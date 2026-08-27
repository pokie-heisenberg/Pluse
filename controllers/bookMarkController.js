const catchAsyncError = require('./../utils/catchAsyncError');
const appError = require('./../utils/appError');
const BookMark = require('./../models/bookMarkModels');
exports.getBookMarkPosts = catchAsyncError(async (req, res, next) => {
  const bookMarks = await BookMark.find({ user: req.user.id }).populate({
    path: 'post',
    populate: { path: 'author', select: 'name profileImage _id', model: 'User' },
  });

  // Filter out bookmarks where the post has been deleted
  const validBookMarks = bookMarks.filter((bm) => bm.post !== null);

  res.status(200).json({
    status: 'success',
    result: validBookMarks.length,
    data: { bookMarks: validBookMarks },
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
