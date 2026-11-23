import { AppError } from './app-error.js';

/** 400 - the request itself is malformed or fails validation */
export class ValidationError extends AppError {
  readonly statusCode = 400;
  readonly code = 'VALIDATION_ERROR';

  constructor(message = 'The request is invalid.', details?: unknown) {
    super(message, { details });
  }
}

/** 401 — we do not know who you are. */
export class UnauthorizedError extends AppError {
  readonly statusCode = 401;
  readonly code = 'UNAUTHORIZED';

  constructor(message = 'Authentication is required.') {
    super(message);
  }
}

/** 403 — we know who you are, and you may not do this. */
export class ForbiddenError extends AppError {
  readonly statusCode = 403;
  readonly code = 'FORBIDDEN';

  constructor(message = 'You do not have access to this resource.') {
    super(message);
  }
}

/** 404 — the thing you asked for does not exist. */
export class NotFoundError extends AppError {
  readonly statusCode = 404;
  readonly code = 'NOT_FOUND';

  constructor(resource: string, id?: string) {
    super(id === undefined ? `${resource} was not found.` : `${resource} '${id}' was not found.`);
  }
}

/** 409 — the request is valid but conflicts with the current state. */
export class ConflictError extends AppError {
  readonly statusCode = 409;
  readonly code = 'CONFLICT';

  constructor(message = 'That conflicts with the current state.', details?: unknown) {
    super(message, { details });
  }
}

/** 503 — something we depend on is unavailable. Usually worth retrying. */
export class ServiceUnavailableError extends AppError {
  readonly statusCode = 503;
  readonly code = 'SERVICE_UNAVAILABLE';

  constructor(message = 'The service is temporarily unavailable.', options?: { cause?: unknown }) {
    super(message, { cause: options?.cause });
  }
}
