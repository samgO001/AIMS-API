const userService = require('../services/user.service');
const { success, created, paginated } = require('../utils/response');
const catchAsync = require('../utils/catchAsync');

class UserController {
  register = catchAsync(async (req, res) => {
    const user = await userService.register(req.body);
    return created(res, user, 'Usuario registrado exitosamente');
  });

  login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    return success(res, result, 'Inicio de sesión exitoso');
  });

  getAll = catchAsync(async (req, res) => {
    const { users, pagination } = await userService.findAll(req.query);
    return paginated(res, users, pagination, 'Usuarios obtenidos exitosamente');
  });

  getById = catchAsync(async (req, res) => {
    const user = await userService.findById(req.params.id);
    return success(res, user, 'Usuario obtenido exitosamente');
  });

  getProfile = catchAsync(async (req, res) => {
    const user = await userService.getProfile(req.user.id);
    return success(res, user, 'Perfil obtenido exitosamente');
  });

  update = catchAsync(async (req, res) => {
    const user = await userService.update(req.params.id, req.body);
    return success(res, user, 'Usuario actualizado exitosamente');
  });

  updateProfile = catchAsync(async (req, res) => {
    const { role, isActive, ...safeData } = req.body;
    const user = await userService.update(req.user.id, safeData);
    return success(res, user, 'Perfil actualizado exitosamente');
  });

  changePassword = catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(req.user.id, currentPassword, newPassword);
    return success(res, null, 'Contraseña actualizada exitosamente');
  });

  delete = catchAsync(async (req, res) => {
    await userService.delete(req.params.id);
    return success(res, null, 'Usuario eliminado exitosamente');
  });

  toggleActive = catchAsync(async (req, res) => {
    const user = await userService.toggleActive(req.params.id);
    const status = user.isActive ? 'activado' : 'desactivado';
    return success(res, user, `Usuario ${status} exitosamente`);
  });
}

module.exports = new UserController();
