class AppError extends Error {
  constructor(message, statusCode, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, errors = []) {
    return new AppError(message, 400, errors);
  }

  static unauthorized(message = 'No autorizado') {
    return new AppError(message, 401);
  }

  static forbidden(message = 'Acceso denegado') {
    return new AppError(message, 403);
  }

  static notFound(message = 'Recurso no encontrado') {
    return new AppError(message, 404);
  }

  static conflict(message) {
    return new AppError(message, 409);
  }

  static tooManyRequests(message = 'Demasiadas solicitudes') {
    return new AppError(message, 429);
  }

  static internal(message = 'Error interno del servidor') {
    return new AppError(message, 500);
  }
}

module.exports = AppError;
