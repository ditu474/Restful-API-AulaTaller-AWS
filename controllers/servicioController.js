const Servicio = require('../models/servicioModel');
const factory = require('./handlerFactory');

exports.getAllServicio = factory.getAll(Servicio);

exports.createServicio = factory.createOne(Servicio);

exports.getServicio = factory.getOne(Servicio);

exports.updateServicio = factory.updateOne(Servicio);

exports.deleteServicio = factory.deleteOne(Servicio);
