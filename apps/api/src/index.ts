import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { installGracefulShutdown } from './lib/graceful-shutdown.js';
import { connectPostgres, closePostgres } from './db/postgres.js';
import { connectMongo, closeMongo } from './db/mongo.js';

process.on('unhandledRejection', (reason) => {
  logger.fatal({ err: reason }, 'unhandled promise rejection');
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.fatal({ err: error }, 'uncaught exception');
  process.exit(1);
});

try {
  await connectPostgres();
  await connectMongo();
} catch (error) {
  logger.fatal({ err: error }, 'startup failed');
  process.exit(1);
}

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, nodeEnv: env.NODE_ENV }, 'API listening');
});

installGracefulShutdown(server, async () => {
  await closePostgres();
  await closeMongo();
});
