import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per 15 minutes
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    errors: []
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // Limit IP to 30 auth requests per 15 minutes
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes.',
    errors: []
  },
  standardHeaders: true,
  legacyHeaders: false
});
