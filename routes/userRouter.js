const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const followRouter = require('./followRoute');
router.route('/signup').post(authController.signUp);
router.route('/verify/:token').get(authController.verifyemail);
router.route('/verify-otp').post(authController.verifyOTP);
router
  .route('/toggle-2fa')
  .patch(authController.protect, authController.toggleTwoFactor);
router.route('/login').post(authController.logIn);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router.route('/search').get(userController.search);
router.route('/logout').get(authController.logout);
router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);
router
  .route('/:id')
  .get(authController.optionalProtect, userController.getUser);

router.use(authController.protect);
router.patch('/updatePassword', authController.updatePassword);
router.use('/follow', followRouter);
router
  .route('/updateMe')
  .patch(userController.updateUserPhoto, userController.updateMe);
router.use(authController.restrictedTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
module.exports = router;
