const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AppError = require('../utils/appError');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(AppError.unauthorized('Token de acceso requerido'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized('Token de acceso requerido'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        AppError.forbidden('No tienes permisos para realizar esta acción')
      );
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
