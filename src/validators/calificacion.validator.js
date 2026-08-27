const Joi = require('joi');

const upsertCalificacion = Joi.object({
  aprendizId: Joi.string().uuid().required().messages({
    'string.empty': 'El ID del aprendiz es obligatorio',
  }),
  competenciaId: Joi.string().uuid().required().messages({
    'string.empty': 'El ID de la competencia es obligatorio',
  }),
  nota: Joi.number().min(0).max(5).required().messages({
    'number.min': 'La nota mínima es 0.0',
    'number.max': 'La nota máxima es 5.0',
  }),
  periodo: Joi.string().trim().optional(),
  estado: Joi.string().valid('Aprobado', 'Por mejorar').optional(),
});

const createCompetencia = Joi.object({
  nombre: Joi.string().trim().min(3).required(),
  codigo: Joi.string().trim().required(),
  programaId: Joi.string().uuid().required(),
});

module.exports = {
  upsertCalificacion,
  createCompetencia,
};
