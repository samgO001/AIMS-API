const asistenciaService = require('../services/asistencia.service');
const { success, created } = require('../utils/response');
const catchAsync = require('../utils/catchAsync');

class AsistenciaController {
  registrarSesion = catchAsync(async (req, res) => {
    const sesion = await asistenciaService.registrarSesion(req.body);
    return created(res, sesion, 'Sesión de asistencia registrada exitosamente');
  });

  getByFicha = catchAsync(async (req, res) => {
    const sesiones = await asistenciaService.findByFicha(req.params.fichaId);
    return success(res, sesiones, 'Historial de asistencia obtenido exitosamente');
  });

  getMyAsistencia = catchAsync(async (req, res) => {
    const asistencia = await asistenciaService.findMyAsistencia(req.user.id);
    return success(res, asistencia, 'Asistencia del aprendiz obtenida exitosamente');
  });

  getResumenGlobal = catchAsync(async (req, res) => {
    const resumen = await asistenciaService.getResumenGlobal();
    return success(res, resumen, 'Resumen global de asistencia obtenido exitosamente');
  });
}

module.exports = new AsistenciaController();
