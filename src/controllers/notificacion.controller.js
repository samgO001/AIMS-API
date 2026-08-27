const notificacionService = require('../services/notificacion.service');
const { success } = require('../utils/response');
const catchAsync = require('../utils/catchAsync');

class NotificacionController {
  getMyNotificaciones = catchAsync(async (req, res) => {
    const list = await notificacionService.findMyNotificaciones(req.user.id);
    return success(res, list, 'Notificaciones obtenidas exitosamente');
  });

  markRead = catchAsync(async (req, res) => {
    await notificacionService.markAsRead(req.params.id, req.user.id);
    return success(res, null, 'Notificación marcada como leída');
  });
}

module.exports = new NotificacionController();
