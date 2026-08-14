const userRepository = require('../repositories/user.repository');
const AppError = require('../utils/appError');

class UserService {
  async findAll(queryParams) {
    const {
      page = 1,
      limit = 10,
      role,
      isActive,
      search,
      sortBy = 'createdAt',
      order = 'desc',
    } = queryParams;

    const skip = (page - 1) * limit;

    const where = {};

    if (role) {
      where.role = role;
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy = { [sortBy]: order };

    const { users, total } = await userRepository.findAll({
      skip,
      take: limit,
      where,
      orderBy,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw AppError.notFound('Usuario no encontrado');
    }
    return user;
  }

  async update(id, updateData) {
    await this.findById(id);

    if (updateData.email) {
      const emailExists = await userRepository.existsByEmail(
        updateData.email,
        id
      );
      if (emailExists) {
        throw AppError.conflict('El email ya está en uso por otro usuario');
      }
    }

    if (updateData.password) {
      delete updateData.password;
    }

    const updatedUser = await userRepository.update(id, updateData);
    return updatedUser;
  }

  async delete(id) {
    await this.findById(id);
    await userRepository.delete(id);
  }

  async toggleActive(id) {
    const user = await this.findById(id);
    const updatedUser = await userRepository.update(id, {
      isActive: !user.isActive,
    });
    return updatedUser;
  }

  async getProfile(userId) {
    return this.findById(userId);
  }
}

module.exports = new UserService();
