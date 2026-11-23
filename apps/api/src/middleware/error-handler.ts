import type { ErrorRequestHandler } from 'express';
import { isAppError } from '../errors/app-error.js';
import { logger } from '../lib/logger.js';
import { getRequestContext } from '../lib/request-context.js';

interface ErrorResponseBody {
  error: {
    code: string;
    message: string;
    requestId?: string;
    details?: unknown;
  };
}

/**
 * The single place this application convert a failure into a response
 */
export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const requestId = getRequestContext()?.requestId;

  if (isAppError(error)) {
    // We threw this on purpose, so the message is safe to show and the caller
    // can do something about it. 4xx is not an incident; do not page anyone.
    logger.warn(
      { err: error, code: error.code, statusCode: error.statusCode },
      'request failed with a handled error',
    );

    const body: ErrorResponseBody = {
      error: { code: error.code, message: error.message, requestId },
    };
    if (error.details !== undefined) {
      body.error.details = error.details;
    }

    res.status(error.statusCode).json(body);
    return;
  }

  logger.error({ err: error }, 'request failed with an unhandled error');

  const body: ErrorResponseBody = {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occured.',
      requestId,
    },
  };

  res.status(500).json(body);
};
