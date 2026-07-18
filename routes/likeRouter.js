const express = require('express');
const router = express.Router({ mergeParams: true });
const likeController = require('./../controllers/likeController');
const authController = require('./../controllers/authController');
router.use(authController.protect);
router.route('/').post(likeController.like);
router.route('/').delete(likeController.unlike);
module.exports = router;
