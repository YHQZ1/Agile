-- Agile Platform Unified Database Schema (2025-11 revision)
-- Execute inside the Supabase SQL editor to bootstrap the database.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

BEGIN;

-- ============================================================================
-- Utility helpers
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.jwt_claim_bigint(claim_name TEXT)
RETURNS BIGINT AS $$
DECLARE
	raw_claims TEXT;
	claim_value TEXT;
BEGIN
	raw_claims := current_setting('request.jwt.claims', true);

	IF raw_claims IS NULL OR raw_claims = '' THEN
		RETURN NULL;
	END IF;

	claim_value := (raw_claims::jsonb ->> claim_name);

	IF claim_value IS NULL OR claim_value !~ '^\d+$' THEN
		RETURN NULL;
	END IF;

	RETURN claim_value::BIGINT;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.jwt_claim_text(claim_name TEXT)
RETURNS TEXT AS $$
DECLARE
	raw_claims TEXT;
BEGIN
	raw_claims := current_setting('request.jwt.claims', true);

	IF raw_claims IS NULL OR raw_claims = '' THEN
		RETURN NULL;
	END IF;

	RETURN (raw_claims::jsonb ->> claim_name);
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.jwt_claim_role()
RETURNS TEXT AS $$
BEGIN
	RETURN public.jwt_claim_text('role');
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- Authentication & user profile
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.authentication (
	id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	primary_email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'recruiter', 'admin')),
	is_active BOOLEAN NOT NULL DEFAULT TRUE,
	last_login TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_authentication_update ON public.authentication;
CREATE TRIGGER trg_authentication_update
BEFORE UPDATE ON public.authentication
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.user_sessions (
	session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id BIGINT NOT NULL REFERENCES public.authentication(id) ON DELETE CASCADE,
	refresh_token TEXT,
	user_agent TEXT,
	ip_address INET,
	expires_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON public.user_sessions (user_id);

CREATE TABLE IF NOT EXISTS public.personal_details (
	user_id BIGINT PRIMARY KEY REFERENCES public.authentication(id) ON DELETE CASCADE,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	dob DATE,
	gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
	institute_roll_no TEXT UNIQUE,
	personal_email TEXT,
	phone_number TEXT,
	profile_picture TEXT,
	address_line1 TEXT,
	address_line2 TEXT,
	city TEXT,
	state_province TEXT,
	postal_code TEXT,
	country TEXT,
	linkedin_profile TEXT,
	github_profile TEXT,
	personal_website TEXT,
	bio TEXT,
	cgpa NUMERIC(4,2) CHECK (cgpa IS NULL OR (cgpa >= 0 AND cgpa <= 10)),
	branch TEXT,
	batch TEXT,
	current_semester TEXT,
	theme_preference TEXT CHECK (theme_preference IN ('system', 'light', 'dark')) DEFAULT 'system',
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_personal_details_update ON public.personal_details;
CREATE TRIGGER trg_personal_details_update
BEFORE UPDATE ON public.personal_details
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.student_preferences (
	user_id BIGINT PRIMARY KEY REFERENCES public.authentication(id) ON DELETE CASCADE,
	prefers_remote BOOLEAN NOT NULL DEFAULT TRUE,
	prefers_hybrid BOOLEAN NOT NULL DEFAULT TRUE,
	prefers_onsite BOOLEAN NOT NULL DEFAULT TRUE,
	desired_roles TEXT[],
	preferred_locations TEXT[],
	salary_range NUMERIC(12,2)[],
	notification_email BOOLEAN NOT NULL DEFAULT TRUE,
	notification_push BOOLEAN NOT NULL DEFAULT TRUE,
	notification_digest_frequency TEXT CHECK (notification_digest_frequency IN ('daily', 'weekly', 'monthly', 'never')) DEFAULT 'weekly',
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_student_preferences_update ON public.student_preferences;
CREATE TRIGGER trg_student_preferences_update
BEFORE UPDATE ON public.student_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- ============================================================================
-- Student experiential data
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.internships (
	internship_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	company_name TEXT NOT NULL,
	job_title TEXT NOT NULL,
	location TEXT,
	company_sector TEXT,
	start_date DATE NOT NULL,
	end_date DATE,
	stipend_salary NUMERIC(10,2) CHECK (stipend_salary IS NULL OR stipend_salary >= 0),
	employment_type TEXT,
	is_current BOOLEAN NOT NULL DEFAULT FALSE,
	highlights TEXT[],
	responsibilities TEXT,
	technologies TEXT[],
	outcome TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CHECK (end_date IS NULL OR start_date <= end_date)
);

DROP TRIGGER IF EXISTS trg_internships_update ON public.internships;
CREATE TRIGGER trg_internships_update
BEFORE UPDATE ON public.internships
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.volunteering (
	volunteering_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	organization TEXT NOT NULL,
	title TEXT,
	location TEXT,
	start_date DATE NOT NULL,
	end_date DATE,
	impact TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CHECK (end_date IS NULL OR start_date <= end_date)
);

DROP TRIGGER IF EXISTS trg_volunteering_update ON public.volunteering;
CREATE TRIGGER trg_volunteering_update
BEFORE UPDATE ON public.volunteering
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.skills (
	skill_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	skill_name TEXT NOT NULL,
	skill_category TEXT,
	skill_proficiency TEXT CHECK (skill_proficiency IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
	experience_years NUMERIC(4,2) CHECK (experience_years IS NULL OR experience_years >= 0),
	last_used_at DATE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT unique_skill_per_user UNIQUE (user_id, skill_name)
);

DROP TRIGGER IF EXISTS trg_skills_update ON public.skills;
CREATE TRIGGER trg_skills_update
BEFORE UPDATE ON public.skills
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.projects (
	project_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	project_title TEXT NOT NULL,
	description TEXT,
	tech_stack TEXT,
	project_link TEXT,
	repository_url TEXT,
	project_status TEXT CHECK (project_status IN ('planned', 'in_progress', 'completed', 'archived')),
	highlights TEXT[],
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_projects_update ON public.projects;
CREATE TRIGGER trg_projects_update
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.accomplishments (
	accomplishment_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	title TEXT NOT NULL,
	institution TEXT,
	accomplishment_type TEXT,
	description TEXT,
	accomplishment_date DATE,
	rank TEXT,
	certificate_url TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_accomplishments_update ON public.accomplishments;
CREATE TRIGGER trg_accomplishments_update
BEFORE UPDATE ON public.accomplishments
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.extra_curricular (
	extra_curricular_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	activity_name TEXT NOT NULL,
	role TEXT,
	organization TEXT,
	start_date DATE,
	end_date DATE,
	achievement TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_extra_curricular_update ON public.extra_curricular;
CREATE TRIGGER trg_extra_curricular_update
BEFORE UPDATE ON public.extra_curricular
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.competition_events (
	event_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	event_name TEXT NOT NULL,
	event_date DATE,
	role TEXT,
	achievement TEXT,
	skills_showcased TEXT[],
	resource_link TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_competition_events_update ON public.competition_events;
CREATE TRIGGER trg_competition_events_update
BEFORE UPDATE ON public.competition_events
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE INDEX IF NOT EXISTS idx_internships_user ON public.internships (user_id);
CREATE INDEX IF NOT EXISTS idx_volunteering_user ON public.volunteering (user_id);
CREATE INDEX IF NOT EXISTS idx_skills_user ON public.skills (user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user ON public.projects (user_id);
CREATE INDEX IF NOT EXISTS idx_accomplishments_user ON public.accomplishments (user_id);
CREATE INDEX IF NOT EXISTS idx_extra_curricular_user ON public.extra_curricular (user_id);
CREATE INDEX IF NOT EXISTS idx_competition_events_user ON public.competition_events (user_id);

-- ============================================================================
-- Learning resources & roadmaps
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.learning_categories (
	category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	slug TEXT UNIQUE NOT NULL,
	title TEXT NOT NULL,
	description TEXT,
	icon TEXT,
	category_type TEXT CHECK (category_type IN ('role', 'skill', 'tool')),
	is_featured BOOLEAN NOT NULL DEFAULT FALSE,
	is_active BOOLEAN NOT NULL DEFAULT TRUE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_learning_categories_update ON public.learning_categories;
CREATE TRIGGER trg_learning_categories_update
BEFORE UPDATE ON public.learning_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.learning_resources (
	resource_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	category_id UUID REFERENCES public.learning_categories(category_id) ON DELETE SET NULL,
	title TEXT NOT NULL,
	resource_type TEXT CHECK (resource_type IN ('article', 'video', 'course', 'roadmap', 'tool', 'link')),
	difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
	url TEXT NOT NULL,
	estimated_duration TEXT,
	description TEXT,
	tags TEXT[],
	order_index INT NOT NULL DEFAULT 0,
	is_recommended BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_learning_resources_update ON public.learning_resources;
CREATE TRIGGER trg_learning_resources_update
BEFORE UPDATE ON public.learning_resources
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.roadmap_modules (
	module_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	category_id UUID REFERENCES public.learning_categories(category_id) ON DELETE CASCADE,
	title TEXT NOT NULL,
	overview TEXT,
	order_index INT NOT NULL DEFAULT 0,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_roadmap_modules_update ON public.roadmap_modules;
CREATE TRIGGER trg_roadmap_modules_update
BEFORE UPDATE ON public.roadmap_modules
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.roadmap_lessons (
	lesson_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	module_id UUID REFERENCES public.roadmap_modules(module_id) ON DELETE CASCADE,
	title TEXT NOT NULL,
	content_summary TEXT,
	resource_url TEXT,
	order_index INT NOT NULL DEFAULT 0,
	estimated_duration TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_roadmap_lessons_update ON public.roadmap_lessons;
CREATE TRIGGER trg_roadmap_lessons_update
BEFORE UPDATE ON public.roadmap_lessons
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.student_learning_progress (
	progress_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	lesson_id UUID NOT NULL REFERENCES public.roadmap_lessons(lesson_id) ON DELETE CASCADE,
	status TEXT NOT NULL DEFAULT 'incomplete' CHECK (status IN ('incomplete', 'in_progress', 'completed')),
	notes TEXT,
	completed_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	UNIQUE (user_id, lesson_id)
);

DROP TRIGGER IF EXISTS trg_student_learning_progress_update ON public.student_learning_progress;
CREATE TRIGGER trg_student_learning_progress_update
BEFORE UPDATE ON public.student_learning_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE INDEX IF NOT EXISTS idx_learning_resources_category_order ON public.learning_resources (category_id, order_index);
CREATE INDEX IF NOT EXISTS idx_roadmap_modules_category_order ON public.roadmap_modules (category_id, order_index);
CREATE INDEX IF NOT EXISTS idx_roadmap_lessons_module_order ON public.roadmap_lessons (module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_student_learning_progress_user ON public.student_learning_progress (user_id, updated_at DESC);

-- ============================================================================
-- Partner companies & campus drives
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.partner_companies (
	company_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name TEXT NOT NULL,
	headline TEXT,
	description TEXT,
	industry TEXT,
	headquarters TEXT,
	website TEXT,
	logo_url TEXT,
	employee_count_range TEXT,
	founded_year INT,
	social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
	is_featured BOOLEAN NOT NULL DEFAULT FALSE,
	created_by BIGINT REFERENCES public.authentication(id) ON DELETE SET NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_partner_companies_update ON public.partner_companies;
CREATE TRIGGER trg_partner_companies_update
BEFORE UPDATE ON public.partner_companies
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.drive_categories (
	category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	label TEXT NOT NULL UNIQUE,
	description TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.campus_drives (
	drive_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	organiser_id BIGINT REFERENCES public.authentication(id) ON DELETE SET NULL,
	company_id UUID REFERENCES public.partner_companies(company_id) ON DELETE SET NULL,
	category_id UUID REFERENCES public.drive_categories(category_id) ON DELETE SET NULL,
	role_title TEXT NOT NULL,
	employment_type TEXT CHECK (employment_type IN ('Full-time', 'Internship', 'Apprenticeship', 'Contract')),
	drive_mode TEXT CHECK (drive_mode IN ('Onsite', 'Remote', 'Hybrid')),
	location TEXT,
	openings INT CHECK (openings IS NULL OR openings >= 0),
	compensation_range TEXT,
	stipend_amount NUMERIC(12,2) CHECK (stipend_amount IS NULL OR stipend_amount >= 0),
	application_deadline DATE,
	application_process TEXT,
	requirements TEXT,
	selection_process TEXT,
	registration_url TEXT,
	contact_email TEXT,
	description TEXT,
	status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'completed', 'cancelled')),
	is_virtual BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_campus_drives_update ON public.campus_drives;
CREATE TRIGGER trg_campus_drives_update
BEFORE UPDATE ON public.campus_drives
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.drive_rounds (
	round_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	drive_id UUID NOT NULL REFERENCES public.campus_drives(drive_id) ON DELETE CASCADE,
	round_order INT NOT NULL DEFAULT 1,
	round_type TEXT,
	round_title TEXT NOT NULL,
	start_at TIMESTAMPTZ,
	end_at TIMESTAMPTZ,
	duration_minutes INT,
	instructions TEXT,
	meeting_link TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_drive_rounds_update ON public.drive_rounds;
CREATE TRIGGER trg_drive_rounds_update
BEFORE UPDATE ON public.drive_rounds
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.drive_resources (
	resource_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	drive_id UUID REFERENCES public.campus_drives(drive_id) ON DELETE CASCADE,
	round_id UUID REFERENCES public.drive_rounds(round_id) ON DELETE SET NULL,
	title TEXT NOT NULL,
	resource_type TEXT CHECK (resource_type IN ('document', 'link', 'video', 'form', 'other')),
	url TEXT,
	description TEXT,
	is_mandatory BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_drive_status (
	status_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	drive_id UUID NOT NULL REFERENCES public.campus_drives(drive_id) ON DELETE CASCADE,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	current_stage TEXT,
	application_status TEXT CHECK (application_status IN ('interested', 'applied', 'shortlisted', 'interview', 'selected', 'rejected', 'withdrawn')),
	applied_at TIMESTAMPTZ,
	last_stage_update TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	notes TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	UNIQUE (drive_id, user_id)
);

DROP TRIGGER IF EXISTS trg_student_drive_status_update ON public.student_drive_status;
CREATE TRIGGER trg_student_drive_status_update
BEFORE UPDATE ON public.student_drive_status
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.student_drive_feedback (
	feedback_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	drive_id UUID NOT NULL REFERENCES public.campus_drives(drive_id) ON DELETE CASCADE,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	rating INT CHECK (rating BETWEEN 1 AND 5),
	feedback TEXT,
	submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	UNIQUE (drive_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_campus_drives_status ON public.campus_drives (status, application_deadline);
CREATE INDEX IF NOT EXISTS idx_student_drive_status_user ON public.student_drive_status (user_id, updated_at DESC);

-- ============================================================================
-- Job marketplace & ATS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.job_postings (
	job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	recruiter_id BIGINT REFERENCES public.authentication(id) ON DELETE SET NULL,
	company_id UUID REFERENCES public.partner_companies(company_id) ON DELETE SET NULL,
	drive_id UUID REFERENCES public.campus_drives(drive_id) ON DELETE SET NULL,
	title TEXT NOT NULL,
	department TEXT,
	employment_type TEXT CHECK (employment_type IN ('Full-time', 'Internship', 'Apprenticeship', 'Contract')),
	work_mode TEXT CHECK (work_mode IN ('Onsite', 'Remote', 'Hybrid')),
	location TEXT,
	salary_min NUMERIC(12,2) CHECK (salary_min IS NULL OR salary_min >= 0),
	salary_max NUMERIC(12,2) CHECK (salary_max IS NULL OR salary_max >= 0),
	currency TEXT DEFAULT 'INR',
	compensation_details TEXT,
	description TEXT,
	responsibilities TEXT,
	qualifications TEXT,
	skills TEXT[],
	experience_level TEXT,
	application_deadline DATE,
	apply_link TEXT,
	is_public BOOLEAN NOT NULL DEFAULT TRUE,
	is_active BOOLEAN NOT NULL DEFAULT TRUE,
	posted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	expires_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CHECK (salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max)
);

DROP TRIGGER IF EXISTS trg_job_postings_update ON public.job_postings;
CREATE TRIGGER trg_job_postings_update
BEFORE UPDATE ON public.job_postings
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.job_requirements (
	requirement_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	job_id UUID NOT NULL REFERENCES public.job_postings(job_id) ON DELETE CASCADE,
	requirement_type TEXT,
	description TEXT NOT NULL,
	is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
	order_index INT NOT NULL DEFAULT 0,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.job_tags (
	tag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name TEXT NOT NULL UNIQUE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.job_posting_tags (
	job_id UUID NOT NULL REFERENCES public.job_postings(job_id) ON DELETE CASCADE,
	tag_id UUID NOT NULL REFERENCES public.job_tags(tag_id) ON DELETE CASCADE,
	PRIMARY KEY (job_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.student_saved_jobs (
	saved_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	job_id UUID NOT NULL REFERENCES public.job_postings(job_id) ON DELETE CASCADE,
	saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	UNIQUE (user_id, job_id)
);

CREATE TABLE IF NOT EXISTS public.job_applications (
	application_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	job_id UUID NOT NULL REFERENCES public.job_postings(job_id) ON DELETE CASCADE,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	resume_version_id BIGINT,
	cover_letter TEXT,
	portfolio_url TEXT,
	status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'in_review', 'interview', 'offer', 'hired', 'rejected', 'withdrawn')),
	current_stage TEXT,
	applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	UNIQUE (job_id, user_id)
);

DROP TRIGGER IF EXISTS trg_job_applications_update ON public.job_applications;
CREATE TRIGGER trg_job_applications_update
BEFORE UPDATE ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.application_status_history (
	history_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	application_id BIGINT NOT NULL REFERENCES public.job_applications(application_id) ON DELETE CASCADE,
	status TEXT NOT NULL,
	stage TEXT,
	notes TEXT,
	actor_user_id BIGINT REFERENCES public.authentication(id) ON DELETE SET NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.job_application_notes (
	note_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	application_id BIGINT NOT NULL REFERENCES public.job_applications(application_id) ON DELETE CASCADE,
	author_id BIGINT REFERENCES public.authentication(id) ON DELETE SET NULL,
	note TEXT NOT NULL,
	visibility TEXT CHECK (visibility IN ('candidate', 'internal')) DEFAULT 'internal',
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_job_application_notes_update ON public.job_application_notes;
CREATE TRIGGER trg_job_application_notes_update
BEFORE UPDATE ON public.job_application_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.job_view_events (
	event_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	job_id UUID NOT NULL REFERENCES public.job_postings(job_id) ON DELETE CASCADE,
	user_id BIGINT REFERENCES public.authentication(id) ON DELETE SET NULL,
	viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	source TEXT
);

CREATE INDEX IF NOT EXISTS idx_job_postings_company ON public.job_postings (company_id, is_active);
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON public.job_postings (is_public, is_active, posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_applications_user ON public.job_applications (user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_application_status_history_app ON public.application_status_history (application_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_student_saved_jobs_user ON public.student_saved_jobs (user_id, saved_at DESC);

-- ============================================================================
-- ATS & resume insights
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.resume_versions (
	resume_version_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	storage_path TEXT NOT NULL,
	file_name TEXT NOT NULL,
	file_size_bytes BIGINT CHECK (file_size_bytes IS NULL OR file_size_bytes >= 0),
	file_extension TEXT,
	ats_score NUMERIC(5,2) CHECK (ats_score IS NULL OR (ats_score >= 0 AND ats_score <= 100)),
	summary TEXT,
	is_active BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_resume_versions_update ON public.resume_versions;
CREATE TRIGGER trg_resume_versions_update
BEFORE UPDATE ON public.resume_versions
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

ALTER TABLE public.job_applications
	DROP CONSTRAINT IF EXISTS fk_job_applications_resume_version;

ALTER TABLE public.job_applications
	ADD CONSTRAINT fk_job_applications_resume_version
	FOREIGN KEY (resume_version_id)
	REFERENCES public.resume_versions(resume_version_id)
	ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.resume_reviews (
	review_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	resume_version_id BIGINT NOT NULL REFERENCES public.resume_versions(resume_version_id) ON DELETE CASCADE,
	reviewer_id BIGINT REFERENCES public.authentication(id) ON DELETE SET NULL,
	review_source TEXT CHECK (review_source IN ('manual', 'ai', 'peer')),
	overall_score NUMERIC(5,2) CHECK (overall_score IS NULL OR (overall_score >= 0 AND overall_score <= 100)),
	strengths TEXT[],
	improvements TEXT[],
	metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.resume_review_comments (
	comment_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	review_id BIGINT NOT NULL REFERENCES public.resume_reviews(review_id) ON DELETE CASCADE,
	section TEXT,
	comment TEXT NOT NULL,
	severity TEXT CHECK (severity IN ('info', 'warning', 'critical')) DEFAULT 'info',
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ats_profile_scores (
	score_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	job_id UUID REFERENCES public.job_postings(job_id) ON DELETE SET NULL,
	match_score NUMERIC(5,2) CHECK (match_score IS NULL OR (match_score >= 0 AND match_score <= 100)),
	skills_match NUMERIC(5,2),
	experience_match NUMERIC(5,2),
	education_match NUMERIC(5,2),
	keyword_gaps TEXT[],
	last_computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ats_score_components (
	component_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	score_id BIGINT NOT NULL REFERENCES public.ats_profile_scores(score_id) ON DELETE CASCADE,
	component TEXT NOT NULL,
	weight NUMERIC(5,2),
	component_score NUMERIC(5,2),
	details JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.ats_activity_log (
	activity_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	activity_type TEXT,
	payload JSONB NOT NULL DEFAULT '{}'::jsonb,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resume_versions_user ON public.resume_versions (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resume_reviews_version ON public.resume_reviews (resume_version_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ats_profile_scores_user ON public.ats_profile_scores (user_id, last_computed_at DESC);

-- ============================================================================
-- Recruiter productivity
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.recruiter_profiles (
	recruiter_id BIGINT PRIMARY KEY REFERENCES public.authentication(id) ON DELETE CASCADE,
	company_id UUID REFERENCES public.partner_companies(company_id) ON DELETE SET NULL,
	full_name TEXT,
	designation TEXT,
	contact_email TEXT,
	contact_phone TEXT,
	about TEXT,
	linkedin_url TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_recruiter_profiles_update ON public.recruiter_profiles;
CREATE TRIGGER trg_recruiter_profiles_update
BEFORE UPDATE ON public.recruiter_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.recruiter_teams (
	team_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	company_id UUID REFERENCES public.partner_companies(company_id) ON DELETE CASCADE,
	team_name TEXT NOT NULL,
	description TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.recruiter_team_members (
	team_id UUID REFERENCES public.recruiter_teams(team_id) ON DELETE CASCADE,
	recruiter_id BIGINT REFERENCES public.recruiter_profiles(recruiter_id) ON DELETE CASCADE,
	role TEXT,
	joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	PRIMARY KEY (team_id, recruiter_id)
);

CREATE TABLE IF NOT EXISTS public.recruiter_saved_students (
	recruiter_id BIGINT REFERENCES public.recruiter_profiles(recruiter_id) ON DELETE CASCADE,
	student_id BIGINT REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	notes TEXT,
	saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	PRIMARY KEY (recruiter_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.recruiter_student_notes (
	note_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	recruiter_id BIGINT REFERENCES public.recruiter_profiles(recruiter_id) ON DELETE CASCADE,
	student_id BIGINT REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	job_id UUID REFERENCES public.job_postings(job_id) ON DELETE SET NULL,
	note TEXT NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_recruiter_student_notes_update ON public.recruiter_student_notes;
CREATE TRIGGER trg_recruiter_student_notes_update
BEFORE UPDATE ON public.recruiter_student_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.recruiter_tasks (
	task_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	recruiter_id BIGINT REFERENCES public.recruiter_profiles(recruiter_id) ON DELETE CASCADE,
	title TEXT NOT NULL,
	description TEXT,
	related_job_id UUID REFERENCES public.job_postings(job_id) ON DELETE SET NULL,
	related_application_id BIGINT REFERENCES public.job_applications(application_id) ON DELETE SET NULL,
	due_at TIMESTAMPTZ,
	status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'archived')) DEFAULT 'pending',
	priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_recruiter_tasks_update ON public.recruiter_tasks;
CREATE TRIGGER trg_recruiter_tasks_update
BEFORE UPDATE ON public.recruiter_tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE INDEX IF NOT EXISTS idx_recruiter_saved_students_recruiter ON public.recruiter_saved_students (recruiter_id, saved_at DESC);
CREATE INDEX IF NOT EXISTS idx_recruiter_tasks_recruiter ON public.recruiter_tasks (recruiter_id, status);

-- ============================================================================
-- Student productivity & notifications
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.student_notifications (
	notification_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	title TEXT NOT NULL,
	body TEXT NOT NULL,
	notification_type TEXT,
	link TEXT,
	metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
	is_read BOOLEAN NOT NULL DEFAULT FALSE,
	read_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_tasks (
	task_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	title TEXT NOT NULL,
	description TEXT,
	related_job_id UUID REFERENCES public.job_postings(job_id) ON DELETE SET NULL,
	due_date DATE,
	priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
	status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'archived')) DEFAULT 'pending',
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_student_tasks_update ON public.student_tasks;
CREATE TRIGGER trg_student_tasks_update
BEFORE UPDATE ON public.student_tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.student_task_activity (
	activity_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	task_id BIGINT NOT NULL REFERENCES public.student_tasks(task_id) ON DELETE CASCADE,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	activity_type TEXT,
	activity_notes TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_goals (
	goal_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	title TEXT NOT NULL,
	description TEXT,
	target_date DATE,
	progress_percent NUMERIC(5,2) CHECK (progress_percent IS NULL OR (progress_percent >= 0 AND progress_percent <= 100)),
	status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed', 'on_hold')) DEFAULT 'not_started',
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_student_goals_update ON public.student_goals;
CREATE TRIGGER trg_student_goals_update
BEFORE UPDATE ON public.student_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.student_goal_checkins (
	checkin_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	goal_id BIGINT NOT NULL REFERENCES public.student_goals(goal_id) ON DELETE CASCADE,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	progress_percent NUMERIC(5,2) CHECK (progress_percent IS NULL OR (progress_percent >= 0 AND progress_percent <= 100)),
	notes TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_bookmarks (
	bookmark_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	bookmark_type TEXT NOT NULL CHECK (bookmark_type IN ('resource', 'job', 'thread', 'company', 'drive')),
	target_id TEXT NOT NULL,
	metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	UNIQUE (user_id, bookmark_type, target_id)
);

CREATE TABLE IF NOT EXISTS public.student_saved_filters (
	filter_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	filter_type TEXT NOT NULL,
	filter_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_saved_searches (
	search_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	search_type TEXT NOT NULL,
	query TEXT NOT NULL,
	filter_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_notifications_user ON public.student_notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_student_tasks_user ON public.student_tasks (user_id, status, due_date);
CREATE INDEX IF NOT EXISTS idx_student_goals_user ON public.student_goals (user_id, status);

-- ============================================================================
-- Forum & community
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.forum_channels (
	channel_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	slug TEXT UNIQUE NOT NULL,
	name TEXT NOT NULL,
	description TEXT,
	visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'students', 'recruiters', 'staff')),
	created_by BIGINT REFERENCES public.authentication(id) ON DELETE SET NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.forum_threads (
	thread_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	channel_id UUID NOT NULL REFERENCES public.forum_channels(channel_id) ON DELETE CASCADE,
	author_id BIGINT NOT NULL REFERENCES public.authentication(id) ON DELETE CASCADE,
	title TEXT NOT NULL,
	body TEXT,
	pinned BOOLEAN NOT NULL DEFAULT FALSE,
	is_locked BOOLEAN NOT NULL DEFAULT FALSE,
	last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_forum_threads_update ON public.forum_threads;
CREATE TRIGGER trg_forum_threads_update
BEFORE UPDATE ON public.forum_threads
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.forum_posts (
	post_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	thread_id UUID NOT NULL REFERENCES public.forum_threads(thread_id) ON DELETE CASCADE,
	author_id BIGINT NOT NULL REFERENCES public.authentication(id) ON DELETE CASCADE,
	parent_post_id UUID REFERENCES public.forum_posts(post_id) ON DELETE CASCADE,
	body TEXT NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_forum_posts_update ON public.forum_posts;
CREATE TRIGGER trg_forum_posts_update
BEFORE UPDATE ON public.forum_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.forum_tags (
	tag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	label TEXT NOT NULL UNIQUE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.forum_thread_tags (
	thread_id UUID NOT NULL REFERENCES public.forum_threads(thread_id) ON DELETE CASCADE,
	tag_id UUID NOT NULL REFERENCES public.forum_tags(tag_id) ON DELETE CASCADE,
	PRIMARY KEY (thread_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.forum_post_reactions (
	reaction_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	post_id UUID NOT NULL REFERENCES public.forum_posts(post_id) ON DELETE CASCADE,
	user_id BIGINT NOT NULL REFERENCES public.authentication(id) ON DELETE CASCADE,
	reaction_type TEXT NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	UNIQUE (post_id, user_id, reaction_type)
);

CREATE TABLE IF NOT EXISTS public.forum_thread_followers (
	thread_id UUID NOT NULL REFERENCES public.forum_threads(thread_id) ON DELETE CASCADE,
	user_id BIGINT NOT NULL REFERENCES public.authentication(id) ON DELETE CASCADE,
	followed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	PRIMARY KEY (thread_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.forum_post_reports (
	report_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	post_id UUID NOT NULL REFERENCES public.forum_posts(post_id) ON DELETE CASCADE,
	reporter_id BIGINT NOT NULL REFERENCES public.authentication(id) ON DELETE CASCADE,
	reason TEXT,
	status TEXT CHECK (status IN ('open', 'reviewing', 'resolved')) DEFAULT 'open',
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forum_threads_channel ON public.forum_threads (channel_id, pinned DESC, last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_thread ON public.forum_posts (thread_id, created_at ASC);

-- ============================================================================
-- Announcements & events
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.announcements (
	announcement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	title TEXT NOT NULL,
	body TEXT NOT NULL,
	audience TEXT CHECK (audience IN ('all', 'students', 'recruiters', 'admins')) DEFAULT 'all',
	priority TEXT CHECK (priority IN ('normal', 'important', 'critical')) DEFAULT 'normal',
	published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	expires_at TIMESTAMPTZ,
	created_by BIGINT REFERENCES public.authentication(id) ON DELETE SET NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_announcements (
	announcement_id UUID REFERENCES public.announcements(announcement_id) ON DELETE CASCADE,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	is_read BOOLEAN NOT NULL DEFAULT FALSE,
	read_at TIMESTAMPTZ,
	PRIMARY KEY (announcement_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.virtual_events (
	event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	title TEXT NOT NULL,
	description TEXT,
	event_type TEXT,
	host_company_id UUID REFERENCES public.partner_companies(company_id) ON DELETE SET NULL,
	start_at TIMESTAMPTZ,
	end_at TIMESTAMPTZ,
	join_link TEXT,
	capacity INT,
	status TEXT CHECK (status IN ('draft', 'published', 'completed', 'cancelled')) DEFAULT 'draft',
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_virtual_events_update ON public.virtual_events;
CREATE TRIGGER trg_virtual_events_update
BEFORE UPDATE ON public.virtual_events
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.event_sessions (
	session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	event_id UUID NOT NULL REFERENCES public.virtual_events(event_id) ON DELETE CASCADE,
	title TEXT NOT NULL,
	presenter TEXT,
	start_at TIMESTAMPTZ,
	end_at TIMESTAMPTZ,
	resources TEXT[],
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.event_registrations (
	registration_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	event_id UUID NOT NULL REFERENCES public.virtual_events(event_id) ON DELETE CASCADE,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	status TEXT CHECK (status IN ('registered', 'attended', 'no_show', 'cancelled')) DEFAULT 'registered',
	registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	UNIQUE (event_id, user_id)
);

DROP TRIGGER IF EXISTS trg_event_registrations_update ON public.event_registrations;
CREATE TRIGGER trg_event_registrations_update
BEFORE UPDATE ON public.event_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.event_resources (
	resource_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	event_id UUID NOT NULL REFERENCES public.virtual_events(event_id) ON DELETE CASCADE,
	title TEXT NOT NULL,
	resource_type TEXT,
	url TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.event_feedback (
	feedback_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	event_id UUID NOT NULL REFERENCES public.virtual_events(event_id) ON DELETE CASCADE,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	rating INT CHECK (rating BETWEEN 1 AND 5),
	feedback TEXT,
	submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_registrations_user ON public.event_registrations (user_id, updated_at DESC);

-- ============================================================================
-- Landing & marketing content
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.landing_page_sections (
	section_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	slug TEXT UNIQUE NOT NULL,
	title TEXT NOT NULL,
	subtitle TEXT,
	body TEXT,
	media_url TEXT,
	order_index INT NOT NULL DEFAULT 0,
	is_active BOOLEAN NOT NULL DEFAULT TRUE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_landing_page_sections_update ON public.landing_page_sections;
CREATE TRIGGER trg_landing_page_sections_update
BEFORE UPDATE ON public.landing_page_sections
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.landing_page_highlights (
	highlight_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	section_id UUID REFERENCES public.landing_page_sections(section_id) ON DELETE CASCADE,
	title TEXT NOT NULL,
	description TEXT,
	icon TEXT,
	order_index INT NOT NULL DEFAULT 0,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_landing_page_highlights_update ON public.landing_page_highlights;
CREATE TRIGGER trg_landing_page_highlights_update
BEFORE UPDATE ON public.landing_page_highlights
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.landing_page_testimonials (
	testimonial_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name TEXT NOT NULL,
	role TEXT,
	company TEXT,
	quote TEXT NOT NULL,
	avatar_url TEXT,
	order_index INT NOT NULL DEFAULT 0,
	is_featured BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_landing_page_testimonials_update ON public.landing_page_testimonials;
CREATE TRIGGER trg_landing_page_testimonials_update
BEFORE UPDATE ON public.landing_page_testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.contact_messages (
	message_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name TEXT NOT NULL,
	email TEXT NOT NULL,
	subject TEXT,
	message TEXT NOT NULL,
	metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
	status TEXT CHECK (status IN ('new', 'in_progress', 'resolved')) DEFAULT 'new',
	received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
	subscriber_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	email TEXT NOT NULL UNIQUE,
	subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	unsubscribed_at TIMESTAMPTZ
);

-- ============================================================================
-- Platform configuration
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.app_settings (
	key TEXT PRIMARY KEY,
	value JSONB NOT NULL,
	description TEXT,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.feature_flags (
	flag_key TEXT PRIMARY KEY,
	description TEXT,
	enabled_for JSONB NOT NULL DEFAULT '{}'::jsonb,
	is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.dashboard_widgets (
	widget_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	widget_key TEXT NOT NULL UNIQUE,
	title TEXT NOT NULL,
	description TEXT,
	default_visibility JSONB NOT NULL DEFAULT '{}'::jsonb,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_dashboard_preferences (
	preference_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	widget_id UUID REFERENCES public.dashboard_widgets(widget_id) ON DELETE CASCADE,
	is_visible BOOLEAN NOT NULL DEFAULT TRUE,
	order_index INT NOT NULL DEFAULT 0,
	metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	UNIQUE (user_id, widget_id)
);

DROP TRIGGER IF EXISTS trg_student_dashboard_preferences_update ON public.student_dashboard_preferences;
CREATE TRIGGER trg_student_dashboard_preferences_update
BEFORE UPDATE ON public.student_dashboard_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- ============================================================================
-- Document storage & audit
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.student_documents (
	document_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	document_type TEXT,
	storage_path TEXT NOT NULL,
	file_name TEXT NOT NULL,
	file_size_bytes BIGINT CHECK (file_size_bytes IS NULL OR file_size_bytes >= 0),
	uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_student_documents_update ON public.student_documents;
CREATE TRIGGER trg_student_documents_update
BEFORE UPDATE ON public.student_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.document_audit_log (
	audit_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	document_id BIGINT NOT NULL REFERENCES public.student_documents(document_id) ON DELETE CASCADE,
	action TEXT NOT NULL CHECK (action IN ('uploaded', 'updated', 'deleted', 'downloaded')),
	actor_user_id BIGINT REFERENCES public.authentication(id) ON DELETE SET NULL,
	metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.media_assets (
	asset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	owner_user_id BIGINT REFERENCES public.authentication(id) ON DELETE SET NULL,
	storage_path TEXT NOT NULL,
	mime_type TEXT,
	size_bytes BIGINT,
	metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Feedback, analytics & audit
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.student_feedback (
	feedback_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
	feedback_type TEXT,
	rating INT CHECK (rating BETWEEN 1 AND 5),
	message TEXT,
	metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.recruiter_feedback (
	feedback_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	recruiter_id BIGINT REFERENCES public.recruiter_profiles(recruiter_id) ON DELETE SET NULL,
	rating INT CHECK (rating BETWEEN 1 AND 5),
	feedback TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.system_audit_log (
	audit_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	event_type TEXT NOT NULL,
	actor_user_id BIGINT REFERENCES public.authentication(id) ON DELETE SET NULL,
	payload JSONB NOT NULL DEFAULT '{}'::jsonb,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.error_reports (
	error_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	context TEXT,
	message TEXT NOT NULL,
	stack_trace TEXT,
	metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
	occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.usage_metrics_daily (
	metric_date DATE NOT NULL,
	metric_key TEXT NOT NULL,
	metric_value NUMERIC,
	metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	PRIMARY KEY (metric_date, metric_key)
);

-- ============================================================================
-- API keys & integrations
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.api_keys (
	key_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name TEXT NOT NULL,
	secret_hash TEXT NOT NULL,
	owner_user_id BIGINT REFERENCES public.authentication(id) ON DELETE SET NULL,
	scopes TEXT[] NOT NULL DEFAULT ARRAY['read'],
	is_active BOOLEAN NOT NULL DEFAULT TRUE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	last_used_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.api_audit_log (
	audit_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	key_id UUID REFERENCES public.api_keys(key_id) ON DELETE SET NULL,
	path TEXT NOT NULL,
	method TEXT,
	status_code INT,
	metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
	occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.integration_webhooks (
	webhook_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name TEXT NOT NULL,
	target_url TEXT NOT NULL,
	secret TEXT,
	is_active BOOLEAN NOT NULL DEFAULT TRUE,
	events TEXT[] NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_integration_webhooks_update ON public.integration_webhooks;
CREATE TRIGGER trg_integration_webhooks_update
BEFORE UPDATE ON public.integration_webhooks
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TABLE IF NOT EXISTS public.integration_events (
	event_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	webhook_id UUID REFERENCES public.integration_webhooks(webhook_id) ON DELETE CASCADE,
	event_type TEXT NOT NULL,
	payload JSONB NOT NULL,
	delivered_at TIMESTAMPTZ,
	delivery_status TEXT CHECK (delivery_status IN ('pending', 'delivered', 'failed')) DEFAULT 'pending',
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Row-Level Security (Supabase policies)
-- ============================================================================

ALTER TABLE public.personal_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteering ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accomplishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extra_curricular ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_task_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_goal_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_saved_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_drive_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_drive_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_review_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ats_profile_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ats_score_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ats_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY personal_details_self_select ON public.personal_details
FOR SELECT USING (user_id = public.jwt_claim_bigint('id'));

CREATE POLICY personal_details_self_write ON public.personal_details
FOR ALL USING (user_id = public.jwt_claim_bigint('id'))
WITH CHECK (user_id = public.jwt_claim_bigint('id'));

DO $$
DECLARE
	table_name TEXT;
BEGIN
	FOR table_name IN SELECT unnest(ARRAY[
		'student_preferences',
		'internships',
		'volunteering',
		'skills',
		'projects',
		'accomplishments',
		'extra_curricular',
		'competition_events',
		'student_learning_progress',
		'student_notifications',
		'student_tasks',
		'student_task_activity',
		'student_goals',
		'student_goal_checkins',
		'student_bookmarks',
		'student_saved_filters',
		'student_saved_searches',
		'student_drive_status',
		'student_drive_feedback',
		'student_documents',
		'resume_versions',
		'ats_profile_scores',
		'ats_activity_log',
		'job_applications',
		'student_saved_jobs',
		'student_feedback'
	])
	LOOP
		EXECUTE format('DROP POLICY IF EXISTS %I_owner_select ON public.%I', table_name, table_name);
		EXECUTE format('DROP POLICY IF EXISTS %I_owner_write ON public.%I', table_name, table_name);
		EXECUTE format('CREATE POLICY %I_owner_select ON public.%I FOR SELECT USING (public.jwt_claim_bigint(''id'') = user_id)', table_name, table_name);
		EXECUTE format('CREATE POLICY %I_owner_write ON public.%I FOR ALL USING (public.jwt_claim_bigint(''id'') = user_id) WITH CHECK (public.jwt_claim_bigint(''id'') = user_id)', table_name, table_name);
	END LOOP;
END;
$$;

DROP POLICY IF EXISTS resume_reviews_owner_select ON public.resume_reviews;
CREATE POLICY resume_reviews_owner_select
ON public.resume_reviews
FOR SELECT
USING (
	public.jwt_claim_bigint('id') = reviewer_id
	OR EXISTS (
		SELECT 1
		FROM public.resume_versions rv
		WHERE rv.resume_version_id = public.resume_reviews.resume_version_id
		AND rv.user_id = public.jwt_claim_bigint('id')
	)
);

DROP POLICY IF EXISTS resume_reviews_owner_write ON public.resume_reviews;
CREATE POLICY resume_reviews_owner_write
ON public.resume_reviews
FOR ALL
USING (
	public.jwt_claim_bigint('id') = reviewer_id
	OR EXISTS (
		SELECT 1
		FROM public.resume_versions rv
		WHERE rv.resume_version_id = public.resume_reviews.resume_version_id
		AND rv.user_id = public.jwt_claim_bigint('id')
	)
)
WITH CHECK (
	public.jwt_claim_bigint('id') = reviewer_id
	OR EXISTS (
		SELECT 1
		FROM public.resume_versions rv
		WHERE rv.resume_version_id = public.resume_reviews.resume_version_id
		AND rv.user_id = public.jwt_claim_bigint('id')
	)
);

DROP POLICY IF EXISTS resume_review_comments_access ON public.resume_review_comments;
CREATE POLICY resume_review_comments_access
ON public.resume_review_comments
FOR ALL
USING (
	EXISTS (
		SELECT 1
		FROM public.resume_reviews rr
		JOIN public.resume_versions rv ON rv.resume_version_id = rr.resume_version_id
		WHERE rr.review_id = public.resume_review_comments.review_id
		AND (
			rr.reviewer_id = public.jwt_claim_bigint('id')
			OR rv.user_id = public.jwt_claim_bigint('id')
		)
	)
)
WITH CHECK (
	EXISTS (
		SELECT 1
		FROM public.resume_reviews rr
		JOIN public.resume_versions rv ON rv.resume_version_id = rr.resume_version_id
		WHERE rr.review_id = public.resume_review_comments.review_id
		AND (
			rr.reviewer_id = public.jwt_claim_bigint('id')
			OR rv.user_id = public.jwt_claim_bigint('id')
		)
	)
);

DROP POLICY IF EXISTS ats_score_components_owner ON public.ats_score_components;
CREATE POLICY ats_score_components_owner
ON public.ats_score_components
FOR ALL
USING (
	EXISTS (
		SELECT 1
		FROM public.ats_profile_scores aps
		WHERE aps.score_id = public.ats_score_components.score_id
		AND aps.user_id = public.jwt_claim_bigint('id')
	)
)
WITH CHECK (
	EXISTS (
		SELECT 1
		FROM public.ats_profile_scores aps
		WHERE aps.score_id = public.ats_score_components.score_id
		AND aps.user_id = public.jwt_claim_bigint('id')
	)
);

ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
CREATE POLICY job_postings_public_select ON public.job_postings
FOR SELECT USING (is_public = TRUE AND is_active = TRUE);

CREATE POLICY job_postings_recruiter_manage ON public.job_postings
FOR ALL USING (
	COALESCE(public.jwt_claim_role(), '') IN ('recruiter', 'admin')
)
WITH CHECK (
	COALESCE(public.jwt_claim_role(), '') IN ('recruiter', 'admin')
);

CREATE POLICY job_applications_recruiter_view ON public.job_applications
FOR SELECT USING (
	public.jwt_claim_role() IN ('recruiter', 'admin') OR user_id = public.jwt_claim_bigint('id')
);

ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_post_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY forum_threads_read ON public.forum_threads FOR SELECT USING (TRUE);
CREATE POLICY forum_threads_author_manage ON public.forum_threads
FOR ALL USING (author_id = public.jwt_claim_bigint('id'))
WITH CHECK (author_id = public.jwt_claim_bigint('id'));

CREATE POLICY forum_posts_read ON public.forum_posts FOR SELECT USING (TRUE);
CREATE POLICY forum_posts_author_manage ON public.forum_posts
FOR ALL USING (author_id = public.jwt_claim_bigint('id'))
WITH CHECK (author_id = public.jwt_claim_bigint('id'));

CREATE POLICY forum_reactions_manage ON public.forum_post_reactions
FOR ALL USING (user_id = public.jwt_claim_bigint('id'))
WITH CHECK (user_id = public.jwt_claim_bigint('id'));

ALTER TABLE public.recruiter_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY recruiter_profiles_read ON public.recruiter_profiles
FOR SELECT USING (TRUE);

CREATE POLICY recruiter_profiles_owner_write ON public.recruiter_profiles
FOR ALL USING (
	public.jwt_claim_role() IN ('recruiter', 'admin') AND recruiter_id = public.jwt_claim_bigint('id')
)
WITH CHECK (
	public.jwt_claim_role() IN ('recruiter', 'admin') AND recruiter_id = public.jwt_claim_bigint('id')
);

COMMIT;
