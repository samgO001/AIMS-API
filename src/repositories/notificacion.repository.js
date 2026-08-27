const prisma = require('../config/database');

class NotificacionRepository {
  async create({ userId, titulo, mensaje, tipo }) {
    return prisma.notificacion.create({
      data: {
        userId,
        titulo,
        mensaje,
        tipo: tipo || 'Info',
      },
    });
  }

  async findByUser(userId) {
    return prisma.notificacion.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id, userId) {
    return prisma.notificacion.updateMany({
      where: { id, userId },
      data: { leida: true },
    });
  }
}

module.exports = new NotificacionRepository();
