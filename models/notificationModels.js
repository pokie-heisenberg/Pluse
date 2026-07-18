const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Notification must belong to recipient'],
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Notification must have sender'],
    },
    type: {
      type: String,
      enum: [
        'like',
        'comment',
        'follow',
        'follow_request',
        'mention',
        'system',
      ],
      required: [true, 'Notification must have type'],
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
    },
    comment: {
      type: mongoose.Schema.ObjectId,
      ref: 'Comment',
    },
    read: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);
notificationSchema.index({ recipient: 1, index: 1 });
const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
