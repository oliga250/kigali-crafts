const mysql = require('mysql2');
require('dotenv').config();

// Ensure all required environment variables are set
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ ERROR: Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please set these variables in your .env file');
  process.exit(1);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

const promisePool = pool.promise();

let retryCount = 5;
const connectWithRetry = () => {
  promisePool.query('SELECT 1')
    .then(() => console.log('✅ Database connected successfully'))
    .catch((err) => {
      if (retryCount > 0) {
        console.log(`Database connection failed, retrying in 5s... (${6 - retryCount}/5)`);
        retryCount--;
        setTimeout(connectWithRetry, 5000);
      } else {
        console.error('❌ Database connection failed after all retries:', err.message);
      }
    });
};

connectWithRetry();

module.exports = promisePool;
