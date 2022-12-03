const express = require("express");
const authController = require("../controllers/authController");
const auth = require('../middleware/auth');
const router = express.Router();


//Admin Routes
router.route("/admin/users").get(auth.isAuthenicated,auth.authorizedRoles('admin'),
authController.getAllUsers);
router.route('/register').post(authController.registerUser);
router.route("/admin/user/:id").get(auth.isAuthenicated,auth.authorizedRoles('admin'),
authController.getUserDetails);
router.route("/admin/update/:id").put(auth.isAuthenicated,auth.authorizedRoles('admin'),
authController.updateUser);
router.route("/admin/deleteuser/:id").delete(auth.isAuthenicated,
auth.authorizedRoles('admin'),authController.deleteuser);


//User Routes
router.route("/login").post(authController.loginUser);
router.route("/logout").get(authController.logout);
router.route("/password/forgot").post(authController.forgetPassword);
router.route("/password/reset/:token").put(authController.resetPassword);
router.route("/me").get(auth.isAuthenicated,authController.getUserProfile);
router.route("/password/update").put(auth.isAuthenicated,authController.updatePassword);
router.route("/me/update").put(auth.isAuthenicated,authController.updateMe);


module.exports = router;