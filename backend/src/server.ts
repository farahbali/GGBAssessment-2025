import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { closeDB, connectDB } from './config/database';



import { ServerConfig } from './types';
import { logger } from './middleware/logger';

// Load environment variables
dotenv.config();
// Server configuration
const serverConfig: ServerConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: (process.env.NODE_ENV as any) || 'development',
  cors: {
    origin:
      process.env.CORS_ORIGIN?.split(',') ||
      [process.env.FRONTEND_URL || 'http://localhost:3000'],
    credentials: true,
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },
  helmet: {
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
    crossOriginEmbedderPolicy: false,
  },
};

const app = express();


app.use(
  express.json({
    limit: process.env.REQUEST_SIZE_LIMIT || '10mb',
    verify: (req, res, buf) => {
      (req as any).rawBody = buf;
    },
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: process.env.REQUEST_SIZE_LIMIT || '10mb',
  })
);








app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Feedback Board API',
    version: process.env.npm_package_version || '1.0.0',
    environment: serverConfig.nodeEnv,
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/feedback/health',
      docs: '/api-docs',
      feedback: '/api/feedback',
    },
  });
});







let server: ReturnType<typeof app.listen>;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(serverConfig.port, () => {
      logger.info('Server started successfully', {
        port: serverConfig.port,
        environment: serverConfig.nodeEnv,
        nodeVersion: process.version,
        pid: process.pid,
      });

      console.log(`🚀 Server running on port ${serverConfig.port}`);
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logger.error('Failed to start server', { error: errorMessage });
    process.exit(1);
  }
};

startServer();

export default app;
