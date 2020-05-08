const mongoose = require('mongoose');

const asistenciaSchema = mongoose.Schema({
  idUsuario: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'La asistencia debe tener relacion con un usuario'],
  },
  idServicio: {
    type: mongoose.Schema.ObjectId,
    ref: 'Servicio',
    required: [true, 'La asistencia debe tener relacion con un servicio'],
  },
  fecha: {
    type: Date,
    required: [true, 'La asistencia debe tener una fecha'],
    default: Date.now(),
  },
  tiempoPermanencia: {
    type: Number,
    min: [1, 'El tiempo de permanencia minimo es 1 hora'],
    max: [4, 'El tiempo de permanencia maximo es de 4 horas'],
  },
  valorado: {
    type: Boolean,
    default: false,
  },
  // ubicacion: {
  //   type: {
  //     type: String,
  //     default: 'Point',
  //     enum: ['Point'],
  //   },
  //   coordinates: [Number],
  // },
});

// asistenciaSchema.index({ ubicacion: '2dsphere' });

// asistenciaSchema.pre(/^find/, function (next) {
//   this.find({ ubicacion });
//   next();
// });

asistenciaSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'idUsuario',
    select: ['nombre', 'tipoDocumento', 'documento', 'correo'],
  });
  this.populate({
    path: 'idServicio',
    select: [
      'idTipoServicio',
      'idAsignatura',
      'encargado',
      'horaInicio',
      'horaFinal',
      'dia',
      'sede',
    ],
  });
  next();
});

const Asistencia = mongoose.model('Asistencia', asistenciaSchema);

module.exports = Asistencia;
