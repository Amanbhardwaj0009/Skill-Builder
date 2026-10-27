import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { config } from './config/env.js';
import { seedInitialData } from './scripts/seed.js';

const startServer = async () => {
  try {
    await connectDatabase();

    // Auto-seed data on boot to ensure full out-of-the-box readiness
    try {
      await seedInitialData();
    } catch (err) {
      console.warn('⚠️ Seeding note:', err);
    }

    const app = createApp();

    const server = app.listen(config.port, () => {
      console.log(`===============================================`);
      console.log(`🎮 SkillQuest AI Backend is LIVE`);
      console.log(`📡 URL: http://localhost:${config.port}`);
      console.log(`⚡ Mode: ${config.nodeEnv}`);
      console.log(`🧠 AI Provider: ${config.llm.provider} (${config.llm.apiKey ? 'API Key Active' : 'Intelligent Offline Fallback'})`);
      console.log(`===============================================`);
    });

    const shutdown = async () => {
      console.log('\nShutting down SkillQuest AI server gracefully...');
      server.close(() => {
        console.log('Server stopped.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('Fatal error starting server:', err);
    process.exit(1);
  }
};

startServer();
