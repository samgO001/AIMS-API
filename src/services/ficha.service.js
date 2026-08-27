const fichaRepository = require('../repositories/ficha.repository');
const programaRepository = require('../repositories/programa.repository');
const userRepository = require('../repositories/user.repository');
const AppError = require('../utils/appError');

class FichaService {
  async create(data) {
    const existing = await fichaRepository.findByNumero(data.numero);
    if (existing) {
      throw AppError.conflict(`La ficha con número '${data.numero}' ya existe`);
    }

    const programa = await programaRepository.findById(data.programaId);
    if (!programa) {
      throw AppError.notFound('El programa especificado no existe');
    }

    const instructor = await userRepository.findById(data.instructorId);
    if (!instructor) {
      throw AppError.notFound('El instructor especificado no existe');
    }

    return fichaRepository.create({
      numero: data.numero,
      badgeCode: data.badgeCode || programa.codigo,
      jornada: data.jornada,
      estado: data.estado || 'Activo',
      programaId: data.programaId,
      instructorId: data.instructorId,
    });
  }

  async findAll(queryParams, user = null) {
    const {
      page = 1,
      limit = 10,
      search,
      estado,
      instructorId,
      programaId,
      sortBy = 'createdAt',
      order = 'desc',
    } = queryParams;

    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 10;
    const skip = (parsedPage - 1) * parsedLimit;

    const where = {};

    if (estado) {
      where.estado = estado;
    }

    if (instructorId) {
      where.instructorId = instructorId;
    }

    if (programaId) {
      where.programaId = programaId;
    }

    if (search) {
      where.OR = [
        { numero: { contains: search, mode: 'insensitive' } },
        { badgeCode: { contains: search, mode: 'insensitive' } },
        { programa: { nombre: { contains: search, mode: 'insensitive' } } },
        { instructor: { firstName: { contains: search, mode: 'insensitive' } } },
        { instructor: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const orderBy = { [sortBy]: order };

    const { fichas, total } = await fichaRepository.findAll({
      skip,
      take: parsedLimit,
      where,
      orderBy,
    });

    const totalPages = Math.ceil(total / parsedLimit);

    const formattedFichas = fichas.map((f) => ({
      id: f.id,
      fichaNumber: f.numero,
      badgeCode: f.badgeCode,
      programTitle: f.programa?.nombre || '',
      instructor: f.instructor ? `${f.instructor.firstName} ${f.instructor.lastName}` : '',
      instructorId: f.instructorId,
      shift: f.jornada,
      status: f.estado,
      aprendicesCount: f._count?.matriculas || 0,
      createdAt: f.createdAt,
    }));

    return {
      fichas: formattedFichas,
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

  async findMyFichas(instructorId) {
    return this.findAll({ instructorId, limit: 50 });
  }

  async findById(id) {
    const ficha = await fichaRepository.findById(id);
    if (!ficha) {
      throw AppError.notFound('Ficha académica no encontrada');
    }
    return {
      id: ficha.id,
      fichaNumber: ficha.numero,
      badgeCode: ficha.badgeCode,
      programTitle: ficha.programa?.nombre || '',
      instructor: ficha.instructor ? `${ficha.instructor.firstName} ${ficha.instructor.lastName}` : '',
      instructorId: ficha.instructorId,
      shift: ficha.jornada,
      status: ficha.estado,
      aprendicesCount: ficha._count?.matriculas || 0,
      matriculas: ficha.matriculas,
      createdAt: ficha.createdAt,
    };
  }

  async update(id, updateData) {
    await this.findById(id);

    if (updateData.numero) {
      const existing = await fichaRepository.findByNumero(updateData.numero, id);
      if (existing) {
        throw AppError.conflict(`El número de ficha '${updateData.numero}' ya existe`);
      }
    }

    if (updateData.programaId) {
      const programa = await programaRepository.findById(updateData.programaId);
      if (!programa) {
        throw AppError.notFound('El programa especificado no existe');
      }
    }

    if (updateData.instructorId) {
      const instructor = await userRepository.findById(updateData.instructorId);
      if (!instructor) {
        throw AppError.notFound('El instructor especificado no existe');
      }
    }

    return fichaRepository.update(id, updateData);
  }

  async delete(id) {
    await this.findById(id);
    return fichaRepository.delete(id);
  }

  async getStats() {
    return fichaRepository.getStats();
  }
}

module.exports = new FichaService();
