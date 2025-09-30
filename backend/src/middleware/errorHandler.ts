import { NextFunction, Request, Response } from 'express';
import { LogEntry } from '../types';
import { logger } from './logger';
import { CustomError, formatErrorResponse } from '../utils/errors';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let customError: CustomError;

  if (error instanceof CustomError) {
    customError = error;
  } else if (error.name === 'ValidationError') {
    customError = new CustomError('Validation failed', 400, true, 'VALIDATION_ERROR');
  } else if (error.name === 'CastError') {
    customError = new CustomError('Invalid data format', 400, true, 'CAST_ERROR');
  } else if (error.name === 'MongoError') {
    customError = new CustomError('Database error', 500, true, 'DATABASE_ERROR');
  } else if (error.name === 'JsonWebTokenError') {
    customError = new CustomError('Invalid token', 401, true, 'JWT_ERROR');
  } else if (error.name === 'TokenExpiredError') {
    customError = new CustomError('Token expired', 401, true, 'JWT_EXPIRED');
  } else {
    customError = new CustomError(
      process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message,
      500,
      false,
      'INTERNAL_ERROR'
    );
  }

  const logEntry: LogEntry = {
    level: customError.statusCode >= 500 ? 'error' : 'warn',
    message: customError.message,
    timestamp: new Date(),
    service: 'feedback-api',
    requestId: req.headers['x-request-id'] as string,
    metadata: {
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      statusCode: customError.statusCode,
      isOperational: customError.isOperational,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    },
  };

  logger.log(logEntry);

  const errorResponse = formatErrorResponse(customError);
  res.status(customError.statusCode).json(errorResponse);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const error = new CustomError(`Route ${req.originalUrl} not found`, 404, true, 'NOT_FOUND');
  
  const logEntry: LogEntry = {
    level: 'warn',
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    timestamp: new Date(),
    service: 'feedback-api',
    requestId: req.headers['x-request-id'] as string,
    metadata: {
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    },
  };

  logger.log(logEntry);

  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    statusCode: 404,
    code: 'NOT_FOUND',
  });
};

export const asyncErrorHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
