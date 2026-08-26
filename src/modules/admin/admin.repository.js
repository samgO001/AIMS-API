const prisma = require('../../config/database');

class AdminRepository {
  async getDashboardStats() {
    const [aprendicesCount, instructoresCount, programasCount, fichasActivasCount, aprendicesPorEstado] = await Promise.all([
      prisma.user.count({ where: { role: 'APRENDIZ', isActive: true } }),
      prisma.user.count({ where: { role: 'INSTRUCTOR', isActive: true } }),
      prisma.programa.count(),
      prisma.ficha.count({ where: { isActive: true } }),
      prisma.user.groupBy({
        by: ['estadoAcademico'],
        where: { role: 'APRENDIZ' },
        _count: { id: true },
      }),
    ]);

    // Asistencia semanal (últimas 4 semanas o resumen reciente)
    const asistenciasRecientes = await prisma.asistencia.groupBy({
      by: ['estado'],
      _count: { id: true },
    });

    return {
      aprendicesCount,
      instructoresCount,
      programasCount,
      fichasActivasCount,
      aprendicesPorEstado: aprendicesPorEstado.map(group => ({
        estado: group.estadoAcademico || 'EN_FORMACION',
        count: group._count.id,
      })),
      asistenciasRecientes,
    };
  }

  async getRecentActivity(limit = 10) {
    return prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async createUserByAdmin(data) {
    return prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role || 'APRENDIZ',
        phone: data.phone || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        isEmailVerified: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });
  }
}

module.exports = new AdminRepository();
