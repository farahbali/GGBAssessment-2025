import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { feedbackApi } from '@/api';
import { Feedback, FeedbackStatus } from '@/types';

interface FeedbackState {
  items: Feedback[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
  submitting: boolean;
  updating: { [key: string]: boolean };
}

const initialState: FeedbackState = {
  items: [],
  loading: false,
  error: null,
  lastFetch: null,
  submitting: false,
  updating: {},
};

export const fetchFeedbacks = createAsyncThunk(
  'feedback/fetchFeedbacks',
  async () => {
    return await feedbackApi.getAll();
  }
);

export const createFeedback = createAsyncThunk(
  'feedback/createFeedback',
  async (feedbackData: { title: string; description: string }) => {
    return await feedbackApi.create(feedbackData);
  }
);

export const updateFeedbackStatus = createAsyncThunk(
  'feedback/updateFeedbackStatus',
  async ({ id, status }: { id: string; status: FeedbackStatus }) => {
    return await feedbackApi.updateStatus(id, { status });
  }
);

export const deleteFeedback = createAsyncThunk(
  'feedback/deleteFeedback',
  async (id: string) => {
    await feedbackApi.delete(id);
    return id;
  }
);

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    optimisticUpdateStatus: (state, action: PayloadAction<{ id: string; status: FeedbackStatus }>) => {
      const { id, status } = action.payload;
      const feedback = state.items.find(item => item._id === id);
      if (feedback) {
        feedback.status = status;
        feedback.updatedAt = new Date().toISOString();
      }
    },
    revertOptimisticUpdate: (state, action: PayloadAction<{ id: string; originalStatus: FeedbackStatus }>) => {
      const { id, originalStatus } = action.payload;
      const feedback = state.items.find(item => item._id === id);
      if (feedback) {
        feedback.status = originalStatus;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.lastFetch = Date.now();
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch feedbacks';
      });

    builder
      .addCase(createFeedback.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.submitting = false;
        state.items.unshift(action.payload);
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.error.message || 'Failed to create feedback';
      });

    builder
      .addCase(updateFeedbackStatus.pending, (state, action) => {
        state.updating[action.meta.arg.id] = true;
        state.error = null;
      })
      .addCase(updateFeedbackStatus.fulfilled, (state, action) => {
        state.updating[action.meta.arg.id] = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateFeedbackStatus.rejected, (state, action) => {
        state.updating[action.meta.arg.id] = false;
        state.error = action.error.message || 'Failed to update feedback';
      });

    builder
      .addCase(deleteFeedback.pending, (state, action) => {
        state.updating[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.updating[action.meta.arg] = false;
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.updating[action.meta.arg] = false;
        state.error = action.error.message || 'Failed to delete feedback';
      });
  },
});

export const { clearError, optimisticUpdateStatus, revertOptimisticUpdate } = feedbackSlice.actions;
export default feedbackSlice.reducer;
