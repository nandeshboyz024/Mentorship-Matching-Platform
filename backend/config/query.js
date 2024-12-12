const pool = require('./databaseConfig.js');

const getUsers = async () => {
  try {
    const res = await pool.query('SELECT * FROM users');  // Query to select all users
    console.log('Users:', res.rows);
  } catch (err) {
    console.error('Error fetching users:', err.stack);
  } finally {
    pool.end();  // Close the connection pool
  }
};

getUsers();  // Call the function to query users
