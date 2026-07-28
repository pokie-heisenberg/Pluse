const mongoose = require('mongoose');
const bookMarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'bookmark must belong to user'],
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: [true, 'bookmark must belong post'],
  },
});
bookMarkSchema.index({ user: 1, post: 1 }, { unique: true });
const BookMark = mongoose.model('BookMark', bookMarkSchema);
module.exports = BookMark;
