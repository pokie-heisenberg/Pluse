const catchAsyncError = require('./../utils/catchAsyncError');
const appError = require('./../utils/appError');
const User = require('./../models/userModels');
const Follow = require('./../models/followModels');
const FollowRequest = require('./../models/followRequestModel');
const multer = require('multer');
const factoryFunction = require('./factoryFunction');
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new appError('Not an image,Please upload image!', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const cloudinary = require('./../utils/cloudinary');
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'users',
        resource_type: 'auto',
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(fileBuffer);
  });
};

exports.updateUserPhoto = upload.single('photo');

const filterObjFn = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.updateMe = catchAsyncError(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new appError(
        'This route is not for password updates. Please use /updateMyPassword.'
      ),
      400
    );
  }
  const filteredBody = filterObjFn(req.body, 'name', 'email', 'location');
  
  if (req.file) {
    const result = await streamUpload(req.file.buffer);
    filteredBody.profileImage = result.secure_url;
  }
  
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      updateUser: updatedUser,
    },
  });
});
exports.search = catchAsyncError(async (req, res, next) => {
  const name = req.query.searched;
  const result = await User.find({ name: new RegExp('^' + name, 'i') });
  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.createUser = factoryFunction.createOne(User);
exports.getAllUsers = factoryFunction.getAll(User);
exports.getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new appError('No document found with that ID', 404));
  }

  const followersCount = await Follow.countDocuments({ following: user._id });
  const followingCount = await Follow.countDocuments({ follower: user._id });

  const userObj = user.toObject();
  userObj.follower = followersCount;
  userObj.following = followingCount;

  if (req.user) {
    const isFollowed = await Follow.findOne({ follower: req.user._id, following: user._id });
    const isRequested = await FollowRequest.findOne({ sender: req.user._id, receiver: user._id, status: 'pending' });
    
    userObj.isFollowed = !!isFollowed;
    userObj.isRequested = !!isRequested;
  } else {
    userObj.isFollowed = false;
    userObj.isRequested = false;
  }

  res.status(200).json({
    status: 'success',
    data: {
      doc: userObj,
    },
  });
});
exports.deleteUser = factoryFunction.deleteOne(User);
exports.updateUser = factoryFunction.updateOne(User);
