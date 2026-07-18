const catchAsyncError = require('./../utils/catchAsyncError');
const appError = require('./../utils/appError');
const Comment = require('./../models/commentsModels');
const Post = require('./../models/postModels');
const Notification = require('./../models/notificationModels');
const Like = require('./../models/likeModels');
const factoryFunction = require('./factoryFunction');
exports.getComment = catchAsyncError(async (req, res, next) => {
  let filter = {};
  if (req.params.postId) filter = { post: req.params.postId, parentComment: null }; // Top level comments
  
  const doc = await Comment.find(filter).populate('author', 'name profileImage');
  
  let comments = doc.map((comment) => (comment.toObject ? comment.toObject() : comment));
  if (req.user) {
    const userLikes = await Like.find({
      user: req.user.id,
      comment: { $in: comments.map((c) => c._id) },
    });
    const likedCommentIds = userLikes.map((l) => l.comment.toString());
    comments = comments.map((comment) => ({
      ...comment,
      isLiked: likedCommentIds.includes(comment._id.toString()),
    }));
  }

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments,
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
  
  if (req.body.parentComment) {
    const parent = await Comment.findById(req.body.parentComment);
    if (parent && parent.author.toString() !== req.user.id) {
      await Notification.create({
        recipient: parent.author,
        sender: req.user.id,
        type: 'comment',
        post: doc.post,
        comment: doc._id,
        message: 'replied to your comment',
      });
    }
  }

  const post = await Post.findById(req.body.post);
  if (post) {
    post.comments = (post.comments || 0) + 1;
    await post.save({ validateBeforeSave: false });
    
    if (post.author.toString() !== req.user.id && (!req.body.parentComment || post.author.toString() !== (await Comment.findById(req.body.parentComment))?.author?.toString())) {
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
  const doc = await Comment.find({ parentComment: req.params.commentId }).populate('author', 'name profileImage');
  
  let replies = doc.map((reply) => (reply.toObject ? reply.toObject() : reply));
  if (req.user) {
    const userLikes = await Like.find({
      user: req.user.id,
      comment: { $in: replies.map((r) => r._id) },
    });
    const likedReplyIds = userLikes.map((l) => l.comment.toString());
    replies = replies.map((reply) => ({
      ...reply,
      isLiked: likedReplyIds.includes(reply._id.toString()),
    }));
  }

  res.status(201).json({
    status: 'success',
    result: replies.length,
    data: {
      replies,
    },
  });
});
