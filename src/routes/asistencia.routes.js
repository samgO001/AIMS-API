const { Router } = require('express');
const asistenciaController = require('../controllers/asistencia.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const asistenciaValidator = require('../validators/asistencia.validator');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Asistencia
 *   description: Control y Registro de Asistencia Académica
 */

router.get('/mi-asistencia', authenticate, authorize('APRENDIZ'), asistenciaController.getMyAsistencia);
router.get('/resumen', authenticate, authorize('ADMIN'), asistenciaController.getResumenGlobal);
router.get(
  '/ficha/:fichaId',
  authenticate,
  validate({ params: asistenciaValidator.fichaIdParam }),
  asistenciaController.getByFicha
);

router.post(
  '/sesion',
  authenticate,
  authorize('INSTRUCTOR', 'ADMIN'),
  validate({ body: asistenciaValidator.registrarSesion }),
  asistenciaController.registrarSesion
);

module.exports = router;
