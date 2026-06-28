import pool from '../config/db.js';

export const apiModel = {
  findAll: async ({ search = '', categoryName = '', status = '' }) => {
    let queryText = `
      SELECT a.id, a.name, a.description, a.logo, a.base_url, a.uptime, a.rating, a.status, a.version, c.name as category 
      FROM apis a 
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      queryText += ` AND (LOWER(a.name) LIKE LOWER($${params.length}) OR LOWER(a.description) LIKE LOWER($${params.length}))`;
    }

    if (categoryName && categoryName !== 'All Categories' && categoryName !== 'All') {
      params.push(categoryName);
      queryText += ` AND LOWER(c.name) = LOWER($${params.length})`;
    }

    if (status) {
      params.push(status);
      queryText += ` AND LOWER(a.status) = LOWER($${params.length})`;
    }

    queryText += ' ORDER BY a.created_at DESC';

    const res = await pool.query(queryText, params);
    return res.rows;
  },

  findById: async (id) => {
    const res = await pool.query(
      `SELECT a.id, a.name, a.description, a.logo, a.base_url, a.uptime, a.rating, a.status, a.version, c.name as category, a.creator_id, a.created_at 
       FROM apis a 
       LEFT JOIN categories c ON a.category_id = c.id 
       WHERE a.id = $1`,
      [id]
    );
    return res.rows[0] || null;
  },

  create: async ({ categoryId, name, description, logo, baseUrl, status = 'active', version = '1.0.0', creatorId }) => {
    const res = await pool.query(
      `INSERT INTO apis (category_id, name, description, logo, base_url, status, version, creator_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [categoryId, name, description, logo, baseUrl, status, version, creatorId]
    );
    return res.rows[0];
  },

  update: async (id, { categoryId, name, description, logo, baseUrl, status, version }) => {
    const res = await pool.query(
      `UPDATE apis 
       SET category_id = COALESCE($1, category_id), 
           name = COALESCE($2, name), 
           description = COALESCE($3, description), 
           logo = COALESCE($4, logo), 
           base_url = COALESCE($5, base_url), 
           status = COALESCE($6, status), 
           version = COALESCE($7, version),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 
       RETURNING *`,
      [categoryId, name, description, logo, baseUrl, status, version, id]
    );
    return res.rows[0];
  },

  updateRating: async (id, rating) => {
    await pool.query('UPDATE apis SET rating = $1 WHERE id = $2', [rating, id]);
  },

  updateUptime: async (id, uptime) => {
    await pool.query('UPDATE apis SET uptime = $1 WHERE id = $2', [uptime, id]);
  },

  delete: async (id) => {
    await pool.query('DELETE FROM apis WHERE id = $1', [id]);
  }
};
