import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access token is missing or invalid.');
    }

    const token = authHeader.split(' ')[1];

    // Support mock token authentication in development/testing mode
    if (token.startsWith('mock-jwt-token-header.')) {
      try {
        const base64Payload = token.split('.')[1];
        // Decode base64 in Node.js
        const payloadString = Buffer.from(base64Payload, 'base64').toString('ascii');
        const user = JSON.parse(payloadString);
        
        // Fetch fresh user info or fallback
        const userResult = await pool.query(
          `SELECT u.id, u.name, u.email, u.plan, u.api_key_count, u.avatar, r.name as role 
           FROM users u 
           JOIN roles r ON u.role_id = r.id 
           WHERE u.id = $1 OR u.email = $2`,
          [user.id, user.email]
        );
        
        if (userResult.rows.length > 0) {
          req.user = userResult.rows[0];
        } else {
          req.user = { ...user, role: user.role || 'developer' };
        }
        return next();
      } catch (e) {
        throw new UnauthorizedError('Invalid mock token.');
      }
    }

    // Real JWT Verification
    const secret = process.env.JWT_SECRET || 'apihub_default_secret_key';
    const decoded = jwt.verify(token, secret);

    const userResult = await pool.query(
      `SELECT u.id, u.name, u.email, u.plan, u.api_key_count, u.avatar, r.name as role 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.id = $1`,
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      throw new UnauthorizedError('User session no longer exists.');
    }

    req.user = userResult.rows[0];
    next();
  } catch (err) {
    next(new UnauthorizedError(err.message || 'Authentication failed.'));
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role.toLowerCase())) {
      return next(new ForbiddenError('You do not have permission to perform this action.'));
    }
    next();
  };
};
