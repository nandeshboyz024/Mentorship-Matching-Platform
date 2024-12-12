const pool = require('./databaseConfig.js');  // Import the database connection

// SQL query to insert a new user into the users table
const insertUser = `
  INSERT INTO users (name, email)
  VALUES ($1, $2) 
  RETURNING *;
`;

const insertTestUser = async (name, email) => {
  try {
    const res = await pool.query(insertUser, [name, email]);  // Run the query with parameters
    console.log('Inserted user:', res.rows[0]);
  } catch (err) {
    console.error('Error inserting user:', err.stack);
  } finally {
    pool.end();  // Close the connection pool
  }
};

// Call the function with a sample user
insertTestUser('John Doe', 'john@example.com');
