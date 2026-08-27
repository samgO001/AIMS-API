const prisma = require('../config/database');

class ProgramaRepository {
  async create(data) {
    return prisma.programa.create({
      data,
      include: {
        _count: {
          select: { fichas: true, competencias: true },
        },
      },
    });
  }

  async findById(id) {
    return prisma.programa.findUnique({
      where: { id },
      include: {
        fichas: {
          include: {
            instructor: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
            _count: { select: { matriculas: true } },
          },
        },
        competencias: true,
        _count: {
          select: { fichas: true, competencias: true },
        },
      },
    });
  }

  async findByCodigo(codigo, excludeId = null) {
    const where = { codigo };
    if (excludeId) {
      where.NOT = { id: excludeId };
    }
    return prisma.programa.findFirst({ where });
  }

  async findAll({ skip = 0, take = 10, where = {}, orderBy = { createdAt: 'desc' } }) {
    const [programas, total] = await prisma.$transaction([
      prisma.programa.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          fichas: {
            select: {
              id: true,
              numero: true,
              estado: true,
              _count: { select: { matriculas: true } },
            },
          },
          _count: {
            select: { fichas: true, competencias: true },
          },
        },
      }),
      prisma.programa.count({ where }),
    ]);

    return { programas, total };
  }

  async update(id, data) {
    return prisma.programa.update({
      where: { id },
      data,
      include: {
        _count: {
          select: { fichas: true, competencias: true },
        },
      },
    });
  }

  async delete(id) {
    return prisma.programa.delete({
      where: { id },
    });
  }
}

module.exports = new ProgramaRepository();
