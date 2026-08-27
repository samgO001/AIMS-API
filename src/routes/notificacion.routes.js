const { Router } = require('express');
const notificacionController = require('../controllers/notificacion.controller');
const { authenticate } = require('../middlewares/auth');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notificaciones
 *   description: Centro de Alertas y Notificaciones por Usuario
 */

router.get('/', authenticate, notificacionController.getMyNotificaciones);
router.patch('/:id/read', authenticate, notificacionController.markRead);

module.exports = router;
