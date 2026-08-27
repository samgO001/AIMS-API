const { Router } = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const programaRoutes = require('./programa.routes');
const fichaRoutes = require('./ficha.routes');
const matriculaRoutes = require('./matricula.routes');
const asistenciaRoutes = require('./asistencia.routes');
const calificacionRoutes = require('./calificacion.routes');
const observacionRoutes = require('./observacion.routes');
const comunicadoRoutes = require('./comunicado.routes');
const notificacionRoutes = require('./notificacion.routes');
const mensajeRoutes = require('./mensaje.routes');
const horarioRoutes = require('./horario.routes');
const configuracionRoutes = require('./configuracion.routes');
const reportesRoutes = require('./reportes.routes');
const documentosRoutes = require('./documentos.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/programas', programaRoutes);
router.use('/fichas', fichaRoutes);
router.use('/matriculas', matriculaRoutes);
router.use('/asistencia', asistenciaRoutes);
router.use('/calificaciones', calificacionRoutes);
router.use('/observaciones', observacionRoutes);
router.use('/comunicados', comunicadoRoutes);
router.use('/notificaciones', notificacionRoutes);
router.use('/mensajes', mensajeRoutes);
router.use('/horarios', horarioRoutes);
router.use('/configuracion', configuracionRoutes);
router.use('/reportes', reportesRoutes);
router.use('/documentos', documentosRoutes);

module.exports = router;
