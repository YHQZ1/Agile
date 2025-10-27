# Agile Backend API

This document describes the REST endpoints exposed by the Agile backend (`backend/server.js`). All URIs are relative to the API base path.

- **Local base URL:** `http://localhost:5001`
- **Production backend (Render):** `https://<render-backend>.onrender.com`
- **Frontend (Vercel):** `https://<vercel-frontend>.vercel.app`
- **ATS UI (Render):** `https://<render-ats>.onrender.com`
- **Health check:** `GET /` returns `{ "message":"🟢 Backend is live!" }`.

The server accepts JSON bodies (`Content-Type: application/json`) and sets/reads a JWT token named `token` in an HTTP-only cookie. Every protected endpoint also accepts the token via the `Authorization: Bearer <JWT>` header as a fallback. When running in production, cookies ship with `SameSite=None` so requests from Vercel work; make sure HTTPS is used end-to-end and `credentials: 'include'` is set on the frontend fetch call.

## Authentication

### POST `/api/auth/login`
Authenticate a user by email and password.

Request body:
```json
{
  "email": "user@example.com",
  "password": "secret"
}
```

Responses:
- `200 OK` – `{ "message": "Login successful", "token": "<jwt>" }` and `token` cookie is set (1 hour lifetime, `SameSite=None` + `Secure` on Render).
- `400 Bad Request` – missing fields.
- `404 Not Found` – user not found.
- `401 Unauthorized` – password mismatch.
- `500 Internal Server Error` – unexpected failure.

### POST `/api/auth/signup`
Create a new account and issue a JWT.

Request body identical to login. Password is hashed with bcrypt (10 rounds).

Responses:
- `201 Created` – `{ "message": "Sign-up successful", "token": "<jwt>" }` with cookie (same options as login).
- `409 Conflict` – email already registered.
- `400 Bad Request` – missing fields.
- `500 Internal Server Error` – unexpected failure.

### GET `/api/auth/verify`
Validate the current session token.

- Requires `token` cookie.
- `200 OK` – `{ "message": "Token valid", "user": { "id": <number>, "email": "..." } }`
- `401 Unauthorized` – missing or invalid token.

## Profile and Forms (POST)
All routes below require authentication and expect a valid user profile to exist unless stated otherwise.

### POST `/api/personal-details-form`
Create or update the authenticated user’s personal profile. The record is tied to the JWT `userId` and will be updated on subsequent submissions.

Request body (required fields marked *):
```json
{
  "first_name": "Aarav",*
  "last_name": "Sharma",*
  "dob": "2002-05-10",*
  "gender": "Male",
  "institute_roll_no": "IITB20221001",*
  "personal_email": "aarav@example.com",
  "phone_number": "9876543210"*
}
```

Responses:
- `201 Created` – `{ "message": "Personal information saved successfully", "user_id": <number> }` (existing row updates in place)
- `400 Bad Request` – validation failure or unique constraint violation.
- `500 Internal Server Error`

### POST `/api/internship-details-form`
Insert an internship for the logged-in user.

Required body fields: `company_name`, `job_title`, `location`, `company_sector`, `start_date`, `end_date`; optional `stipend_salary`.

Additional rules:
- `start_date` must precede `end_date`.
- User must already have a personal profile (`personal_details`).

Responses: `201 Created` with `internship_id`, `400`, `403` (missing profile or FK violation), `500`.

### POST `/api/volunteer-details-form`
Record a volunteering entry. Required fields: `location`, `company_sector`, `task`, `start_date`, `end_date`. Same FK and date validations as internships.

### POST `/api/skills-form`
Create a skill for the current user.

Body:
```json
{
  "skill_name": "React",*
  "skill_proficiency": "Advanced"
}
```

Accepted proficiency values: `Beginner`, `Intermediate`, `Advanced`, `Expert`.

### POST `/api/projects-form`
Create a project owned by the authenticated user. The backend uses the JWT to determine ownership.

Body fields: `project_title`*, `description`*, `tech_stack`*, `project_link`, `role`.

Responses: `201 Created` with `project_id`; `404` if the user lacks a `personal_details` profile; `400/500` other errors.

### POST `/api/accomplishment-form`
Add an accomplishment.

Body fields: `title`*, `institution`, `type`, `description`, `accomplishment_date`, `rank`.

Requires personal profile; returns `accomplishment_id`.

### POST `/api/extra-curricular-form`
Add an extra-curricular record. At least one of `activity_name`, `role`, `organization`, or `duration` must be provided. Returns `extra_curricular_id`.

### POST `/api/competitions-form`
Insert a competition event. Required fields: `event_name`, `event_date`; optional `role`, `achievement`, `skills`.

## Dashboard (GET)
Each GET route returns only the authenticated user’s records. Admin variants with `/:userId` exist but currently lack explicit role checks.

### GET `/api/personal-information`
Returns the user’s personal details (date formatted as `YYYY-MM-DD`).
- `200 OK` – `{ "message": "Personal details retrieved successfully", "data": { ... } }`
- `404 Not Found` – no record.

### GET `/api/volunteer-information`
List volunteering entries with ISO strings truncated to dates.

### GET `/api/internship-information`
List internships; dates formatted; stipend included.

### GET `/api/competition-information`
List competition events; `event_date` formatted.

### GET `/api/skills-information`
List skills including proficiency.

### GET `/api/accomplishment-information`
List accomplishments; dates formatted.

### GET `/api/extra-curricular-information`
List extra-curricular activities.

Each endpoint returns `404` if no data exists, and `500` if a database error occurs.

## Error Handling
All routes funnel through `middleware/errorMiddleware.js` which logs the stack trace and returns `500 { "error": "Something went wrong!" }` when an uncaught error reaches the middleware.

Common HTTP status codes used:
- `200 OK` – request succeeded.
- `201 Created` – resource created.
- `400 Bad Request` – validation errors or missing fields.
- `401 Unauthorized` – missing or invalid JWT.
- `403 Forbidden` – prerequisite data missing (e.g., profile incomplete).
- `404 Not Found` – resource absent.
- `409 Conflict` – uniqueness conflict.
- `500 Internal Server Error` – unexpected server failure.

## Authentication Notes
- JWT secret is `process.env.JWT_SECRET`.
- Token lifetime: 1 hour.
- Cookies are HTTP-only. In production they ship with `Secure` + `SameSite=None` (works across Vercel/Render); locally they use `SameSite=Lax`.
- CORS allowlist comes from `FRONTEND_URL`, `ATS_URL`, localhost, and any `*.vercel.app` domains.

## Environment Variables
- `SUPABASE_DB_URL` – Postgres connection string (Supabase).
- `JWT_SECRET` – symmetric key for signing JWTs.
- `NODE_ENV` – `development` or `production`; controls cookie settings.
- `FRONTEND_URL` – absolute URL of the Vercel deployment (used for strict CORS).
- `ATS_URL` – absolute URL of the ATS Render deployment (optional, included in CORS allowlist).

## Running Locally
1. Load the schema defined in `backend/database.sql` into Supabase.
2. Copy environment variables (`SUPABASE_DB_URL`, `JWT_SECRET`, `NODE_ENV`, `FRONTEND_URL`, `ATS_URL`) into `.env`.
3. `npm install` inside `backend/`.
4. `node server.js` (or `nodemon`).

The API is now ready to consume from the React frontend or any HTTP client that respects the auth flow above.
