"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
const logger_1 = require("./middleware/logger");
// Load environment variables
dotenv_1.default.config();
// Server configuration
const serverConfig = {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    cors: {
        origin: process.env.CORS_ORIGIN?.split(',') ||
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
const app = (0, express_1.default)();
app.use(express_1.default.json({
    limit: process.env.REQUEST_SIZE_LIMIT || '10mb',
    verify: (req, res, buf) => {
        req.rawBody = buf;
    },
}));
app.use(express_1.default.urlencoded({
    extended: true,
    limit: process.env.REQUEST_SIZE_LIMIT || '10mb',
}));
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
let server;
const startServer = async () => {
    try {
        await (0, database_1.connectDB)();
        server = app.listen(serverConfig.port, () => {
            logger_1.logger.info('Server started successfully', {
                port: serverConfig.port,
                environment: serverConfig.nodeEnv,
                nodeVersion: process.version,
                pid: process.pid,
            });
            console.log(`🚀 Server running on port ${serverConfig.port}`);
        });
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        logger_1.logger.error('Failed to start server', { error: errorMessage });
        process.exit(1);
    }
};
startServer();
exports.default = app;
//# sourceMappingURL=server.js.map