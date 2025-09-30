import { logger } from '../middleware/logger';
import Feedback from '../models/Feedback';
import {
  CreateFeedbackRequest,
  FeedbackQuery,
  FeedbackStatus,
  IFeedback,
  IFeedbackDocument,
  PaginatedServiceResponse,
  ServiceResponse,
  UpdateFeedbackStatusRequest,
} from '../types';
import { BadRequestError, DatabaseError, NotFoundError } from '../utils/errors';

const mapFeedback = (doc: IFeedbackDocument | any): IFeedback => ({
  _id: doc._id.toString(),
  title: doc.title,
  description: doc.description,
  status: doc.status,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export class FeedbackService {
  static async getAllFeedbacks(query: FeedbackQuery): Promise<PaginatedServiceResponse<IFeedback>> {
    try {
      const { status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search } = query;
      const filter: any = {};
      if (status) filter.status = status;
      if (search) filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];

      const [docs, total] = await Promise.all([
        Feedback.find(filter)
          .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
          .skip((page - 1) * limit)
          .limit(limit),
        Feedback.countDocuments(filter),
      ]);

      const data = docs.map(mapFeedback);
      const totalPages = Math.ceil(total / limit);

      return { success: true, data, statusCode: 200, pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 } };
    } catch (err: any) {
      logger.error('Failed to get feedbacks', { error: err.message, query });
      throw new DatabaseError('Failed to retrieve feedbacks');
    }
  }

  static async getFeedbackById(id: string): Promise<ServiceResponse<IFeedback>> {
    try {
      const doc = await Feedback.findById(id);
      if (!doc) throw new NotFoundError('Feedback');
      return { success: true, data: mapFeedback(doc), statusCode: 200 };
    } catch (err: any) {
      if (err instanceof NotFoundError) throw err;
      logger.error('Failed to get feedback by ID', { error: err.message, id });
      throw new DatabaseError('Failed to retrieve feedback');
    }
  }

  static async createFeedback(data: CreateFeedbackRequest): Promise<ServiceResponse<IFeedback>> {
    try {
      const feedback = new Feedback({ title: data.title.trim(), description: data.description.trim(), status: 'open' });
      const saved = await feedback.save();
      logger.info('Feedback created', { id: saved._id, title: saved.title });
      return { success: true, data: mapFeedback(saved), statusCode: 201 };
    } catch (err: any) {
      logger.error('Failed to create feedback', { error: err.message, data });
      throw new DatabaseError('Failed to create feedback');
    }
  }

  static async updateFeedbackStatus(id: string, { status }: UpdateFeedbackStatusRequest): Promise<ServiceResponse<IFeedback>> {
    try {
      const feedback = await Feedback.findById(id);
      if (!feedback) throw new NotFoundError('Feedback');

      if (!this.isValidStatusTransition(feedback.status, status))
        throw new BadRequestError(`Invalid status transition from ${feedback.status} to ${status}`);

      feedback.status = status;
      feedback.updatedAt = new Date();
      const updated = await feedback.save();

      logger.info('Feedback status updated', { id: updated._id, from: feedback.status, to: status });
      return { success: true, data: mapFeedback(updated), statusCode: 200 };
    } catch (err: any) {
      if (err instanceof NotFoundError || err instanceof BadRequestError) throw err;
      logger.error('Failed to update feedback status', { error: err.message, id, status });
      throw new DatabaseError('Failed to update feedback status');
    }
  }

  static async deleteFeedback(id: string): Promise<ServiceResponse<void>> {
    try {
      const feedback = await Feedback.findByIdAndDelete(id);
      if (!feedback) throw new NotFoundError('Feedback');
      logger.info('Feedback deleted', { id });
      return { success: true, data: undefined, statusCode: 200 };
    } catch (err: any) {
      if (err instanceof NotFoundError) throw err;
      logger.error('Failed to delete feedback', { error: err.message, id });
      throw new DatabaseError('Failed to delete feedback');
    }
  }

  private static isValidStatusTransition(current: FeedbackStatus, next: FeedbackStatus): boolean {
    const transitions: Record<FeedbackStatus, FeedbackStatus[]> = {
      open: ['in-progress', 'done'],
      'in-progress': ['done'],
      done: [],
    };
    return transitions[current]?.includes(next) || false;
  }
   static async bulkUpdateStatus(updates: { id: string; status: FeedbackStatus }[]): Promise<ServiceResponse<IFeedback[]>> {
    const results: IFeedback[] = [];
    const errors: string[] = [];

    for (const u of updates) {
      try {
        const r = await this.updateFeedbackStatus(u.id, { status: u.status });
        r.data && results.push(r.data);
      } catch (err: any) {
        errors.push(`Failed to update ${u.id}: ${err.message}`);
      }
    }

    if (errors.length) logger.warn('Bulk update completed with errors', { errors });
    return { success: true, data: results, statusCode: 200 };
  }
  static async getFeedbackStats(): Promise<ServiceResponse<any>> {
    try {
      const stats = await Feedback.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]);

      const result = stats.reduce((acc: any, s: any) => {
        acc.total += s.count;
        acc[s._id + 'Count'] = s.count;
        acc.statusCounts.push({ status: s._id, count: s.count });
        return acc;
      }, { total: 0, statusCounts: [], openCount: 0, inProgressCount: 0, doneCount: 0 });

      return { success: true, data: result, statusCode: 200 };
    } catch (err: any) {
      logger.error('Failed to get feedback stats', { error: err.message });
      throw new DatabaseError('Failed to retrieve feedback statistics');
    }
  }

}
