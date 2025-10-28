const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authenticateToken = require("../middleware/authenticationToken");
const requireRecruiter = require("../middleware/requireRecruiter");

router.use(authenticateToken, requireRecruiter);

const allowedStatuses = ["draft", "open", "paused", "closed", "published"];

async function getRecruiterProfileId(userId) {
  const result = await pool.query(
    "SELECT recruiter_id FROM recruiter_profiles WHERE user_id = $1",
    [userId]
  );
  return result.rows[0]?.recruiter_id || null;
}

async function assertJobOwnership(jobId, recruiterId) {
  const result = await pool.query(
    "SELECT job_id FROM job_postings WHERE job_id = $1 AND recruiter_id = $2",
    [jobId, recruiterId]
  );
  return result.rows.length > 0;
}

function parseNullableNumber(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

router.get("/", async (req, res) => {
  try {
    const recruiterId = await getRecruiterProfileId(req.user.id);
    if (!recruiterId) {
      return res.status(409).json({ message: "Create a recruiter profile before listing jobs" });
    }

    const result = await pool.query(
      `SELECT jp.*, COALESCE(app_counts.count, 0) AS applications_count
       FROM job_postings jp
       LEFT JOIN (
         SELECT job_id, COUNT(*) AS count
         FROM job_applications
         GROUP BY job_id
       ) AS app_counts ON app_counts.job_id = jp.job_id
       WHERE jp.recruiter_id = $1
       ORDER BY jp.created_at DESC`,
      [recruiterId]
    );

    return res.status(200).json({ message: "Jobs retrieved", data: result.rows });
  } catch (error) {
    console.error("Error listing jobs:", error);
    return res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

router.post("/", async (req, res) => {
  try {
    const recruiterId = await getRecruiterProfileId(req.user.id);
    if (!recruiterId) {
      return res.status(409).json({ message: "Create a recruiter profile before posting jobs" });
    }

    const {
      title,
      employment_type,
      job_function,
      location,
      openings,
      salary_ctc,
      stipend_amount,
      compensation_notes,
      description,
      application_deadline,
      status,
    } = req.body;

    if (!title || !location || !description) {
      return res.status(400).json({ message: "title, location, and description are required" });
    }

    const normalizedStatus = status && allowedStatuses.includes(status) ? status : "draft";
    const cleanOpenings = parseInt(openings, 10);

    const insertQuery = `
      INSERT INTO job_postings (
        recruiter_id, title, employment_type, job_function, location,
        openings, salary_ctc, stipend_amount, compensation_notes, description,
        application_deadline, status
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12
      ) RETURNING *;
    `;

    const values = [
      recruiterId,
      title,
      employment_type || null,
      job_function || null,
      location,
      Number.isNaN(cleanOpenings) || cleanOpenings <= 0 ? 1 : cleanOpenings,
      parseNullableNumber(salary_ctc),
      parseNullableNumber(stipend_amount),
      compensation_notes || null,
      description,
      application_deadline || null,
      normalizedStatus,
    ];

    const result = await pool.query(insertQuery, values);
    return res.status(201).json({ message: "Job created", data: result.rows[0] });
  } catch (error) {
    console.error("Error creating job:", error);
    return res.status(500).json({ message: "Failed to create job" });
  }
});

router.get("/:jobId", async (req, res) => {
  try {
    const recruiterId = await getRecruiterProfileId(req.user.id);
    if (!recruiterId) {
      return res.status(409).json({ message: "Create a recruiter profile before accessing jobs" });
    }

    const { jobId } = req.params;
    const result = await pool.query(
      "SELECT * FROM job_postings WHERE job_id = $1 AND recruiter_id = $2",
      [jobId, recruiterId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({ message: "Job retrieved", data: result.rows[0] });
  } catch (error) {
    console.error("Error fetching job:", error);
    return res.status(500).json({ message: "Failed to fetch job" });
  }
});

router.put("/:jobId", async (req, res) => {
  try {
    const recruiterId = await getRecruiterProfileId(req.user.id);
    if (!recruiterId) {
      return res.status(409).json({ message: "Create a recruiter profile before updating jobs" });
    }

    const { jobId } = req.params;

    const ownsJob = await assertJobOwnership(jobId, recruiterId);
    if (!ownsJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    const fields = {
      title: req.body.title,
      employment_type: req.body.employment_type,
      job_function: req.body.job_function,
      location: req.body.location,
      openings: req.body.openings,
      salary_ctc: parseNullableNumber(req.body.salary_ctc),
      stipend_amount: parseNullableNumber(req.body.stipend_amount),
      compensation_notes: req.body.compensation_notes,
      description: req.body.description,
      application_deadline: req.body.application_deadline,
      status: req.body.status,
    };

    if (!fields.title || !fields.location || !fields.description) {
      return res.status(400).json({ message: "title, location, and description are required" });
    }

    if (fields.status && !allowedStatuses.includes(fields.status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const cleanOpenings = parseInt(fields.openings, 10);

    const updateQuery = `
      UPDATE job_postings SET
        title = $1,
        employment_type = $2,
        job_function = $3,
        location = $4,
        openings = $5,
        salary_ctc = $6,
        stipend_amount = $7,
        compensation_notes = $8,
        description = $9,
        application_deadline = $10,
        status = $11,
        updated_at = NOW()
      WHERE job_id = $12
      RETURNING *;
    `;

    const values = [
      fields.title,
      fields.employment_type || null,
      fields.job_function || null,
      fields.location,
      Number.isNaN(cleanOpenings) || cleanOpenings <= 0 ? 1 : cleanOpenings,
      fields.salary_ctc,
      fields.stipend_amount,
      fields.compensation_notes || null,
      fields.description,
      fields.application_deadline || null,
      fields.status || "draft",
      jobId,
    ];

    const result = await pool.query(updateQuery, values);
    return res.status(200).json({ message: "Job updated", data: result.rows[0] });
  } catch (error) {
    console.error("Error updating job:", error);
    return res.status(500).json({ message: "Failed to update job" });
  }
});

router.patch("/:jobId/status", async (req, res) => {
  try {
    const recruiterId = await getRecruiterProfileId(req.user.id);
    if (!recruiterId) {
      return res.status(409).json({ message: "Create a recruiter profile before updating jobs" });
    }

    const { jobId } = req.params;
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const ownsJob = await assertJobOwnership(jobId, recruiterId);
    if (!ownsJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    const result = await pool.query(
      "UPDATE job_postings SET status = $1, updated_at = NOW() WHERE job_id = $2 RETURNING *",
      [status, jobId]
    );

    return res.status(200).json({ message: "Job status updated", data: result.rows[0] });
  } catch (error) {
    console.error("Error updating job status:", error);
    return res.status(500).json({ message: "Failed to update status" });
  }
});

router.get("/:jobId/applications", async (req, res) => {
  try {
    const recruiterId = await getRecruiterProfileId(req.user.id);
    if (!recruiterId) {
      return res.status(409).json({ message: "Create a recruiter profile before accessing applications" });
    }

    const { jobId } = req.params;
    const ownsJob = await assertJobOwnership(jobId, recruiterId);
    if (!ownsJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    const result = await pool.query(
      `SELECT ja.*, pd.first_name, pd.last_name, pd.personal_email, pd.phone_number,
              pd.institute_roll_no
       FROM job_applications ja
       JOIN personal_details pd ON pd.user_id = ja.student_user_id
       WHERE ja.job_id = $1
       ORDER BY ja.created_at DESC`,
      [jobId]
    );

    return res.status(200).json({ message: "Applications retrieved", data: result.rows });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({ message: "Failed to fetch applications" });
  }
});

router.post("/:jobId/applications", async (req, res) => {
  try {
    const recruiterId = await getRecruiterProfileId(req.user.id);
    if (!recruiterId) {
      return res.status(409).json({ message: "Create a recruiter profile before adding applications" });
    }

    const { jobId } = req.params;
    const ownsJob = await assertJobOwnership(jobId, recruiterId);
    if (!ownsJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    const {
      student_user_id,
      resume_url,
      cover_letter,
      current_stage,
      status,
      notes,
    } = req.body;

    if (!student_user_id) {
      return res.status(400).json({ message: "student_user_id is required" });
    }

    const candidateResult = await pool.query(
      "SELECT user_id FROM personal_details WHERE user_id = $1",
      [student_user_id]
    );

    if (candidateResult.rows.length === 0) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    const normalizedStatus = status && ["pending", "in_progress", "rejected", "hired"].includes(status)
      ? status
      : "pending";

    const insertQuery = `
      INSERT INTO job_applications (
        job_id, student_user_id, resume_url, cover_letter, current_stage, status, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (job_id, student_user_id) DO UPDATE SET
        resume_url = EXCLUDED.resume_url,
        cover_letter = EXCLUDED.cover_letter,
        current_stage = EXCLUDED.current_stage,
        status = EXCLUDED.status,
        notes = EXCLUDED.notes,
        updated_at = NOW()
      RETURNING *;
    `;

    const result = await pool.query(insertQuery, [
      jobId,
      student_user_id,
      resume_url || null,
      cover_letter || null,
      current_stage || "Application Review",
      normalizedStatus,
      notes || null,
    ]);

    return res.status(201).json({ message: "Application saved", data: result.rows[0] });
  } catch (error) {
    console.error("Error saving application:", error);
    return res.status(500).json({ message: "Failed to save application" });
  }
});

router.patch("/:jobId/applications/:applicationId", async (req, res) => {
  try {
    const recruiterId = await getRecruiterProfileId(req.user.id);
    if (!recruiterId) {
      return res.status(409).json({ message: "Create a recruiter profile before updating applications" });
    }

    const { jobId, applicationId } = req.params;
    const ownsJob = await assertJobOwnership(jobId, recruiterId);
    if (!ownsJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    const { current_stage, status, notes } = req.body;

    const updates = [];
    const values = [];

    if (current_stage) {
      updates.push(`current_stage = $${updates.length + 1}`);
      values.push(current_stage);
    }

    if (status) {
      const allowed = ["pending", "in_progress", "rejected", "hired"];
      if (!allowed.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      updates.push(`status = $${updates.length + 1}`);
      values.push(status);
    }

    if (notes !== undefined) {
      updates.push(`notes = $${updates.length + 1}`);
      values.push(notes);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const query = `
      UPDATE job_applications
      SET ${updates.join(", ")}, updated_at = NOW()
      WHERE application_id = $${updates.length + 1} AND job_id = $${updates.length + 2}
      RETURNING *;
    `;

    const result = await pool.query(query, [...values, applicationId, jobId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.status(200).json({ message: "Application updated", data: result.rows[0] });
  } catch (error) {
    console.error("Error updating application:", error);
    return res.status(500).json({ message: "Failed to update application" });
  }
});

router.get("/:jobId/applications/:applicationId/screenings", async (req, res) => {
  try {
    const recruiterId = await getRecruiterProfileId(req.user.id);
    if (!recruiterId) {
      return res.status(409).json({ message: "Create a recruiter profile before accessing screenings" });
    }

    const { jobId, applicationId } = req.params;
    const ownsJob = await assertJobOwnership(jobId, recruiterId);
    if (!ownsJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    const applicationResult = await pool.query(
      "SELECT application_id FROM job_applications WHERE application_id = $1 AND job_id = $2",
      [applicationId, jobId]
    );

    if (applicationResult.rows.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    const screenings = await pool.query(
      "SELECT * FROM application_screenings WHERE application_id = $1 ORDER BY created_at DESC",
      [applicationId]
    );

    return res.status(200).json({ message: "Screenings retrieved", data: screenings.rows });
  } catch (error) {
    console.error("Error fetching screenings:", error);
    return res.status(500).json({ message: "Failed to fetch screenings" });
  }
});

router.post("/:jobId/applications/:applicationId/screenings", async (req, res) => {
  try {
    const recruiterId = await getRecruiterProfileId(req.user.id);
    if (!recruiterId) {
      return res.status(409).json({ message: "Create a recruiter profile before recording screenings" });
    }

    const { jobId, applicationId } = req.params;
    const ownsJob = await assertJobOwnership(jobId, recruiterId);
    if (!ownsJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    const applicationResult = await pool.query(
      "SELECT application_id FROM job_applications WHERE application_id = $1 AND job_id = $2",
      [applicationId, jobId]
    );

    if (applicationResult.rows.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    const { stage_name, outcome, scheduled_at, notes } = req.body;

    if (!stage_name) {
      return res.status(400).json({ message: "stage_name is required" });
    }

    if (outcome && !["pending", "pass", "fail"].includes(outcome)) {
      return res.status(400).json({ message: "Invalid outcome" });
    }

    const insertQuery = `
      INSERT INTO application_screenings (application_id, stage_name, outcome, scheduled_at, notes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const result = await pool.query(insertQuery, [
      applicationId,
      stage_name,
      outcome || "pending",
      scheduled_at || null,
      notes || null,
    ]);

    return res.status(201).json({ message: "Screening recorded", data: result.rows[0] });
  } catch (error) {
    console.error("Error recording screening:", error);
    return res.status(500).json({ message: "Failed to record screening" });
  }
});

module.exports = router;
