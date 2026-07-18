const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
    },
    content: {
      type: String,
      required: [true, 'Comment can not be empty'],
    },
    media: {
      url: String,
      type: {
        type: String,
        enum: ['gif'],
      },
    },
    likes: {
      type: Number,
      default: 0,
    },
    parentComment: {
      type: mongoose.Schema.ObjectId,
      ref: 'Comment',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
