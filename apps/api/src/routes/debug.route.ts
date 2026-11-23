import { Router } from 'express';
import { ConflictError, NotFoundError, ValidationError } from '../errors/http-errors.js';

/**
 * Routes that exist only to prove the error handler works.
 */
export const debugRouter: Router = Router();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// A bug: nothing anticipated this.
debugRouter.get('/boom', () => {
  throw new Error('deliberate synchronous failure');
});

debugRouter.get('/async-boom', async () => {
  await sleep(10);
  throw new Error('deliberate asynchronous failure');
});

debugRouter.get('/not-found', () => {
  throw new NotFoundError('Event', 'evt_123');
});

debugRouter.get('/invalid', () => {
  throw new ValidationError('The request is invalid.', {
    fields: { seatCount: 'must be between 1 and 8' },
  });
});

debugRouter.get('/conflict', () => {
  throw new ConflictError('That seat is already held by someone else.');
});
