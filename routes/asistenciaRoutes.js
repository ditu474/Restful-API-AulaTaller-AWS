const express = require("express");
const asistenciaController = require("../controllers/asistenciaController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .post(
    asistenciaController.validarServicioRol,
    asistenciaController.setServicioId,
    asistenciaController.validarUltimaVisita,
    asistenciaController.createAsistencia
  );

router.route("/me").get(asistenciaController.getMisAsistencias);

router.use(authController.restrictTo("admin"));

router.route("/").get(asistenciaController.getAllAsistencia);
router
  .route("/:id")
  .get(asistenciaController.getAsistencia)
  .patch(asistenciaController.updateAsistencia)
  .delete(asistenciaController.deleteAsistencia);

module.exports = router;
