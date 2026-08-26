const prisma = require('../config/database');

/**
 * Registrar una acción en los logs de auditoría
 * @param {string|null} userId ID del usuario que realizó la acción
 * @param {string} accion Nombre/descripción de la acción (ej: 'CREAR_USUARIO', 'REGISTRAR_ASISTENCIA')
 * @param {object|string} [detalles] Detalles adicionales
 */
const logAudit = async (userId, accion, detalles = null) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  try {
    const detallesStr = typeof detalles === 'object' && detalles !== null 
      ? JSON.stringify(detalles) 
      : detalles;

    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        accion,
        detalles: detallesStr,
      },
    });
  } catch (error) {
    console.error('Error al guardar log de auditoría:', error.message);
  }
};

module.exports = logAudit;
