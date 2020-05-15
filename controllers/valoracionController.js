const Valoracion = require("../models/valoracionModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Asistencia = require("../models/asistenciaModel");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllValoracion = factory.getAll(Valoracion);

exports.createValoracion = factory.createOne(Valoracion);

exports.getValoracion = factory.getOne(Valoracion);

exports.updateValoracion = factory.updateOne(Valoracion);

exports.deleteValoracion = factory.deleteOne(Valoracion);

exports.getMisValoraciones = catchAsync(async (req, res, next) => {
  let features = new APIFeatures(
    Valoracion.find({ idUsuario: req.user.id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;

  if (!doc) {
    return next(
      new AppError(
        `No se encontraron asistencias para la ID ${req.user.id}`,
        404
      )
    );
  }

  res.status(200).json({
    status: "success",
    results: doc.length,
    data: { doc },
  });
});

exports.verificarDatos = catchAsync(async (req, res, next) => {
  if (!req.body.idAsistencia)
    return next(new AppError("Debe especificar la id de la asistencia", 404));
  let asistencia = await Asistencia.findById(req.body.idAsistencia);
  if (!asistencia)
    return next(
      new AppError(
        `No se encontraron asistencias para la ID ${req.user.id}`,
        404
      )
    );
  if (asistencia.idUsuario.id !== req.user.id)
    return next(new AppError("La asistencia no pertenece a este usuario", 404));
  req.body.idUsuario = req.user.id;
  const date = Date(Date.now()).toLocaleString("en-US", {
    timeZone: "America/Bogota",
  });
  const dia = new Date(date);
  req.body.fecha = dia;
  next();
});
