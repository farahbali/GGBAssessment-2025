import { NextFunction, Request, Response } from 'express';
import { Document } from 'mongoose';
export interface IFeedback {
    _id: string;
    title: string;
    description: string;
    status: FeedbackStatus;
    createdAt: Date;
    updatedAt: Date;
}
export interface IFeedbackDocument extends Document {
    title: string;
    description: string;
    status: FeedbackStatus;
    createdAt: Date;
    updatedAt: Date;
}
export type FeedbackStatus = 'open' | 'in-progress' | 'done';
export interface CreateFeedbackRequest {
    title: string;
    description: string;
}
export interface UpdateFeedbackStatusRequest {
    status: FeedbackStatus;
}
export interface FeedbackQuery {
    status?: FeedbackStatus;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'updatedAt' | 'title';
    sortOrder?: 'asc' | 'desc';
    search?: string;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    pagination?: PaginationInfo;
}
export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export interface AuthenticatedRequest extends Request {
    user?: any;
}
export type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;
export type AsyncAuthenticatedRequestHandler = (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export interface AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    code?: string;
    keyValue?: Record<string, any>;
    errors?: Record<string, any>;
}
export interface ValidationError {
    field: string;
    message: string;
    value?: any;
}
export interface DatabaseConfig {
    uri: string;
    options: {
        maxPoolSize: number;
        serverSelectionTimeoutMS: number;
        socketTimeoutMS: number;
    };
}
export interface ServerConfig {
    port: number;
    nodeEnv: 'development' | 'production' | 'test';
    cors: {
        origin: string | string[];
        credentials: boolean;
    };
    rateLimit: {
        windowMs: number;
        max: number;
    };
    helmet: {
        contentSecurityPolicy: boolean;
        crossOriginEmbedderPolicy: boolean;
    };
}
export interface LogEntry {
    level: 'error' | 'warn' | 'info' | 'debug';
    message: string;
    timestamp: Date;
    service: string;
    requestId?: string;
    userId?: string;
    metadata?: Record<string, any>;
}
export interface HealthCheck {
    status: 'healthy' | 'unhealthy';
    timestamp: Date;
    uptime: number;
    version: string;
    environment: string;
    database: {
        status: 'connected' | 'disconnected';
        responseTime?: number;
    };
    memory: {
        used: number;
        total: number;
        percentage: number;
    };
}
export interface CacheConfig {
    ttl: number;
    maxSize: number;
    checkPeriod: number;
}
export interface CacheEntry<T = any> {
    key: string;
    value: T;
    expiresAt: Date;
    createdAt: Date;
}
export interface ValidationRule {
    field: string;
    rules: {
        required?: boolean;
        type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
        pattern?: RegExp;
        enum?: any[];
        custom?: (value: any) => boolean | string;
    };
}
export interface ServiceResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    statusCode: number;
}
export interface PaginatedServiceResponse<T = any> extends ServiceResponse<T[]> {
    pagination: PaginationInfo;
}
export interface RateLimitInfo {
    limit: number;
    current: number;
    remaining: number;
    resetTime: Date;
}
export interface SecurityHeaders {
    'X-Content-Type-Options': string;
    'X-Frame-Options': string;
    'X-XSS-Protection': string;
    'Strict-Transport-Security': string;
    'Referrer-Policy': string;
}
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
export interface EnvironmentVariables {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: number;
    MONGODB_URI: string;
    FRONTEND_URL: string;
    JWT_SECRET?: string;
    RATE_LIMIT_WINDOW_MS?: number;
    RATE_LIMIT_MAX?: number;
    LOG_LEVEL?: 'error' | 'warn' | 'info' | 'debug';
    CORS_ORIGIN?: string;
}
//# sourceMappingURL=index.d.ts.map