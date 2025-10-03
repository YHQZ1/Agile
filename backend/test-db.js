// test-db.js
const { Pool } = require('pg');
require('dotenv').config();

async function testConnection() {
  const pool = new Pool({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connection successful');
    const res = await client.query('SELECT NOW()');
    console.log('Current time:', res.rows[0].now);
    client.release();
  } catch (err) {
    console.error('❌ Connection failed:', err.stack);
  } finally {
    await pool.end();
  }
}

testConnection();