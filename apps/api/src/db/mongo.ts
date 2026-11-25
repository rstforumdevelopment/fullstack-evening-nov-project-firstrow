import { MongoClient, type Db } from 'mongodb';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { ServiceUnavailableError } from '../errors/http-errors.js';

const client = new MongoClient(env.MONGO_URL, {
  maxPoolSize: env.DATABASE_POOL_MAX,
  serverSelectionTimeoutMS: 5_000,
});

let database: Db | undefined;

export async function connectMongo(): Promise<void> {
  try {
    await client.connect();
    database = client.db(env.MONGO_DB);
    await database.command({ ping: 1 });

    logger.info({ database: env.MONGO_DB }, 'mongodb connected');
  } catch (error) {
    throw new ServiceUnavailableError('Could not connect to MongoDB.', { cause: error });
  }
}

export function getMongoDb(): Db {
  if (database === undefined) {
    throw new Error('MongoDB is not connected. connectMongo() must run at startup.');
  }
  return database;
}

export async function closeMongo(): Promise<void> {
  await client.close();
  database = undefined;
  logger.info('mongodb connection closed');
}
