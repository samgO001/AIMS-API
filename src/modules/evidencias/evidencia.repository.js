const prisma = require('../../config/database');

class EvidenciaRepository {
  async getAll(where = {}) {
    return prisma.evidencia.findMany({
      where,
      include: {
        ficha: {
          select: { id: true, numero: true, jornada: true },
        },
        instructor: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        _count: {
          select: { entregas: true },
        },
      },
      orderBy: { fechaLimite: 'asc' },
    });
  }

  async getById(id) {
    return prisma.evidencia.findUnique({
      where: { id },
      include: {
        ficha: true,
        instructor: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        entregas: {
          include: {
            aprendiz: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
        },
      },
    });
  }

  async create(data) {
    return prisma.evidencia.create({
      data,
      include: {
        ficha: {
          select: { id: true, numero: true },
        },
      },
    });
  }

  async update(id, data) {
    return prisma.evidencia.update({
      where: { id },
      data,
      include: {
        ficha: {
          select: { id: true, numero: true },
        },
      },
    });
  }

  async delete(id) {
    return prisma.evidencia.delete({
      where: { id },
    });
  }

  async upsertEntrega(evidenciaId, aprendizId, data) {
    return prisma.entregaEvidencia.upsert({
      where: {
        evidenciaId_aprendizId: {
          evidenciaId,
          aprendizId,
        },
      },
      update: {
        archivoUrl: data.archivoUrl || null,
        comentario: data.comentario || null,
        fechaEntrega: new Date(),
      },
      create: {
        evidenciaId,
        aprendizId,
        archivoUrl: data.archivoUrl || null,
        comentario: data.comentario || null,
      },
      include: {
        aprendiz: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
  }

  async calificarEntrega(entregaId, nota) {
    return prisma.entregaEvidencia.update({
      where: { id: entregaId },
      data: { nota },
      include: {
        aprendiz: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        evidencia: {
          select: { id: true, titulo: true },
        },
      },
    });
  }

  async getEntregasByEvidencia(evidenciaId) {
    return prisma.entregaEvidencia.findMany({
      where: { evidenciaId },
      include: {
        aprendiz: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { fechaEntrega: 'desc' },
    });
  }
}

module.exports = new EvidenciaRepository();
