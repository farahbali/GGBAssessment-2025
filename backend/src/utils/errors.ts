import { AppError, ValidationError as ValidationErrorType } from '../types';

// Custom error classes
export class CustomError extends Error implements AppError {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;
  public keyValue?: Record<string, any>;
  public errors?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    code?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Renamed class to avoid conflict with interface
export class ValidationException extends CustomError {
  public errors: ValidationErrorType[];

  constructor(message: string, errors: ValidationErrorType[]) {
    super(message, 400, true, 'VALIDATION_ERROR');
    this.errors = errors;
  }
}

export class NotFoundError extends CustomError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, true, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401, true, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = 'Forbidden access') {
    super(message, 403, true, 'FORBIDDEN');
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, true, 'CONFLICT');
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string = 'Bad request') {
    super(message, 400, true, 'BAD_REQUEST');
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string = 'Internal server error') {
    super(message, 500, true, 'INTERNAL_SERVER_ERROR');
  }
}

export class DatabaseError extends CustomError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, true, 'DATABASE_ERROR');
  }
}

export class RateLimitError extends CustomError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, true, 'RATE_LIMIT_EXCEEDED');
  }
}

// Error handling utilities
export const isOperationalError = (error: Error): boolean => {
  return error instanceof CustomError && error.isOperational;
};

export const createError = (
  message: string,
  statusCode: number = 500,
  code?: string
): CustomError => new CustomError(message, statusCode, true, code);

// Mongoose error handler
export const handleMongooseError = (error: any): CustomError => {
  if (error.name === 'ValidationError') {
    const validationErrors: ValidationErrorType[] = Object.values(error.errors).map(
      (err: any) => ({
        field: err.path,
        message: err.message,
        value: err.value,
      })
    );
    return new ValidationException('Validation failed', validationErrors);
  }

  if (error.name === 'CastError') {
    return new BadRequestError(`Invalid ${error.path}: ${error.value}`);
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return new ConflictError(`${field} already exists`);
  }

  if (error.name === 'MongoNetworkError') {
    return new DatabaseError('Database connection failed');
  }

  if (error.name === 'MongoTimeoutError') {
    return new DatabaseError('Database operation timeout');
  }

  return new DatabaseError('Database operation failed');
};

// JWT error handler
export const handleJWTError = (error: any): CustomError => {
  if (error.name === 'JsonWebTokenError') {
    return new UnauthorizedError('Invalid token');
  }

  if (error.name === 'TokenExpiredError') {
    return new UnauthorizedError('Token expired');
  }

  return new UnauthorizedError('Authentication failed');
};

// Error response formatter
export const formatErrorResponse = (error: Error) => {
  const isOperational = isOperationalError(error);

  return {
    success: false,
    error: error.name || 'Error',
    message: error.message,
    statusCode: error instanceof CustomError ? error.statusCode : 500,
    code: error instanceof CustomError ? error.code : undefined,
    details:
      process.env.NODE_ENV === 'development'
        ? { stack: error.stack, isOperational }
        : undefined,
  };
};
