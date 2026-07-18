const catchAsyncError = require('./../utils/catchAsyncError');
const appError = require('./../utils/appError');
const Comment = require('./../models/commentsModels');
const Post = require('./../models/postModels');
const Notification = require('./../models/notificationModels');
const factoryFunction = require('./factoryFunction');
exports.getComment = catchAsyncError(async (req, res, next) => {
  let filter = {};
  if (req.params.postId) filter = { post: req.params.postId, parentComment: null }; // Top level comments
  
  const comments = await Comment.find(filter).populate('author', 'name profileImage');
  
  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments, // return as comments for easier frontend parsing
      data: comments
    }
  });
});
exports.getOneComment = factoryFunction.getOne(Comment);
exports.deleteComment = catchAsyncError(async (req, res, next) => {
  const doc = await Comment.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new appError('No document found with that ID', 404));
  }
  if (doc.post) {
    const post = await Post.findById(doc.post);
    if (post) {
      post.comments = Math.max((post.comments || 1) - 1, 0);
      await post.save({ validateBeforeSave: false });
    }
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.updateComment = factoryFunction.updateOne(Comment);
exports.setCommentId = (req, res, next) => {
  if (!req.body.parentComment) {
    req.body.parentComment = req.params.commentId;
  }
  next();
};
exports.createComment = catchAsyncError(async (req, res, next) => {
  if (!req.body.author) req.body.author = req.user.id;
  if (!req.body.post) req.body.post = req.params.postId;

  const doc = await Comment.create(req.body);

  if (!doc) {
    return next(new appError('Comment could not be created', 400));
  }
  const post = await Post.findById(req.body.post);
  if (post) {
    post.comments = (post.comments || 0) + 1;
    await post.save({ validateBeforeSave: false });
    
    if (post.author.toString() !== req.user.id) {
      await Notification.create({
      recipient: post.author,
      sender: req.user.id,
      type: 'comment',
      post: post._id,
      comment: doc._id,
      message: 'commented on your post',
    });
    }
  }

  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
      comment: await Comment.findById(doc._id).populate('author', 'name profileImage'),
    },
  });
});
exports.getReplies = catchAsyncError(async (req, res, next) => {
  const replies = await Comment.find({ parentComment: req.params.commentId }).populate('author', 'name profileImage');
  res.status(201).json({
    status: 'success',
    result: replies.length,
    data: {
      replies,
    },
  });
});
