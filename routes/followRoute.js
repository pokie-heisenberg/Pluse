const express = require('express');
const router = express.Router({ mergeParams: true });
const authController = require('./../controllers/authController');
const followController = require('./../controllers/followController');
router.use(authController.protect);
router
  .route('/:userId')
  .post(followController.createFollowRequest)
  .delete(followController.unfollow);
router.route('/:userId/accept').post(followController.acceptFollowRequest);
router.route('/:userId/decline').post(followController.declineFollowRequest);
module.exports = router;
