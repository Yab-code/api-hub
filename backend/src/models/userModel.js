import pool from '../config/db.js';

export const userModel = {
  findByEmail: async (email) => {
    const res = await pool.query(
      `SELECT u.id, u.name, u.email, u.password_hash, u.plan, u.api_key_count, u.avatar, u.bio, r.name as role 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE LOWER(u.email) = LOWER($1)`,
      [email]
    );
    return res.rows[0] || null;
  },

  findById: async (id) => {
    const res = await pool.query(
      `SELECT u.id, u.name, u.email, u.plan, u.api_key_count, u.avatar, u.bio, r.name as role 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.id = $1`,
      [id]
    );
    return res.rows[0] || null;
  },

  create: async ({ name, email, passwordHash, roleName = 'developer', plan = 'Free', avatar = null }) => {
    // Get role ID
    const roleRes = await pool.query('SELECT id FROM roles WHERE LOWER(name) = LOWER($1)', [roleName]);
    const roleId = roleRes.rows[0]?.id;

    if (!roleId) {
      throw new Error(`Role '${roleName}' not found.`);
    }

    const res = await pool.query(
      `INSERT INTO users (role_id, name, email, password_hash, plan, avatar) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, name, email, plan, avatar`,
      [roleId, name, email, passwordHash, plan, avatar]
    );
    return res.rows[0];
  },

  update: async (id, { name, email, bio = null, avatar = null }) => {
    const res = await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name), 
           email = COALESCE($2, email), 
           bio = COALESCE($3, bio), 
           avatar = COALESCE($4, avatar),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 
       RETURNING id, name, email, plan, api_key_count, avatar, bio`,
      [name, email, bio, avatar, id]
    );
    return res.rows[0];
  },

  updatePassword: async (id, passwordHash) => {
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, id]);
  },

  findAll: async () => {
    const res = await pool.query(
      `SELECT u.id, u.name, u.email, r.name as role, u.plan, u.avatar, u.bio, u.created_at 
       FROM users u 
       JOIN roles r ON u.role_id = r.id
       ORDER BY u.created_at DESC`
    );
    return res.rows;
  },

  updateAdminUser: async (id, { roleName, plan }) => {
    // Get role ID if provided
    let roleId = null;
    if (roleName) {
      const roleRes = await pool.query('SELECT id FROM roles WHERE LOWER(name) = LOWER($1)', [roleName]);
      roleId = roleRes.rows[0]?.id;
    }

    const res = await pool.query(
      `UPDATE users 
       SET role_id = COALESCE($1, role_id), 
           plan = COALESCE($2, plan),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 
       RETURNING id, name, email, plan`,
      [roleId, plan, id]
    );
    return res.rows[0];
  },

  delete: async (id) => {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  }
};
