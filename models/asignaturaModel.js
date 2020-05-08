const mongoose = require('mongoose');

const asignaturaSchema = mongoose.Schema({
  nombre: {
    type: String,
    unique: true,
    required: [true, 'La asignatura debe tener un nombre'],
    validate: {
      validator: function (val) {
        var re = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
        return re.test(val);
      },
      message: 'El nombre no debe contener caracteres especiales',
    },
    maxlength: [40, 'Un nombre no debe tener mas de 40 caracteres'],
    minlength: [5, 'Un nombre debe tener minimo 5 caracteres'],
  },
});

const Asignatura = mongoose.model('Asignatura', asignaturaSchema);

module.exports = Asignatura;
