import type { RequestHandler } from 'express';
import { NotFoundError } from '../errors/http-errors.js';

export const notFoundHandler: RequestHandler = (req) => {
  throw new NotFoundError('Route', `${req.method} ${req.path}`);
};
