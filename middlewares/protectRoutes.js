const { promisify } = require('util');

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return next(
        new AppError('No tienes permisos para realizar esta acción', 403)
      );
    }
    next();
  };
};

exports.verifyToken = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('No se encontró el token', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('No existe un usuario registrado con este token', 401)
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    next(
      new AppError(
        'El usuario recientemente cambio la clave, logueese de nuevo',
        401)
    );
  }

  req.user = currentUser;
  next();
});