const mongoose = require('mongoose');
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxLength: 300,
    },
    content: {
      type: String,
      trim: true,
    },
    media: [String],
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    Unlikes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
