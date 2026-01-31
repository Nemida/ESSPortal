const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database');
    client.release(); 
  } catch (err) {
    console.error('Database connection failed:', err.stack);
  }
};

testConnection();

module.exports = {
  query: (text, params) => pool.query(text, params),
};