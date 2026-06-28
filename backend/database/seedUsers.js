// backend/database/seedUsers.js
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('backend/.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const users = [
  {
    name: 'Admin User',
    email: 'admin@apihub.com',
    password: 'Admin123!',
    role: 'Admin',
  },
  {
    name: 'Developer User',
    email: 'developer@apihub.com',
    password: 'Developer123!',
    role: 'Developer',
  },
];

async function main() {
  console.log('🚀 Starting Users seed...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Ensure roles exist
    const roleNames = Array.from(new Set(users.map((u) => u.role)));
    const roleMap = {};
    for (const roleName of roleNames) {
      const insertRole = `INSERT INTO roles (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id;`;
      const res = await client.query(insertRole, [roleName]);
      if (res.rows.length) {
        roleMap[roleName] = res.rows[0].id;
      }
    }
    // Fetch ids for any pre‑existing roles
    const existingRoles = await client.query(`SELECT id, name FROM roles WHERE name = ANY($1)`, [roleNames]);
    for (const row of existingRoles.rows) {
      roleMap[row.name] = row.id;
    }

    const insertUser = `INSERT INTO users (role_id, name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING;`;
    let inserted = 0;
    for (const u of users) {
      const hashed = await bcrypt.hash(u.password, 10);
      const res = await client.query(insertUser, [roleMap[u.role], u.name, u.email, hashed]);
      if (res.rowCount) inserted++;
    }
    await client.query('COMMIT');
    console.log(`Inserted users: ${inserted}`);
    console.log('✅ Users seeded successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Users seed failed', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
