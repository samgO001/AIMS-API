const notificacionRepository = require('../repositories/notificacion.repository');

class NotificacionService {
  async create(data) {
    return notificacionRepository.create(data);
  }

  async findMyNotificaciones(userId) {
    return notificacionRepository.findByUser(userId);
  }

  async markAsRead(id, userId) {
    return notificacionRepository.markAsRead(id, userId);
  }
}

module.exports = new NotificacionService();
