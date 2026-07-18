const Follow = require('./../models/followModels');
const User = require('./../models/userModels');
const catchAsyncError = require('./../utils/catchAsyncError');
const appError = require('./../utils/appError');
const FollowRequest = require('./../models/followRequestModel');
const Notification = require('./../models/notificationModels');
exports.createFollowRequest = catchAsyncError(async (req, res, next) => {
  const rel = await Follow.findOne({
    follower: req.user.id,
    following: req.params.userId,
  });
  if (rel) {
    return next(new appError('you are already following this user!', 401));
  }
  const fr = await FollowRequest.findOne({
    sender: req.user.id,
    receiver: req.params.userId,
    status: 'pending',
  });
  if (fr) {
    return next(new appError('follow request already sent!', 401));
  }
  const followRequest = await FollowRequest.create({
    sender: req.user.id,
    receiver: req.params.userId,
  });

  await Notification.create({
    recipient: req.params.userId,
    sender: req.user.id,
    type: 'follow_request',
    message: 'sent you a follow request',
  });

  res.status(201).json({
    status: 'success',
    data: {
      followRequest,
    },
  });
});

exports.acceptFollowRequest = catchAsyncError(async (req, res, next) => {
  const request = await FollowRequest.findOne({
    sender: req.params.userId,
    receiver: req.user.id,
    status: 'pending',
  });
  if (!request) {
    return next(new appError('No request found!', 401));
  }
  // Create mutual follow relationships
  await Follow.create({
    follower: req.params.userId,
    following: req.user.id,
  });

  await Follow.create({
    follower: req.user.id,
    following: req.params.userId,
  });

  // Increment follower and following counts for both users
  await FollowRequest.deleteOne({
    sender: req.params.userId,
    receiver: req.user.id,
    status: 'pending',
  });

  // Emit notification to the person who requested
  await Notification.create({
    recipient: req.params.userId,
    sender: req.user.id,
    type: 'follow',
    message: 'accepted your follow request',
  });

  res.status(201).json({
    status: 'success',
  });
});

exports.declineFollowRequest = catchAsyncError(async (req, res, next) => {
  const request = await FollowRequest.findOneAndDelete({
    sender: req.params.userId,
    receiver: req.user.id,
    status: 'pending',
  });

  if (!request) {
    return next(new appError('No request found!', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Follow request declined',
  });
});

exports.unfollow = catchAsyncError(async (req, res, next) => {
  const deletedFollow = await Follow.findOneAndDelete({
    follower: req.user.id,
    following: req.params.userId,
  });

  res.status(200).json({
    status: 'success',
    message: 'unfollowed successfully',
  });
});
