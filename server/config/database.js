const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const connectDB = async () => {
  try {
    // Skip database connection if DATABASE_URL is not provided (development mode)
    if (!process.env.DATABASE_URL) {
      console.log('No DATABASE_URL provided, skipping database connection (development mode)');
      return;
    }

    const client = await pool.connect();
    console.log('Connected to NeonDB successfully');
    
    // Create users table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create user_activity table for tracking usage
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_activity (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        tool_type VARCHAR(50) NOT NULL,
        input_data TEXT,
        output_data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    client.release();
    console.log('Database tables initialized');
  } catch (error) {
    console.error('Database connection error:', error);
    if (process.env.NODE_ENV === 'production') {
      throw error;
    } else {
      console.log('Continuing without database in development mode');
    }
  }
};

module.exports = { pool, connectDB };
