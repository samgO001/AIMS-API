const env = require('./config/env');
const app = require('./app');
const prisma = require('./config/database');

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    app.listen(env.port, () => {
      console.log(`🚀 AIMS API running on port ${env.port}`);
      console.log(`📚 API Docs: http://localhost:${env.port}/api/docs`);
      console.log(`🏥 Health Check: http://localhost:${env.port}/api/health`);
      console.log(`🔧 Environment: ${env.nodeEnv}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
