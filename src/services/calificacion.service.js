const calificacionRepository = require('../repositories/calificacion.repository');
const userRepository = require('../repositories/user.repository');
const AppError = require('../utils/appError');

class CalificacionService {
  async upsertCalificacion(instructorId, data) {
    const aprendiz = await userRepository.findById(data.aprendizId);
    if (!aprendiz) {
      throw AppError.notFound('Aprendiz no encontrado');
    }

    if (data.nota < 0 || data.nota > 5) {
      throw AppError.badRequest('La nota debe estar entre 0.0 y 5.0');
    }

    return calificacionRepository.upsertCalificacion({
      aprendizId: data.aprendizId,
      competenciaId: data.competenciaId,
      instructorId,
      nota: data.nota,
      periodo: data.periodo,
      estado: data.estado,
    });
  }

  async findMyCalificaciones(aprendizId) {
    const califs = await calificacionRepository.findByAprendiz(aprendizId);

    const gradesData = califs.map((c) => ({
      id: c.id,
      subject: c.competencia?.nombre || 'Competencia',
      grade: Number(c.nota),
      periodo: c.periodo,
      instructor: c.instructor ? `${c.instructor.firstName} ${c.instructor.lastName}` : 'Instructor',
      estado: c.estado,
    }));

    return gradesData;
  }

  async findInstructorCalificaciones(instructorId) {
    const califs = await calificacionRepository.findByInstructor(instructorId);

    // Group by competency
    const groupsMap = {};
    califs.forEach((c) => {
      const compId = c.competenciaId;
      if (!groupsMap[compId]) {
        groupsMap[compId] = {
          id: compId,
          title: c.competencia?.nombre || 'Competencia',
          students: [],
        };
      }

      groupsMap[compId].students.push({
        name: c.aprendiz ? `${c.aprendiz.firstName} ${c.aprendiz.lastName}` : 'Aprendiz',
        nota: Number(c.nota),
        maxNota: 5.0,
      });
    });

    const groups = Object.values(groupsMap).map((g) => {
      const avg = g.students.reduce((sum, s) => sum + s.nota, 0) / (g.students.length || 1);
      return {
        ...g,
        overallNota: Number(avg.toFixed(1)),
      };
    });

    return groups;
  }

  async getAdminResumen() {
    return calificacionRepository.getAdminResumen();
  }

  async createCompetencia(data) {
    return calificacionRepository.createCompetencia(data);
  }

  async findCompetencias(programaId) {
    return calificacionRepository.findCompetenciasByPrograma(programaId);
  }
}

module.exports = new CalificacionService();
