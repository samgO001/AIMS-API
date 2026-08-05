require('dotenv').config();

const env = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET + '_refresh'),
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  databaseUrl: process.env.DATABASE_URL,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'AIMS API <noreply@aims-api.com>',
  },
};

const requiredVars = ['jwtSecret', 'databaseUrl'];
for (const varName of requiredVars) {
  if (!env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
}

module.exports = env;

