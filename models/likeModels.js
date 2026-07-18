const mongoose = require('mongoose');
const Post = require('./postModels');
const Comment = require('./commentsModels');
const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      default: null,
    },
    comment: {
      type: mongoose.Schema.ObjectId,
      ref: 'Comment',
      default: null,
    },
  },
  { timestamps: true }
);
likeSchema.index({ user: 1, post: 1, comment: 1 }, { unique: true });
likeSchema.statics.calculatePostLike = async function (postId) {
  const stats = await this.aggregate([
    {
      $match: { post: postId, comment: null },
    },
    {
      $group: {
        _id: '$post',
        likes: { $sum: 1 },
      },
    },
  ]);
  if (stats.length > 0) {
    await Post.findByIdAndUpdate(postId, {
      likes: stats[0].likes,
    });
  } else {
    await Post.findByIdAndUpdate(postId, {
      likes: 0,
    });
  }
};
likeSchema.statics.calculateCommentLike = async function (commentId) {
  const stats = await this.aggregate([
    {
      $match: { comment: commentId },
    },
    {
      $group: {
        _id: '$comment',
        likes: { $sum: 1 },
      },
    },
  ]);
  if (stats.length > 0) {
    await Comment.findByIdAndUpdate(commentId, {
      likes: stats[0].likes,
    });
  } else {
    await Comment.findByIdAndUpdate(commentId, {
      likes: 0,
    });
  }
};
likeSchema.post('save', function () {
  if (this.post) this.constructor.calculatePostLike(this.post);
  if (this.comment) this.constructor.calculateCommentLike(this.comment);
});
likeSchema.pre(/^findOneAnd/, async function () {
  this.r = await this.clone().findOne();
});
likeSchema.post(/^findOneAnd/, async function () {
  if (this.r.post) this.r.constructor.calculatePostLike(this.r.post);
  if (this.r.comment) this.r.constructor.calculateCommentLike(this.r.comment);
});
const Like = mongoose.model('Like', likeSchema);
module.exports = Like;
