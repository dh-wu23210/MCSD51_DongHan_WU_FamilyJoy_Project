/** Module: db-connector. Handles db-connector responsibilities. */

// MySQL database connection for FamilyJoy (using mysql2)
const mysql = require('mysql2');
const config = require('../config');

// Use a pool for better concurrency and stable connections
const pool = mysql.createPool(Object.assign({
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}, config.db));

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.message || err);
  } else {
    console.log('Database connected');
    connection.release();
  }
});

// Export the callback-based pool (default export)
module.exports = pool;

// Also export a promise-based pool for async/await usage
module.exports.promise = pool.promise();
