const express = require('express');
const servicioController = require('../controllers/servicioController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/').get(servicioController.getAllServicio);

router.use(authController.restrictTo('admin'));

router.route('/').post(servicioController.createServicio);
router
  .route('/:id')
  .get(servicioController.getServicio)
  .patch(servicioController.updateServicio)
  .delete(servicioController.deleteServicio);

module.exports = router;
