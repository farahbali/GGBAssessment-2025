import React from 'react';
import { BaseComponentProps } from '@/types';
import { cn } from '@/utils';

interface LoadingSpinnerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message,
  className = '',
  'data-testid': testId,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className={cn('flex flex-col items-center justify-center space-y-2', className)}
      data-testid={testId}
    >
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
          sizeClasses[size]
        )}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="text-sm text-gray-600" role="status">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
