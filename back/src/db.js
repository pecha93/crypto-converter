// db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://crypto-converter:123456@localhost:5432/crypto-converter',
});

module.exports = pool;