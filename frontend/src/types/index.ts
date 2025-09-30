
export interface Feedback {
  _id: string;
  title: string;
  description: string;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
}

export type FeedbackStatus = 'open' | 'in-progress' | 'done';

export interface CreateFeedbackRequest {
  title: string;
  description: string;
}

export interface UpdateFeedbackStatusRequest {
  status: FeedbackStatus;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FeedbackState {
  items: Feedback[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

export interface RootState {
  feedback: FeedbackState;
}


export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
  className?: string;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message: string;
  code?: string;
}


export interface FeedbackFormData {
  title: string;
  description: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}


export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;


export interface ApiErrorResponse  {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, any>;
}

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

export interface AsyncComponentProps extends BaseComponentProps {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}
