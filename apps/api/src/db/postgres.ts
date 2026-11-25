import { Pool } from 'pg';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { ServiceUnavailableError } from '../errors/http-errors.js';

/**
 * One pool for the whole process, created once when this module is imported.
 * A pool is a small set of already-open connections that queries borrow and return.
 */
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.DATABASE_POOL_MAX,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on('error', (error) => {
  logger.error({ err: error }, 'idle postgres client errored');
});

/** Proves at startup that the database is actually reachable. */
export async function connectPostgres(): Promise<void> {
  try {
    const { rows } = await pool.query<{ version: string }>('select version()');
    logger.info({ version: rows[0]?.version.split(',')[0] }, 'postgres connected');
  } catch (error) {
    throw new ServiceUnavailableError('Could not connect to PostgreSQL.', { cause: error });
  }
}

/** Waits for in-flight queries, then closes every connection in the pool */
export async function closePostgres(): Promise<void> {
  await pool.end();
  logger.info('postgres pool closed');
}
