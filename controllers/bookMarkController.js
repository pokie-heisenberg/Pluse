const catchAsyncError = require('./../utils/catchAsyncError');
const appError = require('./../utils/appError');
const BookMark = require('./../models/bookMarkModels');
exports.getBookMarkPosts = catchAsyncError(async (req, res, next) => {
  const bookMarks = await BookMark.find({ user: req.user.id })
    .populate('post')
    .populate('user');
  res.status(200).json({
    status: 'success',
    result: bookMarks.length,
    data: {
      bookMarks,
    },
  });
});
exports.bookMarkPost = catchAsyncError(async (req, res, next) => {
  await BookMark.create({
    user: req.user.id,
    post: req.params.postId,
  });
  res.status(201).json({
    status: 'success',
    message: 'bookmarked successfully',
  });
});
exports.UnMarkPost = catchAsyncError(async (req, res, next) => {
  await BookMark.deleteOne({
    user: req.user.id,
    post: req.params.postId,
  });
  res.status(201).json({
    status: 'success',
    message: 'unmarked successfully',
  });
});
