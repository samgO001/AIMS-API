const env = require('./config/env');
const app = require('./app');
const prisma = require('./config/database');

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('[INFO] Database connected successfully');

    app.listen(env.port, () => {
      console.log(`[INFO] AIMS API running on port ${env.port}`);
      console.log(`[INFO] API Docs: http://localhost:${env.port}/api/docs`);
      console.log(`[INFO] Health Check: http://localhost:${env.port}/api/health`);
      console.log(`[INFO] Environment: ${env.nodeEnv}`);
    });
  } catch (error) {
    console.error('[ERROR] Failed to start server:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('\n[INFO] Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n[INFO] Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
