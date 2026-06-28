import logger from '../config/logger.js';
import { sendError } from '../utils/response.js';
import { AppError } from '../utils/errors.js';

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // Log error via Winston
  logger.error({
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  if (err.isOperational) {
    return sendError(res, err.message, [], err.statusCode);
  }

  // PostgreSQL duplicate key violation
  if (err.code === '23505') {
    return sendError(res, 'Record already exists.', [err.detail], 400);
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    return sendError(res, 'Invalid reference to another entity.', [err.detail], 400);
  }

  // Default Fallback
  const message = process.env.NODE_ENV === 'development' ? err.message : 'An internal server error occurred.';
  const details = process.env.NODE_ENV === 'development' ? err.stack : [];
  return sendError(res, message, details, 500);
};
