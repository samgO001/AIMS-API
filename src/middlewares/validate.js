const AppError = require('../utils/appError');

const validate = (schema) => {
  return (req, res, next) => {
    const dataToValidate = {};

    if (schema.body) {
      dataToValidate.body = req.body;
    }
    if (schema.params) {
      dataToValidate.params = req.params;
    }
    if (schema.query) {
      dataToValidate.query = req.query;
    }

    const schemas = {};
    if (schema.body) schemas.body = schema.body;
    if (schema.params) schemas.params = schema.params;
    if (schema.query) schemas.query = schema.query;

    const errors = [];

    for (const [key, joiSchema] of Object.entries(schemas)) {
      const { error, value } = joiSchema.validate(dataToValidate[key], {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        errors.push(
          ...error.details.map((detail) => detail.message)
        );
      } else {
        req[key] = value;
      }
    }

    if (errors.length > 0) {
      return next(AppError.badRequest('Error de validación', errors));
    }

    next();
  };
};

module.exports = validate;
