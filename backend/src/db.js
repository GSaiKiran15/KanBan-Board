import 'dotenv/config'; // Loads variables from .env file into process.env
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  // Use environment variables for the connection configuration
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT, 
});

// Test the connection (optional, but recommended)
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Successfully connected to PostgreSQL database!');
  client.release();
});

export default pool;