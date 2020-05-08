const mongoose = require('mongoose');

const tipoServicioSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El tipo de servicio debe tener un nombre'],
    unique: true,
    validate: {
      validator: function (val) {
        var re = /^[a-zA-Z]+(([',. -ñ][a-zA-Z])?[a-zA-Z]*)*$/;
        return re.test(val);
      },
      message: 'El nombre no debe contener caracteres especiales',
    },
    maxlength: [50, 'Un nombre no debe tener mas de 50 caracteres'],
    minlength: [5, 'Un nombre debe tener minimo 5 caracteres'],
  },
  imgUrl: {
    type: String,
    required: [true, 'El tipo de servicio debe tener una imagen'],
  },
  privacidad: {
    type: [String],
    required: [true, 'El tipo de servicio debe tener una privacidad'],
    enum: {
      values: ['admin', 'docente', 'monitor', 'estudiante', 'externo'],
      message: 'Solo puede ser admin, docente, monitor, estudiante, externo',
    },
    validate: {
      validator: function (val) {
        return val.isEmpty;
      },
      message: 'La privacidad no debe estar vacia',
    },
  },
});

const TipoServicio = mongoose.model('TipoServicio', tipoServicioSchema);

module.exports = TipoServicio;
