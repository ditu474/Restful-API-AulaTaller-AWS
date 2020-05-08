const express = require('express');
const asignaturaController = require('../controllers/asignaturaController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/').get(asignaturaController.getAllAsignatura);

router.use(authController.restrictTo('admin'));

router.route('/').post(asignaturaController.createAsignatura);
router
  .route('/:id')
  .get(asignaturaController.getAsignatura)
  .patch(asignaturaController.updateAsignatura)
  .delete(asignaturaController.deleteAsignatura);

module.exports = router;
