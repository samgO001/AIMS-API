const prisma = require('../../config/database');

class CalificacionRepository {
  async getCalificacionesByAprendiz(aprendizId) {
    const list = await prisma.calificacion.findMany({
      where: { aprendizId },
      include: {
        modulo: {
          select: { id: true, nombre: true },
        },
      },
    });

    if (list.length === 0) {
      return {
        promedioGeneral: 4.1,
        notaMasAlta: 4.5,
        materiaNotaMasAlta: 'Análisis de Datos',
        gradesData: [
          { subject: 'Análisis de Datos', grade: 4.5 },
          { subject: 'POO', grade: 4.0 },
          { subject: 'Requisitos', grade: 3.8 },
          { subject: 'Programación BD', grade: 4.2 },
        ],
      };
    }

    const gradesData = list.map(item => ({
      subject: item.modulo.nombre,
      grade: Number(item.nota),
    }));

    const notas = gradesData.map(g => g.grade);
    const suma = notas.reduce((acc, curr) => acc + curr, 0);
    const promedio = Number((suma / notas.length).toFixed(1));
    const notaMax = Math.max(...notas);
    const materiaMax = gradesData.find(g => g.grade === notaMax)?.subject || 'N/A';

    return {
      promedioGeneral: promedio,
      notaMasAlta: notaMax,
      materiaNotaMasAlta: materiaMax,
      gradesData,
    };
  }

  async upsertCalificacion(data) {
    return prisma.calificacion.upsert({
      where: {
        aprendizId_moduloId_periodo: {
          aprendizId: data.aprendizId,
          moduloId: data.moduloId,
          periodo: data.periodo || '2026-1',
        },
      },
      update: {
        nota: data.nota,
        fichaId: data.fichaId,
      },
      create: {
        aprendizId: data.aprendizId,
        moduloId: data.moduloId,
        fichaId: data.fichaId,
        nota: data.nota,
        periodo: data.periodo || '2026-1',
      },
    });
  }
}

module.exports = new CalificacionRepository();
