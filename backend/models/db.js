const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'kigali_crafts',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'oliga123',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
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