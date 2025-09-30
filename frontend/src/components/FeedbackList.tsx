import React, { memo, useMemo, useState } from 'react';
import { useFeedback } from '@/hooks';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import FeedbackCard from '@/components/FeedbackCard';
import FeedbackCardSkeleton from '@/components/FeedbackCardSkeleton';
import { sortFeedbacks, groupFeedbacksByStatus } from '@/utils';
import { Feedback, FeedbackStatus } from '@/types';
import { LOADING_MESSAGES, UI_CONSTANTS } from '@/constants';

type SortOption = 'newest' | 'oldest' | 'status';
type ViewMode = 'all' | 'grouped';

const FeedbackList: React.FC = memo(() => {
  const { feedbacks, loading, error, loadFeedbacks, changeStatus, removeFeedback } = useFeedback();
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
console.log('feedbacks', feedbacks)
  // Sort and filter feedbacks
  const sortedFeedbacks = useMemo(() => {
    return sortFeedbacks(feedbacks, sortBy);
  }, [feedbacks, sortBy]);

  // Group feedbacks by status
  const groupedFeedbacks = useMemo(() => {
    return groupFeedbacksByStatus(sortedFeedbacks);
  }, [sortedFeedbacks]);

  // Handle status change with loading state
  const handleStatusChange = async (id: string, status: FeedbackStatus) => {
    setUpdatingIds(prev => new Set(prev).add(id));
    try {
      const result = await changeStatus(id, status);
      if (!result.success) {
        console.error('Failed to update status:', result.error);
      }
    } finally {
      setUpdatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // Handle delete with loading state
  const handleDelete = async (id: string) => {
    setUpdatingIds(prev => new Set(prev).add(id));
    try {
      const result = await removeFeedback(id);
      if (!result.success) {
        console.error('Failed to delete feedback:', result.error);
      }
    } finally {
      setUpdatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center py-8">
          <LoadingSpinner message={LOADING_MESSAGES.FETCHING_FEEDBACK} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: UI_CONSTANTS.SKELETON_ITEMS }).map((_, index) => (
            <FeedbackCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load feedback"
        message={error}
        onRetry={loadFeedbacks}
      />
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h3>
        <p className="text-gray-500">Be the first to submit feedback!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <h2 className="text-lg font-medium text-gray-900">
          Feedback ({feedbacks.length})
        </h2>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Sort options */}
          <div className="flex space-x-2">
            <label className="text-sm font-medium text-gray-700">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="status">Status</option>
            </select>
          </div>
          
          {/* View mode */}
          <div className="flex space-x-2">
            <label className="text-sm font-medium text-gray-700">View:</label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as ViewMode)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="grouped">Grouped</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feedback list */}
      {viewMode === 'all' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedFeedbacks.map((feedback) => (
            <FeedbackCard
              key={feedback._id}
              feedback={feedback}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              isUpdating={updatingIds.has(feedback._id)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedFeedbacks).map(([status, statusFeedbacks]) => (
            <div key={status}>
              <h3 className="text-md font-medium text-gray-700 mb-3 capitalize">
                {status.replace('-', ' ')} ({statusFeedbacks.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {statusFeedbacks.map((feedback) => (
                  <FeedbackCard
                    key={feedback._id}
                    feedback={feedback}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    isUpdating={updatingIds.has(feedback._id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

FeedbackList.displayName = 'FeedbackList';

export default FeedbackList;