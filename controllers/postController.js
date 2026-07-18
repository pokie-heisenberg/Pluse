const catchAsyncError = require('./../utils/catchAsyncError');
const appError = require('./../utils/appError');
const Post = require('./../models/postModels');
const cloudinary = require('./../utils/cloudinary');
const Follow = require('./../models/followModels');
const Like = require('./../models/likeModels');
const factoryFunction = require('./factoryFunction');

const streamUpload = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'post',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Cloudinary upload returned no result'));
        }
      }
    );
    stream.end(file.buffer);
  });
};

exports.getAllPosts = catchAsyncError(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 20;
  const skip = (page - 1) * limit;

  const doc = await Post.find()
    .populate('author', 'name profileImage')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  let posts = doc.map((post) => (post.toObject ? post.toObject() : post));
  if (req.user) {
    const userLikes = await Like.find({
      user: req.user.id,
      post: { $in: posts.map((p) => p._id) },
    });
    const likedPostIds = userLikes.map((l) => l.post.toString());
    posts = posts.map((post) => ({
      ...post,
      isLiked: likedPostIds.includes(post._id.toString()),
    }));
  }

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      data: posts,
    },
  });
});

exports.getPost = factoryFunction.getOne(Post);

exports.updatePost = catchAsyncError(async (req, res, next) => {
  // If the frontend sends existing media URLs that were retained, parse them.
  // FormData sends arrays strangely, so ensure we handle it.
  let retainedMedia = [];
  if (req.body.existingMedia) {
    retainedMedia = Array.isArray(req.body.existingMedia)
      ? req.body.existingMedia
      : [req.body.existingMedia];
  }

  let newMediaUrls = [];
  if (req.files && req.files.length > 0) {
    const uploadPromise = req.files.map((file) => streamUpload(file));
    const uploadResult = await Promise.all(uploadPromise);
    newMediaUrls = uploadResult.map((result) => result.secure_url);
  }

  const postData = { ...req.body };
  // Combine retained media and newly uploaded media
  if (req.body.existingMedia || req.files?.length > 0) {
    postData.media = [...retainedMedia, ...newMediaUrls];
  }

  const post = await Post.findByIdAndUpdate(req.params.id, postData, {
    new: true,
    runValidators: true,
  }).populate('author', 'name profileImage');

  if (!post) {
    return next(new appError('No post found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { doc: post }, // Follow factory pattern format
  });
});

exports.deletePost = factoryFunction.deleteOne(Post);
exports.getUserFeed = catchAsyncError(async (req, res, next) => {
  //get following list
  const followingList = await Follow.find({ follower: req.user.id });
  //get only ids
  const followingIds = followingList.map((el) => el.following);

  const authorIds = [...followingIds, req.user.id];

  //get feed
  let feedQuery = Post.find({ author: { $in: authorIds } })
    .populate('author', 'name profileImage')
    .sort({ createdAt: -1 });

  // Dynamic pagination based on query params (e.g., ?page=1&limit=10)
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 20; // Default limit is 20 posts per page
  const skip = (page - 1) * limit;

  const feedPost = await feedQuery.skip(skip).limit(limit);

  let posts = feedPost.map((post) => (post.toObject ? post.toObject() : post));
  const userLikes = await Like.find({
    user: req.user.id,
    post: { $in: posts.map((p) => p._id) },
  });
  const likedPostIds = userLikes.map((l) => l.post.toString());
  posts = posts.map((post) => ({
    ...post,
    isLiked: likedPostIds.includes(post._id.toString()),
  }));

  res.status(201).json({
    status: 'success',
    data: {
      feedPost: posts,
    },
  });
});

exports.getUserPosts = catchAsyncError(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 20;
  const skip = (page - 1) * limit;

  const doc = await Post.find({ author: req.params.userId })
    .populate('author', 'name profileImage')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  let posts = doc.map((post) => (post.toObject ? post.toObject() : post));
  if (req.user) {
    const userLikes = await Like.find({
      user: req.user.id,
      post: { $in: posts.map((p) => p._id) },
    });
    const likedPostIds = userLikes.map((l) => l.post.toString());
    posts = posts.map((post) => ({
      ...post,
      isLiked: likedPostIds.includes(post._id.toString()),
    }));
  }

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      data: posts,
    },
  });
});

exports.setUserId = (req, res, next) => {
  if (!req.body.author) req.body.author = req.user.id;
  next();
};
exports.createPost = catchAsyncError(async (req, res, next) => {
  let mediaUrls = [];
  if (req.files && req.files.length > 0) {
    const uploadPromise = req.files.map((file) => streamUpload(file));
    const uploadResult = await Promise.all(uploadPromise);
    mediaUrls = uploadResult.map((result) => result.secure_url);
  }
  const postData = {
    ...req.body,
    author: req.user.id,
    media: mediaUrls,
  };
  let post = await Post.create(postData);

  // Populate author so frontend can render the PostCard immediately
  post = await post.populate('author', 'name profileImage');

  res.status(201).json({
    status: 'success',
    data: { post },
  });
});
