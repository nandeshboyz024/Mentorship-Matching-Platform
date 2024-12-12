const pool = require('./databaseConfig.js');  // Import the database connection

// SQL query to create the users table
const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL
  );
`;

// Function to create the users table
const createTable = async () => {
  try {
    const res = await pool.query(createUsersTable);  // Run the SQL query
    console.log('Users table created or already exists');
  } catch (err) {
    console.error('Error creating table:', err.stack);
  } finally {
    pool.end();  // Close the connection pool
  }
};

createTable();  // Call the function to create the table
