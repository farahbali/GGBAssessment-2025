import { NextFunction, Request, Response } from 'express';
import { logger } from './logger';

export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = process.hrtime();
  const startMemory = process.memoryUsage().heapUsed;

  res.on('finish', () => {
    const diff = process.hrtime(startTime);
    const durationMs = diff[0] * 1000 + diff[1] / 1_000_000;
    const memoryUsedMB = (process.memoryUsage().heapUsed - startMemory) / 1024 / 1024;

    const metrics = {
      method: req.method,
      url: req.originalUrl,
      duration: durationMs.toFixed(2),
      statusCode: res.statusCode,
      memoryUsedMB: memoryUsedMB.toFixed(2),
      timestamp: new Date(),
      requestId: req.headers['x-request-id'] || undefined,
    };
    logger.info('Request performance metrics', metrics);
    if (durationMs > 1000) {
      logger.warn('Slow request detected', metrics);
    }
    if (memoryUsedMB > 200) {
      logger.warn('High memory usage detected', metrics);
    }

    if (res.statusCode >= 400) {
      logger.warn('Error response detected', metrics);
    }
  });

  next();
};
