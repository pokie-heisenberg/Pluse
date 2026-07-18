const express = require('express');
const router = express.Router({ mergeParams: true });
const authController = require('./../controllers/authController');
const commentController = require('./../controllers/commentController');
const likeRouter = require('./likeRouter');
const postController = require('./../controllers/postController');
router
  .route('/')
  .get(commentController.getComment);
router
  .route('/:id')
  .get(commentController.getOneComment);
router
  .route('/:commentId/reply')
  .get(commentController.getReplies);

router.use(authController.protect);

router
  .route('/')
  .post(commentController.createComment);
router
  .route('/:id')
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);
router.use('/:commentId/likes', likeRouter);
router
  .route('/:commentId/reply')
  .post(commentController.setCommentId, commentController.createComment);
module.exports = router;
