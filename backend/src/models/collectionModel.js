import pool from '../config/db.js';

export const collectionModel = {
  findUserCollections: async (userId) => {
    const res = await pool.query(
      `SELECT c.id, c.name, c.description, c.created_at, COUNT(ca.api_id)::int as api_count 
       FROM collections c 
       LEFT JOIN collection_apis ca ON c.id = ca.collection_id 
       WHERE c.user_id = $1 
       GROUP BY c.id 
       ORDER BY c.created_at DESC`,
      [userId]
    );
    return res.rows;
  },

  findById: async (id) => {
    const metaRes = await pool.query(
      'SELECT id, name, description, user_id, created_at FROM collections WHERE id = $1',
      [id]
    );
    const collection = metaRes.rows[0] || null;

    if (!collection) return null;

    const apisRes = await pool.query(
      `SELECT a.id, a.name, a.description, a.logo, a.base_url, a.uptime, a.rating, a.status, c.name as category 
       FROM collection_apis ca 
       JOIN apis a ON ca.api_id = a.id 
       LEFT JOIN categories c ON a.category_id = c.id 
       WHERE ca.collection_id = $1`,
      [id]
    );

    collection.apis = apisRes.rows;
    return collection;
  },

  create: async (userId, { name, description }) => {
    const res = await pool.query(
      'INSERT INTO collections (user_id, name, description) VALUES ($1, $2, $3) RETURNING *',
      [userId, name, description]
    );
    return res.rows[0];
  },

  update: async (id, { name, description }) => {
    const res = await pool.query(
      `UPDATE collections 
       SET name = COALESCE($1, name), 
           description = COALESCE($2, description),
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING *`,
      [name, description, id]
    );
    return res.rows[0];
  },

  delete: async (id) => {
    await pool.query('DELETE FROM collections WHERE id = $1', [id]);
  },

  addApi: async (collectionId, apiId) => {
    const res = await pool.query(
      'INSERT INTO collection_apis (collection_id, api_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
      [collectionId, apiId]
    );
    return res.rows[0] || null;
  },

  removeApi: async (collectionId, apiId) => {
    const res = await pool.query(
      'DELETE FROM collection_apis WHERE collection_id = $1 AND api_id = $2 RETURNING *',
      [collectionId, apiId]
    );
    return res.rows.length > 0;
  }
};
