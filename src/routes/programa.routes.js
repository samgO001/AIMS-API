const { Router } = require('express');
const programaController = require('../controllers/programa.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const programaValidator = require('../validators/programa.validator');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Programas
 *   description: Gestión de Programas de Formación Académica SENA
 */

router.get('/', authenticate, programaController.getAll);
router.get('/:id', authenticate, validate({ params: programaValidator.idParam }), programaController.getById);

router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate({ body: programaValidator.createPrograma }),
  programaController.create
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ params: programaValidator.idParam, body: programaValidator.updatePrograma }),
  programaController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ params: programaValidator.idParam }),
  programaController.delete
);

module.exports = router;
