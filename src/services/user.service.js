const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const userRepository = require('../repositories/user.repository');
const AppError = require('../utils/appError');

const SALT_ROUNDS = 12;

class UserService {
  async register(userData) {
    const emailExists = await userRepository.existsByEmail(userData.email);
    if (emailExists) {
      throw AppError.conflict('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

    const user = await userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return user;
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw AppError.unauthorized('Credenciales inválidas');
    }

    if (!user.isActive) {
      throw AppError.forbidden('La cuenta está desactivada');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw AppError.unauthorized('Credenciales inválidas');
    }

    const token = this._generateToken(user);

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

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

  async changePassword(userId, currentPassword, newPassword) {
    const user = await userRepository.findByIdWithPassword(userId);
    if (!user) {
      throw AppError.notFound('Usuario no encontrado');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      throw AppError.badRequest('La contraseña actual es incorrecta');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await userRepository.update(userId, { password: hashedNewPassword });
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

  _generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    );
  }
}

module.exports = new UserService();
