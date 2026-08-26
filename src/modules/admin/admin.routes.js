const { Router } = require('express');
const adminController = require('./admin.controller');
const { authenticate, authorize } = require('../../middlewares/auth');

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN'));

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Obtener estadísticas generales del panel de administración
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas del sistema
 */
router.get('/stats', adminController.getStats);

/**
 * @swagger
 * /admin/recent-activity:
 *   get:
 *     summary: Obtener el historial de actividad reciente (logs de auditoría)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logs de auditoría recientes
 */
router.get('/recent-activity', adminController.getRecentActivity);

/**
 * @swagger
 * /admin/users:
 *   post:
 *     summary: Crear un usuario administrativo o instructor directamente
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, role]
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, INSTRUCTOR, APRENDIZ]
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente por el administrador
 */
router.post('/users', adminController.createUser);

module.exports = router;
