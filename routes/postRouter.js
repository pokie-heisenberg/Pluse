const express = require('express');
const router = express.Router();
const postController = require('./../controllers/postController');
const authController = require('./../controllers/authController');
const likeRouter = require('./../routes/likeRouter');
const commentRouter = require('./../routes/commentsRouter');
const { uploadMedia } = require('./../utils/multerConfig');
router
  .route('/')
  .get(authController.optionalProtect, postController.getAllPosts)
  .post(authController.protect, uploadMedia, postController.createPost);
router.route('/user/:userId').get(authController.optionalProtect, postController.getUserPosts);
router.use('/:postId/likes', likeRouter);
router.use('/:postId/comments', commentRouter);
router.use(authController.protect);
router.route('/feed').get(postController.getUserFeed);
router
  .route('/:id')
  .get(postController.getPost)
  .patch(uploadMedia, postController.updatePost)
  .delete(postController.deletePost);
module.exports = router;
