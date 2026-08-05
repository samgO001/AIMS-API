const Joi = require('joi');

const ROLES = ['ADMIN', 'INSTRUCTOR', 'APRENDIZ'];

const id = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.guid': 'El ID debe ser un UUID válido',
    'any.required': 'El ID es requerido',
  }),
});

const createUser = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede exceder 50 caracteres',
    'any.required': 'El nombre es requerido',
  }),
  lastName: Joi.string().trim().min(2).max(50).required().messages({
    'string.min': 'El apellido debe tener al menos 2 caracteres',
    'string.max': 'El apellido no puede exceder 50 caracteres',
    'any.required': 'El apellido es requerido',
  }),
  email: Joi.string().trim().lowercase().email().required().messages({
    'string.email': 'Debe proporcionar un email válido',
    'any.required': 'El email es requerido',
  }),
  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'string.max': 'La contraseña no puede exceder 100 caracteres',
      'string.pattern.base':
        'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
      'any.required': 'La contraseña es requerida',
    }),
  role: Joi.string()
    .valid(...ROLES)
    .default('APRENDIZ')
    .messages({
      'any.only': `El rol debe ser uno de: ${ROLES.join(', ')}`,
    }),
  phone: Joi.string()
    .trim()
    .pattern(/^\+?[\d\s-]{7,15}$/)
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Debe proporcionar un número de teléfono válido',
    }),
});

const updateUser = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede exceder 50 caracteres',
  }),
  lastName: Joi.string().trim().min(2).max(50).messages({
    'string.min': 'El apellido debe tener al menos 2 caracteres',
    'string.max': 'El apellido no puede exceder 50 caracteres',
  }),
  email: Joi.string().trim().lowercase().email().messages({
    'string.email': 'Debe proporcionar un email válido',
  }),
  phone: Joi.string()
    .trim()
    .pattern(/^\+?[\d\s-]{7,15}$/)
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Debe proporcionar un número de teléfono válido',
    }),
  role: Joi.string()
    .valid(...ROLES)
    .messages({
      'any.only': `El rol debe ser uno de: ${ROLES.join(', ')}`,
    }),
  isActive: Joi.boolean(),
})
  .min(1)
  .messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar',
  });

const changePassword = Joi.object({
  currentPassword: Joi.string().required().messages({
    'any.required': 'La contraseña actual es requerida',
  }),
  newPassword: Joi.string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'La nueva contraseña debe tener al menos 8 caracteres',
      'string.max': 'La nueva contraseña no puede exceder 100 caracteres',
      'string.pattern.base':
        'La nueva contraseña debe contener al menos una mayúscula, una minúscula y un número',
      'any.required': 'La nueva contraseña es requerida',
    }),
});

const queryUsers = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.min': 'La página debe ser al menos 1',
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.min': 'El límite debe ser al menos 1',
    'number.max': 'El límite no puede exceder 100',
  }),
  role: Joi.string()
    .valid(...ROLES)
    .messages({
      'any.only': `El rol debe ser uno de: ${ROLES.join(', ')}`,
    }),
  isActive: Joi.boolean(),
  search: Joi.string().trim().max(100),
  sortBy: Joi.string()
    .valid('firstName', 'lastName', 'email', 'createdAt')
    .default('createdAt'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
});

const login = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    'string.email': 'Debe proporcionar un email válido',
    'any.required': 'El email es requerido',
  }),
  password: Joi.string().required().messages({
    'any.required': 'La contraseña es requerida',
  }),
});

module.exports = {
  createUser,
  updateUser,
  changePassword,
  queryUsers,
  login,
  id,
};
