require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT || 5432,  // Use 5432 if PGPORT is not set
  ssl: {
    rejectUnauthorized: false // Required for some hosted databases
  }
});

module.exports = pool;
