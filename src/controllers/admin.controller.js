const adminService = require('../services/admin.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/response');

exports.getStats = catchAsync(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  ApiResponse.success(res, stats, 'Estadísticas del panel administrativo obtenidas exitosamente');
});

exports.getRecentActivity = catchAsync(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
  const activity = await adminService.getRecentActivity(limit);
  ApiResponse.success(res, activity, 'Actividad reciente obtenida exitosamente');
});

exports.createUser = catchAsync(async (req, res) => {
  const newUser = await adminService.createUserByAdmin(req.user.id, req.body);
  ApiResponse.created(res, newUser, 'Usuario creado exitosamente por el administrador');
});
