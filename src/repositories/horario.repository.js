const prisma = require('../config/database');

class HorarioRepository {
  async create(data) {
    return prisma.horario.create({ data });
  }

  async findByFicha(fichaId) {
    return prisma.horario.findMany({
      where: { fichaId },
      orderBy: { horaInicio: 'asc' },
    });
  }

  async findMyHorario(aprendizId) {
    const matricula = await prisma.matricula.findFirst({
      where: { aprendizId, estado: 'Activo' },
      include: {
        ficha: {
          include: {
            horarios: true,
            programa: true,
            instructor: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!matricula || !matricula.ficha) {
      return [];
    }

    return matricula.ficha.horarios.map((h) => ({
      id: h.id,
      diaSemana: h.diaSemana,
      horaInicio: h.horaInicio,
      horaFin: h.horaFin,
      aula: h.aula || 'Ambiente SENA',
      ficha: matricula.ficha.numero,
      programa: matricula.ficha.programa?.nombre,
      instructor: matricula.ficha.instructor
        ? `${matricula.ficha.instructor.firstName} ${matricula.ficha.instructor.lastName}`
        : '',
    }));
  }

  async delete(id) {
    return prisma.horario.delete({ where: { id } });
  }
}

module.exports = new HorarioRepository();
