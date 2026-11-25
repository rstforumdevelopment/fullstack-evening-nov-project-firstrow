import type { Server } from 'node:http';
import { logger } from './logger.js';

const SHUTDOWN_TIMEOUT_MS = 10_000;

/**
 * Turns a kill signal into an orderly stop.
 * 1. stop accepting new connections
 * 2. let requests already in flight finish
 * 3. close the database pools
 * 4. exit 0
 */
export function installGracefulShutdown(server: Server, closeResources: () => Promise<void>): void {
  let shuttingDown = false;

  const shutdown = (signal: NodeJS.Signals): void => {
    if (shuttingDown) {
      logger.warn({ signal }, 'already shutting down');
      return;
    }
    shuttingDown = true;
    logger.info({ signal }, 'shutdown started');

    const forceExit = setTimeout(() => {
      logger.fatal({ timeoutMs: SHUTDOWN_TIMEOUT_MS }, 'shutdown timed out, forcing exit');
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);

    forceExit.unref();

    void (async () => {
      try {
        await new Promise<void>((resolve, reject) => {
          server.close((error) => {
            if (error && (error as NodeJS.ErrnoException).code !== 'ERR_SERVER_NOT_RUNNING') {
              reject(error);
              return;
            }
            resolve();
          });
          server.closeIdleConnections();
        });
        logger.info('http server closed');

        await closeResources();

        clearTimeout(forceExit);
        logger.info('shutdown complete');
      } catch (error) {
        logger.fatal({ err: error }, 'shutdown failed');
        process.exit(1);
      }
    })();
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}
