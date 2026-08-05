const prisma = require('../config/database');

class UserRepository {
  async create(data) {
    return prisma.user.create({
      data,
      select: this._defaultSelect(),
    });
  }

  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      select: this._defaultSelect(),
    });
  }

  async findByIdWithPassword(id) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll({ skip, take, where, orderBy }) {
    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy,
        select: this._defaultSelect(),
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  async update(id, data) {
    return prisma.user.update({
      where: { id },
      data,
      select: this._defaultSelect(),
    });
  }

  async delete(id) {
    return prisma.user.delete({
      where: { id },
    });
  }

  async existsByEmail(email, excludeId = null) {
    const where = { email };
    if (excludeId) {
      where.NOT = { id: excludeId };
    }
    const user = await prisma.user.findFirst({ where });
    return !!user;
  }

  async count(where = {}) {
    return prisma.user.count({ where });
  }

  _defaultSelect() {
    return {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      phone: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      password: false,
    };
  }
}

module.exports = new UserRepository();
