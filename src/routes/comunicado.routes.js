const { Router } = require('express');
const comunicadoController = require('../controllers/comunicado.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const comunicadoValidator = require('../validators/comunicado.validator');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Comunicados
 *   description: Difusión Institucional y Mensajes Oficiales
 */

router.get('/', authenticate, comunicadoController.getAll);
router.post('/:id/read', authenticate, comunicadoController.markRead);

router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate({ body: comunicadoValidator.createComunicado }),
  comunicadoController.create
);

module.exports = router;
