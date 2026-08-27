const prisma = require('../config/database');

class FichaRepository {
  async create(data) {
    return prisma.ficha.create({
      data,
      include: {
        programa: true,
        instructor: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        _count: { select: { matriculas: true } },
      },
    });
  }

  async findById(id) {
    return prisma.ficha.findUnique({
      where: { id },
      include: {
        programa: true,
        instructor: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        },
        matriculas: {
          include: {
            aprendiz: {
              select: { id: true, firstName: true, lastName: true, email: true, phone: true, isActive: true },
            },
          },
        },
        _count: { select: { matriculas: true, sesiones: true } },
      },
    });
  }

  async findByNumero(numero, excludeId = null) {
    const where = { numero };
    if (excludeId) {
      where.NOT = { id: excludeId };
    }
    return prisma.ficha.findFirst({ where });
  }

  async findAll({ skip = 0, take = 10, where = {}, orderBy = { createdAt: 'desc' } }) {
    const [fichas, total] = await prisma.$transaction([
      prisma.ficha.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          programa: true,
          instructor: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          _count: { select: { matriculas: true } },
        },
      }),
      prisma.ficha.count({ where }),
    ]);

    return { fichas, total };
  }

  async update(id, data) {
    return prisma.ficha.update({
      where: { id },
      data,
      include: {
        programa: true,
        instructor: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        _count: { select: { matriculas: true } },
      },
    });
  }

  async delete(id) {
    return prisma.ficha.delete({
      where: { id },
    });
  }

  async getStats() {
    const [total, activas, enRiesgo] = await prisma.$transaction([
      prisma.ficha.count(),
      prisma.ficha.count({ where: { estado: 'Activo' } }),
      prisma.ficha.count({ where: { estado: 'Riesgo' } }),
    ]);

    return { total, activas, enRiesgo };
  }
}

module.exports = new FichaRepository();
