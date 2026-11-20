import { pino, type Logger } from 'pino';
import { env } from '../config/env.js';
import { getRequestContext } from './request-context.js';

export const logger: Logger = pino({
  level: env.LOG_LEVEL,
  mixin() {
    const context = getRequestContext();
    return context ? { requestId: context.requestId } : {};
  },
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'password', '*.password'],
    censor: '[redacted]',
  },
  ...(env.LOG_PRETTY
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss.l',
            ignore: 'pid,hostname',
            singleLine: true,
          },
        },
      }
    : {}),
});
