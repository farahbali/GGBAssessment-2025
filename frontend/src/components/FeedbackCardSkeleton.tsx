import React from 'react';
import { Skeleton } from '@/components/ui';

const FeedbackCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start mb-3">
        <Skeleton lines={2} height="h-5" width="w-3/4" />
        <Skeleton height="h-6" width="w-20" />
      </div>
      
      <div className="mb-4">
        <Skeleton lines={3} height="h-4" />
      </div>
      
      <div className="flex justify-between items-center text-sm mb-4">
        <Skeleton height="h-4" width="w-32" />
        <Skeleton height="h-4" width="w-24" />
      </div>
      
      <div className="flex justify-between items-center">
        <Skeleton height="h-8" width="w-32" />
        <Skeleton height="h-8" width="w-16" />
      </div>
    </div>
  );
};

export default FeedbackCardSkeleton;
