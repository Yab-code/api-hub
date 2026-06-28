// backend/database/seedApis.js
import fs from 'fs/promises';
import path from 'path';
import https from 'https';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve('backend/.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const DATA_DIR = path.resolve('backend/data');
const JSON_PATH = path.join(DATA_DIR, 'public-apis.json');
const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/public-apis/public-apis/master/entries.json';

async function downloadPublicApis() {
  console.log('📥 Downloading Public APIs dataset from GitHub...');
  return new Promise((resolve, reject) => {
    https.get(GITHUB_RAW_URL, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download file. Status code: ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function ensureDataFile() {
  try {
    await fs.access(JSON_PATH);
    // file exists
  } catch (_) {
    // file does not exist – fetch and write
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await downloadPublicApis();
    await fs.writeFile(JSON_PATH, raw, 'utf-8');
    console.log('✅ Saved dataset to', JSON_PATH);
  }
}

function isValidUrl(str) {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}

async function main() {
  console.log('🚀 Starting API import...');
  await ensureDataFile();
  const rawContent = await fs.readFile(JSON_PATH, 'utf-8');
  const { entries } = JSON.parse(rawContent);
  const totalLoaded = entries.length;
  // Validation & deduplication
  const seen = new Set();
  const validRecords = [];
  let duplicates = 0;
  for (const e of entries) {
    const name = e.API?.trim();
    const url = e.Link?.trim();
    if (!name || !url || !isValidUrl(url)) continue; // skip malformed or bad URLs
    const key = `${name}|${url}`;
    if (seen.has(key)) {
      duplicates++;
      continue;
    }
    seen.add(key);
    validRecords.push({
      name,
      description: e.Description?.trim() || null,
      category: e.Category?.trim() || 'Uncategorized',
      link: url,
      https: e.HTTPS === true || e.HTTPS === 'true',
      auth: e.Auth?.trim() || null,
      cors: e.Cors?.trim() || null,
    });
  }
  const validCount = validRecords.length;
  console.log(`Loaded: ${totalLoaded} APIs`);
  console.log(`Valid: ${validCount}`);
  console.log(`Duplicates: ${duplicates}`);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Insert categories, on conflict do nothing
    const categorySet = new Set(validRecords.map((r) => r.category));
    const categoryMap = {};
    for (const cat of categorySet) {
      const insertText = `INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id;`;
      const res = await client.query(insertText, [cat]);
      if (res.rows.length) {
        categoryMap[cat] = res.rows[0].id;
      }
    }
    // Fetch ids for existing categories
    const existing = await client.query(`SELECT id, name FROM categories WHERE name = ANY($1)`, [Array.from(categorySet)]);
    for (const row of existing.rows) {
      categoryMap[row.name] = row.id;
    }

    const insertApiText = `INSERT INTO apis (category_id, name, description, base_url, https_supported, auth_type, cors_support)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (name, base_url) DO NOTHING RETURNING id;`;
    let inserted = 0;
    for (const rec of validRecords) {
      const values = [
        categoryMap[rec.category],
        rec.name,
        rec.description,
        rec.link,
        rec.https,
        rec.auth || null,
        rec.cors || null,
      ];
      const res = await client.query(insertApiText, values);
      if (res.rowCount) inserted++;
    }
    await client.query('COMMIT');
    console.log(`Inserted: ${inserted}`);
    console.log('✅ Finished Successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Import failed', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
