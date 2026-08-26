const asistenciaService = require('../services/asistencia.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/response');

exports.getMisAsistencias = catchAsync(async (req, res) => {
  const data = await asistenciaService.getMisAsistencias(req.user.id);
  ApiResponse.success(res, data, 'Datos de asistencia del aprendiz obtenidos exitosamente');
});

exports.registrarAsistencia = catchAsync(async (req, res) => {
  const resultado = await asistenciaService.registrarAsistenciaSesion(req.user.id, req.body);
  ApiResponse.created(res, resultado, 'Asistencias registradas exitosamente');
});
