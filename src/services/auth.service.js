const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const userRepository = require('../repositories/user.repository');
const authRepository = require('../repositories/auth.repository');
const AppError = require('../utils/appError');
const { generateRandomToken, hashToken } = require('../utils/token');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/mailer');

const SALT_ROUNDS = 12;

class AuthService {
  /**
   * Register a new user and send verification email.
   */
  async register(userData) {
    const emailExists = await userRepository.existsByEmail(userData.email);
    if (emailExists) {
      throw AppError.conflict('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

    // Generate email verification token (unhashed sent to email, hashed stored in DB)
    const { unhashedToken, hashedToken } = generateRandomToken();

    const user = await userRepository.create({
      ...userData,
      password: hashedPassword,
      isEmailVerified: false,
      emailVerificationToken: hashedToken,
    });

    // Send verification email asynchronously
    sendVerificationEmail(user.email, unhashedToken).catch((err) => {
      console.error('Error al enviar correo de verificación:', err.message);
    });

    return {
      user,
      message: 'Usuario registrado exitosamente. Se ha enviado un correo para verificar tu cuenta.',
    };
  }

  /**
   * Login user and issue Access Token & Refresh Token.
   */
  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw AppError.unauthorized('Credenciales inválidas');
    }

    if (!user.isActive) {
      throw AppError.forbidden('La cuenta está desactivada. Contacta al administrador.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw AppError.unauthorized('Credenciales inválidas');
    }

    // Generate JWT Access Token
    const accessToken = this._generateAccessToken(user);

    // Generate Refresh Token & save to DB
    const refreshToken = await this._generateAndSaveRefreshToken(user.id);

    const { password: _, emailVerificationToken, resetPasswordToken, resetPasswordExpires, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Verify email address using provided token.
   */
  async verifyEmail(unhashedToken) {
    const hashed = hashToken(unhashedToken);
    const user = await authRepository.findUserByVerificationToken(hashed);

    if (!user) {
      throw AppError.badRequest('El token de verificación es inválido o ya ha sido utilizado.');
    }

    await authRepository.verifyUserEmail(user.id);

    return { message: 'Correo electrónico verificado exitosamente.' };
  }

  /**
   * Resend verification email.
   */
  async resendVerificationEmail(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      // Return success to prevent email enumeration (OWASP security rule)
      return { message: 'Si el correo está registrado y no verificado, recibirás las instrucciones en tu bandeja de entrada.' };
    }

    if (user.isEmailVerified) {
      throw AppError.badRequest('Este correo electrónico ya se encuentra verificado.');
    }

    const { unhashedToken, hashedToken } = generateRandomToken();
    await authRepository.updateVerificationToken(user.id, hashedToken);

    await sendVerificationEmail(user.email, unhashedToken);

    return { message: 'Si el correo está registrado y no verificado, recibirás las instrucciones en tu bandeja de entrada.' };
  }

  /**
   * Initiate forgot password flow (generates reset token and sends email).
   */
  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      // Return generic message to prevent email enumeration
      return { message: 'Si el correo existe en nuestra plataforma, se enviará un enlace de recuperación.' };
    }

    const { unhashedToken, hashedToken } = generateRandomToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await authRepository.saveResetPasswordToken(user.id, hashedToken, expiresAt);

    await sendPasswordResetEmail(user.email, unhashedToken);

    return { message: 'Si el correo existe en nuestra plataforma, se enviará un enlace de recuperación.' };
  }

  /**
   * Reset password using token.
   */
  async resetPassword(unhashedToken, newPassword) {
    const hashed = hashToken(unhashedToken);
    const user = await authRepository.findUserByResetToken(hashed);

    if (!user) {
      throw AppError.badRequest('El token de recuperación es inválido o ha expirado.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await authRepository.resetPassword(user.id, hashedPassword);

    // Revoke all existing refresh tokens for security
    await authRepository.revokeAllUserRefreshTokens(user.id);

    return { message: 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.' };
  }

  /**
   * Refresh Access Token using Refresh Token with Refresh Token Rotation.
   */
  async refreshToken(refreshTokenStr) {
    const storedToken = await authRepository.findRefreshToken(refreshTokenStr);

    if (!storedToken || storedToken.revokedAt || new Date(storedToken.expiresAt) < new Date()) {
      throw AppError.unauthorized('Refresh token inválido, expirado o revocado.');
    }

    if (!storedToken.user.isActive) {
      throw AppError.forbidden('La cuenta está desactivada.');
    }

    // Generate new Access Token
    const accessToken = this._generateAccessToken(storedToken.user);

    // Refresh Token Rotation: revoke old token, issue new token
    const newRefreshToken = await this._generateAndSaveRefreshToken(storedToken.user.id);
    await authRepository.revokeRefreshToken(storedToken.id, newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Logout user by revoking refresh token.
   */
  async logout(refreshTokenStr, userId = null) {
    if (refreshTokenStr) {
      const storedToken = await authRepository.findRefreshToken(refreshTokenStr);
      if (storedToken) {
        await authRepository.revokeRefreshToken(storedToken.id);
      }
    } else if (userId) {
      await authRepository.revokeAllUserRefreshTokens(userId);
    }

    return { message: 'Sesión cerrada exitosamente.' };
  }

  /**
   * Change password for an authenticated user.
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await userRepository.findByIdWithPassword(userId);
    if (!user) {
      throw AppError.notFound('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw AppError.badRequest('La contraseña actual es incorrecta');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await userRepository.update(userId, { password: hashedNewPassword });

    // Revoke all refresh tokens on password change
    await authRepository.revokeAllUserRefreshTokens(userId);

    return { message: 'Contraseña actualizada exitosamente.' };
  }

  /**
   * Get authenticated user profile.
   */
  async getMe(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw AppError.notFound('Usuario no encontrado');
    }
    return user;
  }

  // --- Helper Methods ---

  _generateAccessToken(user) {
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

  async _generateAndSaveRefreshToken(userId) {
    const { unhashedToken } = generateRandomToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await authRepository.createRefreshToken({
      userId,
      token: unhashedToken,
      expiresAt,
    });

    return unhashedToken;
  }
}

module.exports = new AuthService();
