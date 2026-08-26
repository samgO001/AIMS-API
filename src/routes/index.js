const { Router } = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const adminRoutes = require('./admin.routes');
const programaRoutes = require('./programa.routes');
const fichaRoutes = require('./ficha.routes');
const asistenciaRoutes = require('./asistencia.routes');
const calificacionRoutes = require('./calificacion.routes');
const horarioRoutes = require('./horario.routes');
const notificacionRoutes = require('./notificacion.routes');
const aprendizRoutes = require('./aprendiz.routes');

const moduloRoutes = require('./modulo.routes');
const evidenciaRoutes = require('./evidencia.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/programas', programaRoutes);
router.use('/fichas', fichaRoutes);
router.use('/asistencia', asistenciaRoutes);
router.use('/calificaciones', calificacionRoutes);
router.use('/horarios', horarioRoutes);
router.use('/notificaciones', notificacionRoutes);
router.use('/aprendiz', aprendizRoutes);
router.use('/modulos', moduloRoutes);
router.use('/evidencias', evidenciaRoutes);

module.exports = router;


