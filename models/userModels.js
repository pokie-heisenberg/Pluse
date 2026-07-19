const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { parse } = require('path');
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Provide the name'],
      maxLenght: 40,
    },
    email: {
      type: String,
      required: [true, 'Please provide the email'],
      unique: true,
    },
    roles: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    profileImage: {
      type: String,
      default: 'https://ui-avatars.com/api/?name=User&background=random',
    },
    follower: {
      type: Number,
      default: 0,
    },
    following: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: [true, 'Please provide the password'],
      minLength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'please confirm your password'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'password did not match',
      },
      select: false,
    },
    passwordChangedAt: {
      type: Date,
      select: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true }
);
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};
userSchema.methods.createEmailVerificationToken = function () {
  const verifyToken = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verifyToken)
    .digest('hex');
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return verifyToken;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
userSchema.pre('save', function () {
  if (!this.isModified('password') || this.isNew) {
    if (this.isNew) {
      // Default to UI avatars with their name
      if (
        !this.profileImage ||
        this.profileImage === 'photo.jpg' ||
        this.profileImage.includes('?name=User')
      ) {
        this.profileImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=random`;
      }
    }
  }

  if (!this.isModified('password') || this.isNew) return;
  this.passwordChangedAt = Date.now() - 1000;
});

const User = mongoose.model('User', userSchema);
module.exports = User;
