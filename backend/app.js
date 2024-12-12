const express = require('express');
const app = express();

const pool = require('./config/databaseConfig.js');

// GET route to fetch users from the database and send to the client
app.get('/', (req, res, next) => {
    // Query the database for users
    pool.query('SELECT * FROM users', (err, result) => {  // 'result' will contain the query result
        if (err) {
            console.error('Database query error:', err.stack);
            res.status(500).json({
                status: 'error',
                message: 'Failed to fetch users from the database',
                error: err.message
            });
        } else {
            console.log('User Data:', result.rows);  // Log the fetched data (optional)
            // Send the fetched users data in the response
            res.status(200).json({
                status: 'success',
                message: 'Users fetched successfully',
                data: result.rows  // Send the array of user rows
            });
        }
    });
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
