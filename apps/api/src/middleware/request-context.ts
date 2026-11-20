import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';
import { runWithRequestContext } from '../lib/request-context.js';

const REQUEST_ID_HEADER = 'x-request-id';

const SAFE_REQUEST_ID = /^[\w-]{1,128}$/;

export const requestContext: RequestHandler = (req, res, next) => {
  const incoming = req.get(REQUEST_ID_HEADER);
  const requestId = incoming && SAFE_REQUEST_ID.test(incoming) ? incoming : randomUUID();

  res.setHeader(REQUEST_ID_HEADER, requestId);

  runWithRequestContext({ requestId }, next);
};
