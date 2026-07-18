const Notification = require('../models/notificationModels');
const catchAsyncError = require('./../utils/catchAsyncError');
const appError = require('./../utils/appError');
const factoryFunction = require('./factoryFunction');

exports.getNotifications = catchAsyncError(async (req, res, next) => {
  const notifications = await Notification.find({ recipient: req.user.id })
    .sort({ createdAt: -1 })
    .populate('sender', 'name email profileImage')
    .populate('post', 'content')
    .populate('comment', 'name content');

  res.status(200).json({
    status: 'success',
    results: notifications.length,
    data: {
      notifications,
    },
  });
});

exports.markAsRead = catchAsyncError(async (req, res, next) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user.id },
    { read: true },
    { new: true, runValidators: true }
  );

  if (!notification) {
    return next(new appError('No notification found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      notification,
    },
  });
});

exports.markAllAsRead = catchAsyncError(async (req, res, next) => {
  await Notification.updateMany(
    { recipient: req.user.id, read: false },
    { read: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'All notifications marked as read',
  });
});

exports.deleteNotification = catchAsyncError(async (req, res, next) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    recipient: req.user.id
  });

  if (!notification) {
    return next(new appError('No notification found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
