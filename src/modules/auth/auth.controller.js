const authService = require('./auth.service');
const { success, created } = require('../../utils/response');
const catchAsync = require('../../utils/catchAsync');

class AuthController {
  register = catchAsync(async (req, res) => {
    const result = await authService.register(req.body);
    return created(res, result.user, result.message);
  });

  login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return success(res, result, 'Inicio de sesión exitoso');
  });

  verifyEmail = catchAsync(async (req, res) => {
    const token = req.query.token || req.body.token;
    const result = await authService.verifyEmail(token);
    return success(res, null, result.message);
  });

  resendVerification = catchAsync(async (req, res) => {
    const { email } = req.body;
    const result = await authService.resendVerificationEmail(email);
    return success(res, null, result.message);
  });

  forgotPassword = catchAsync(async (req, res) => {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    return success(res, null, result.message);
  });

  validateResetToken = catchAsync(async (req, res) => {
    const token = req.query.token || req.body.token;
    const result = await authService.validateResetToken(token);
    return success(res, null, result.message);
  });

  resetPassword = catchAsync(async (req, res) => {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword(token, newPassword);
    return success(res, null, result.message);
  });

  refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    return success(res, result, 'Token renovado exitosamente');
  });

  logout = catchAsync(async (req, res) => {
    const refreshToken = req.body?.refreshToken;
    const userId = req.user?.id;
    const result = await authService.logout(refreshToken, userId);
    return success(res, null, result.message);
  });

  changePassword = catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(req.user.id, currentPassword, newPassword);
    return success(res, null, result.message);
  });

  getMe = catchAsync(async (req, res) => {
    const user = await authService.getMe(req.user.id);
    return success(res, user, 'Perfil obtenido exitosamente');
  });
    googleLogin = catchAsync(async (req, res) => {
    const { idToken } = req.body;
    const result = await authService.googleLogin(idToken);
    return success(res, result, 'Inicio de sesión con Google exitoso');
  });

  sendMagicLink = catchAsync(async (req, res) => {
    const { email } = req.body;
    const result = await authService.sendMagicLink(email);
    return success(res, null, result.message);
  });

  verifyMagicLink = catchAsync(async (req, res) => {
    const token = req.query.token || req.body.token;
    const result = await authService.verifyMagicLink(token);
    return success(res, result, 'Inicio de sesión exitoso');
  });
}

module.exports = new AuthController();
