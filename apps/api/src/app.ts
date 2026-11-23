import express, { type Express } from 'express';
import { requestContext } from './middleware/request-context.js';
import { requestLogger } from './middleware/request-logger.js';
import { notFoundHandler } from './middleware/not-found.js';
import { healthRouter } from './routes/health.route.js';
import { debugRouter } from './routes/debug.route.js';
import { errorHandler } from './middleware/error-handler.js';
import { isProduction } from './config/env.js';

/**
 * Builds the express application,
 * but it does NOT start listening to traffic.
 * (It does not start the application)
 */
export function createApp(): Express {
  const app = express();

  // Set middlewares
  // 1. Give the request an id, before anything can want to log one.
  app.use(requestContext);

  // 2. Turn a JSON request body into a JavaScript object which will be
  // attached to the request object (req.body)
  app.use(express.json());

  // 3. Time and report every request. Registering this as early as possible.
  app.use(requestLogger);

  // 4. Define all the routes.
  app.use('/health', healthRouter);

  // 5. Deliberate failures, for proving that out error handler works.
  if (!isProduction) {
    app.use('/debug', debugRouter);
  }

  // 6. If nothing above matched, then that thing does not exist.
  // Then this middleware will send a 404 NOT FOUND
  app.use(notFoundHandler);

  app.use(errorHandler);

  return app;
}
