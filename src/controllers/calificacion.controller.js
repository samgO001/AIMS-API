const calificacionService = require('../services/calificacion.service');
const { success, created } = require('../utils/response');
const catchAsync = require('../utils/catchAsync');

class CalificacionController {
  upsert = catchAsync(async (req, res) => {
    const calificacion = await calificacionService.upsertCalificacion(req.user.id, req.body);
    return success(res, calificacion, 'Calificación registrada/actualizada exitosamente');
  });

  getMyCalificaciones = catchAsync(async (req, res) => {
    const grades = await calificacionService.findMyCalificaciones(req.user.id);
    return success(res, grades, 'Mis calificaciones obtenidas exitosamente');
  });

  getInstructorCalificaciones = catchAsync(async (req, res) => {
    const groups = await calificacionService.findInstructorCalificaciones(req.user.id);
    return success(res, groups, 'Calificaciones por competencia obtenidas exitosamente');
  });

  getAdminResumen = catchAsync(async (req, res) => {
    const resumen = await calificacionService.getAdminResumen();
    return success(res, resumen, 'Resumen de calificaciones obtenido exitosamente');
  });

  createCompetencia = catchAsync(async (req, res) => {
    const competencia = await calificacionService.createCompetencia(req.body);
    return created(res, competencia, 'Competencia creada exitosamente');
  });

  getCompetencias = catchAsync(async (req, res) => {
    const competencias = await calificacionService.findCompetencias(req.query.programaId);
    return success(res, competencias, 'Competencias obtenidas exitosamente');
  });
}

module.exports = new CalificacionController();
