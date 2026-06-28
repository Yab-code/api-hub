import pool from '../config/db.js';

export const notificationModel = {
  findUserNotifications: async (userId) => {
    const res = await pool.query(
      'SELECT id, title, message, is_read, created_at FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return res.rows;
  },

  findById: async (id) => {
    const res = await pool.query('SELECT * FROM notifications WHERE id = $1', [id]);
    return res.rows[0] || null;
  },

  markAsRead: async (id) => {
    const res = await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *',
      [id]
    );
    return res.rows[0];
  },

  create: async (userId, { title, message }) => {
    const res = await pool.query(
      'INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3) RETURNING *',
      [userId, title, message]
    );
    return res.rows[0];
  }
};
