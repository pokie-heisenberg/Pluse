const JWT = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const User = require('./../models/userModels');
const catchAsyncError = require('../utils/catchAsyncError');
const appError = require('../utils/appError');
const sendEmail = require('./../utils/email');
const sharp = require('sharp');
const multer = require('multer');
const Email = require('./../utils/email');
const signUpToken = (id) => {
  return JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, req, res) => {
  const token = signUpToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production' && (req.secure || req.headers['x-forwarded-proto'] === 'https')) {
    cookieOptions.secure = true;
    cookieOptions.sameSite = 'none';
  }
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
exports.signUp = catchAsyncError(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  await new Email(newUser).sendWelcome();
  createSendToken(newUser, 201, req, res);
});
exports.logIn = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new appError('Please provide email and address!', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  const correct = user
    ? await user.correctPassword(password, user.password)
    : false;
  if (!user || !correct) {
    return next(new appError('Incorrect Password or Email!', 401));
  }
  createSendToken(user, 200, req, res);
});
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedOut', {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'Lax',
  });
  res.status(200).json({
    status: 'success',
  });
};
exports.restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.roles)) {
      return next(
        new appError("You don't have permission to perform this action!", 403)
      );
    }
    next();
  };
};
exports.protect = catchAsyncError(async (req, res, next) => {
  //1.check whether token exist or not;
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new appError('You are not logged In!', 401));
  }
  const decode = await promisify(JWT.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(
      new appError('Token belonging to user is no lomger exist!', 401)
    );
  }
  if (currentUser.changedPasswordAfter(decode.iat)) {
    return next(
      new appError('user reccently changed,please login again!', 401)
    );
  }
  req.user = currentUser;
  next();
});

exports.optionalProtect = catchAsyncError(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next();
  }
  try {
    const decode = await promisify(JWT.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decode.id);
    if (currentUser && !currentUser.changedPasswordAfter(decode.iat)) {
      req.user = currentUser;
    }
  } catch (err) {
    // Ignore verification errors for optional protect
  }
  next();
});

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new appError('There is no user with this email', 401));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //send it to user
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}`;
  const { resetPasswordTemplate } = require('../utils/emailTemplates');

  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Your reset token is valid only for 10min!',
    //   message,
    //   html: resetPasswordTemplate(resetUrl),
    // });
    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;
    await new Email(user, resetURL).sendResetPassword();
    res.status(200).json({
      status: 'Success',
      message: 'resettoken send successfully!',
    });
  } catch (err) {
    console.error("FORGOT PASSWORD EMAIL ERROR:", err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new appError('There is error in sending email! Try again later', 500)
    );
  }
});
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: resetToken,
    passwordResetExpires: { $gte: Date.now() },
  });
  if (!user) {
    return next(
      new appError(
        'Your resetToken has been expired or invalid!,Please try again!',
        401
      )
    );
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 201, req, res);
});
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!user.correctPassword(req.body.password, user.password)) {
    return next(new appError('incorrect password!', 401));
  }
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();
  createSendToken(user, 201, req, res);
});
