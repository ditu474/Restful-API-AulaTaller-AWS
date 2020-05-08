const mongoose = require('mongoose');
const validator = require('validator');

const servicioSchema = mongoose.Schema({
  idTipoServicio: {
    type: mongoose.Schema.ObjectId,
    ref: 'TipoServicio',
    required: [true, 'El servicio debe tener un tipo de servicio'],
  },
  idAsignatura: {
    type: mongoose.Schema.ObjectId,
    ref: 'Asignatura',
  },
  tema: {
    type: String,
    maxlength: [30, 'Un tema no debe tener mas de 30 caracteres'],
    minlength: [5, 'Un tema debe tener minimo 5 caracteres'],
    validate: {
      validator: function (val) {
        var re = /^[a-zA-Zñ]+(([',. -][a-zA-Zñ ])?[a-zA-Zñ]*)*$/;
        return re.test(val);
      },
      message: 'El tema no puede tener caracteres especiales',
    },
  },
  horaInicio: {
    type: Number,
    required: [true, 'Un servicio debe tener una hora de inicio'],
    min: [6, 'La hora minima es 6'],
    max: [20, 'La hora maxima es 20'],
  },
  horaFinal: {
    type: Number,
    required: [true, 'Un servicio debe tener una hora final'],
    min: [6, 'La hora minima es 6'],
    max: [20, 'La hora maxima es 20'],
    validate: {
      validator: function (el) {
        return el > this.horaInicio;
      },
      message: 'La hora final debe ser mayor a la hora de inicio',
    },
  },
  dia: {
    type: Number,
    required: [true, 'Un servicio debe tener un dia'],
    min: [0, 'El dia minimo es 0 y representa domingo'],
    max: [6, 'El dia maximo es 6 y representa sabado'],
  },
  sede: {
    type: String,
    required: [true, 'Un servicio debe tener una sede'],
    enum: {
      values: ['medellin', 'oriente', 'uraba', 'otro'],
      message: 'La sede debe ser medellin, oriente, uraba u otro',
    },
  },
  encargado: {
    type: String,
    required: [true, 'El encargado es requerido'],
    validate: {
      validator: function (val) {
        var re = /^[a-zA-Z]+(([',. -ñ][a-zA-Z ])?[a-zA-Z]*)*$/;
        return re.test(val);
      },
      message: 'El nombre del encargado no debe tener caracteres especiales',
    },
  },
  codigo: {
    type: String,
    unique: true,
    required: [
      true,
      'El servicio debe tener un codigo para registrar asistencias',
    ],
    validate: [
      validator.isAlphanumeric,
      'El codigo solo permite caracteres alfanumericos',
    ],
  },
  enlace: {
    type: String,
  },
});

servicioSchema.index({ dia: 1 });

servicioSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'idTipoServicio',
    select: 'nombre',
  });
  this.populate({
    path: 'idAsignatura',
    select: 'nombre',
  });
  next();
});

const Servicio = mongoose.model('Servicio', servicioSchema);

module.exports = Servicio;
