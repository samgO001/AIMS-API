const Joi = require('joi');

const createFicha = Joi.object({
  numero: Joi.string().trim().min(3).max(30).required().messages({
    'string.empty': 'El número de ficha es obligatorio',
  }),
  badgeCode: Joi.string().trim().max(10).optional(),
  jornada: Joi.string().trim().required().messages({
    'string.empty': 'La jornada es obligatoria',
  }),
  estado: Joi.string().valid('Activo', 'Riesgo', 'Finalizada').optional(),
  programaId: Joi.string().uuid().required().messages({
    'string.empty': 'El programa es obligatorio',
    'string.guid': 'El ID del programa debe ser un UUID válido',
  }),
  instructorId: Joi.string().uuid().required().messages({
    'string.empty': 'El instructor líder es obligatorio',
    'string.guid': 'El ID del instructor debe ser un UUID válido',
  }),
});

const updateFicha = Joi.object({
  numero: Joi.string().trim().min(3).max(30).optional(),
  badgeCode: Joi.string().trim().max(10).optional(),
  jornada: Joi.string().trim().optional(),
  estado: Joi.string().valid('Activo', 'Riesgo', 'Finalizada').optional(),
  programaId: Joi.string().uuid().optional(),
  instructorId: Joi.string().uuid().optional(),
}).min(1);

const idParam = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.guid': 'El ID debe ser un UUID válido',
  }),
});

module.exports = {
  createFicha,
  updateFicha,
  idParam,
};
