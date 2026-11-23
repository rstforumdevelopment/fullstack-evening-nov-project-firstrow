/**
 * The base class for every failure this application raises on purpose.
 */
export abstract class AppError extends Error {
  /** The HTTP status this failure should become. */
  abstract readonly statusCode: number;

  /** A stable, machine-readable identifier. */
  abstract readonly code: string;

  readonly isOperational: boolean = true;
  readonly details?: unknown;

  constructor(message: string, options: { details?: unknown; cause?: unknown } = {}) {
    super(message, { cause: options.cause });

    this.name = this.constructor.name;
    this.details = options.details;

    // Drops this constructor from the stack trace, so the first line points at
    //  the code that threw rather than this file.
    Error.captureStackTrace(this, this.constructor);
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
