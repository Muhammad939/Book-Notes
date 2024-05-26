const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'book_notes',
  password: 'Mbchone23',
  port: 5433, 
});

module.exports = pool;
