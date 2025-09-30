import { NextFunction, Request, Response } from 'express';
import { LogEntry } from '../types';

interface LoggerInterface {
  log(entry: LogEntry): void;
  error(message: string, metadata?: Record<string, any>): void;
  warn(message: string, metadata?: Record<string, any>): void;
  info(message: string, metadata?: Record<string, any>): void;
  debug(message: string, metadata?: Record<string, any>): void;
}

class Logger implements LoggerInterface {
  private logLevel: 'error' | 'warn' | 'info' | 'debug';

  constructor() {
    this.logLevel = (process.env.LOG_LEVEL as any) || 'info';
  }

  private shouldLog(level: string): boolean {
    const levels = { error: 0, warn: 1, info: 2, debug: 3 };
    return levels[level as keyof typeof levels] <= levels[this.logLevel];
  }

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, service, requestId, metadata } = entry;

    const logObject = {
      timestamp: timestamp.toISOString(),
      level: level.toUpperCase(),
      service,
      message,
      ...(requestId && { requestId }),
      ...(metadata && { metadata }),
    };

    return JSON.stringify(logObject);
  }

  log(entry: LogEntry): void {
    if (this.shouldLog(entry.level)) {
      console.log(this.formatLog(entry));
    }
  }

  error(message: string, metadata?: Record<string, any>): void {
    this.log({
      level: 'error',
      message,
      timestamp: new Date(),
      service: 'feedback-api',
      metadata,
    });
  }

  warn(message: string, metadata?: Record<string, any>): void {
    this.log({
      level: 'warn',
      message,
      timestamp: new Date(),
      service: 'feedback-api',
      metadata,
    });
  }

  info(message: string, metadata?: Record<string, any>): void {
    this.log({
      level: 'info',
      message,
      timestamp: new Date(),
      service: 'feedback-api',
      metadata,
    });
  }

  debug(message: string, metadata?: Record<string, any>): void {
    this.log({
      level: 'debug',
      message,
      timestamp: new Date(),
      service: 'feedback-api',
      metadata,
    });
  }
}

export const logger = new Logger();

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const requestId =
    (req.headers['x-request-id'] as string) ||
    `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-ID', requestId);

  logger.info('Request started', {
    requestId,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    contentLength: req.get('Content-Length'),
  });

  const originalEnd = res.end.bind(res);
  res.end = function (
    chunk?: any,
    encoding?: BufferEncoding | (() => void),
    cb?: () => void
  ): Response {
    const duration = Date.now() - startTime;

    logger.info('Request completed', {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length'),
    });

    return originalEnd(chunk, encoding as any, cb);
  } as typeof res.end;

  next();
};
