import { NextFunction, Request, Response } from 'express';
import {
  CreateFeedbackRequest,
  FeedbackQuery,
  UpdateFeedbackStatusRequest,
  ValidationError,
} from '../types';
import { BadRequestError, ValidationException } from '../utils/errors';

const feedbackStatuses = ['open', 'in-progress', 'done'] as const;
const sortFields = ['createdAt', 'updatedAt', 'title'] as const;
const sortOrders = ['asc', 'desc'] as const;

const pushError = (
  errors: ValidationError[],
  field: string,
  message: string,
  value?: any
) => errors.push({ field, message, value });

export const validateCreateFeedback = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { title, description } = req.body as CreateFeedbackRequest;
  const errors: ValidationError[] = [];

  if (!title || typeof title !== 'string' || title.trim() === '') {
    pushError(errors, 'title', !title ? 'Title is required' : 'Title must be a non-empty string', title);
  } else if (title.length > 100) {
    pushError(errors, 'title', 'Title must be no more than 100 characters', title);
  }

  if (!description || typeof description !== 'string' || description.trim() === '') {
    pushError(errors, 'description', !description ? 'Description is required' : 'Description must be a non-empty string', description);
  } else if (description.length > 500) {
    pushError(errors, 'description', 'Description must be no more than 500 characters', description);
  }

  if (errors.length) throw new ValidationException('Validation failed', errors);

  next();
};

export const validateUpdateStatus = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { status } = req.body as UpdateFeedbackStatusRequest;
  const errors: ValidationError[] = [];

  if (!status) pushError(errors, 'status', 'Status is required');
  else if (!feedbackStatuses.includes(status)) {
    pushError(errors, 'status', `Status must be one of: ${feedbackStatuses.join(', ')}`, status);
  }

  if (errors.length) throw new ValidationException('Validation failed', errors);

  next();
};

export const validateFeedbackId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id } = req.params;

  if (!id) throw new BadRequestError('Feedback ID is required');

  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    throw new BadRequestError('Invalid Feedback ID format');
  }

  next();
};

export const validateFeedbackQuery = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const query = req.query as any;
  const errors: ValidationError[] = [];

  const page = parseInt(query.page);
  const limit = parseInt(query.limit);

  if (query.status && !feedbackStatuses.includes(query.status)) {
    pushError(errors, 'status', `Status must be one of: ${feedbackStatuses.join(', ')}`, query.status);
  }
  if (query.page && (isNaN(page) || page < 1)) {
    pushError(errors, 'page', 'Page must be a positive integer', query.page);
  }
  if (query.limit && (isNaN(limit) || limit < 1 || limit > 100)) {
    pushError(errors, 'limit', 'Limit must be between 1 and 100', query.limit);
  }
  if (query.sortBy && !sortFields.includes(query.sortBy)) {
    pushError(errors, 'sortBy', `Sort field must be one of: ${sortFields.join(', ')}`, query.sortBy);
  }
  if (query.sortOrder && !sortOrders.includes(query.sortOrder)) {
    pushError(errors, 'sortOrder', `Sort order must be one of: ${sortOrders.join(', ')}`, query.sortOrder);
  }
  if (query.search && typeof query.search !== 'string') {
    pushError(errors, 'search', 'Search must be a string', query.search);
  }

  if (errors.length) throw new ValidationException('Query validation failed', errors);

  const sanitizedQuery: FeedbackQuery = {
    status: feedbackStatuses.includes(query.status) ? query.status : undefined,
    page: !isNaN(page) && page > 0 ? page : 1,
    limit: !isNaN(limit) && limit > 0 && limit <= 100 ? limit : 10,
    sortBy: sortFields.includes(query.sortBy) ? query.sortBy : 'createdAt',
    sortOrder: sortOrders.includes(query.sortOrder) ? query.sortOrder : 'desc',
    search: typeof query.search === 'string' ? query.search.trim() : undefined,
  };

  req.query = sanitizedQuery as any;
  next();
};
