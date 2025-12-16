import "dotenv/config";
import pkg from "pg";
const { Pool } = pkg;

let pool;

// Support both DATABASE_URL (for Render) and individual env vars (for local dev)
if (process.env.DATABASE_URL) {
  // Render deployment using connection string
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  console.log("Using DATABASE_URL connection string");
} else {
  // Local development using individual environment variables
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
  console.log("Using individual DB environment variables");
}

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("Successfully connected to PostgreSQL database!");
  release();
});

export default pool;
