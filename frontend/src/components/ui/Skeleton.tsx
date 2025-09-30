import React from 'react';
import { BaseComponentProps } from '@/types';
import { cn } from '@/utils';

interface SkeletonProps extends BaseComponentProps {
  lines?: number;
  height?: string;
  width?: string;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  lines = 1,
  height = 'h-4',
  width = 'w-full',
  className = '',
  'data-testid': testId,
}) => {
  return (
    <div
      className={cn('animate-pulse', className)}
      data-testid={testId}
    >
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'bg-gray-200 rounded',
            height,
            width,
            index < lines - 1 && 'mb-2'
          )}
        />
      ))}
    </div>
  );
};

export default Skeleton;
