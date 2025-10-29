-- Agile Platform Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID helper functions (optional but recommended for future features)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

BEGIN;

-- ============================================================================
-- Utility Helpers
-- ============================================================================

-- Shared trigger to keep updated_at columns in sync
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Helper to safely read a BIGINT claim from the active JWT (returns NULL if absent)
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

-- ============================================================================
-- Authentication & Core Profile
-- ============================================================================

-- Authentication credentials (students, recruiters, admins)
CREATE TABLE IF NOT EXISTS public.authentication (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    primary_email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'recruiter', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_auth_update ON public.authentication;
CREATE TRIGGER trg_auth_update
BEFORE UPDATE ON public.authentication
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- Primary profile for every authenticated user (1:1 with authentication)
CREATE TABLE IF NOT EXISTS public.personal_details (
    user_id BIGINT PRIMARY KEY REFERENCES public.authentication(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    dob DATE NOT NULL,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
    institute_roll_no TEXT NOT NULL UNIQUE,
    personal_email TEXT,
    phone_number TEXT NOT NULL UNIQUE,
    profile_picture TEXT,
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_personal_details_update ON public.personal_details;
CREATE TRIGGER trg_personal_details_update
BEFORE UPDATE ON public.personal_details
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- ============================================================================
-- Student Experience Records
-- ============================================================================

-- Internship history captured per student
CREATE TABLE IF NOT EXISTS public.internships (
    internship_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    location TEXT NOT NULL,
    company_sector TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    stipend_salary NUMERIC(10, 2) CHECK (stipend_salary >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (start_date < end_date)
);

DROP TRIGGER IF EXISTS trg_internships_update ON public.internships;
CREATE TRIGGER trg_internships_update
BEFORE UPDATE ON public.internships
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- Volunteering experience log
CREATE TABLE IF NOT EXISTS public.volunteering (
    volunteering_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
    location TEXT NOT NULL,
    company_sector TEXT NOT NULL,
    task TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (start_date < end_date)
);

DROP TRIGGER IF EXISTS trg_volunteering_update ON public.volunteering;
CREATE TRIGGER trg_volunteering_update
BEFORE UPDATE ON public.volunteering
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- Skills catalog per student
CREATE TABLE IF NOT EXISTS public.skills (
    skill_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    skill_proficiency TEXT CHECK (skill_proficiency IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_skill_per_user UNIQUE (user_id, skill_name)
);

DROP TRIGGER IF EXISTS trg_skills_update ON public.skills;
CREATE TRIGGER trg_skills_update
BEFORE UPDATE ON public.skills
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- Student project portfolio entries
CREATE TABLE IF NOT EXISTS public.projects (
    project_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
    project_title TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT NOT NULL,
    project_link TEXT,
    role TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_projects_update ON public.projects;
CREATE TRIGGER trg_projects_update
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- Awards and achievements
CREATE TABLE IF NOT EXISTS public.accomplishments (
    accomplishment_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    institution TEXT,
    type TEXT,
    description TEXT,
    accomplishment_date DATE,
    rank TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_accomplishments_update ON public.accomplishments;
CREATE TRIGGER trg_accomplishments_update
BEFORE UPDATE ON public.accomplishments
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- Extra curricular activities
CREATE TABLE IF NOT EXISTS public.extra_curricular (
    extra_curricular_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
    activity_name TEXT,
    role TEXT,
    organization TEXT,
    duration TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_extra_curricular_update ON public.extra_curricular;
CREATE TRIGGER trg_extra_curricular_update
BEFORE UPDATE ON public.extra_curricular
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- Competition participation records
CREATE TABLE IF NOT EXISTS public.competition_events (
    event_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
    event_name TEXT NOT NULL,
    event_date DATE NOT NULL,
    role TEXT,
    achievement TEXT,
    skills TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_competition_events_update ON public.competition_events;
CREATE TRIGGER trg_competition_events_update
BEFORE UPDATE ON public.competition_events
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- Supporting indexes for student records
CREATE INDEX IF NOT EXISTS idx_internships_user_id ON public.internships (user_id);
CREATE INDEX IF NOT EXISTS idx_volunteering_user_id ON public.volunteering (user_id);
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON public.skills (user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects (user_id);
CREATE INDEX IF NOT EXISTS idx_accomplishments_user_id ON public.accomplishments (user_id);
CREATE INDEX IF NOT EXISTS idx_extra_curricular_user_id ON public.extra_curricular (user_id);
CREATE INDEX IF NOT EXISTS idx_competition_events_user_id ON public.competition_events (user_id);

-- ============================================================================
-- Recruiter Profile & Hiring Workflow
-- ============================================================================

-- Recruiter company profile (1:1 with authentication)
CREATE TABLE IF NOT EXISTS public.recruiter_profiles (
    recruiter_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES public.authentication(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    industry TEXT,
    company_size TEXT,
    company_email TEXT,
    company_phone TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state_province TEXT,
    country TEXT,
    postal_code TEXT,
    website TEXT,
    description TEXT,
    founded_year INT,
    logo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_recruiter_profiles_update ON public.recruiter_profiles;
CREATE TRIGGER trg_recruiter_profiles_update
BEFORE UPDATE ON public.recruiter_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- Job postings authored by recruiters
CREATE TABLE IF NOT EXISTS public.job_postings (
    job_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    recruiter_id BIGINT NOT NULL REFERENCES public.recruiter_profiles(recruiter_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    employment_type TEXT,
    job_function TEXT,
    location TEXT NOT NULL,
    openings INT NOT NULL DEFAULT 1 CHECK (openings > 0),
    salary_ctc NUMERIC(12, 2) CHECK (salary_ctc >= 0),
    stipend_amount NUMERIC(12, 2) CHECK (stipend_amount >= 0),
    compensation_notes TEXT,
    description TEXT NOT NULL,
    application_deadline DATE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'paused', 'closed', 'published')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_job_postings_update ON public.job_postings;
CREATE TRIGGER trg_job_postings_update
BEFORE UPDATE ON public.job_postings
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- Applications submitted for recruiter jobs
CREATE TABLE IF NOT EXISTS public.job_applications (
    application_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    job_id BIGINT NOT NULL REFERENCES public.job_postings(job_id) ON DELETE CASCADE,
    student_user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
    resume_url TEXT,
    cover_letter TEXT,
    current_stage TEXT NOT NULL DEFAULT 'Application Review',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'rejected', 'hired')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_application_per_job UNIQUE (job_id, student_user_id)
);

DROP TRIGGER IF EXISTS trg_job_applications_update ON public.job_applications;
CREATE TRIGGER trg_job_applications_update
BEFORE UPDATE ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- Screening milestones recorded on each application
CREATE TABLE IF NOT EXISTS public.application_screenings (
    screening_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES public.job_applications(application_id) ON DELETE CASCADE,
    stage_name TEXT NOT NULL,
    outcome TEXT DEFAULT 'pending' CHECK (outcome IN ('pending', 'pass', 'fail')),
    scheduled_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Supporting indexes for recruiter workflow
CREATE INDEX IF NOT EXISTS idx_recruiter_profiles_user_id ON public.recruiter_profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_recruiter_id ON public.job_postings (recruiter_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON public.job_applications (job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_student_user_id ON public.job_applications (student_user_id);
CREATE INDEX IF NOT EXISTS idx_application_screenings_application_id ON public.application_screenings (application_id);

-- ============================================================================
-- Row-Level Security (enable when policies are ready)
-- ============================================================================

ALTER TABLE public.authentication ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteering ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accomplishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extra_curricular ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_screenings ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- Row Level Security Policies
-- =========================================================================

-- Allow a user (based on JWT `id` claim) to read their own personal details
DROP POLICY IF EXISTS personal_details_select_self ON public.personal_details;
CREATE POLICY personal_details_select_self
ON public.personal_details
FOR SELECT
USING (public.jwt_claim_bigint('id') = user_id);

-- Allow a user to insert their own personal details row
DROP POLICY IF EXISTS personal_details_insert_self ON public.personal_details;
CREATE POLICY personal_details_insert_self
ON public.personal_details
FOR INSERT
WITH CHECK (public.jwt_claim_bigint('id') = user_id);

-- Allow a user to update only their personal details row
DROP POLICY IF EXISTS personal_details_update_self ON public.personal_details;
CREATE POLICY personal_details_update_self
ON public.personal_details
FOR UPDATE
USING (public.jwt_claim_bigint('id') = user_id)
WITH CHECK (public.jwt_claim_bigint('id') = user_id);

-- Note: Define granular RLS policies per table to suit application security needs.

-- ============================================================================
-- Optional Content Maintenance (legacy compatibility)
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'content'
    ) THEN
    EXECUTE 'ALTER TABLE public.content ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT ARRAY[]::TEXT[]';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_content_categories ON public.content USING GIN (categories)';
    EXECUTE 'UPDATE public.content SET categories = ARRAY[type] WHERE categories IS NULL OR array_length(categories, 1) IS NULL';
    END IF;
END;
$$;

DROP TABLE IF EXISTS public.messages;

-- ============================================================================
-- Finalize Transaction
-- ============================================================================

COMMIT;
