-- database.sql
-- Canonical schema for the Agile backend on Supabase (PostgreSQL)
-- id columns use identity to stay Supabase-compatible. Run inside a Supabase SQL session.

BEGIN;

-- Optional extension for UUIDs (commented out for now)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table backing authentication & authorization
CREATE TABLE IF NOT EXISTS public.authentication (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    primary_email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'recruiter', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_auth_update ON public.authentication;
CREATE TRIGGER trg_auth_update
BEFORE UPDATE ON public.authentication
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- Core profile table (1:1 with authentication)
CREATE TABLE IF NOT EXISTS public.personal_details (
    user_id BIGINT PRIMARY KEY REFERENCES public.authentication(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    dob DATE NOT NULL,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
    institute_roll_no TEXT NOT NULL UNIQUE,
    personal_email TEXT,
    phone_number TEXT NOT NULL UNIQUE,
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_personal_details_update ON public.personal_details;
CREATE TRIGGER trg_personal_details_update
BEFORE UPDATE ON public.personal_details
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- Internships: many-to-one with personal_details
CREATE TABLE IF NOT EXISTS public.internships (
    internship_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.personal_details(user_id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    location TEXT NOT NULL,
    company_sector TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    stipend_salary NUMERIC(10,2) CHECK (stipend_salary >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (start_date < end_date)
);

DROP TRIGGER IF EXISTS trg_internships_update ON public.internships;
CREATE TRIGGER trg_internships_update
BEFORE UPDATE ON public.internships
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- Volunteering
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

-- Skills (per user)
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

-- Projects
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

-- Accomplishments
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

-- Extra Curricular
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

-- Competition events
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

-- Lightweight indexes to support dashboards
CREATE INDEX IF NOT EXISTS idx_internships_user_id ON public.internships (user_id);
CREATE INDEX IF NOT EXISTS idx_volunteering_user_id ON public.volunteering (user_id);
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON public.skills (user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects (user_id);
CREATE INDEX IF NOT EXISTS idx_accomplishments_user_id ON public.accomplishments (user_id);
CREATE INDEX IF NOT EXISTS idx_extra_curricular_user_id ON public.extra_curricular (user_id);
CREATE INDEX IF NOT EXISTS idx_competition_events_user_id ON public.competition_events (user_id);

COMMIT;
