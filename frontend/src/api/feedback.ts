import { apiClient } from './client';
import { API_CONFIG } from '@/constants';
import { Feedback, CreateFeedbackRequest, UpdateFeedbackStatusRequest } from '@/types';

export class FeedbackService {
  private static readonly ENDPOINT = API_CONFIG.ENDPOINTS.FEEDBACK;

  static async getAll(): Promise<Feedback[]> {
    const response = await apiClient.get<Feedback[]>(this.ENDPOINT);
    return response.data || [];
  }

  static async getById(id: string): Promise<Feedback> {
    const response = await apiClient.get<Feedback>(`${this.ENDPOINT}/${id}`);
    if (!response.data) {
      throw new Error('Feedback not found');
    }
    return response.data;
  }

  static async create(data: CreateFeedbackRequest): Promise<Feedback> {
    const response = await apiClient.post<Feedback>(this.ENDPOINT, data);
    if (!response.data) {
      throw new Error('Failed to create feedback');
    }
    return response.data;
  }


  static async updateStatus(
    id: string, 
    status: UpdateFeedbackStatusRequest
  ): Promise<Feedback> {
    const response = await apiClient.patch<Feedback>(
      `${this.ENDPOINT}/${id}`, 
      status
    );
    if (!response.data) {
      throw new Error('Failed to update feedback status');
    }
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.ENDPOINT}/${id}`);
  }

  static async bulkUpdateStatus(
    updates: Array<{ id: string; status: UpdateFeedbackStatusRequest }>
  ): Promise<Feedback[]> {
    const promises = updates.map(({ id, status }) => 
      this.updateStatus(id, status)
    );
    return Promise.all(promises);
  }

  static async search(query: string): Promise<Feedback[]> {
    const response = await apiClient.get<Feedback[]>(
      `${this.ENDPOINT}/search?q=${encodeURIComponent(query)}`
    );
    return response.data || [];
  }
}


export const feedbackApi = {
  getAll: FeedbackService.getAll,
  getById: FeedbackService.getById,
  create: FeedbackService.create,
  updateStatus: FeedbackService.updateStatus,
  delete: FeedbackService.delete,
  bulkUpdateStatus: FeedbackService.bulkUpdateStatus,
  search: FeedbackService.search,
};
