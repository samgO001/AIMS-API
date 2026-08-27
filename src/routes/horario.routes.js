const { Router } = require('express');
const horarioController = require('../controllers/horario.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Horarios
 *   description: Gestión de Horarios de Clases y Ambientes
 */

router.get('/mi-horario', authenticate, authorize('APRENDIZ'), horarioController.getMyHorario);
router.get('/ficha/:fichaId', authenticate, horarioController.getByFicha);
router.post('/', authenticate, authorize('ADMIN'), horarioController.create);
router.delete('/:id', authenticate, authorize('ADMIN'), horarioController.delete);

module.exports = router;
