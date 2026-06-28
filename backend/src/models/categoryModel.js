import pool from '../config/db.js';

export const categoryModel = {
  findAll: async () => {
    const res = await pool.query('SELECT id, name, created_at FROM categories ORDER BY name ASC');
    return res.rows;
  },

  findById: async (id) => {
    const res = await pool.query('SELECT id, name FROM categories WHERE id = $1', [id]);
    return res.rows[0] || null;
  },

  findByName: async (name) => {
    const res = await pool.query('SELECT id, name FROM categories WHERE LOWER(name) = LOWER($1)', [name]);
    return res.rows[0] || null;
  },

  create: async (name) => {
    const res = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING id, name', [name]);
    return res.rows[0];
  },

  update: async (id, name) => {
    const res = await pool.query(
      'UPDATE categories SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name',
      [name, id]
    );
    return res.rows[0];
  },

  delete: async (id) => {
    await pool.query('DELETE FROM categories WHERE id = $1', [id]);
  }
};
