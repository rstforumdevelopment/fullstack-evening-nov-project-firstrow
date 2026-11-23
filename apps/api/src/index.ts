import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';

process.on('unhandledRejection', (reason) => {
  logger.fatal({ err: reason }, 'unhandled promise rejection');
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.fatal({ err: error }, 'uncaught exception');
  process.exit(1);
});

const app = createApp();

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, nodeEnv: env.NODE_ENV }, 'API listening');
});
