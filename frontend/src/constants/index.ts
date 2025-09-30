
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  ENDPOINTS: {
    FEEDBACK: '/api/feedback',
    HEALTH: '/api/health',
    DOCS: '/api-docs',
  },
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;


export const APP_CONFIG = {
  NAME: 'Feedback Board',
  VERSION: '1.0.0',
  DESCRIPTION: 'A modern feedback management system',
  SUPPORTED_BROWSERS: ['chrome', 'firefox', 'safari', 'edge'],
} as const;

export const UI_CONSTANTS = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  SKELETON_ITEMS: 3,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  ITEMS_PER_PAGE: 10,
} as const;


export const FEEDBACK_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  DONE: 'done',
} as const;

export const FEEDBACK_STATUS_LABELS = {
  [FEEDBACK_STATUS.OPEN]: 'Open',
  [FEEDBACK_STATUS.IN_PROGRESS]: 'In Progress',
  [FEEDBACK_STATUS.DONE]: 'Done',
} as const;

export const FEEDBACK_STATUS_COLORS = {
  [FEEDBACK_STATUS.OPEN]: 'bg-blue-100 text-blue-800',
  [FEEDBACK_STATUS.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
  [FEEDBACK_STATUS.DONE]: 'bg-green-100 text-green-800',
} as const;

export const FEEDBACK_STATUS_ORDER = [
  FEEDBACK_STATUS.OPEN,
  FEEDBACK_STATUS.IN_PROGRESS,
  FEEDBACK_STATUS.DONE,
] as const;

export const VALIDATION_RULES = {
  TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
    REQUIRED: true,
  },
  DESCRIPTION: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 500,
    REQUIRED: true,
  },
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  GENERIC: 'Something went wrong. Please try again.',
  REQUIRED_FIELD: 'This field is required.',
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters.`,
  MAX_LENGTH: (max: number) => `Must be no more than ${max} characters.`,
} as const;


export const SUCCESS_MESSAGES = {
  FEEDBACK_CREATED: 'Feedback created successfully!',
  FEEDBACK_UPDATED: 'Feedback updated successfully!',
  FEEDBACK_DELETED: 'Feedback deleted successfully!',
  STATUS_UPDATED: 'Status updated successfully!',
} as const;

export const LOADING_MESSAGES = {
  FETCHING_FEEDBACK: 'Loading feedback...',
  CREATING_FEEDBACK: 'Creating feedback...',
  UPDATING_STATUS: 'Updating status...',
  DELETING_FEEDBACK: 'Deleting feedback...',
} as const;


export const STORAGE_KEYS = {
  THEME: 'feedback-board-theme',
  USER_PREFERENCES: 'feedback-board-preferences',
  CACHE_TIMESTAMP: 'feedback-board-cache-timestamp',
} as const;


export const CACHE_CONFIG = {
  FEEDBACK_CACHE_DURATION: 5 * 60 * 1000,
  MAX_CACHE_SIZE: 50, 
} as const;

export const A11Y = {
  SKIP_TO_CONTENT: 'Skip to main content',
  LOADING: 'Loading',
  ERROR: 'Error',
  SUCCESS: 'Success',
  FORM_LABEL: 'Feedback form',
  FEEDBACK_LIST: 'Feedback list',
  STATUS_BUTTON: (status: string) => `Change status to ${status}`,
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

export const FEATURES = {
  DARK_MODE: true,
  OFFLINE_SUPPORT: false,
  PUSH_NOTIFICATIONS: false,
  ANALYTICS: false,
} as const;
