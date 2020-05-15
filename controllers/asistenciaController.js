const Asistencia = require("../models/asistenciaModel");
const factory = require("./handlerFactory");
const Servicio = require("../models/servicioModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const TipoServicio = require("../models/tipoServicioModel");
const User = require("../models/userModel");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllAsistencia = factory.getAll(Asistencia);

exports.createAsistencia = factory.createOne(Asistencia);

exports.getAsistencia = factory.getOne(Asistencia);

exports.updateAsistencia = factory.updateOne(Asistencia);

exports.deleteAsistencia = factory.deleteOne(Asistencia);

exports.setServicioId = catchAsync(async (req, res, next) => {
  if (!req.body.codigo)
    return next(
      new AppError("Debe ingresar el código del servicio al que asistió", 400)
    );
  let servicio = await Servicio.findOne({ codigo: req.body.codigo });
  if (!servicio)
    return next(
      new AppError("No se encontro Servicio con el codigo ingresado", 400)
    );
  const date = Date(Date.now()).toLocaleString("en-US", {
    timeZone: "America/Bogota",
  });
  const dia = new Date(date);
  if (dia.getDay() !== servicio.dia)
    return next(
      new AppError(
        "No puede registrar una asistencia en el dia incorrecto",
        400
      )
    );
  //Calculo horas asistencia
  req.body.tiempoPermanencia = servicio.horaFinal - servicio.horaInicio;
  req.body.idServicio = servicio["_id"];
  req.body.fecha = dia;

  if (!req.body.idUsuario) req.body.idUsuario = req.user.id;

  next();
});

exports.validarServicioRol = catchAsync(async (req, res, next) => {
  let servicio = await Servicio.findOne({ codigo: req.body.codigo });

  if (!servicio)
    return next(
      new AppError("No se encontro Servicio con el codigo ingresado", 400)
    );

  let tipoServicio = await TipoServicio.findById(servicio.idTipoServicio);

  if (!tipoServicio.privacidad.includes(req.user.rol))
    next(new AppError("No tienes permisos para realizar esta accion", 403));

  next();
});

exports.getMisAsistencias = catchAsync(async (req, res, next) => {
  let features = new APIFeatures(
    Asistencia.find({ idUsuario: req.user.id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;

  if (!doc) {
    return next(
      new AppError(`No se encontro documento con la ID ${req.user.id}`, 400)
    );
  }

  res.status(200).json({
    status: "success",
    results: doc.length,
    data: { doc },
  });
});

exports.validarUltimaVisita = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (
    user.lastVisit &&
    Date.parse(user.lastVisit) + 60 * 60 * 1000 >= Date.now()
  ) {
    return next(
      new AppError("Solo puedes registrar una asistencia cada hora", 400)
    );
  }
  user.lastVisit = Date.now();
  await user.save({ validateBeforeSave: false });
  next();
});
