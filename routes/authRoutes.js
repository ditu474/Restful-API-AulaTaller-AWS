const express = require('express');
const authController = require('../controllers/authController');
const protectRoutes = require("../middlewares/protectRoutes");

const router = express.Router();

router.post('/signup', authController.singUp);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(protectRoutes.verifyToken);

router.patch('/updateMyPassword', authController.updatePassword);

module.exports = router;