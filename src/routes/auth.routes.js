const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');
const { authLimiter } = require('../middlewares/rateLimiter');
const {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  emailOnlySchema,
  resetPasswordSchema,
  refreshTokenSchema,
  changePasswordSchema,
} = require('../validators/auth.validator');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación, gestión de sesión, verificación de correo y recuperación de contraseña
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registro de un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, password]
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Juan
 *               lastName:
 *                 type: string
 *                 example: Pérez
 *               email:
 *                 type: string
 *                 example: juan.perez@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *               phone:
 *                 type: string
 *                 example: "+573001234567"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       409:
 *         description: Email ya registrado
 */
router.post('/register', validate({ body: registerSchema }), authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicio de sesión con correo y contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan.perez@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso (retorna accessToken y refreshToken)
 *       401:
 *         description: Credenciales inválidas
 *       429:
 *         description: Demasiados intentos (rate limit)
 */
router.post('/login', authLimiter, validate({ body: loginSchema }), authController.login);

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Confirmar correo electrónico mediante token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Correo verificado exitosamente
 *       400:
 *         description: Token inválido o expirado
 */
router.post('/verify-email', authLimiter, validate({ body: verifyEmailSchema }), authController.verifyEmail);
router.get('/verify-email', authLimiter, authController.verifyEmail);

/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     summary: Reenviar correo de verificación
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan.perez@example.com
 *     responses:
 *       200:
 *         description: Solicitud procesada
 *       429:
 *         description: Demasiados intentos (rate limit)
 */
router.post('/resend-verification', authLimiter, validate({ body: emailOnlySchema }), authController.resendVerification);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Solicitar recuperación de contraseña (envía correo)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan.perez@example.com
 *     responses:
 *       200:
 *         description: Enlace de recuperación enviado si el correo existe
 *       429:
 *         description: Demasiados intentos (rate limit)
 */
router.post('/forgot-password', authLimiter, validate({ body: emailOnlySchema }), authController.forgotPassword);

/**
 * @swagger
 * /auth/validate-reset-token:
 *   post:
 *     summary: Validar si un token de recuperación de contraseña es válido sin cambiar la contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token de recuperación válido
 *       400:
 *         description: Token inválido o expirado
 *       429:
 *         description: Demasiados intentos (rate limit)
 */
router.post('/validate-reset-token', authLimiter, validate({ body: verifyEmailSchema }), authController.validateResetToken);
router.get('/validate-reset-token', authLimiter, authController.validateResetToken);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Restablecer contraseña utilizando token seguro
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, newPassword]
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Contraseña restablecida exitosamente
 *       400:
 *         description: Token de recuperación inválido o expirado
 *       429:
 *         description: Demasiados intentos (rate limit)
 */
router.post('/reset-password', authLimiter, validate({ body: resetPasswordSchema }), authController.resetPassword);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Renovar Access Token usando Refresh Token (Refresh Token Rotation)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nuevos tokens generados exitosamente
 *       401:
 *         description: Refresh token inválido, expirado o revocado
 */
router.post('/refresh-token', validate({ body: refreshTokenSchema }), authController.refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cierre de sesión (revoca Refresh Token)
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Cambio de contraseña para usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: Password123
 *               newPassword:
 *                 type: string
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *       400:
 *         description: Contraseña actual incorrecta
 *       401:
 *         description: No autorizado
 */
router.post('/change-password', authenticate, validate({ body: changePasswordSchema }), authController.changePassword);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Consultar perfil del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario autenticado
 *       401:
 *         description: Token no provisto o expirado
 */
router.get('/me', authenticate, authController.getMe);

module.exports = router;
