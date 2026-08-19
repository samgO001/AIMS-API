const request = require('supertest');
const app = require('../../src/app');

describe('Global App & Health Check Integration Tests', () => {
  test('GET /api/health should return 200 and health status', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('AIMS API is running');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('environment');
  });

  test('GET unhandled route should return 404 Not Found formatted error', async () => {
    const res = await request(app).get('/api/v1/ruta-que-no-existe');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('no encontrada');
  });

  test('GET /api/docs/ should serve Swagger documentation UI', async () => {
    const res = await request(app).get('/api/docs/');

    expect([200, 301, 302]).toContain(res.status);
  });
});
