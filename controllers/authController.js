const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.singup = catchAsync(async (req, res, next) => {
  const reqObj = {
    nombre: req.body.nombre,
    tipoDocumento: req.body.tipoDocumento,
    documento: req.body.documento,
    correo: req.body.correo,
    rol: req.body.rol,
    sede: req.body.sede,
    programaAcademico: req.body.programaAcademico,
    semestre: req.body.semestre,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  };
  const newUser = await User.create(reqObj);

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { correo, password } = req.body;
  if (!correo || !password) {
    return next(new AppError('Porfavor ingresa correo y contraseña', 400));
  }
  const user = await User.findOne({ correo }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError('El correo o la contraseña estan incorrectas'),
      401
    );
  }
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('No estas logueado', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('No existe un usuario registrado con este token.', 401)
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    next(
      new AppError(
        'El usuario recientemente cambio la clave, logueese de nuevo.',
        401
      )
    );
  }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return next(
        new AppError('No tienes permisos para realizar esta accion', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ correo: req.body.correo });
  if (!user) {
    return next(new AppError('No existe usuario con este correo', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot password? submit PATCH request with your new password and passwordConfirm to ${resetURL}. If you don't forget your password, ignore this email.`;

  try {
    await sendEmail({
      email: user.correo,
      subject: 'Tu token (valido por 10 minutos)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Tu token ha sido enviado a tu email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('Ha ocurrido un error enviando el token, trata luego', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('El token es invalido o ha expirado', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    return next(new AppError('Tu contraseña actual es incorrecta', 401));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});
