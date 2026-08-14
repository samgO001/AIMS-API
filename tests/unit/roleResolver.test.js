const { resolveRoleFromEmail } = require('../../src/utils/roleResolver');
const AppError = require('../../src/utils/appError');

describe('roleResolver Unit Tests', () => {
  test('should resolve soy.sena.edu.co domain to APRENDIZ', () => {
    const role = resolveRoleFromEmail('test.user@soy.sena.edu.co');
    expect(role).toBe('APRENDIZ');
  });

  test('should resolve sena.edu.co domain to INSTRUCTOR', () => {
    const role = resolveRoleFromEmail('instructor.test@sena.edu.co');
    expect(role).toBe('INSTRUCTOR');
  });

  test('should resolve gmail.com domain to APRENDIZ', () => {
    const role = resolveRoleFromEmail('normal.user@gmail.com');
    expect(role).toBe('APRENDIZ');
  });

  test('should reject any other domain and throw AppError.badRequest', () => {
    expect(() => {
      resolveRoleFromEmail('user@outlook.com');
    }).toThrow(AppError);

    expect(() => {
      resolveRoleFromEmail('user@outlook.com');
    }).toThrow('El dominio del correo no esta permitido para registro');
  });

  test('should reject invalid email formats', () => {
    expect(() => {
      resolveRoleFromEmail('invalidemailformat');
    }).toThrow(AppError);

    expect(() => {
      resolveRoleFromEmail('');
    }).toThrow(AppError);

    expect(() => {
      resolveRoleFromEmail(null);
    }).toThrow(AppError);
  });
});
