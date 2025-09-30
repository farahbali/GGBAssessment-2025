import { NextFunction, Request, Response } from 'express';
import { LogEntry } from '../types';
interface LoggerInterface {
    log(entry: LogEntry): void;
    error(message: string, metadata?: Record<string, any>): void;
    warn(message: string, metadata?: Record<string, any>): void;
    info(message: string, metadata?: Record<string, any>): void;
    debug(message: string, metadata?: Record<string, any>): void;
}
declare class Logger implements LoggerInterface {
    private logLevel;
    constructor();
    private shouldLog;
    private formatLog;
    log(entry: LogEntry): void;
    error(message: string, metadata?: Record<string, any>): void;
    warn(message: string, metadata?: Record<string, any>): void;
    info(message: string, metadata?: Record<string, any>): void;
    debug(message: string, metadata?: Record<string, any>): void;
}
export declare const logger: Logger;
export declare const requestLogger: (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=logger.d.ts.map