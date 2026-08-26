const calificacionRepository = require('../repositories/calificacion.repository');
const logAudit = require('../utils/auditLogger');

class CalificacionService {
  async getMisCalificaciones(aprendizId) {
    return calificacionRepository.getCalificacionesByAprendiz(aprendizId);
  }

  async registrarCalificacion(userId, data) {
    const result = await calificacionRepository.upsertCalificacion(data);
    await logAudit(userId, 'REGISTRAR_CALIFICACION', { calificacionId: result.id, aprendizId: data.aprendizId, nota: data.nota });
    return result;
  }
}

module.exports = new CalificacionService();
