import React from 'react';
import { BaseComponentProps } from '@/types';
import { cn } from '@/utils';

interface ErrorMessageProps extends BaseComponentProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  variant?: 'error' | 'warning' | 'info';
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Error',
  message,
  onRetry,
  variant = 'error',
  className = '',
  'data-testid': testId,
}) => {
  const variantClasses = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconClasses = {
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  };

  return (
    <div
      className={cn(
        'rounded-md border p-4',
        variantClasses[variant],
        className
      )}
      data-testid={testId}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className={cn('h-5 w-5', iconClasses[variant])}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          <div className="mt-2 text-sm">
            <p>{message}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="bg-transparent border border-current rounded-md px-3 py-2 text-sm font-medium hover:bg-current hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
