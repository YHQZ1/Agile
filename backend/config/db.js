const { Pool } = require('pg');
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log("Connected to Supabase! Time is:", res.rows[0]);
  } catch (err) {
    console.error("Error connecting to Supabase:", err.message);
  }
}

testConnection();
