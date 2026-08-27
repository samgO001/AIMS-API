const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const env = require('../../src/config/env');

jest.mock('../../src/middlewares/rateLimiter', () => ({
  authLimiter: (req, res, next) => next(),
  apiLimiter: (req, res, next) => next(),
}));

jest.mock('../../src/repositories/programa.repository');
jest.mock('../../src/repositories/ficha.repository');
jest.mock('../../src/repositories/matricula.repository');
jest.mock('../../src/repositories/asistencia.repository');
jest.mock('../../src/repositories/calificacion.repository');
jest.mock('../../src/repositories/observacion.repository');
jest.mock('../../src/repositories/comunicado.repository');
jest.mock('../../src/repositories/notificacion.repository');
jest.mock('../../src/repositories/mensaje.repository');
jest.mock('../../src/repositories/horario.repository');
jest.mock('../../src/repositories/configuracion.repository');
jest.mock('../../src/repositories/user.repository');

const programaRepo = require('../../src/repositories/programa.repository');
const fichaRepo = require('../../src/repositories/ficha.repository');
const matriculaRepo = require('../../src/repositories/matricula.repository');
const asistenciaRepo = require('../../src/repositories/asistencia.repository');
const calificacionRepo = require('../../src/repositories/calificacion.repository');
const observacionRepo = require('../../src/repositories/observacion.repository');
const comunicadoRepo = require('../../src/repositories/comunicado.repository');
const notificacionRepo = require('../../src/repositories/notificacion.repository');
const mensajeRepo = require('../../src/repositories/mensaje.repository');
const horarioRepo = require('../../src/repositories/horario.repository');
const configRepo = require('../../src/repositories/configuracion.repository');
const userRepo = require('../../src/repositories/user.repository');

describe('AIMS Complete Modules Integration Test Suite', () => {
  const adminToken = jwt.sign(
    { id: 'admin-uuid', email: 'admin@sena.edu.co', role: 'ADMIN' },
    env.jwtSecret,
    { expiresIn: '15m' }
  );

  const instructorToken = jwt.sign(
    { id: 'inst-uuid', email: 'instructor@sena.edu.co', role: 'INSTRUCTOR' },
    env.jwtSecret,
    { expiresIn: '15m' }
  );

  const aprendizToken = jwt.sign(
    { id: 'aprendiz-uuid', email: 'aprendiz@soy.sena.edu.co', role: 'APRENDIZ' },
    env.jwtSecret,
    { expiresIn: '15m' }
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Programas
  describe('Programas Module', () => {
    test('GET /api/v1/programas', async () => {
      programaRepo.findAll.mockResolvedValue({ programas: [], total: 0 });
      const res = await request(app)
        .get('/api/v1/programas')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('POST /api/v1/programas (ADMIN)', async () => {
      programaRepo.findByCodigo.mockResolvedValue(null);
      programaRepo.create.mockResolvedValue({ id: 'prog-1', nombre: 'ADSO', codigo: 'ADSO' });

      const res = await request(app)
        .post('/api/v1/programas')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Análisis y Desarrollo de Software', codigo: 'ADSO', nivel: 'Tecnólogo', duracion: '24 meses' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  // 2. Fichas
  describe('Fichas Module', () => {
    test('GET /api/v1/fichas', async () => {
      fichaRepo.findAll.mockResolvedValue({ fichas: [], total: 0 });
      const res = await request(app)
        .get('/api/v1/fichas')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });

    test('GET /api/v1/fichas/mis-fichas (INSTRUCTOR)', async () => {
      fichaRepo.findAll.mockResolvedValue({ fichas: [], total: 0 });
      const res = await request(app)
        .get('/api/v1/fichas/mis-fichas')
        .set('Authorization', `Bearer ${instructorToken}`);
      expect(res.status).toBe(200);
    });
  });

  // 3. Matrículas
  describe('Matrículas Module', () => {
    test('GET /api/v1/matriculas', async () => {
      matriculaRepo.findAll.mockResolvedValue({ matriculas: [], total: 0 });
      const res = await request(app)
        .get('/api/v1/matriculas')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });
  });

  // 4. Asistencia
  describe('Asistencia Module', () => {
    test('GET /api/v1/asistencia/resumen (ADMIN)', async () => {
      asistenciaRepo.getGlobalStats.mockResolvedValue({ totalSesiones: 10, totalRegistros: 100, promedioGlobal: 90 });
      asistenciaRepo.getResumenPorFicha.mockResolvedValue([]);
      asistenciaRepo.getResumenPorPrograma.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/v1/asistencia/resumen')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.promedioGlobal).toBe(90);
    });

    test('POST /api/v1/asistencia/sesion (INSTRUCTOR)', async () => {
      fichaRepo.findById.mockResolvedValue({ id: 'ficha-uuid' });
      asistenciaRepo.createSesionWithRegistros.mockResolvedValue({ id: 'sesion-1' });

      const res = await request(app)
        .post('/api/v1/asistencia/sesion')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          fichaId: '11111111-1111-1111-1111-111111111111',
          registros: [{ aprendizId: '22222222-2222-2222-2222-222222222222', estado: 'Presente' }],
        });

      expect(res.status).toBe(201);
    });
  });

  // 5. Calificaciones
  describe('Calificaciones Module', () => {
    test('GET /api/v1/calificaciones/mis-calificaciones (APRENDIZ)', async () => {
      calificacionRepo.findByAprendiz.mockResolvedValue([]);
      const res = await request(app)
        .get('/api/v1/calificaciones/mis-calificaciones')
        .set('Authorization', `Bearer ${aprendizToken}`);
      expect(res.status).toBe(200);
    });

    test('POST /api/v1/calificaciones', async () => {
      userRepo.findById.mockResolvedValue({ id: '22222222-2222-2222-2222-222222222222' });
      calificacionRepo.upsertCalificacion.mockResolvedValue({ id: 'c-1', nota: 4.5 });

      const res = await request(app)
        .post('/api/v1/calificaciones')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          aprendizId: '22222222-2222-2222-2222-222222222222',
          competenciaId: '33333333-3333-3333-3333-333333333333',
          nota: 4.5,
        });

      expect(res.status).toBe(200);
    });
  });

  // 6. Observaciones
  describe('Observaciones Module', () => {
    test('POST /api/v1/observaciones', async () => {
      userRepo.findById.mockResolvedValue({ id: 'aprendiz-uuid' });
      observacionRepo.create.mockResolvedValue({ id: 'obs-1' });

      const res = await request(app)
        .post('/api/v1/observaciones')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          aprendizId: '22222222-2222-2222-2222-222222222222',
          tipo: 'Felicitacion',
          descripcion: 'Excelente desempeño en proyecto',
        });

      expect(res.status).toBe(201);
    });
  });

  // 7. Comunicados
  describe('Comunicados Module', () => {
    test('POST /api/v1/comunicados (ADMIN)', async () => {
      comunicadoRepo.create.mockResolvedValue({ id: 'com-1' });

      const res = await request(app)
        .post('/api/v1/comunicados')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          destinatario: 'Todos los aprendices',
          titulo: 'Inicio de Trimestre',
          mensaje: 'Se informa el inicio del trimestre académico.',
        });

      expect(res.status).toBe(201);
    });
  });

  // 8. Configuración
  describe('Configuración Module', () => {
    test('GET /api/v1/configuracion', async () => {
      configRepo.get.mockResolvedValue({ nombreCentro: 'Centro SENA', nit: '8999999034' });

      const res = await request(app)
        .get('/api/v1/configuracion')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.nit).toBe('8999999034');
    });
  });

  // 9. Documentos & Reportes
  describe('Documentos & Reportes Modules', () => {
    test('GET /api/v1/documentos (APRENDIZ)', async () => {
      const res = await request(app)
        .get('/api/v1/documentos')
        .set('Authorization', `Bearer ${aprendizToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    test('GET /api/v1/reportes/matriculas-mensuales', async () => {
      const res = await request(app)
        .get('/api/v1/reportes/matriculas-mensuales')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(6);
    });
  });
});
