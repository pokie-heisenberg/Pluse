const mongoose = require('mongoose');
const followRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['accepted', 'pending', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);
const FollowRequest = mongoose.model('FollowRequest', followRequestSchema);
module.exports = FollowRequest;
