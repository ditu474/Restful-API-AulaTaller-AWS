const TipoServicio = require('../models/tipoServicioModel');
const factory = require('./handlerFactory');

exports.getAllTipoServicio = factory.getAll(TipoServicio);

exports.createTipoServicio = factory.createOne(TipoServicio);

exports.getTipoServicio = factory.getOne(TipoServicio);

exports.updateTipoServicio = factory.updateOne(TipoServicio);

exports.deleteTipoServicio = factory.deleteOne(TipoServicio);
