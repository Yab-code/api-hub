import pool from '../config/db.js';

export const reviewModel = {
  findByApiId: async (apiId) => {
    const res = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.name as user_name, u.avatar as user_avatar 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.api_id = $1 
       ORDER BY r.created_at DESC`,
      [apiId]
    );
    return res.rows;
  },

  findById: async (id) => {
    const res = await pool.query('SELECT * FROM reviews WHERE id = $1', [id]);
    return res.rows[0] || null;
  },

  create: async (userId, { apiId, rating, comment }) => {
    const res = await pool.query(
      `INSERT INTO reviews (user_id, api_id, rating, comment) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [userId, apiId, rating, comment]
    );
    return res.rows[0];
  },

  update: async (id, { rating, comment }) => {
    const res = await pool.query(
      `UPDATE reviews 
       SET rating = COALESCE($1, rating), 
           comment = COALESCE($2, comment), 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING *`,
      [rating, comment, id]
    );
    return res.rows[0];
  },

  delete: async (id) => {
    await pool.query('DELETE FROM reviews WHERE id = $1', [id]);
  }
};
