const asistenciaRepository = require('../repositories/asistencia.repository');
const fichaRepository = require('../repositories/ficha.repository');
const AppError = require('../utils/appError');

class AsistenciaService {
  async registrarSesion(data) {
    const ficha = await fichaRepository.findById(data.fichaId);
    if (!ficha) {
      throw AppError.notFound('Ficha no encontrada');
    }

    if (!data.registros || !Array.isArray(data.registros) || data.registros.length === 0) {
      throw AppError.badRequest('Debe incluir los registros de asistencia para los aprendices');
    }

    return asistenciaRepository.createSesionWithRegistros(data);
  }

  async findByFicha(fichaId) {
    await fichaRepository.findById(fichaId);
    return asistenciaRepository.findSesionesByFicha(fichaId);
  }

  async findMyAsistencia(aprendizId) {
    const registros = await asistenciaRepository.findRegistrosByAprendiz(aprendizId);
    const total = registros.length;
    const presentes = registros.filter((r) => r.estado === 'Presente').length;
    const excusas = registros.filter((r) => r.estado === 'Excusa').length;
    const ausentes = registros.filter((r) => r.estado === 'Ausente').length;
    const porcentaje = total > 0 ? Math.round((presentes / total) * 100) : 100;

    return {
      porcentaje,
      total,
      presentes,
      excusas,
      ausentes,
      registros: registros.map((r) => ({
        id: r.id,
        fecha: r.sesion?.fecha ? r.sesion.fecha.toISOString().split('T')[0] : '',
        tema: r.sesion?.tema || 'Sesión de formación',
        ficha: r.sesion?.ficha?.numero || '',
        programa: r.sesion?.ficha?.programa?.nombre || '',
        estado: r.estado,
        observacion: r.observacion,
      })),
    };
  }

  async getResumenGlobal() {
    const stats = await asistenciaRepository.getGlobalStats();
    const resumenFichas = await asistenciaRepository.getResumenPorFicha();
    const porPrograma = await asistenciaRepository.getResumenPorPrograma();

    const fichasCriticas = resumenFichas.filter((f) => f.estado === 'Riesgo').length;
    const mejorProgramaObj = porPrograma.reduce(
      (max, p) => (p.pct > (max.pct || 0) ? p : max),
      { name: 'N/A', pct: 0 }
    );

    return {
      promedioGlobal: stats.promedioGlobal,
      totalSesiones: stats.totalSesiones,
      fichasCriticas,
      mejorPrograma: mejorProgramaObj.name,
      programasBars: porPrograma,
      resumenFichas,
    };
  }
}

module.exports = new AsistenciaService();
