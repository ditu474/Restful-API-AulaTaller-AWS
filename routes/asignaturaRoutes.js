const express = require('express');
const asignaturaController = require('../controllers/asignaturaController');
const protectRoutes = require('../middlewares/protectRoutes');

const router = express.Router();

router.use(protectRoutes.verifyToken);

router.route('/').get(asignaturaController.getAllAsignatura);

router.use(protectRoutes.restrictTo('admin'));

router.route('/').post(asignaturaController.createAsignatura);
router
  .route('/:id')
  .get(asignaturaController.getAsignatura)
  .patch(asignaturaController.updateAsignatura)
  .delete(asignaturaController.deleteAsignatura);

module.exports = router;
