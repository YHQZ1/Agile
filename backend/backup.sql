--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: authentication; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authentication (
    primary_email character varying(255) NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.authentication OWNER TO postgres;

--
-- Name: personal_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personal_details (
    user_id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    dob date NOT NULL,
    gender character varying(10),
    college character varying(100) NOT NULL,
    institute_roll_no character varying(50) NOT NULL,
    personal_email character varying(100),
    phone_number character varying(15) NOT NULL,
    CONSTRAINT authentication_gender_check CHECK (((gender)::text = ANY ((ARRAY['Male'::character varying, 'Female'::character varying, 'Other'::character varying])::text[])))
);


ALTER TABLE public.personal_details OWNER TO postgres;

--
-- Name: authentication_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.authentication_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.authentication_user_id_seq OWNER TO postgres;

--
-- Name: authentication_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.authentication_user_id_seq OWNED BY public.personal_details.user_id;


--
-- Name: cgpa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cgpa (
    cgpa_id integer NOT NULL,
    education_id integer,
    semester integer,
    cgpa numeric(3,2),
    CONSTRAINT cgpa_cgpa_check CHECK (((cgpa >= (0)::numeric) AND (cgpa <= (10)::numeric))),
    CONSTRAINT cgpa_semester_check CHECK (((semester >= 1) AND (semester <= 8)))
);


ALTER TABLE public.cgpa OWNER TO postgres;

--
-- Name: cgpa_cgpa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cgpa_cgpa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cgpa_cgpa_id_seq OWNER TO postgres;

--
-- Name: cgpa_cgpa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cgpa_cgpa_id_seq OWNED BY public.cgpa.cgpa_id;


--
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    company_id integer NOT NULL,
    company_name character varying(100) NOT NULL,
    sector character varying(100) NOT NULL
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- Name: companies_company_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.companies_company_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.companies_company_id_seq OWNER TO postgres;

--
-- Name: companies_company_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.companies_company_id_seq OWNED BY public.companies.company_id;


--
-- Name: education; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.education (
    education_id integer NOT NULL,
    user_id integer,
    program character varying(100) NOT NULL,
    branch character varying(100) NOT NULL,
    course_start_date date NOT NULL,
    course_end_date date NOT NULL,
    batch integer NOT NULL,
    uni_roll_no character varying(50) NOT NULL,
    current_semester integer,
    school_10 character varying(100) NOT NULL,
    board_10 character varying(50) NOT NULL,
    cgpa_10 numeric(3,2),
    start_date_10 date NOT NULL,
    end_date_10 date NOT NULL,
    school_12 character varying(100),
    board_12 character varying(50),
    cgpa_12 numeric(3,2),
    start_date_12 date,
    end_date_12 date,
    gap_year_start date,
    gap_year_end date,
    CONSTRAINT education_cgpa_10_check CHECK (((cgpa_10 >= (0)::numeric) AND (cgpa_10 <= (10)::numeric))),
    CONSTRAINT education_cgpa_12_check CHECK (((cgpa_12 >= (0)::numeric) AND (cgpa_12 <= (10)::numeric))),
    CONSTRAINT education_current_semester_check CHECK (((current_semester >= 1) AND (current_semester <= 8)))
);


ALTER TABLE public.education OWNER TO postgres;

--
-- Name: education_education_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.education_education_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.education_education_id_seq OWNER TO postgres;

--
-- Name: education_education_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.education_education_id_seq OWNED BY public.education.education_id;


--
-- Name: hiring_workflow; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hiring_workflow (
    workflow_id integer NOT NULL,
    job_id integer,
    stage_name character varying(100),
    venue character varying(255),
    schedule timestamp without time zone
);


ALTER TABLE public.hiring_workflow OWNER TO postgres;

--
-- Name: hiring_workflow_workflow_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hiring_workflow_workflow_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hiring_workflow_workflow_id_seq OWNER TO postgres;

--
-- Name: hiring_workflow_workflow_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hiring_workflow_workflow_id_seq OWNED BY public.hiring_workflow.workflow_id;


--
-- Name: internships; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.internships (
    internship_id integer NOT NULL,
    user_id integer,
    company_name character varying(100) NOT NULL,
    job_title character varying(100) NOT NULL,
    location character varying(100) NOT NULL,
    company_sector character varying(100) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    stipend_salary numeric(10,2),
    CONSTRAINT internships_stipend_salary_check CHECK ((stipend_salary >= (0)::numeric))
);


ALTER TABLE public.internships OWNER TO postgres;

--
-- Name: internships_internship_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.internships_internship_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.internships_internship_id_seq OWNER TO postgres;

--
-- Name: internships_internship_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.internships_internship_id_seq OWNED BY public.internships.internship_id;


--
-- Name: job_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_applications (
    application_id integer NOT NULL,
    user_id integer,
    job_id integer,
    status character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT job_applications_status_check CHECK (((status)::text = ANY ((ARRAY['Applied'::character varying, 'Yet to Apply'::character varying, 'Not Interested'::character varying, 'Withdrawn'::character varying, 'Rejected'::character varying, 'Offered'::character varying, 'Offer Accepted'::character varying, 'Offer Rejected'::character varying])::text[])))
);


ALTER TABLE public.job_applications OWNER TO postgres;

--
-- Name: job_applications_application_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.job_applications_application_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.job_applications_application_id_seq OWNER TO postgres;

--
-- Name: job_applications_application_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.job_applications_application_id_seq OWNED BY public.job_applications.application_id;


--
-- Name: job_eligibility; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_eligibility (
    job_id integer NOT NULL,
    course character varying(100) NOT NULL,
    min_cgpa numeric(3,2),
    no_backlogs boolean,
    already_placed boolean
);


ALTER TABLE public.job_eligibility OWNER TO postgres;

--
-- Name: job_openings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_openings (
    job_id integer NOT NULL,
    company_id integer,
    title character varying(255) NOT NULL,
    category character varying(100),
    job_functions text,
    job_profile character varying(100),
    ctc numeric(10,2),
    required_skills text,
    additional_info text,
    attached_docs text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    application_deadline date
);


ALTER TABLE public.job_openings OWNER TO postgres;

--
-- Name: job_openings_job_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.job_openings_job_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.job_openings_job_id_seq OWNER TO postgres;

--
-- Name: job_openings_job_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.job_openings_job_id_seq OWNED BY public.job_openings.job_id;


--
-- Name: project_skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_skills (
    project_id integer NOT NULL,
    skill_id integer NOT NULL
);


ALTER TABLE public.project_skills OWNER TO postgres;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    project_id integer NOT NULL,
    user_id integer,
    project_title character varying(255) NOT NULL,
    description text NOT NULL,
    tech_stack text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: projects_project_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projects_project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_project_id_seq OWNER TO postgres;

--
-- Name: projects_project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_project_id_seq OWNED BY public.projects.project_id;


--
-- Name: resume; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resume (
    resume_id integer NOT NULL,
    user_id integer,
    resume_file bytea
);


ALTER TABLE public.resume OWNER TO postgres;

--
-- Name: resume_resume_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.resume_resume_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resume_resume_id_seq OWNER TO postgres;

--
-- Name: resume_resume_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.resume_resume_id_seq OWNED BY public.resume.resume_id;


--
-- Name: skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skills (
    skill_id integer NOT NULL,
    skill_name character varying(100) NOT NULL,
    skill_type character varying(50),
    CONSTRAINT skills_skill_type_check CHECK (((skill_type)::text = ANY ((ARRAY['Language'::character varying, 'Tech'::character varying, 'Soft Skill'::character varying, 'Subject'::character varying])::text[])))
);


ALTER TABLE public.skills OWNER TO postgres;

--
-- Name: skills_skill_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.skills_skill_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.skills_skill_id_seq OWNER TO postgres;

--
-- Name: skills_skill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.skills_skill_id_seq OWNED BY public.skills.skill_id;


--
-- Name: socialmedia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.socialmedia (
    social_id integer NOT NULL,
    user_id integer,
    linkedin character varying(255),
    github character varying(255),
    personal_website character varying(255)
);


ALTER TABLE public.socialmedia OWNER TO postgres;

--
-- Name: socialmedia_social_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.socialmedia_social_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.socialmedia_social_id_seq OWNER TO postgres;

--
-- Name: socialmedia_social_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.socialmedia_social_id_seq OWNED BY public.socialmedia.social_id;


--
-- Name: user_skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_skills (
    user_id integer NOT NULL,
    skill_id integer NOT NULL
);


ALTER TABLE public.user_skills OWNER TO postgres;

--
-- Name: volunteering; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.volunteering (
    volunteering_id integer NOT NULL,
    user_id integer,
    location character varying(100) NOT NULL,
    company_sector character varying(100) NOT NULL,
    task text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL
);


ALTER TABLE public.volunteering OWNER TO postgres;

--
-- Name: volunteering_volunteering_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.volunteering_volunteering_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.volunteering_volunteering_id_seq OWNER TO postgres;

--
-- Name: volunteering_volunteering_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.volunteering_volunteering_id_seq OWNED BY public.volunteering.volunteering_id;


--
-- Name: cgpa cgpa_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cgpa ALTER COLUMN cgpa_id SET DEFAULT nextval('public.cgpa_cgpa_id_seq'::regclass);


--
-- Name: companies company_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies ALTER COLUMN company_id SET DEFAULT nextval('public.companies_company_id_seq'::regclass);


--
-- Name: education education_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.education ALTER COLUMN education_id SET DEFAULT nextval('public.education_education_id_seq'::regclass);


--
-- Name: hiring_workflow workflow_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hiring_workflow ALTER COLUMN workflow_id SET DEFAULT nextval('public.hiring_workflow_workflow_id_seq'::regclass);


--
-- Name: internships internship_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.internships ALTER COLUMN internship_id SET DEFAULT nextval('public.internships_internship_id_seq'::regclass);


--
-- Name: job_applications application_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_applications ALTER COLUMN application_id SET DEFAULT nextval('public.job_applications_application_id_seq'::regclass);


--
-- Name: job_openings job_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_openings ALTER COLUMN job_id SET DEFAULT nextval('public.job_openings_job_id_seq'::regclass);


--
-- Name: personal_details user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_details ALTER COLUMN user_id SET DEFAULT nextval('public.authentication_user_id_seq'::regclass);


--
-- Name: projects project_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN project_id SET DEFAULT nextval('public.projects_project_id_seq'::regclass);


--
-- Name: resume resume_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resume ALTER COLUMN resume_id SET DEFAULT nextval('public.resume_resume_id_seq'::regclass);


--
-- Name: skills skill_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills ALTER COLUMN skill_id SET DEFAULT nextval('public.skills_skill_id_seq'::regclass);


--
-- Name: socialmedia social_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.socialmedia ALTER COLUMN social_id SET DEFAULT nextval('public.socialmedia_social_id_seq'::regclass);


--
-- Name: volunteering volunteering_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.volunteering ALTER COLUMN volunteering_id SET DEFAULT nextval('public.volunteering_volunteering_id_seq'::regclass);


--
-- Data for Name: authentication; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.authentication (primary_email, password) FROM stdin;
user@example.com	$2b$10$s46VhF1zPfv0cjG5y04grukVfSoTgBStgnqoliPicZbXvk8ZGsJBW
trevor@123	$2b$10$rMd1srdIV4pC1zTQ4ajnk.NiWPeHrmN/ZLvkui8S40tBki.nFTpeq
mike@123	$2b$10$YTWji0GQHx7W5oKZYeylCuaazwdL2wea4jGCnLYq3.IMMIVdTh7Ja
loonly@gmail.com	$2b$10$Js7KyrNMbjOoOHa/S7Nv..7ydDI4qu05Qecl8xCztXS9hx8nVJxSi
\.


--
-- Data for Name: cgpa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cgpa (cgpa_id, education_id, semester, cgpa) FROM stdin;
1	1	1	9.10
2	1	2	8.80
3	1	3	8.50
4	2	1	8.70
5	2	2	8.60
6	2	3	8.40
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (company_id, company_name, sector) FROM stdin;
1	Microsoft India	Tech
2	Infosys	IT
\.


--
-- Data for Name: education; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.education (education_id, user_id, program, branch, course_start_date, course_end_date, batch, uni_roll_no, current_semester, school_10, board_10, cgpa_10, start_date_10, end_date_10, school_12, board_12, cgpa_12, start_date_12, end_date_12, gap_year_start, gap_year_end) FROM stdin;
1	1	B.Tech	Computer Science	2020-08-01	2024-05-30	2024	IITB12345	6	Delhi Public School	CBSE	9.50	2017-06-01	2019-04-30	Modern School	CBSE	9.20	2019-06-01	2021-04-30	\N	\N
2	2	B.Tech	Electronics and Communication	2019-08-01	2023-05-30	2023	NITT67890	8	St. Xavier's	ICSE	9.30	2016-06-01	2018-04-30	DAV Public School	CBSE	8.90	2018-06-01	2020-04-30	\N	\N
\.


--
-- Data for Name: hiring_workflow; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hiring_workflow (workflow_id, job_id, stage_name, venue, schedule) FROM stdin;
1	1	Online Test	Virtual	2024-10-10 10:00:00
2	2	HR Interview	Company Office	2024-11-15 14:00:00
\.


--
-- Data for Name: internships; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.internships (internship_id, user_id, company_name, job_title, location, company_sector, start_date, end_date, stipend_salary) FROM stdin;
1	1	Google India	Software Engineer Intern	Bangalore	Tech	2023-06-01	2023-09-30	50000.00
2	2	TCS	Data Analyst Intern	Mumbai	IT	2022-05-01	2022-08-30	30000.00
\.


--
-- Data for Name: job_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_applications (application_id, user_id, job_id, status, created_at) FROM stdin;
1	1	1	Applied	2025-03-30 13:30:06.886061
2	2	2	Offered	2025-03-30 13:30:06.886061
\.


--
-- Data for Name: job_eligibility; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_eligibility (job_id, course, min_cgpa, no_backlogs, already_placed) FROM stdin;
1	B.Tech Computer Science	7.50	t	f
2	B.Tech Electronics	7.00	t	f
\.


--
-- Data for Name: job_openings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_openings (job_id, company_id, title, category, job_functions, job_profile, ctc, required_skills, additional_info, attached_docs, created_at, application_deadline) FROM stdin;
1	1	Software Engineer	Engineering	Develop software solutions	Full Stack Developer	2500000.00	Python, Java, React	Work from home available	\N	2025-03-30 13:30:06.886061	2025-01-31
2	2	Data Scientist	Analytics	Analyze large datasets	Data Analyst	2000000.00	SQL, Python, Machine Learning	Hybrid model	\N	2025-03-30 13:30:06.886061	2024-12-31
\.


--
-- Data for Name: personal_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personal_details (user_id, first_name, last_name, dob, gender, college, institute_roll_no, personal_email, phone_number) FROM stdin;
1	Aarav	Sharma	2002-05-10	Male	IIT Bombay	IITB20221001	aarav.sharma@gmail.com	9876543210
2	Ishita	Verma	2001-09-15	Female	NIT Trichy	NITT20222002	ishita.verma@gmail.com	9823456789
\.


--
-- Data for Name: project_skills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_skills (project_id, skill_id) FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (project_id, user_id, project_title, description, tech_stack, start_date, end_date) FROM stdin;
1	1	AI Chatbot	A chatbot for customer support	Python, TensorFlow	2022-09-01	2022-12-30
2	2	IoT Home Automation	Smart home system with IoT sensors	Arduino, C++	2023-03-01	2023-06-30
\.


--
-- Data for Name: resume; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resume (resume_id, user_id, resume_file) FROM stdin;
1	1	\N
2	2	\N
\.


--
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.skills (skill_id, skill_name, skill_type) FROM stdin;
1	Python	Language
2	Java	Language
3	Machine Learning	Tech
4	Public Speaking	Soft Skill
\.


--
-- Data for Name: socialmedia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.socialmedia (social_id, user_id, linkedin, github, personal_website) FROM stdin;
1	1	https://linkedin.com/in/aaravsharma	https://github.com/aaravsharma	https://aaravsharma.dev
2	2	https://linkedin.com/in/ishitaverma	https://github.com/ishitaverma	https://ishitaverma.me
\.


--
-- Data for Name: user_skills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_skills (user_id, skill_id) FROM stdin;
1	1
1	3
2	2
2	4
\.


--
-- Data for Name: volunteering; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.volunteering (volunteering_id, user_id, location, company_sector, task, start_date, end_date) FROM stdin;
1	1	Mumbai	Education	Teaching underprivileged kids	2022-06-01	2022-12-30
2	2	Delhi	Social Work	Planting trees in urban areas	2023-01-01	2023-06-30
3	\N	New York	Healthcare	Organizing events	2025-04-01	2025-04-10
\.


--
-- Name: authentication_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.authentication_user_id_seq', 2, true);


--
-- Name: cgpa_cgpa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cgpa_cgpa_id_seq', 6, true);


--
-- Name: companies_company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.companies_company_id_seq', 2, true);


--
-- Name: education_education_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.education_education_id_seq', 2, true);


--
-- Name: hiring_workflow_workflow_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hiring_workflow_workflow_id_seq', 2, true);


--
-- Name: internships_internship_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.internships_internship_id_seq', 2, true);


--
-- Name: job_applications_application_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.job_applications_application_id_seq', 2, true);


--
-- Name: job_openings_job_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.job_openings_job_id_seq', 2, true);


--
-- Name: projects_project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_project_id_seq', 2, true);


--
-- Name: resume_resume_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.resume_resume_id_seq', 2, true);


--
-- Name: skills_skill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.skills_skill_id_seq', 4, true);


--
-- Name: socialmedia_social_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.socialmedia_social_id_seq', 2, true);


--
-- Name: volunteering_volunteering_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.volunteering_volunteering_id_seq', 3, true);


--
-- Name: personal_details authentication_institute_roll_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_details
    ADD CONSTRAINT authentication_institute_roll_no_key UNIQUE (institute_roll_no);


--
-- Name: personal_details authentication_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_details
    ADD CONSTRAINT authentication_phone_number_key UNIQUE (phone_number);


--
-- Name: personal_details authentication_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_details
    ADD CONSTRAINT authentication_pkey PRIMARY KEY (user_id);


--
-- Name: authentication authentication_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authentication
    ADD CONSTRAINT authentication_pkey1 PRIMARY KEY (primary_email);


--
-- Name: cgpa cgpa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cgpa
    ADD CONSTRAINT cgpa_pkey PRIMARY KEY (cgpa_id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (company_id);


--
-- Name: education education_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.education
    ADD CONSTRAINT education_pkey PRIMARY KEY (education_id);


--
-- Name: education education_uni_roll_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.education
    ADD CONSTRAINT education_uni_roll_no_key UNIQUE (uni_roll_no);


--
-- Name: hiring_workflow hiring_workflow_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hiring_workflow
    ADD CONSTRAINT hiring_workflow_pkey PRIMARY KEY (workflow_id);


--
-- Name: internships internships_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.internships
    ADD CONSTRAINT internships_pkey PRIMARY KEY (internship_id);


--
-- Name: job_applications job_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_pkey PRIMARY KEY (application_id);


--
-- Name: job_eligibility job_eligibility_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_eligibility
    ADD CONSTRAINT job_eligibility_pkey PRIMARY KEY (job_id, course);


--
-- Name: job_openings job_openings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_openings
    ADD CONSTRAINT job_openings_pkey PRIMARY KEY (job_id);


--
-- Name: project_skills project_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_skills
    ADD CONSTRAINT project_skills_pkey PRIMARY KEY (project_id, skill_id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (project_id);


--
-- Name: resume resume_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resume
    ADD CONSTRAINT resume_pkey PRIMARY KEY (resume_id);


--
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (skill_id);


--
-- Name: skills skills_skill_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_skill_name_key UNIQUE (skill_name);


--
-- Name: socialmedia socialmedia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.socialmedia
    ADD CONSTRAINT socialmedia_pkey PRIMARY KEY (social_id);


--
-- Name: user_skills user_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT user_skills_pkey PRIMARY KEY (user_id, skill_id);


--
-- Name: volunteering volunteering_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.volunteering
    ADD CONSTRAINT volunteering_pkey PRIMARY KEY (volunteering_id);


--
-- Name: idx_job_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_job_category ON public.job_openings USING btree (category);


--
-- Name: idx_job_ctc; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_job_ctc ON public.job_openings USING btree (ctc);


--
-- Name: idx_job_deadline; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_job_deadline ON public.job_openings USING btree (application_deadline);


--
-- Name: idx_job_profile; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_job_profile ON public.job_openings USING btree (job_profile);


--
-- Name: cgpa cgpa_education_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cgpa
    ADD CONSTRAINT cgpa_education_id_fkey FOREIGN KEY (education_id) REFERENCES public.education(education_id) ON DELETE CASCADE;


--
-- Name: education education_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.education
    ADD CONSTRAINT education_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.personal_details(user_id) ON DELETE CASCADE;


--
-- Name: hiring_workflow hiring_workflow_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hiring_workflow
    ADD CONSTRAINT hiring_workflow_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.job_openings(job_id) ON DELETE CASCADE;


--
-- Name: internships internships_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.internships
    ADD CONSTRAINT internships_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.personal_details(user_id) ON DELETE CASCADE;


--
-- Name: job_applications job_applications_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.job_openings(job_id) ON DELETE CASCADE;


--
-- Name: job_applications job_applications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.personal_details(user_id) ON DELETE CASCADE;


--
-- Name: job_eligibility job_eligibility_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_eligibility
    ADD CONSTRAINT job_eligibility_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.job_openings(job_id) ON DELETE CASCADE;


--
-- Name: job_openings job_openings_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_openings
    ADD CONSTRAINT job_openings_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id) ON DELETE CASCADE;


--
-- Name: project_skills project_skills_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_skills
    ADD CONSTRAINT project_skills_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(project_id) ON DELETE CASCADE;


--
-- Name: project_skills project_skills_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_skills
    ADD CONSTRAINT project_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(skill_id) ON DELETE CASCADE;


--
-- Name: projects projects_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.personal_details(user_id) ON DELETE CASCADE;


--
-- Name: resume resume_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resume
    ADD CONSTRAINT resume_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.personal_details(user_id) ON DELETE CASCADE;


--
-- Name: socialmedia socialmedia_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.socialmedia
    ADD CONSTRAINT socialmedia_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.personal_details(user_id) ON DELETE CASCADE;


--
-- Name: user_skills user_skills_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT user_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(skill_id) ON DELETE CASCADE;


--
-- Name: user_skills user_skills_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT user_skills_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.personal_details(user_id) ON DELETE CASCADE;


--
-- Name: volunteering volunteering_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.volunteering
    ADD CONSTRAINT volunteering_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.personal_details(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

