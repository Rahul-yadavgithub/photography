import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import logger from '../utils/logger.js';

// Helper to log rate limit hits
const handler = (req, res, next, options) => {
  logger.warn(`Rate Limit Exceeded: ${options.message} - IP: ${req.ip} - Path: ${req.originalUrl}`);
  res.status(options.statusCode).json({
    success: false,
    message: options.message
  });
};

export const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: 'Too many authentication attempts from this IP, please try again in a minute.',
  handler,
  standardHeaders: true,
  legacyHeaders: false,
});

export const adminLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  // Rate limit based on Clerk User ID if available, otherwise fallback to IP
  keyGenerator: (req, res) => {
    if (req.auth && req.auth.userId) {
      return req.auth.userId;
    }
    return ipKeyGenerator(req, res);
  },
  message: 'Too many admin requests from this user, please try again in a minute.',
  handler,
  standardHeaders: true,
  legacyHeaders: false,
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  keyGenerator: (req, res) => {
    if (req.auth && req.auth.userId) {
      return req.auth.userId;
    }
    return ipKeyGenerator(req, res);
  },
  message: 'Too many uploads from this user, please try again in a minute.',
  handler,
  standardHeaders: true,
  legacyHeaders: false,
});

export const publicReadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: 'Too many requests from this IP, please try again in a minute.',
  handler,
  standardHeaders: true,
  legacyHeaders: false,
});

export const inquiryLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: 'Too many inquiries submitted from this IP, please try again in a minute.',
  handler,
  standardHeaders: true,
  legacyHeaders: false,
});
