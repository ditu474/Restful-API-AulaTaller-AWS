const express = require('express');
const servicioController = require('../controllers/servicioController');
const protectRoutes = require("../middlewares/protectRoutes");

const router = express.Router();

router.use(protectRoutes.verifyToken);

router.route('/').get(servicioController.getAllServicio);

router.use(protectRoutes.restrictTo('admin'));

router.route('/').post(servicioController.createServicio);
router
  .route('/:id')
  .get(servicioController.getServicio)
  .patch(servicioController.updateServicio)
  .delete(servicioController.deleteServicio);

module.exports = router;
