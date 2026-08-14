const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/config/database');

describe('Auth Register Integration Tests', () => {
  const testEmails = [
    'aprendiz.test.gmail@gmail.com',
    'aprendiz.test.soy@soy.sena.edu.co',
    'instructor.test.sena@sena.edu.co',
  ];

  beforeEach(async () => {
    // Delete any existing test users to ensure clean slate before each test
    await prisma.user.deleteMany({
      where: {
        email: {
          in: testEmails,
        },
      },
    });
  });

  afterAll(async () => {
    // Clean up created users after all tests
    await prisma.user.deleteMany({
      where: {
        email: {
          in: testEmails,
        },
      },
    });
    // Disconnect Prisma
    await prisma.$disconnect();
  });

  test('should register a Gmail email as APRENDIZ', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        firstName: 'Juan',
        lastName: 'Gmail',
        email: 'aprendiz.test.gmail@gmail.com',
        password: 'Password123',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('aprendiz.test.gmail@gmail.com');
    expect(res.body.data.role).toBe('APRENDIZ');
  });

  test('should register a @soy.sena.edu.co email as APRENDIZ', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        firstName: 'Juan',
        lastName: 'SenaSoy',
        email: 'aprendiz.test.soy@soy.sena.edu.co',
        password: 'Password123',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('aprendiz.test.soy@soy.sena.edu.co');
    expect(res.body.data.role).toBe('APRENDIZ');
  });

  test('should register a @sena.edu.co email as INSTRUCTOR', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        firstName: 'Juan',
        lastName: 'SenaInst',
        email: 'instructor.test.sena@sena.edu.co',
        password: 'Password123',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('instructor.test.sena@sena.edu.co');
    expect(res.body.data.role).toBe('INSTRUCTOR');
  });

  test('should reject registration with a disallowed email domain', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        firstName: 'Juan',
        lastName: 'Outlook',
        email: 'aprendiz.test.outlook@outlook.com',
        password: 'Password123',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('El dominio del correo no esta permitido para registro');
  });

  test('should ignore and strip the role property even if client passes role: ADMIN', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        firstName: 'Juan',
        lastName: 'Malicious',
        email: 'aprendiz.test.gmail@gmail.com',
        password: 'Password123',
        role: 'ADMIN',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    // Should be resolved to APRENDIZ because of gmail.com domain, not ADMIN
    expect(res.body.data.role).toBe('APRENDIZ');
  });
});
