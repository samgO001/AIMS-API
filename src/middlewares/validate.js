const AppError = require('../utils/appError');

const validate = (schema) => {
  if (!schema) {
    throw new Error('El middleware de validación requiere un esquema');
  }

  // Guardarraíl defensivo: Si se pasa un schema de Joi directamente sin objeto contenedor (e.g. validate(schema)),
  // lo envolvemos automáticamente como { body: schema } para prevenir omitir la validación.
  let targetSchema = schema;
  const isJoiSchema = schema.isJoi || (typeof schema.validate === 'function' && schema.type === 'object');
  const hasTargets = schema.body || schema.params || schema.query;

  if (isJoiSchema || !hasTargets) {
    targetSchema = { body: schema };
  }

  return (req, res, next) => {
    const dataToValidate = {};

    if (targetSchema.body) {
      dataToValidate.body = req.body;
    }
    if (targetSchema.params) {
      dataToValidate.params = req.params;
    }
    if (targetSchema.query) {
      dataToValidate.query = req.query;
    }

    const schemas = {};
    if (targetSchema.body) schemas.body = targetSchema.body;
    if (targetSchema.params) schemas.params = targetSchema.params;
    if (targetSchema.query) schemas.query = targetSchema.query;

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
