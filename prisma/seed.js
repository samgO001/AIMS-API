const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

async function main() {
  console.log('🌱 Starting seed...');

  const adminPassword = await bcrypt.hash('Admin123', SALT_ROUNDS);
  const instructorPassword = await bcrypt.hash('Instructor123', SALT_ROUNDS);
  const aprendizPassword = await bcrypt.hash('Aprendiz123', SALT_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@aims.com' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'AIMS',
      email: 'admin@aims.com',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+57 300 000 0001',
    },
  });

  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@aims.com' },
    update: {},
    create: {
      firstName: 'Carlos',
      lastName: 'Instructor',
      email: 'instructor@aims.com',
      password: instructorPassword,
      role: 'INSTRUCTOR',
      phone: '+57 300 000 0002',
    },
  });

  const aprendiz = await prisma.user.upsert({
    where: { email: 'aprendiz@aims.com' },
    update: {},
    create: {
      firstName: 'María',
      lastName: 'Aprendiz',
      email: 'aprendiz@aims.com',
      password: aprendizPassword,
      role: 'APRENDIZ',
      phone: '+57 300 000 0003',
    },
  });

  console.log('✅ Seed completed:');
  console.log(`   Admin: ${admin.email}`);
  console.log(`   Instructor: ${instructor.email}`);
  console.log(`   Aprendiz: ${aprendiz.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
