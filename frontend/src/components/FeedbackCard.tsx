import React, { memo } from 'react';
import { Feedback, FeedbackStatus } from '@/types';
import { Button } from '@/components/ui';
import { 
  formatDate, 
  getStatusLabel, 
  getStatusColor, 
  getNextStatus, 
  canUpdateStatus 
} from '@/utils';
import { SUCCESS_MESSAGES } from '@/constants';

interface FeedbackCardProps {
  feedback: Feedback;
  onStatusChange: (id: string, status: FeedbackStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isUpdating?: boolean;
}

const FeedbackCard: React.FC<FeedbackCardProps> = memo(({
  feedback,
  onStatusChange,
  onDelete,
  isUpdating = false,
}) => {
  const handleStatusChange = async () => {
    const nextStatus = getNextStatus(feedback.status);
    if (nextStatus) {
      await onStatusChange(feedback._id, nextStatus);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      await onDelete(feedback._id);
    }
  };

  const nextStatus = getNextStatus(feedback.status);
  const canUpdate = canUpdateStatus(feedback.status);

  return (
    <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
          {feedback.title}
        </h3>
        
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}
        >
          {getStatusLabel(feedback.status)}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">
        {feedback.description}
      </p>
      
      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
        <span>Created {formatDate(feedback.createdAt)}</span>
        {feedback.updatedAt !== feedback.createdAt && (
          <span>Updated {formatDate(feedback.updatedAt)}</span>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {canUpdate && (
            <Button
              onClick={handleStatusChange}
              disabled={isUpdating}
              variant="primary"
              size="sm"
            >
              {isUpdating ? 'Updating...' : `Mark as ${getStatusLabel(nextStatus!)}`}
            </Button>
          )}
        </div>
        
        <Button
          onClick={handleDelete}
          disabled={isUpdating}
          variant="danger"
          size="sm"
        >
          Delete
        </Button>
      </div>
    </div>
  );
});

FeedbackCard.displayName = 'FeedbackCard';

export default FeedbackCard;