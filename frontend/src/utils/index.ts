import { FEEDBACK_STATUS, FEEDBACK_STATUS_LABELS, FEEDBACK_STATUS_COLORS } from '@/constants';
import { Feedback, FeedbackStatus } from '@/types';

// Date utilities
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(dateString);
};

// Feedback utilities
export const getStatusLabel = (status: FeedbackStatus): string => {
  return FEEDBACK_STATUS_LABELS[status] || status;
};

export const getStatusColor = (status: FeedbackStatus): string => {
  return FEEDBACK_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
};

export const getNextStatus = (currentStatus: FeedbackStatus): FeedbackStatus | null => {
  const statusOrder = Object.values(FEEDBACK_STATUS);
  const currentIndex = statusOrder.indexOf(currentStatus);
  
  if (currentIndex === -1 || currentIndex === statusOrder.length - 1) {
    return null;
  }
  
  return statusOrder[currentIndex + 1] as FeedbackStatus;
};

export const canUpdateStatus = (currentStatus: FeedbackStatus): boolean => {
  return getNextStatus(currentStatus) !== null;
};

// Validation utilities
export const validateTitle = (title: string): string | null => {
  if (!title.trim()) return 'Title is required';
  if (title.length < 1) return 'Title must be at least 1 character';
  if (title.length > 100) return 'Title must be no more than 100 characters';
  return null;
};

export const validateDescription = (description: string): string | null => {
  if (!description.trim()) return 'Description is required';
  if (description.length < 1) return 'Description must be at least 1 character';
  if (description.length > 500) return 'Description must be no more than 500 characters';
  return null;
};

export const validateFeedback = (data: { title: string; description: string }) => {
  const errors: Record<string, string> = {};
  
  const titleError = validateTitle(data.title);
  if (titleError) errors.title = titleError;
  
  const descriptionError = validateDescription(data.description);
  if (descriptionError) errors.description = descriptionError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// String utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Array utilities
export const sortFeedbacks = (feedbacks: Feedback[], sortBy: 'newest' | 'oldest' | 'status'): Feedback[] => {
  const sorted = [...feedbacks];
  
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'status':
      return sorted.sort((a, b) => {
        const statusOrder = Object.values(FEEDBACK_STATUS);
        return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      });
    default:
      return sorted;
  }
};

export const groupFeedbacksByStatus = (feedbacks: Feedback[]): Record<FeedbackStatus, Feedback[]> => {
  return feedbacks.reduce((groups, feedback) => {
    if (!groups[feedback.status]) {
      groups[feedback.status] = [];
    }
    groups[feedback.status].push(feedback);
    return groups;
  }, {} as Record<FeedbackStatus, Feedback[]>);
};

// Error handling utilities
// export const isApiError = (error: any): error is ApiError => {
//   return error && typeof error === 'object' && 'message' in error;
// };

interface ApiError {
  message: string;
  // Add other possible API error properties
  code?: number;
  status?: string;
}

const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
};

export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unknown error occurred';
};

export const handleApiError = (error: unknown): string => {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return 'Network error. Please check your connection.';
  }
  
  return getErrorMessage(error);
};

// Local storage utilities
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail if storage is not available
  }
};

export const removeFromStorage = (key: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
  } catch {
    // Silently fail if storage is not available
  }
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Class name utilities
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// URL utilities
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  return `${baseUrl}${endpoint}`;
};

// Performance utilities
export const measurePerformance = (name: string, fn: () => void): void => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
  } else {
    fn();
  }
};
