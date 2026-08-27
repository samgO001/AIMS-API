const Joi = require('joi');

const createPrograma = Joi.object({
  nombre: Joi.string().trim().min(3).max(150).required().messages({
    'string.empty': 'El nombre del programa es obligatorio',
  }),
  codigo: Joi.string().trim().min(2).max(30).required().messages({
    'string.empty': 'El código de programa es obligatorio',
  }),
  nivel: Joi.string().trim().required().messages({
    'string.empty': 'El nivel de formación es obligatorio',
  }),
  duracion: Joi.string().trim().required().messages({
    'string.empty': 'La duración del programa es obligatoria',
  }),
  competenciasCount: Joi.number().integer().min(0).optional(),
  estado: Joi.string().valid('Activo', 'Inactivo').optional(),
});

const updatePrograma = Joi.object({
  nombre: Joi.string().trim().min(3).max(150).optional(),
  codigo: Joi.string().trim().min(2).max(30).optional(),
  nivel: Joi.string().trim().optional(),
  duracion: Joi.string().trim().optional(),
  competenciasCount: Joi.number().integer().min(0).optional(),
  estado: Joi.string().valid('Activo', 'Inactivo').optional(),
}).min(1);

const idParam = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.guid': 'El ID debe ser un UUID válido',
  }),
});

module.exports = {
  createPrograma,
  updatePrograma,
  idParam,
};
