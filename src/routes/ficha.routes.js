const { Router } = require('express');
const fichaController = require('../controllers/ficha.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const fichaValidator = require('../validators/ficha.validator');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Fichas
 *   description: Gestión de Grupos de Formación Académica (Fichas SENA)
 */

router.get('/', authenticate, fichaController.getAll);
router.get('/mis-fichas', authenticate, authorize('INSTRUCTOR'), fichaController.getMyFichas);
router.get('/stats', authenticate, authorize('ADMIN'), fichaController.getStats);
router.get('/:id', authenticate, validate({ params: fichaValidator.idParam }), fichaController.getById);

router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate({ body: fichaValidator.createFicha }),
  fichaController.create
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ params: fichaValidator.idParam, body: fichaValidator.updateFicha }),
  fichaController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ params: fichaValidator.idParam }),
  fichaController.delete
);

module.exports = router;
