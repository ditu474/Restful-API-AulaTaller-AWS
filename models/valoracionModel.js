const mongoose = require('mongoose');
const Asistencia = require('./asistenciaModel');

const valoracionSchema = mongoose.Schema({
  idAsistencia: {
    type: mongoose.Schema.ObjectId,
    ref: 'Asistencia',
    required: [true, 'La valoracion debe estar relacionada con una asistencia'],
    unique: true,
  },
  idUsuario: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'La valoracion debe tener un usuario relacionado'],
  },
  valoracion: {
    type: Number,
    min: [1, 'la puntuacion minima es 1'],
    max: [10, 'la puntuacion maxima es 10'],
    required: [true, 'La valoracion debe tener un valor'],
  },
  detalle: {
    type: String,
    maxlength: [200, 'Un detalle no debe contener mas de 200 caracteres'],
  },
  fecha: {
    type: Date,
    required: [true, 'La asistencia debe tener una fecha'],
    default: Date.now(),
  },
});

valoracionSchema.pre('save', async function (next) {
  let asistencia = await Asistencia.findById(this.idAsistencia).catch((err) =>
    next(
      new AppError(
        `No se encontraron asistencias para la ID ${this.idAsistencia}`,
        404
      )
    )
  );
  asistencia.valorado = true;
  await asistencia.save();
  next();
});

valoracionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'idAsistencia',
    select: ['idServicio', 'fecha'],
  });
  next();
});

const Valoracion = mongoose.model('Valoracion', valoracionSchema);

module.exports = Valoracion;
