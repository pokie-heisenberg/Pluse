const catchAsyncError = require('./../utils/catchAsyncError');
const appError = require('./../utils/appError');
const Like = require('./../models/likeModels');
const Post = require('./../models/postModels');
const Notification = require('./../models/notificationModels');
exports.like = catchAsyncError(async (req, res, next) => {
  const existingLike = await Like.findOne({
    user: req.user.id,
    post: req.params.postId || null,
    comment: req.params.commentId || null,
  });

  if (existingLike) {
    await Like.findOneAndDelete({ _id: existingLike._id });
    return res.status(200).json({
      status: 'success',
      message: 'unliked it!',
    });
  }

  await Like.create({
    user: req.user.id,
    post: req.params.postId || null,
    comment: req.params.commentId || null,
  });

  if (req.params.postId) {
    const post = await Post.findById(req.params.postId);
    if (post && post.author.toString() !== req.user.id) {
      await Notification.create({
        recipient: post.author,
        sender: req.user.id,
        type: 'like',
        post: post._id,
        message: 'liked your post'
      });
    }
  }

  res.status(200).json({
    status: 'success',
    message: 'liked it!',
  });
});
exports.unlike = catchAsyncError(async (req, res, next) => {
  const like = await Like.findOneAndDelete({
    user: req.user.id,
    post: req.params.postId || null,
    comment: req.params.commentId || null,
  });

  if (!like) {
    return next(new appError('Like not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
