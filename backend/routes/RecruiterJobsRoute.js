const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const authenticateToken = require("../middleware/authenticationToken");
const requireRecruiter = require("../middleware/requireRecruiter");

router.use(authenticateToken, requireRecruiter);

const allowedStatuses = ["draft", "open", "paused", "closed", "published"];

async function getRecruiterProfileId(userId) {
  const { data, error } = await supabase
    .from("recruiter_profiles")
    .select("recruiter_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.recruiter_id ?? null;
}

async function assertJobOwnership(jobId, recruiterId) {
  const { data, error } = await supabase
    .from("job_postings")
    .select("job_id")
    .eq("job_id", jobId)
    .eq("recruiter_id", recruiterId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
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

    const { data: jobs, error } = await supabase
      .from("job_postings")
      .select("*, job_applications(count)")
      .eq("recruiter_id", recruiterId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const normalized = (jobs || []).map((job) => {
      const applicationsCount = job.job_applications?.[0]?.count ?? 0;
      const { job_applications, ...rest } = job;
      return { ...rest, applications_count: applicationsCount };
    });

    return res.status(200).json({ message: "Jobs retrieved", data: normalized });
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

    const payload = {
      recruiter_id: recruiterId,
      title,
      employment_type: employment_type || null,
      job_function: job_function || null,
      location,
      openings: Number.isNaN(cleanOpenings) || cleanOpenings <= 0 ? 1 : cleanOpenings,
      salary_ctc: parseNullableNumber(salary_ctc),
      stipend_amount: parseNullableNumber(stipend_amount),
      compensation_notes: compensation_notes || null,
      description,
      application_deadline: application_deadline || null,
      status: normalizedStatus,
    };

    const { data, error } = await supabase
      .from("job_postings")
      .insert([payload])
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json({ message: "Job created", data });
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
    const { data, error } = await supabase
      .from("job_postings")
      .select("*")
      .eq("job_id", jobId)
      .eq("recruiter_id", recruiterId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({ message: "Job retrieved", data });
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

    const updatePayload = {
      title: fields.title,
      employment_type: fields.employment_type || null,
      job_function: fields.job_function || null,
      location: fields.location,
      openings: Number.isNaN(cleanOpenings) || cleanOpenings <= 0 ? 1 : cleanOpenings,
      salary_ctc: fields.salary_ctc,
      stipend_amount: fields.stipend_amount,
      compensation_notes: fields.compensation_notes || null,
      description: fields.description,
      application_deadline: fields.application_deadline || null,
      status: fields.status || "draft",
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("job_postings")
      .update(updatePayload)
      .eq("job_id", jobId)
      .eq("recruiter_id", recruiterId)
      .select("*")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Job not found" });
      }
      throw error;
    }

    return res.status(200).json({ message: "Job updated", data });
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

    const { data, error } = await supabase
      .from("job_postings")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("job_id", jobId)
      .eq("recruiter_id", recruiterId)
      .select("*")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Job not found" });
      }
      throw error;
    }

    return res.status(200).json({ message: "Job status updated", data });
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

    const { data: applications, error } = await supabase
      .from("job_applications")
      .select(
        `*, personal_details:student_user_id (
          first_name,
          last_name,
          personal_email,
          phone_number,
          institute_roll_no
        )`
      )
      .eq("job_id", jobId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const normalized = (applications || []).map((application) => {
      const personal = Array.isArray(application.personal_details)
        ? application.personal_details[0]
        : application.personal_details;

      const { personal_details, ...rest } = application;

      return {
        ...rest,
        first_name: personal?.first_name ?? null,
        last_name: personal?.last_name ?? null,
        personal_email: personal?.personal_email ?? null,
        phone_number: personal?.phone_number ?? null,
        institute_roll_no: personal?.institute_roll_no ?? null,
      };
    });

    return res.status(200).json({ message: "Applications retrieved", data: normalized });
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

    const { data: candidate, error: candidateError } = await supabase
      .from("personal_details")
      .select("user_id")
      .eq("user_id", student_user_id)
      .maybeSingle();

    if (candidateError) {
      throw candidateError;
    }

    if (!candidate) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    const normalizedStatus = status && ["pending", "in_progress", "rejected", "hired"].includes(status)
      ? status
      : "pending";

    const upsertPayload = {
      job_id: jobId,
      student_user_id,
      resume_url: resume_url || null,
      cover_letter: cover_letter || null,
      current_stage: current_stage || "Application Review",
      status: normalizedStatus,
      notes: notes || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("job_applications")
      .upsert([upsertPayload], { onConflict: "job_id,student_user_id" })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json({ message: "Application saved", data });
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

  const allowedApplicationStatuses = ["pending", "in_progress", "rejected", "hired"];
  const updates = {};

    if (current_stage) {
      updates.current_stage = current_stage;
    }

    if (status) {
      if (!allowedApplicationStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      updates.status = status;
    }

    if (notes !== undefined) {
      updates.notes = notes;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("job_applications")
      .update(updates)
      .eq("application_id", applicationId)
      .eq("job_id", jobId)
      .select("*")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Application not found" });
      }
      throw error;
    }

    return res.status(200).json({ message: "Application updated", data });
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

    const { data: application, error: applicationError } = await supabase
      .from("job_applications")
      .select("application_id")
      .eq("application_id", applicationId)
      .eq("job_id", jobId)
      .maybeSingle();

    if (applicationError) {
      throw applicationError;
    }

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const { data: screenings, error } = await supabase
      .from("application_screenings")
      .select("*")
      .eq("application_id", applicationId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return res.status(200).json({ message: "Screenings retrieved", data: screenings || [] });
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

    const { data: application, error: applicationError } = await supabase
      .from("job_applications")
      .select("application_id")
      .eq("application_id", applicationId)
      .eq("job_id", jobId)
      .maybeSingle();

    if (applicationError) {
      throw applicationError;
    }

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const { stage_name, outcome, scheduled_at, notes } = req.body;

    if (!stage_name) {
      return res.status(400).json({ message: "stage_name is required" });
    }

    if (outcome && !["pending", "pass", "fail"].includes(outcome)) {
      return res.status(400).json({ message: "Invalid outcome" });
    }

    const { data, error } = await supabase
      .from("application_screenings")
      .insert([
        {
          application_id: applicationId,
          stage_name,
          outcome: outcome || "pending",
          scheduled_at: scheduled_at || null,
          notes: notes || null,
        },
      ])
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json({ message: "Screening recorded", data });
  } catch (error) {
    console.error("Error recording screening:", error);
    return res.status(500).json({ message: "Failed to record screening" });
  }
});

module.exports = router;
