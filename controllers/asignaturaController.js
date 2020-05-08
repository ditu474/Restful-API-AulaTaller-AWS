const Asignatura = require('../models/asignaturaModel');
const factory = require('./handlerFactory');

exports.getAllAsignatura = factory.getAll(Asignatura);

exports.createAsignatura = factory.createOne(Asignatura);

exports.getAsignatura = factory.getOne(Asignatura);

exports.updateAsignatura = factory.updateOne(Asignatura);

exports.deleteAsignatura = factory.deleteOne(Asignatura);
