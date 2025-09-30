
import mongoose from 'mongoose';
import { logger } from '../middleware/logger';
import { DatabaseConfig } from '../types';
import dotenv from 'dotenv';

dotenv.config();


const dbConfig: DatabaseConfig = {
  uri: process.env.MONGODB_URI || '',
  options: {    
    maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '10', 10),
    serverSelectionTimeoutMS: parseInt(process.env.DB_SERVER_SELECTION_TIMEOUT || '5000', 10),
    socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT || '45000', 10),
  },
};

let isConnected = false;
let connectionAttempts = 0;
const maxConnectionAttempts = 5;

const setupConnectionHandlers = (): void => {
  mongoose.connection.on('connected', () => {
    isConnected = true;
    connectionAttempts = 0;
    logger.info('MongoDB connected successfully', {
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
    });
  });

  mongoose.connection.on('error', (error: unknown) => {
    isConnected = false;
    const message = error instanceof Error ? error.message : String(error);
    logger.error('MongoDB connection error', { error: message });
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    isConnected = true;
    logger.info('MongoDB reconnected');
  });

  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      isConnected = false;
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error('Failed to close MongoDB connection on termination', { error: message });
      process.exit(1);
    }
  });
};


const connectDB = async (): Promise<void> => {
  if (!dbConfig.uri) {
    logger.error('MONGODB_URI environment variable is not defined');
    process.exit(1);
  }

  setupConnectionHandlers();

  try {
    await mongoose.connect(dbConfig.uri, dbConfig.options);
    await new Promise<void>((resolve, reject) => {
      if (mongoose.connection.readyState === 1) resolve();
      else {
        mongoose.connection.once('connected', () => resolve());
        mongoose.connection.once('error', (err) => reject(err));
      }
    });
  } catch (err: unknown) {
    connectionAttempts++;
    const message = err instanceof Error ? err.message : String(err);

    logger.error('Database connection failed', {
      attempt: connectionAttempts,
      maxAttempts: maxConnectionAttempts,
      error: message,
    });

    if (connectionAttempts < maxConnectionAttempts) {
      const delay = Math.pow(2, connectionAttempts) * 1000;
      logger.info(`Retrying connection in ${delay}ms...`);
      setTimeout(() => void connectDB(), delay);
    } else {
      logger.error('Max connection attempts reached. Exiting...');
      process.exit(1);
    }
  }
};

const checkDatabaseHealth = async (): Promise<{ status: 'connected' | 'disconnected'; responseTime?: number; error?: string }> => {
  try {
    const startTime = Date.now();
    const db = mongoose.connection.db;
    if (!db) return { status: 'disconnected', error: 'No database connection' };

    await db.admin().ping();
    return { status: 'connected', responseTime: Date.now() - startTime };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: 'disconnected', error: message };
  }
};

const getConnectionStatus = (): boolean => isConnected && mongoose.connection.readyState === 1;

const closeDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    isConnected = false;
    logger.info('Database connection closed');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error('Error closing database connection', { error: message });
  }
};

export { connectDB, closeDB, checkDatabaseHealth, getConnectionStatus, dbConfig };
