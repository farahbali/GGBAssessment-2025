import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
  fetchFeedbacks, 
  createFeedback, 
  updateFeedbackStatus, 
  deleteFeedback 
} from '@/lib/features/feedback/feedbackSlice';
import { CreateFeedbackRequest, FeedbackStatus } from '@/types';
import { handleApiError } from '@/utils';

export const useFeedback = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.feedback);

  const loadFeedbacks = useCallback(async () => {
    try {
      await dispatch(fetchFeedbacks()).unwrap();
    } catch (error) {
      console.error('Failed to load feedbacks:', handleApiError(error));
    }
  }, [dispatch]);

  const addFeedback = useCallback(async (data: CreateFeedbackRequest) => {
    try {
      const result = await dispatch(createFeedback(data)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: handleApiError(error) 
      };
    }
  }, [dispatch]);

  const changeStatus = useCallback(async (id: string, status: FeedbackStatus) => {
    try {
      const result = await dispatch(updateFeedbackStatus({ id, status })).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: handleApiError(error) 
      };
    }
  }, [dispatch]);

  const removeFeedback = useCallback(async (id: string) => {
    try {
      await dispatch(deleteFeedback(id)).unwrap();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: handleApiError(error) 
      };
    }
  }, [dispatch]);

  return {
    // State
    feedbacks: items,
    loading,
    error,
    
    loadFeedbacks,
    addFeedback,
    changeStatus,
    removeFeedback,
  };
};
