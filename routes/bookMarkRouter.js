const express = require('express');
const router = express.Router({ mergeParams: true });
const authController = require('./../controllers/authController');
const bookMarkController = require('./../controllers/bookMarkController');
router.use(authController.protect);
router
  .route('/')
  .get(bookMarkController.getBookMarkPosts)
  .post(authController.restrictedTo('user'), bookMarkController.bookMarkPost)
  .delete(bookMarkController.UnMarkPost);
module.exports = router;
