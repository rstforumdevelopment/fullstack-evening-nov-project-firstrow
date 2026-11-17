import { Router, type RequestHandler } from 'express';
import { APP_NAME } from '@firstrow/shared';

interface HealthResponse {
  status: 'ok';
  app: string;
  uptimeSeconds: number;
  timestamp: string;
}

// Request/Route Handler
const getHealth: RequestHandler<Record<string, never>, HealthResponse> = (_req, res) => {
  res.json({
    status: 'ok',
    app: APP_NAME,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
};

export const healthRouter: Router = Router();

healthRouter.get('/', getHealth);
