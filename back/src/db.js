// db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://cryptoconverter:123456@localhost:5432/cryptoconverter',
});

module.exports = pool;