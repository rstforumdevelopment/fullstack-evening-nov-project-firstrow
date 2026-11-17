import express, { type Express } from 'express';
import { requestLogger } from './middleware/request-logger.js';
import { notFoundHandler } from './middleware/not-found.js';
import { healthRouter } from './routes/health.route.js';

/**
 * Builds the express application,
 * but it does NOT start listening to traffic.
 * (It does not start the application)
 */
export function createApp(): Express {
  const app = express();

  // Set middlewares

  // 1. Turn a JSON request body into a JavaScript object which will be
  // attached to the request object (req.body)
  app.use(express.json());

  // 2. Time and report every request. Registering this as early as possible.
  app.use(requestLogger);

  // 3. Define all the routes.
  app.use('/health', healthRouter);

  // 4. If nothing above matched, then that thing does not exist.
  // Then this middleware will send a 404 NOT FOUND
  app.use(notFoundHandler);

  return app;
}
