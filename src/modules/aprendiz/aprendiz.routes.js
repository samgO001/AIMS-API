const { Router } = require('express');
const aprendizController = require('./aprendiz.controller');
const { authenticate, authorize } = require('../../middlewares/auth');

const router = Router();

router.use(authenticate);
router.use(authorize('APRENDIZ', 'ADMIN'));

/**
 * @swagger
 * /aprendiz/dashboard:
 *   get:
 *     summary: Obtener el resumen ejecutivo del dashboard para el aprendiz
 *     tags: [Aprendiz]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos consolidados del dashboard del aprendiz
 */
router.get('/dashboard', aprendizController.getDashboard);

module.exports = router;
