-- Authentication Table (Stores User Information)
CREATE TABLE Authentication ( 
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    DOB DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
    college VARCHAR(100) NOT NULL,
    institute_roll_no VARCHAR(50) UNIQUE NOT NULL,
    primary_email VARCHAR(100) UNIQUE NOT NULL,
    personal_email VARCHAR(100),
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- Education Table (Normalized CGPA to a separate table)
CREATE TABLE Education (
    education_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Authentication(user_id) ON DELETE CASCADE,
    program VARCHAR(100) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    course_start_date DATE NOT NULL,
    course_end_date DATE NOT NULL,
    batch INT NOT NULL,
    uni_roll_no VARCHAR(50) UNIQUE NOT NULL,
    current_semester INT CHECK (current_semester BETWEEN 1 AND 8),
    school_10 VARCHAR(100) NOT NULL,
    board_10 VARCHAR(50) NOT NULL,
    cgpa_10 DECIMAL(3,2) CHECK (cgpa_10 BETWEEN 0 AND 10),
    start_date_10 DATE NOT NULL,
    end_date_10 DATE NOT NULL,
    school_12 VARCHAR(100),
    board_12 VARCHAR(50),
    cgpa_12 DECIMAL(3,2) CHECK (cgpa_12 BETWEEN 0 AND 10),
    start_date_12 DATE,
    end_date_12 DATE,
    gap_year_start DATE,
    gap_year_end DATE
);

-- CGPA Table (Storing CGPA for each semester separately for 3NF)
CREATE TABLE CGPA (
    cgpa_id SERIAL PRIMARY KEY,
    education_id INT REFERENCES Education(education_id) ON DELETE CASCADE,
    semester INT CHECK (semester BETWEEN 1 AND 8),
    cgpa DECIMAL(3,2) CHECK (cgpa BETWEEN 0 AND 10)
);

-- Internships Table
CREATE TABLE Internships (
    internship_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Authentication(user_id) ON DELETE CASCADE,
    company_name VARCHAR(100) NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    company_sector VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    stipend_salary DECIMAL(10,2) CHECK (stipend_salary >= 0)
);

-- Volunteering Table
CREATE TABLE Volunteering (
    volunteering_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Authentication(user_id) ON DELETE CASCADE,
    location VARCHAR(100) NOT NULL,
    company_sector VARCHAR(100) NOT NULL,
    task TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

-- Social Media Table
CREATE TABLE SocialMedia (
    social_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Authentication(user_id) ON DELETE CASCADE,
    linkedin VARCHAR(255),
    github VARCHAR(255),
    personal_website VARCHAR(255)
);

-- Skills Table
CREATE TABLE Skills (
    skill_id SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) UNIQUE NOT NULL,
    skill_type VARCHAR(50) CHECK (skill_type IN ('Language', 'Tech', 'Soft Skill', 'Subject'))
);

-- User Skills (Mapping between users and their skills)
CREATE TABLE User_Skills (
    user_id INT REFERENCES Authentication(user_id) ON DELETE CASCADE,
    skill_id INT REFERENCES Skills(skill_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, skill_id)
);

-- Projects Table
CREATE TABLE Projects (
    project_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Authentication(user_id) ON DELETE CASCADE,
    project_title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

-- Project Skills Mapping
CREATE TABLE Project_Skills (
    project_id INT REFERENCES Projects(project_id) ON DELETE CASCADE,
    skill_id INT REFERENCES Skills(skill_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, skill_id)
);

-- Companies Table (For job applications)
CREATE TABLE Companies (
    company_id SERIAL PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    sector VARCHAR(100) NOT NULL
);

-- Job Openings Table
CREATE TABLE Job_Openings (
    job_id SERIAL PRIMARY KEY,
    company_id INT REFERENCES Companies(company_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    job_functions TEXT,
    job_profile VARCHAR(100),
    ctc DECIMAL(10,2),
    required_skills TEXT,
    additional_info TEXT,
    attached_docs TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    application_deadline DATE
);

-- Job Eligibility Table
CREATE TABLE Job_Eligibility (
    job_id INT REFERENCES Job_Openings(job_id) ON DELETE CASCADE,
    course VARCHAR(100),
    min_cgpa DECIMAL(3,2),
    no_backlogs BOOLEAN,
    already_placed BOOLEAN,
    PRIMARY KEY (job_id, course)
);

-- Job Applications Table
CREATE TABLE Job_Applications (
    application_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Authentication(user_id) ON DELETE CASCADE,
    job_id INT REFERENCES Job_Openings(job_id) ON DELETE CASCADE,
    status VARCHAR(50) CHECK (status IN ('Applied', 'Yet to Apply', 'Not Interested', 'Withdrawn', 'Rejected', 'Offered', 'Offer Accepted', 'Offer Rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hiring Workflow Table
CREATE TABLE Hiring_Workflow (
    workflow_id SERIAL PRIMARY KEY,
    job_id INT REFERENCES Job_Openings(job_id) ON DELETE CASCADE,
    stage_name VARCHAR(100),
    venue VARCHAR(255),
    schedule TIMESTAMP
);

-- Search and Filtering
CREATE INDEX idx_job_category ON Job_Openings(category);
CREATE INDEX idx_job_profile ON Job_Openings(job_profile);
CREATE INDEX idx_job_ctc ON Job_Openings(ctc);
CREATE INDEX idx_job_deadline ON Job_Openings(application_deadline);

-- Resume Table
CREATE TABLE Resume (
    resume_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Authentication(user_id) ON DELETE CASCADE,
    resume_file BYTEA
);

INSERT INTO Authentication (first_name, last_name, DOB, gender, college, institute_roll_no, primary_email, personal_email, phone_number, password) VALUES
('Aarav', 'Sharma', '2002-05-10', 'Male', 'IIT Bombay', 'IITB20221001', 'aarav.sharma@iitb.ac.in', 'aarav.sharma@gmail.com', '9876543210', 'password123'),
('Ishita', 'Verma', '2001-09-15', 'Female', 'NIT Trichy', 'NITT20222002', 'ishita.verma@nitt.ac.in', 'ishita.verma@gmail.com', '9823456789', 'securePass456');


INSERT INTO Education (user_id, program, branch, course_start_date, course_end_date, batch, uni_roll_no, current_semester, school_10, board_10, cgpa_10, start_date_10, end_date_10, school_12, board_12, cgpa_12, start_date_12, end_date_12) VALUES
(1, 'B.Tech', 'Computer Science', '2020-08-01', '2024-05-30', 2024, 'IITB12345', 6, 'Delhi Public School', 'CBSE', 9.5, '2017-06-01', '2019-04-30', 'Modern School', 'CBSE', 9.2, '2019-06-01', '2021-04-30'),
(2, 'B.Tech', 'Electronics and Communication', '2019-08-01', '2023-05-30', 2023, 'NITT67890', 8, 'St. Xavier''s', 'ICSE', 9.3, '2016-06-01', '2018-04-30', 'DAV Public School', 'CBSE', 8.9, '2018-06-01', '2020-04-30');


INSERT INTO CGPA (education_id, semester, cgpa) VALUES
(1, 1, 9.1), (1, 2, 8.8), (1, 3, 8.5),
(2, 1, 8.7), (2, 2, 8.6), (2, 3, 8.4);


INSERT INTO Internships (user_id, company_name, job_title, location, company_sector, start_date, end_date, stipend_salary) VALUES
(1, 'Google India', 'Software Engineer Intern', 'Bangalore', 'Tech', '2023-06-01', '2023-09-30', 50000.00),
(2, 'TCS', 'Data Analyst Intern', 'Mumbai', 'IT', '2022-05-01', '2022-08-30', 30000.00);


INSERT INTO Volunteering (user_id, location, company_sector, task, start_date, end_date) VALUES
(1, 'Mumbai', 'Education', 'Teaching underprivileged kids', '2022-06-01', '2022-12-30'),
(2, 'Delhi', 'Social Work', 'Planting trees in urban areas', '2023-01-01', '2023-06-30');


INSERT INTO SocialMedia (user_id, linkedin, github, personal_website) VALUES
(1, 'https://linkedin.com/in/aaravsharma', 'https://github.com/aaravsharma', 'https://aaravsharma.dev'),
(2, 'https://linkedin.com/in/ishitaverma', 'https://github.com/ishitaverma', 'https://ishitaverma.me');


INSERT INTO Skills (skill_name, skill_type) VALUES
('Python', 'Language'), ('Java', 'Language'), ('Machine Learning', 'Tech'), ('Public Speaking', 'Soft Skill');


INSERT INTO User_Skills (user_id, skill_id) VALUES
(1, 1), (1, 3), (2, 2), (2, 4);


INSERT INTO Projects (user_id, project_title, description, tech_stack, start_date, end_date) VALUES
(1, 'AI Chatbot', 'A chatbot for customer support', 'Python, TensorFlow', '2022-09-01', '2022-12-30'),
(2, 'IoT Home Automation', 'Smart home system with IoT sensors', 'Arduino, C++', '2023-03-01', '2023-06-30');


INSERT INTO Companies (company_name, sector) VALUES
('Microsoft India', 'Tech'), ('Infosys', 'IT');


INSERT INTO Job_Openings (company_id, title, category, job_functions, job_profile, ctc, required_skills, additional_info, attached_docs, application_deadline) VALUES
(1, 'Software Engineer', 'Engineering', 'Develop software solutions', 'Full Stack Developer', 2500000.00, 'Python, Java, React', 'Work from home available', NULL, '2025-01-31'),
(2, 'Data Scientist', 'Analytics', 'Analyze large datasets', 'Data Analyst', 2000000.00, 'SQL, Python, Machine Learning', 'Hybrid model', NULL, '2024-12-31');


INSERT INTO Job_Eligibility (job_id, course, min_cgpa, no_backlogs, already_placed) VALUES
(1, 'B.Tech Computer Science', 7.5, TRUE, FALSE),
(2, 'B.Tech Electronics', 7.0, TRUE, FALSE);


INSERT INTO Job_Applications (user_id, job_id, status) VALUES
(1, 1, 'Applied'), (2, 2, 'Offered');


INSERT INTO Hiring_Workflow (job_id, stage_name, venue, schedule) VALUES
(1, 'Online Test', 'Virtual', '2024-10-10 10:00:00'),
(2, 'HR Interview', 'Company Office', '2024-11-15 14:00:00');


INSERT INTO Resume (user_id, resume_file) VALUES
(1, NULL),
(2, NULL);


SELECT * FROM Authentication;
SELECT * FROM Education;
SELECT * FROM CGPA;
SELECT * FROM Internships;
SELECT * FROM Volunteering;
SELECT * FROM SocialMedia;
SELECT * FROM Skills;
SELECT * FROM User_Skills;
SELECT * FROM Projects;
SELECT * FROM Project_Skills;
SELECT * FROM Companies;
SELECT * FROM Job_Openings;
SELECT * FROM Job_Eligibility;
SELECT * FROM Job_Applications;
SELECT * FROM Hiring_Workflow;
SELECT * FROM Resume;