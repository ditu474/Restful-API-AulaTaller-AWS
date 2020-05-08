const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    validate: {
      validator: function (val) {
        var re = /^[a-zA-Zñ]+(([',. -][a-zA-Zñ ])?[a-zA-Zñ]*)*$/;
        return re.test(val);
      },
      message: 'El nombre no debe contener caracteres especiales',
    },
  },
  tipoDocumento: {
    type: String,
    required: [true, 'El tipo de documento es requerido'],
    enum: {
      values: ['TI', 'CC', 'CE', 'Pasaporte'],
      message: 'El tipo de documento debe ser TI, CC, CE, Pasaporte',
    },
    default: 'CC',
  },
  documento: {
    type: String,
    unique: true,
    minlength: [7, 'Un documento valido debe tener minimo 7 caracteres'],
    maxlength: [15, 'Un documento valido debe tener maximo 15 caracteres'],
    required: [true, 'Ingresa tu numero de documento'],
    validate: [validator.isAlphanumeric, 'Documento Invalido'],
  },
  correo: {
    type: String,
    required: [true, 'El correo es requerido'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Correo invalido'],
  },
  rol: {
    type: String,
    enum: {
      values: ['docente', 'estudiante', 'externo'],
      message: 'Rol invalido',
    },
    default: 'estudiante',
  },
  sede: {
    type: String,
    enum: {
      values: ['medellin', 'oriente', 'uraba'],
      message: 'La sede debe ser medellin, oriente, uraba',
    },
  },
  programaAcademico: {
    type: String,
  },
  semestre: {
    type: Number,
    validate: {
      validator: function (val) {
        var re = /^[0-9]*$/;
        return re.test(val);
      },
      message: 'El semestre debe ser un numero entero entre 1 y 10',
    },
    min: [1, 'El semestre es minimo 1'],
    max: [10, 'El semestre maximo es 10'],
  },
  password: {
    type: String,
    required: [true, 'Porfavor escriba una contraseña'],
    minlength: [8, 'La contraseña debe contener 8 caracteres minimo'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Porfavor confirme su contraseña'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Las contraseñas no son iguales',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastVisit: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
