import pool from '../config/db.js';

export const favoriteModel = {
  findUserFavorites: async (userId) => {
    const res = await pool.query(
      `SELECT a.id, a.name, a.description, a.logo, a.base_url, a.uptime, a.rating, a.status, a.version, c.name as category 
       FROM favorites f 
       JOIN apis a ON f.api_id = a.id 
       LEFT JOIN categories c ON a.category_id = c.id 
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );
    return res.rows;
  },

  exists: async (userId, apiId) => {
    const res = await pool.query(
      'SELECT 1 FROM favorites WHERE user_id = $1 AND api_id = $2',
      [userId, apiId]
    );
    return res.rows.length > 0;
  },

  create: async (userId, apiId) => {
    const res = await pool.query(
      'INSERT INTO favorites (user_id, api_id) VALUES ($1, $2) RETURNING id',
      [userId, apiId]
    );
    return res.rows[0];
  },

  delete: async (userId, apiId) => {
    const res = await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND api_id = $2 RETURNING id',
      [userId, apiId]
    );
    return res.rows.length > 0;
  }
};
