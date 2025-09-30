"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = exports.logger = void 0;
class Logger {
    constructor() {
        this.logLevel = process.env.LOG_LEVEL || 'info';
    }
    shouldLog(level) {
        const levels = { error: 0, warn: 1, info: 2, debug: 3 };
        return levels[level] <= levels[this.logLevel];
    }
    formatLog(entry) {
        const { level, message, timestamp, service, requestId, metadata } = entry;
        const logObject = {
            timestamp: timestamp.toISOString(),
            level: level.toUpperCase(),
            service,
            message,
            ...(requestId && { requestId }),
            ...(metadata && { metadata }),
        };
        return JSON.stringify(logObject);
    }
    log(entry) {
        if (this.shouldLog(entry.level)) {
            console.log(this.formatLog(entry));
        }
    }
    error(message, metadata) {
        this.log({
            level: 'error',
            message,
            timestamp: new Date(),
            service: 'feedback-api',
            metadata,
        });
    }
    warn(message, metadata) {
        this.log({
            level: 'warn',
            message,
            timestamp: new Date(),
            service: 'feedback-api',
            metadata,
        });
    }
    info(message, metadata) {
        this.log({
            level: 'info',
            message,
            timestamp: new Date(),
            service: 'feedback-api',
            metadata,
        });
    }
    debug(message, metadata) {
        this.log({
            level: 'debug',
            message,
            timestamp: new Date(),
            service: 'feedback-api',
            metadata,
        });
    }
}
exports.logger = new Logger();
const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    const requestId = req.headers['x-request-id'] ||
        `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-ID', requestId);
    exports.logger.info('Request started', {
        requestId,
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        contentLength: req.get('Content-Length'),
    });
    const originalEnd = res.end.bind(res);
    res.end = function (chunk, encoding, cb) {
        const duration = Date.now() - startTime;
        exports.logger.info('Request completed', {
            requestId,
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            contentLength: res.get('Content-Length'),
        });
        return originalEnd(chunk, encoding, cb);
    };
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=logger.js.map