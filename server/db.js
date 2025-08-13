
const { Pool } = require('pg');

console.log('DATABASE_URL found:', process.env.DATABASE_URL);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });


const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('🐘 Connected to the PostgreSQL database!');
    client.release(); 
  } catch (err) {
    console.error('DATABASE CONNECTION FAILED:', err.stack);
  }
};

testConnection();

module.exports = {
  query: (text, params) => pool.query(text, params),
};