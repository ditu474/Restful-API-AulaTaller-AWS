const express = require('express');
const valoracionController = require('../controllers/valoracionController');
const protectRoutes = require("../middlewares/protectRoutes");

const router = express.Router();

router.use(protectRoutes.verifyToken);

router
  .route('/')
  .post(
    valoracionController.verificarDatos,
    valoracionController.createValoracion
  );
router.route('/me').get(valoracionController.getMisValoraciones);

router.use(protectRoutes.restrictTo('admin'));

router.route('/').get(valoracionController.getAllValoracion);
router
  .route('/:id')
  .get(valoracionController.getValoracion)
  .patch(valoracionController.updateValoracion)
  .delete(valoracionController.deleteValoracion);

module.exports = router;
