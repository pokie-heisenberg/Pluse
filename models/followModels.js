const mongoose = require('mongoose');
const User = require('./userModels');
const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    following: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);
followSchema.index({ follower: 1, following: 1 }, { unique: true });
followSchema.statics.calculateFollowStats = async function (userId) {
  const followerCount = await this.countDocuments({ following: userId });
  const followingCount = await this.countDocuments({ follower: userId });

  await User.findByIdAndUpdate(userId, {
    follower: followerCount,
    following: followingCount,
  });
};
followSchema.post('save', async function () {
  await this.constructor.calculateFollowStats(this.follower);
  await this.constructor.calculateFollowStats(this.following);
});
followSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calculateFollowStats(doc.follower);
    await doc.constructor.calculateFollowStats(doc.following);
  }
});
const Follow = mongoose.model('Follow', followSchema);
module.exports = Follow;
