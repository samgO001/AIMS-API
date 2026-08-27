const programaRepository = require('../repositories/programa.repository');
const AppError = require('../utils/appError');

class ProgramaService {
  async create(data) {
    const existing = await programaRepository.findByCodigo(data.codigo);
    if (existing) {
      throw AppError.conflict(`El programa con código '${data.codigo}' ya existe`);
    }

    return programaRepository.create(data);
  }

  async findAll(queryParams) {
    const {
      page = 1,
      limit = 10,
      search,
      nivel,
      estado,
      sortBy = 'createdAt',
      order = 'desc',
    } = queryParams;

    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 10;
    const skip = (parsedPage - 1) * parsedLimit;

    const where = {};

    if (nivel) {
      where.nivel = nivel;
    }

    if (estado) {
      where.estado = estado;
    }

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { codigo: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy = { [sortBy]: order };

    const { programas, total } = await programaRepository.findAll({
      skip,
      take: parsedLimit,
      where,
      orderBy,
    });

    const totalPages = Math.ceil(total / parsedLimit);

    // Enriquecer con cálculo de aprendices por programa
    const formattedProgramas = programas.map((prog) => {
      const totalAprendices = prog.fichas.reduce(
        (sum, f) => sum + (f._count?.matriculas || 0),
        0
      );
      return {
        ...prog,
        fichasCount: prog._count?.fichas || 0,
        competenciasCount: prog._count?.competencias || prog.competenciasCount || 0,
        totalAprendices,
      };
    });

    return {
      programas: formattedProgramas,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages,
        hasNextPage: parsedPage < totalPages,
        hasPrevPage: parsedPage > 1,
      },
    };
  }

  async findById(id) {
    const programa = await programaRepository.findById(id);
    if (!programa) {
      throw AppError.notFound('Programa de formación no encontrado');
    }
    return programa;
  }

  async update(id, updateData) {
    await this.findById(id);

    if (updateData.codigo) {
      const existing = await programaRepository.findByCodigo(updateData.codigo, id);
      if (existing) {
        throw AppError.conflict(`El código '${updateData.codigo}' ya pertenece a otro programa`);
      }
    }

    return programaRepository.update(id, updateData);
  }

  async delete(id) {
    await this.findById(id);
    return programaRepository.delete(id);
  }
}

module.exports = new ProgramaService();
