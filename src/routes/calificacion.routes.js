const { Router } = require('express');
const calificacionController = require('../controllers/calificacion.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const calificacionValidator = require('../validators/calificacion.validator');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Calificaciones
 *   description: Gestión de Competencias y Calificaciones Académicas
 */

router.get('/mis-calificaciones', authenticate, authorize('APRENDIZ'), calificacionController.getMyCalificaciones);
router.get('/instructor', authenticate, authorize('INSTRUCTOR', 'ADMIN'), calificacionController.getInstructorCalificaciones);
router.get('/resumen', authenticate, authorize('ADMIN'), calificacionController.getAdminResumen);

router.get('/competencias', authenticate, calificacionController.getCompetencias);
router.post(
  '/competencias',
  authenticate,
  authorize('ADMIN'),
  validate({ body: calificacionValidator.createCompetencia }),
  calificacionController.createCompetencia
);

router.post(
  '/',
  authenticate,
  authorize('INSTRUCTOR', 'ADMIN'),
  validate({ body: calificacionValidator.upsertCalificacion }),
  calificacionController.upsert
);

module.exports = router;
