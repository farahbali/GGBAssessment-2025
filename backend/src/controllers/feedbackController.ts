import { Request, Response } from 'express';
import { logger } from '../middleware/logger';
import {
  CreateFeedbackRequest,
  FeedbackQuery,
  UpdateFeedbackStatusRequest,
  FeedbackStatus,
} from '../types';
import { asyncErrorHandler } from '../middleware/errorHandler';
import { FeedbackService } from '../services/feedbackService';

export class FeedbackController {
 
  static getAllFeedbacks = asyncErrorHandler(async (req: Request, res: Response) => {
    const query = req.query as FeedbackQuery;

    logger.info('Getting all feedbacks', { query });

    const result = await FeedbackService.getAllFeedbacks(query);

    res.status(result.statusCode).json({
      success: result.success,
      data: result.data,
      pagination: result.pagination,
    });
  });

  static getFeedbackById = asyncErrorHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    logger.info('Getting feedback by ID', { id });

    const result = await FeedbackService.getFeedbackById(id);

    res.status(result.statusCode).json({
      success: result.success,
      data: result.data,
    });
  });

  static createFeedback = asyncErrorHandler(async (req: Request, res: Response) => {
    const data = req.body as CreateFeedbackRequest;

    logger.info('Creating feedback', { title: data.title });

    const result = await FeedbackService.createFeedback(data);

    res.status(result.statusCode).json({
      success: result.success,
      data: result.data,
      message: 'Feedback created successfully',
    });
  });


  static updateFeedbackStatus = asyncErrorHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body as UpdateFeedbackStatusRequest;

    logger.info('Updating feedback status', { id, status: data.status });

    const result = await FeedbackService.updateFeedbackStatus(id, data);

    res.status(result.statusCode).json({
      success: result.success,
      data: result.data,
      message: 'Feedback status updated successfully',
    });
  });

  
  static deleteFeedback = asyncErrorHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    logger.info('Deleting feedback', { id });

    const result = await FeedbackService.deleteFeedback(id);

    res.status(result.statusCode).json({
      success: result.success,
      message: 'Feedback deleted successfully',
    });
  });


  static getFeedbackStats = asyncErrorHandler(async (req: Request, res: Response) => {
    logger.info('Getting feedback statistics');

    const result = await FeedbackService.getFeedbackStats();

    res.status(result.statusCode).json({
      success: result.success,
      data: result.data,
    });
  });

  static bulkUpdateStatus = asyncErrorHandler(async (req: Request, res: Response) => {
    const updates = (req.body as Array<{ id: string; status: string }>).map(u => ({
      id: u.id,
      status: u.status as FeedbackStatus,
    }));

    logger.info('Bulk updating feedback status', { count: updates.length });

    const result = await FeedbackService.bulkUpdateStatus(updates);

    res.status(result.statusCode).json({
      success: result.success,
      data: result.data,
      message: 'Bulk update completed',
    });
  });
  
}
