const express = require('express');
const tiposervicioController = require('../controllers/tiposervicioController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/').get(tiposervicioController.getAllTipoServicio);

router.use(authController.restrictTo('admin'));

router.route('/').post(tiposervicioController.createTipoServicio);
router
  .route('/:id')
  .get(tiposervicioController.getTipoServicio)
  .patch(tiposervicioController.updateTipoServicio)
  .delete(tiposervicioController.deleteTipoServicio);

module.exports = router;
