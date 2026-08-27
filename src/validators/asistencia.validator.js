const Joi = require('joi');

const registroItem = Joi.object({
  aprendizId: Joi.string().uuid().required().messages({
    'string.empty': 'El ID del aprendiz es obligatorio',
  }),
  estado: Joi.string().valid('Presente', 'Ausente', 'Excusa').required().messages({
    'string.empty': 'El estado de asistencia es obligatorio',
  }),
  observacion: Joi.string().trim().allow(null, '').optional(),
});

const registrarSesion = Joi.object({
  fichaId: Joi.string().uuid().required().messages({
    'string.empty': 'El ID de la ficha es obligatorio',
  }),
  fecha: Joi.date().iso().optional(),
  tema: Joi.string().trim().optional(),
  registros: Joi.array().items(registroItem).min(1).required().messages({
    'array.min': 'Debe enviar al menos un registro de asistencia',
  }),
});

const fichaIdParam = Joi.object({
  fichaId: Joi.string().uuid().required().messages({
    'string.guid': 'El ID de la ficha debe ser un UUID válido',
  }),
});

module.exports = {
  registrarSesion,
  fichaIdParam,
};
