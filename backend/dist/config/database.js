"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = exports.getConnectionStatus = exports.checkDatabaseHealth = exports.closeDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../middleware/logger");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbConfig = {
    uri: process.env.MONGODB_URI || '',
    options: {
        maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '10', 10),
        serverSelectionTimeoutMS: parseInt(process.env.DB_SERVER_SELECTION_TIMEOUT || '5000', 10),
        socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT || '45000', 10),
    },
};
exports.dbConfig = dbConfig;
let isConnected = false;
let connectionAttempts = 0;
const maxConnectionAttempts = 5;
const setupConnectionHandlers = () => {
    mongoose_1.default.connection.on('connected', () => {
        isConnected = true;
        connectionAttempts = 0;
        logger_1.logger.info('MongoDB connected successfully', {
            host: mongoose_1.default.connection.host,
            port: mongoose_1.default.connection.port,
            name: mongoose_1.default.connection.name,
        });
    });
    mongoose_1.default.connection.on('error', (error) => {
        isConnected = false;
        const message = error instanceof Error ? error.message : String(error);
        logger_1.logger.error('MongoDB connection error', { error: message });
    });
    mongoose_1.default.connection.on('disconnected', () => {
        isConnected = false;
        logger_1.logger.warn('MongoDB disconnected');
    });
    mongoose_1.default.connection.on('reconnected', () => {
        isConnected = true;
        logger_1.logger.info('MongoDB reconnected');
    });
    process.on('SIGINT', async () => {
        try {
            await mongoose_1.default.connection.close();
            isConnected = false;
            logger_1.logger.info('MongoDB connection closed through app termination');
            process.exit(0);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            logger_1.logger.error('Failed to close MongoDB connection on termination', { error: message });
            process.exit(1);
        }
    });
};
const connectDB = async () => {
    if (!dbConfig.uri) {
        logger_1.logger.error('MONGODB_URI environment variable is not defined');
        process.exit(1);
    }
    setupConnectionHandlers();
    try {
        await mongoose_1.default.connect(dbConfig.uri, dbConfig.options);
        await new Promise((resolve, reject) => {
            if (mongoose_1.default.connection.readyState === 1)
                resolve();
            else {
                mongoose_1.default.connection.once('connected', () => resolve());
                mongoose_1.default.connection.once('error', (err) => reject(err));
            }
        });
    }
    catch (err) {
        connectionAttempts++;
        const message = err instanceof Error ? err.message : String(err);
        logger_1.logger.error('Database connection failed', {
            attempt: connectionAttempts,
            maxAttempts: maxConnectionAttempts,
            error: message,
        });
        if (connectionAttempts < maxConnectionAttempts) {
            const delay = Math.pow(2, connectionAttempts) * 1000;
            logger_1.logger.info(`Retrying connection in ${delay}ms...`);
            setTimeout(() => void connectDB(), delay);
        }
        else {
            logger_1.logger.error('Max connection attempts reached. Exiting...');
            process.exit(1);
        }
    }
};
exports.connectDB = connectDB;
const checkDatabaseHealth = async () => {
    try {
        const startTime = Date.now();
        const db = mongoose_1.default.connection.db;
        if (!db)
            return { status: 'disconnected', error: 'No database connection' };
        await db.admin().ping();
        return { status: 'connected', responseTime: Date.now() - startTime };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { status: 'disconnected', error: message };
    }
};
exports.checkDatabaseHealth = checkDatabaseHealth;
const getConnectionStatus = () => isConnected && mongoose_1.default.connection.readyState === 1;
exports.getConnectionStatus = getConnectionStatus;
const closeDB = async () => {
    try {
        await mongoose_1.default.connection.close();
        isConnected = false;
        logger_1.logger.info('Database connection closed');
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        logger_1.logger.error('Error closing database connection', { error: message });
    }
};
exports.closeDB = closeDB;
//# sourceMappingURL=database.js.map