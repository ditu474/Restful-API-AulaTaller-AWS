const express = require('express');
const userController = require('../controllers/userController');
const protectRoutes = require('../middlewares/protectRoutes');

const router = express.Router();

router.use(protectRoutes.verifyToken);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.use(protectRoutes.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
