import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { SecurityHeaders } from '../types';
import { logger } from './logger';
import { CorsOptions } from 'cors';

const jsonError = (res: Response, status: number, code: string, message: string) =>
  res.status(status).json({ success: false, error: code, message, statusCode: status, code });

const sanitizeString = (str: string) => str.replace(/[<>]/g, '').trim();



const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000', 
  process.env.FRONTEND_URL, 
].filter(Boolean) as string[];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn('CORS blocked', { origin, allowedOrigins });
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  credentials: true,
  optionsSuccessStatus: 200,
};
const rateHandler = (req: Request, res: Response, msg: string) => {
  logger.warn('Rate limit exceeded', { ip: req.ip, ua: req.get('User-Agent'), url: req.url });
  return jsonError(res, 429, 'RATE_LIMIT_EXCEEDED', msg);
};

const createRateLimit = (windowMs: number, max: number, message: string) =>
  rateLimit({ windowMs, max, standardHeaders: true, legacyHeaders: false,
    handler: (req, res) => rateHandler(req, res, message),
    message: { success: false, error: 'Rate limit exceeded', message, statusCode: 429, code: 'RATE_LIMIT_EXCEEDED' },
  });

export const generalRateLimit = createRateLimit(15 * 60 * 1000, 100, 'Too many requests, try later.');
export const strictRateLimit  = createRateLimit(15 * 60 * 1000, 5,   'Too many requests to this endpoint.');

export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
});

export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  const headers: SecurityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
  Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));
  next();
};

export const sanitizeRequest = (req: Request, _res: Response, next: NextFunction) => {
  const sanitizeObj = (obj: any): any =>
    typeof obj === 'string' ? sanitizeString(obj) :
    Array.isArray(obj) ? obj.map(sanitizeObj) :
    obj && typeof obj === 'object' ? Object.fromEntries(Object.entries(obj).map(([k,v]) => [k, sanitizeObj(v)])) : obj;
  req.query = sanitizeObj(req.query);
  req.body  = sanitizeObj(req.body);
  next();
};

export const ipWhitelist = (allowed: string[]) => (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.connection.remoteAddress || '';
  if (allowed.includes(ip)) return next();
  logger.warn('IP not in whitelist', { ip, url: req.url });
  return jsonError(res, 403, 'IP_NOT_ALLOWED', 'Access denied from this IP address');
};

export const requestSizeLimiter = (maxSize: number) => (req: Request, res: Response, next: NextFunction) => {
  const len = parseInt(req.get('Content-Length') || '0');
  return len > maxSize
    ? jsonError(res, 413, 'PAYLOAD_TOO_LARGE', `Request exceeds ${maxSize} bytes`)
    : next();
};

export const securityAudit = (req: Request, res: Response, next: NextFunction) => {
  const patterns = [/\.\./, /<script/i, /union\s+select/i, /javascript:/i, /on\w+\s*=/i];
  const check = (val: any, ctx: string): boolean => typeof val === 'string' && patterns.some(p => {
    if (p.test(val)) {
      logger.warn('Suspicious request', { pattern: p.toString(), ctx, val, ip: req.ip, url: req.url });
      return true;
    } return false;
  });
  const traverse = (obj: any, ctx = ''): boolean =>
    typeof obj === 'string' ? check(obj, ctx) :
    Array.isArray(obj) ? obj.some((v,i) => traverse(v, `${ctx}[${i}]`)) :
    obj && typeof obj === 'object' ? Object.entries(obj).some(([k,v]) => traverse(v, `${ctx}.${k}`)) : false;

  if (check(req.url, 'url') || Object.values(req.query).some(v => check(v, 'query')) || traverse(req.body))
    return jsonError(res, 400, 'SUSPICIOUS_REQUEST', 'Suspicious request detected');
  next();
};
