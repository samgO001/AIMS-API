const asistenciaService = require('../asistencia/asistencia.service');
const calificacionService = require('../calificaciones/calificacion.service');
const horarioService = require('../horarios/horario.service');
const notificacionService = require('../notificaciones/notificacion.service');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/response');

exports.getDashboard = catchAsync(async (req, res) => {
  const aprendizId = req.user.id;

  const [asistencia, calificaciones, horario, notificaciones] = await Promise.all([
    asistenciaService.getMisAsistencias(aprendizId),
    calificacionService.getMisCalificaciones(aprendizId),
    horarioService.getMiHorario(aprendizId),
    notificacionService.getMisNotificaciones(aprendizId),
  ]);

  const dashboardData = {
    user: {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
    },
    statCards: [
      { label: 'PROMEDIO', value: String(calificaciones.promedioGeneral), highlight: true },
      { label: 'ASISTENCIA', value: `${asistencia.porcentajeGlobal}%`, highlight: true },
      { label: 'MATERIAS', value: String(calificaciones.gradesData.length), highlight: false },
    ],
    competencias: calificaciones.gradesData.map(g => ({
      nombre: g.subject,
      nota: g.grade,
      max: 5,
    })),
    proximasClases: [],
    notificacionesRecientes: notificaciones.notificaciones.slice(0, 5),
    unreadNotificationsCount: notificaciones.unreadCount,
  };

  ApiResponse.success(res, dashboardData, 'Dashboard del aprendiz obtenido exitosamente');
});
