import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { closeDB, connectDB } from './config/database';
import { setupSwagger } from './config/swagger';

import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger, requestLogger } from './middleware/logger';
import { performanceMiddleware } from './middleware/performance';
import { corsOptions, helmetConfig } from './middleware/security';
import feedbackRoutes from './routes/feedback';
import { ServerConfig } from './types';

dotenv.config();
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


app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.set('trust proxy', 1);

app.use(performanceMiddleware);

app.use(helmetConfig);

app.use(performanceMiddleware);

app.use(requestLogger);
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

app.use('/api/feedback', feedbackRoutes);


setupSwagger(app);




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


app.use(notFoundHandler);

app.use(errorHandler);


const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  try {
    await closeDB();

    server.close(() => {
      logger.info('Server closed successfully');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logger.error('Error during graceful shutdown', { error: errorMessage });
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (err: unknown) => {
  const errorMessage = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;
  logger.error('Uncaught Exception', { error: errorMessage, stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
  process.exit(1);
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
      console.log(
        `📚 API Documentation: http://localhost:${serverConfig.port}/api-docs`
      );
      console.log(
        `🏥 Health Check: http://localhost:${serverConfig.port}/api/feedback/health`
      );
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logger.error('Failed to start server', { error: errorMessage });
    process.exit(1);
  }
};

startServer();

export default app;
