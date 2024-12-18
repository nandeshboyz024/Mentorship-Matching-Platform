const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const pool = require('./config/databaseConfig.js');

app.use(cors());
app.use(express.json());

app.post('/create_account', async (req, res) => {
    try{
        const { firstName, lastName, username, email, password, role } = req.body;
        const checkUserQuery = 'SELECT * FROM users WHERE username = $1';
        const checkUserResult = await pool.query(checkUserQuery,[username]);

        if (checkUserResult.rows.length > 0) {
            return res.json({
                success: false,
                message: 'Username already exists.'
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password,saltRounds);

        const insertQuery = `
            INSERT INTO users (first_name, last_name, username, email, password, role) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
        `;
        const result = await pool.query(insertQuery, [firstName, lastName, username, email, hashedPassword, role]);
        
        const userBioQuery = `INSERT INTO bios (username, bio) VALUES ($1, $2)`;
        const userSkillQuery = `INSERT INTO skills (username) VALUES ($1)`;
        await pool.query(userBioQuery,[username,""]);
        await pool.query(userSkillQuery,[username]);
        return res.json({
            success: true,
            message: 'User account created successfully',
            data: result.rows[0]
        });
    } catch (err) {
        // console.error('Error in creating account');
        return res.status(500).json({
            status: 'error',
            message: 'Failed to create user account',
        });
    }
});

app.post('/find-user', async (req, res) => {
    try {
        const { username, password } = req.body;
        const userQuery = 'SELECT * FROM users WHERE username = $1';
        const bioQuery = 'SELECT bio FROM bios WHERE username = $1';
        const skillsQuery = 'SELECT * FROM skills WHERE username = $1';
        const userResult = await pool.query(userQuery, [username]);
        const bioResult = await pool.query(bioQuery, [username]);
        const skillsResult = await pool.query(skillsQuery, [username]);

        if (userResult.rows.length > 0 && bioResult.rows.length > 0 && skillsResult.rows.length > 0) {
            const user = userResult.rows[0];
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch){
                return res.json({
                    success: false,
                    message:'Invalid username or password'
                });
            }
            const bio = bioResult.rows[0].bio
            const skills = {
                isPython:skillsResult.rows[0].python,
                isJava: skillsResult.rows[0].java,
                isC:skillsResult.rows[0].c,
                isCPlusPlus:skillsResult.rows[0].cplusplus,
                isJavaScript:skillsResult.rows[0].javascript,
                isSQL:skillsResult.rows[0].sql,
                isHtml:skillsResult.rows[0].html,
                isCss:skillsResult.rows[0].css,
                isReactJs:skillsResult.rows[0].react,
                isNodeJs:skillsResult.rows[0].nodejs,
                isDjango:skillsResult.rows[0].django,
                isFlask:skillsResult.rows[0].flask,
                isAndroid:skillsResult.rows[0].android,
                isIOS:skillsResult.rows[0].ios,
                isFlutter:skillsResult.rows[0].flutter,
                isMachineLearning:skillsResult.rows[0].machine_learning,
                isDataAnalytics:skillsResult.rows[0].data_analytics,
                isDeepLearning:skillsResult.rows[0].deep_learning,
                isDocker:skillsResult.rows[0].docker,
                isKubernetes:skillsResult.rows[0].kubernetes,
                isAws:skillsResult.rows[0].aws,
                isAzure:skillsResult.rows[0].azure,
                isGit:skillsResult.rows[0].git,
                isGitHub:skillsResult.rows[0].github
            };
            return res.json({
                success: true,
                message: 'User found',
                user: user,
                bio: bio,
                skills: skills
            });
        } else {
            return res.json({
                success: false,
                message: 'Invalid username or password',
            });
        }
    } catch (err) {
        // console.error('Error in finding user', err);
        return res.json({
            success: false,
            message: 'Error occurred while fetching user data',
        });
    }
});

app.put('/update-user-bio', async (req, res) => {
    const { username, bio } = req.body;
    try {
        const updateBioQuery = 'UPDATE bios SET bio = $1 WHERE username = $2 RETURNING *';
        const result = await pool.query(updateBioQuery, [bio, username]);

        if (result.rows.length > 0){
            return res.json({
                success: true,
                message: 'Bio updated successfully.'
            });
        } else {
            return res.json({
                success: false,
                message: 'User not found.',
            });
        }
    } catch (err) {
        // console.error('Error updating bio:', err);
        return res.json({
            success: false,
            message: 'Failed to update bio.',
        });
    }
});

app.put('/update-user-skills', async (req, res) => {
    const { username, skills } = req.body;
    try {
        const updateBioQuery = 'UPDATE skills SET python = $2, java = $3, c = $4, cplusplus = $5, javascript = $6, sql = $7, html = $8, css = $9, react = $10, nodejs = $11, django = $12, flask = $13, android = $14, ios = $15, flutter = $16, machine_learning = $17, data_analytics = $18, deep_learning = $19, docker = $20, kubernetes = $21, aws = $22, azure = $23, git = $24, github = $25 WHERE username = $1 RETURNING *';
        const result = await pool.query(updateBioQuery, [username, skills.isPython, skills.isJava, skills.isC, skills.isCPlusPlus, skills.isJavaScript, skills.isSQL, skills.isHtml, skills.isCss, skills.isReactJs, skills.isNodeJs, skills.isDjango, skills.isFlask, skills.isAndroid, skills.isIOS, skills.isFlutter, skills.isMachineLearning,  skills.isDataAnalytics, skills.isDeepLearning, skills.isDocker, skills.isKubernetes, skills.isAws, skills.isAzure, skills.isGit, skills.isGitHub]);
        if (result.rows.length > 0){
            return res.json({
                success: true,
                message: 'Skills updated successfully.'
            });
        } else {
            return res.json({
                success: false,
                message: 'User not found.',
            });
        }
    } catch (err) {
        // console.error('Error updating bio:', err);
        return res.json({
            success: false,
            message: 'Failed to update bio.',
        });
    }
});

app.post('/get_mentor', async (req, res) => {
    try {
        const { mentee_username } = req.body;

        const getMentorsQuery = `
            SELECT u.username
            FROM users u
            WHERE u.role = 'mentor'
            AND NOT EXISTS (
                SELECT 1
                FROM requests r
                WHERE r.mentor_username = u.username
                AND r.mentee_username = $1
            );
        `;

        const mentorsResult = await pool.query(getMentorsQuery, [mentee_username]);

        if (mentorsResult.rows.length > 0) {
            const mentors = mentorsResult.rows;
            const mentorDetails = [];

            // For each mentor, get their corresponding skills
            for (const mentor of mentors) {
                const skillsQuery = 'SELECT * FROM skills WHERE username = $1';
                const skillsResult = await pool.query(skillsQuery, [mentor.username]);

                if (skillsResult.rows.length > 0) {
                    const skills = skillsResult.rows[0];
                    mentorDetails.push({
                        username: mentor.username,
                        skills: {
                            isPython: skills.python,
                            isJava: skills.java,
                            isC: skills.c,
                            isCPlusPlus: skills.cplusplus,
                            isJavaScript: skills.javascript,
                            isSQL: skills.sql,
                            isHtml: skills.html,
                            isCss: skills.css,
                            isReactJs: skills.react,
                            isNodeJs: skills.nodejs,
                            isDjango: skills.django,
                            isFlask: skills.flask,
                            isAndroid: skills.android,
                            isIOS: skills.ios,
                            isFlutter: skills.flutter,
                            isMachineLearning: skills.machine_learning,
                            isDataAnalytics: skills.data_analytics,
                            isDeepLearning: skills.deep_learning,
                            isDocker: skills.docker,
                            isKubernetes: skills.kubernetes,
                            isAws: skills.aws,
                            isAzure: skills.azure,
                            isGit: skills.git,
                            isGitHub: skills.github
                        }
                    });
                }
            }

            return res.json({
                success: true,
                message: 'Mentors and their skills fetched successfully',
                mentors: mentorDetails
            });
        } else {
            return res.json({
                success: false,
                message: 'No mentors available or all mentors are already requested by the user.'
            });
        }
    } catch (err) {
        // console.error('Error fetching mentors and skills:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch mentors and skills.'
        });
    }
});

app.post('/create_request', async (req, res) => {
    try {
        const { mentee_username, mentor_username } = req.body;

        const insertRequestQuery = `
            INSERT INTO requests (mentor_username, mentee_username, status)
            VALUES ($1, $2, $3) RETURNING *;
        `;
        const result = await pool.query(insertRequestQuery, [mentor_username, mentee_username, 'pending']);
        let message = `You received a request from ${mentee_username}`;
        const notificationQuery = `
            INSERT INTO notifications VALUES ($1, $2) RETURNING *;
        `;
        const notify = await pool.query(notificationQuery,[mentor_username,message]);  
        return res.json({
            success: true,
            message: 'Request sent successfully!',
            request: result.rows[0]
        });
    } catch (err) {
        // console.error('Error creating request:', err);
        return res.json({
            success: false,
            message: 'Failed to create the request.'
        });
    }
});

app.post('/request-status-for-mentee', async (req, res) => {
    try {
        const { mentee_username } = req.body;

        const getMentorsQuery = `
            SELECT mentor_username, status
            FROM requests
            WHERE mentee_username = $1 AND status = 'pending';
        `;

        const mentorsResult = await pool.query(getMentorsQuery, [mentee_username]);

        if (mentorsResult.rows.length > 0) {
            const mentors = mentorsResult.rows.map(row => ({
                mentor_username: row.mentor_username,
                status: row.status
            }));

            return res.json({
                success: true,
                message: 'Mentors fetched successfully.',
                mentors: mentors
            });
        } else {
            return res.json({
                success: false,
                message: 'No request found.'
            });
        }
    } catch (err) {
        // console.error('Error fetching mentors:', err);
        return res.json({
            success: false,
            message: 'Failed to fetch mentors.'
        });
    }
});

app.post('/request-status-for-mentor', async (req, res) => {
    try {
        const { mentor_username } = req.body;

        const getMentorsQuery = `
            SELECT mentee_username, status
            FROM requests
            WHERE mentor_username = $1 AND status = 'pending';
        `;

        const menteesResult = await pool.query(getMentorsQuery, [mentor_username]);

        if (menteesResult.rows.length > 0) {
            const mentees = menteesResult.rows.map(row => ({
                mentee_username: row.mentee_username,
                status: row.status
            }));

            return res.json({
                success: true,
                message: 'Mentees fetched successfully.',
                mentees: mentees
            });
        } else {
            return res.json({
                success: false,
                message: 'No request found.'
            });
        }
    } catch (err) {
        // console.error('Error fetching mentees:', err);
        return res.json({
            success: false,
            message: 'Failed to fetch mentees.'
        });
    }
});

app.post('/accepted-request-for-mentee', async (req, res) => {
    try {
        const { mentee_username } = req.body;

        const getMentorsQuery = `
            SELECT mentor_username, status
            FROM requests
            WHERE mentee_username = $1 AND status = 'accepted';
        `;

        const mentorsResult = await pool.query(getMentorsQuery, [mentee_username]);

        if (mentorsResult.rows.length > 0) {
            const mentors = mentorsResult.rows.map(row => ({
                mentor_username: row.mentor_username,
                status: row.status
            }));

            return res.json({
                success: true,
                message: 'Mentors fetched successfully.',
                mentors: mentors
            });
        } else {
            return res.json({
                success: false,
                message: 'No mentors found.'
            });
        }
    } catch (err) {
        // console.error('Error fetching mentors:', err);
        return res.json({
            success: false,
            message: 'Failed to fetch mentors.'
        });
    }
});


app.post('/accepted-request-for-mentor', async (req, res) => {
    try {
        const { mentor_username } = req.body;

        const getMenteesQuery = `
            SELECT mentee_username, status
            FROM requests
            WHERE mentor_username = $1 AND status = 'accepted';
        `;

        const menteesResult = await pool.query(getMenteesQuery, [mentor_username]);

        if (menteesResult.rows.length > 0) {
            const mentees = menteesResult.rows.map(row => ({
                mentee_username: row.mentee_username,
                status: row.status
            }));

            return res.json({
                success: true,
                message: 'Mentees fetched successfully.',
                mentees: mentees
            });
        } else {
            return res.json({
                success: false,
                message: 'No mentee found.'
            });
        }
    } catch (err) {
        // console.error('Error fetching mentees:', err);
        return res.json({
            success: false,
            message: 'Failed to fetch mentees.'
        });
    }
});

app.delete('/delete-request', async (req, res) => {
    
    try {
        const { mentee_username, mentor_username, notify_to, message } = req.query;
        const deleteRequestQuery = `
            DELETE FROM requests
            WHERE mentor_username = $1 AND mentee_username = $2 RETURNING *;
        `;
        const result = await pool.query(deleteRequestQuery, [mentor_username, mentee_username]);

        

        if (result.rowCount > 0) {
            const notificationQuery = `
            INSERT INTO notifications VALUES ($1, $2) RETURNING *;
            `;
            await pool.query(notificationQuery,[notify_to,message]); 
            
            return res.json({
                success: true,
                message: 'Request deleted successfully!',
            });
        } else {
            return res.json({
                success: false,
                message: 'No matching request found to delete.',
            });
        }
    } catch (err) {
        // console.error('Error deleting request:', err);
        return res.json({
            success: false,
            message: 'Failed to delete the request.',
        });
    }
});


app.put('/accept-request', async (req, res) => {
    const { mentee_username, mentor_username, notify_to, message } = req.body;
    try {
        const acceptRequestQuery = `UPDATE requests SET status = 'accepted' WHERE mentee_username = $1 AND mentor_username = $2 RETURNING *`;
        const result = await pool.query(acceptRequestQuery, [mentee_username,mentor_username]);


        if (result.rows.length > 0){
            const notificationQuery = `
            INSERT INTO notifications VALUES ($1, $2) RETURNING *;
            `;
            await pool.query(notificationQuery,[notify_to,message]); 
            return res.json({
                success: true,
                message: 'Skills updated successfully.'
            });
        } else {
            return res.json({
                success: false,
                message: 'request not found.',
            });
        }
    } catch (err) {
        // console.error('Error in accepting request:', err);
        return res.json({
            success: false,
            message: 'Failed to accept the request.',
        });
    }
});

app.get('/get_all_users', async (req, res) => {
    const {skill}  = req.query;
    try {
        if(skill==='all'){
            const AllUserQuery = `SELECT username, first_name, last_name, role FROM users`;
            const result = await pool.query(AllUserQuery);
            if (result.rows.length > 0) {
                return res.json({
                    success: true,
                    data: result.rows
                });
            } else {
                return res.json({
                    success: true,
                    data: []
                });
            }
        }
        else{
            const skillUserQuery = `SELECT u.username, u.first_name, u.last_name, u.role
                FROM users AS u
                JOIN skills AS s ON s.username = u.username
                WHERE s.${skill} = true;
                `;
            const result = await pool.query(skillUserQuery);
            if (result.rows.length > 0) {
                return res.json({
                    success: true,
                    data: result.rows
                });
            } else {
                return res.json({
                    success: true,
                    data: []
                });
            }
        }
    } catch (err) {
        // console.error('Error in getting all users:', err);
        return res.json({
            success: false,
            message: 'Error in getting all users'
        });
    }
});

app.get('/get-user',async(req,res)=>{
    const {username}  = req.query;
    try{
        const userQuery = 'SELECT * FROM users WHERE username = $1';
        const bioQuery = 'SELECT bio FROM bios WHERE username = $1';
        const skillsQuery = 'SELECT * FROM skills WHERE username = $1';
        const userResult = await pool.query(userQuery, [username]);
        const bioResult = await pool.query(bioQuery, [username]);
        const skillsResult = await pool.query(skillsQuery, [username]);

        if (userResult.rows.length > 0 && bioResult.rows.length > 0 && skillsResult.rows.length > 0) {
            const user = userResult.rows[0];
            const bio = bioResult.rows[0].bio
            const skills = {
                isPython:skillsResult.rows[0].python,
                isJava: skillsResult.rows[0].java,
                isC:skillsResult.rows[0].c,
                isCPlusPlus:skillsResult.rows[0].cplusplus,
                isJavaScript:skillsResult.rows[0].javascript,
                isSQL:skillsResult.rows[0].sql,
                isHtml:skillsResult.rows[0].html,
                isCss:skillsResult.rows[0].css,
                isReactJs:skillsResult.rows[0].react,
                isNodeJs:skillsResult.rows[0].nodejs,
                isDjango:skillsResult.rows[0].django,
                isFlask:skillsResult.rows[0].flask,
                isAndroid:skillsResult.rows[0].android,
                isIOS:skillsResult.rows[0].ios,
                isFlutter:skillsResult.rows[0].flutter,
                isMachineLearning:skillsResult.rows[0].machine_learning,
                isDataAnalytics:skillsResult.rows[0].data_analytics,
                isDeepLearning:skillsResult.rows[0].deep_learning,
                isDocker:skillsResult.rows[0].docker,
                isKubernetes:skillsResult.rows[0].kubernetes,
                isAws:skillsResult.rows[0].aws,
                isAzure:skillsResult.rows[0].azure,
                isGit:skillsResult.rows[0].git,
                isGitHub:skillsResult.rows[0].github
            };
            return res.json({
                success: true,
                message: 'User found',
                user: user,
                bio: bio,
                skills: skills
            });
        } else {
            return res.json({
                success: false,
                message: 'Invalid username',
            });
        }
    }
    catch(err){
        return res.json({
            success:false,
            message:'Error in fetching data of the user'
        })
    }
});


app.get('/get-and-delete-notifications', async (req, res) => {
    const { username } = req.query;
    try {
        const fetchNotificationsQuery = 'SELECT * FROM notifications WHERE username = $1';
        const fetchResult = await pool.query(fetchNotificationsQuery, [username]);

        if (fetchResult.rows.length === 0) {
            return res.json({
                success: false,
                message: 'No notifications found'
            });
        }
        const deleteNotificationsQuery = 'DELETE FROM notifications WHERE username = $1 RETURNING *';
        const deleteResult = await pool.query(deleteNotificationsQuery, [username]);

        return res.json({
            success: true,
            message: 'Notifications fetched and deleted successfully',
            deletedNotifications: deleteResult.rows
        });
    } catch (err) {
        // console.error('Error in fetching and deleting notifications:', err);
        return res.json({
            success: false,
            message: 'Error in fetching and deleting notifications',
        });
    }
});


app.delete('/delete_account', async (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.json({
            success: false,
            message: 'Username is required'
        });
    }
    const deleteQuery = 'DELETE FROM users WHERE username = $1 RETURNING *';
    try {
        const result = await pool.query(deleteQuery, [username]);
        if (result.rowCount === 0) {
            return res.json({ 
                success: false,
                message: 'User not found'
            });
        }
        return res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (err) {
        // console.error('Error deleting account:', err);
        return res.json({
            success: false,
            message: 'Error deleting account'
        });
    }
});

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
