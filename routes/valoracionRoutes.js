const express = require('express');
const valoracionController = require('../controllers/valoracionController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .post(
    valoracionController.verificarDatos,
    valoracionController.createValoracion
  );
router.route('/me').get(valoracionController.getMisValoraciones);

router.use(authController.restrictTo('admin'));

router.route('/').get(valoracionController.getAllValoracion);
router
  .route('/:id')
  .get(valoracionController.getValoracion)
  .patch(valoracionController.updateValoracion)
  .delete(valoracionController.deleteValoracion);

module.exports = router;
