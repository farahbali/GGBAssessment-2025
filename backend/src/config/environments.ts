import { EnvironmentVariables } from '../types';

const validateEnvironment = (): void => {
  const requiredVars = ['MONGODB_URI', 'PORT'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

const loadEnvironment = (): EnvironmentVariables => {
  validateEnvironment();
  
  return {
    NODE_ENV: (process.env.NODE_ENV as any) || 'development',
    PORT: parseInt(process.env.PORT || '5000'),
    MONGODB_URI: process.env.MONGODB_URI!,
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    JWT_SECRET: process.env.JWT_SECRET,
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    LOG_LEVEL: (process.env.LOG_LEVEL as any) || 'info',
    CORS_ORIGIN: process.env.CORS_ORIGIN,
  };
};

export const env = loadEnvironment();
export default env;
