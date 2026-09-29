// api/event_db.js
// MySQL connection pool for charityevents_db.
// Uses the mysql2 promise wrapper so routes can use async/await.

const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST || 'localhost',
  user:     process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'charityevents_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Promise-based wrapper for async/await support.
const db = pool.promise();

// Lightweight connectivity test on startup.
db.query('SELECT 1')
  .then(() => console.log('MySQL connected: charityevents_db'))
  .catch(err => console.error('MySQL connection failed:', err.message));

module.exports = db;
