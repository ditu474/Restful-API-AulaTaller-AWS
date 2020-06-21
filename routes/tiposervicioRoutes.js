const express = require('express');
const tiposervicioController = require('../controllers/tiposervicioController');
const protectRoutes = require("../middlewares/protectRoutes");

const router = express.Router();

router.use(protectRoutes.verifyToken);

router.route('/').get(tiposervicioController.getAllTipoServicio);

router.use(protectRoutes.restrictTo('admin'));

router.route('/').post(tiposervicioController.createTipoServicio);
router
  .route('/:id')
  .get(tiposervicioController.getTipoServicio)
  .patch(tiposervicioController.updateTipoServicio)
  .delete(tiposervicioController.deleteTipoServicio);

module.exports = router;
