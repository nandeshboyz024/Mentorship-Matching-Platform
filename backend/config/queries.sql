CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(100) PRIMARY KEY,
    password VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    role VARCHAR(10) NOT NULL CHECK (role IN ('mentor', 'mentee'))
);

INSERT INTO users (username, password, email, first_name, last_name, role) VALUES ('user2','password2','email2.@gmail.com','first2','last2','ment');


CREATE TABLE IF NOT EXISTS skills(
    username VARCHAR(100) PRIMARY KEY,
	c BOOLEAN DEFAULT FALSE,
    cplusplus BOOLEAN DEFAULT FALSE,
    python BOOLEAN DEFAULT FALSE,
    javascript BOOLEAN DEFAULT FALSE,
    java BOOLEAN DEFAULT FALSE,
    sql BOOLEAN DEFAULT FALSE,
	html BOOLEAN DEFAULT FALSE,
	css BOOLEAN DEFAULT FALSE,
    react BOOLEAN DEFAULT FALSE,
    nodejs BOOLEAN DEFAULT FALSE,
	flask BOOLEAN DEFAULT FALSE,
	django BOOLEAN DEFAULT FALSE,
	android BOOLEAN DEFAULT FALSE,
	ios BOOLEAN DEFAULT FALSE,
	flutter BOOLEAN DEFAULT FALSE,
	machine_learning BOOLEAN DEFAULT FALSE,
	data_analytics BOOLEAN DEFAULT FALSE,
	deep_learning BOOLEAN DEFAULT FALSE,
	docker BOOLEAN DEFAULT FALSE,
	kubernetes BOOLEAN DEFAULT FALSE,
	aws BOOLEAN DEFAULT FALSE,
	azure BOOLEAN DEFAULT FALSE,
	git BOOLEAN DEFAULT FALSE,
	github BOOLEAN DEFAULT FALSE
);

INSERT INTO skills (username, c, cplusplus, python, javascript, java, sql, html, css, react, nodejs, flask, django, android, ios, flutter, machine_learning, data_analytics, deep_learning, docker, kubernetes, aws, azure, git, github) VALUES ('user1',TRUE,TRUE,TRUE,FALSE,FALSE,TRUE,TRUE,TRUE,TRUE, TRUE, TRUE, TRUE, TRUE,FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, TRUE);


CREATE TABLE IF NOT EXISTS interests(
    username VARCHAR(100) PRIMARY KEY,
	programming_language BOOLEAN DEFAULT FALSE,
    web_development BOOLEAN DEFAULT FALSE,
    mobile_development BOOLEAN DEFAULT FALSE,
    data_science BOOLEAN DEFAULT FALSE,
    devops BOOLEAN DEFAULT FALSE,
    version_control BOOLEAN DEFAULT FALSE
);

INSERT INTO interests (username) VALUES ('user2');

CREATE TABLE IF NOT EXISTS mentorship (
    mentor_username VARCHAR(100) NOT NULL,
    mentee_username VARCHAR(100) NOT NULL,
    PRIMARY KEY (mentor_username, mentee_username),
    FOREIGN KEY (mentor_username) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY (mentee_username) REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS requests (
    mentor_username VARCHAR(100),
	mentee_username VARCHAR(100),
	PRIMARY KEY (mentor_username, mentee_username),
	FOREIGN KEY (mentor_username) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY (mentee_username) REFERENCES users(username) ON DELETE CASCADE
);


ALTER TABLE skills
ADD CONSTRAINT fk_username
FOREIGN KEY (username)
REFERENCES users(username)
ON DELETE CASCADE;

ALTER TABLE requests
ADD COLUMN status VARCHAR(10) DEFAULT 'pending',
ADD CONSTRAINT status_check
CHECK (status IN ('pending', 'accepted'));


WITH table1 AS(
	SELECT mentor_username
	FROM requests
	WHERE mentee_username = 'my_user_name' 
)

SELECT users.username
FROM users
LEFT JOIN table1 ON users.username = table1.mentor_username
where users.role='mentor' AND table1.mentor_username IS NULL;


SELECT u.username
FROM users u
WHERE u.role = 'mentor'
AND NOT EXISTS (
    SELECT 1
    FROM requests r
    WHERE r.mentor_username = u.username
    AND r.mentee_username = 'satyamg21'
);

SELECT u.username, u.first_name, u.last_name, u.role, s.python
FROM users AS u
JOIN skills AS s ON s.username = u.username
WHERE s.python=true;
