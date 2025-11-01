
const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const authenticateToken = require("../middleware/authenticationToken");
const requireRecruiter = require("../middleware/requireRecruiter");

router.use(authenticateToken, requireRecruiter);

const ALLOWED_JOB_STATUSES = new Set(["draft", "open", "paused", "closed", "published"]);
const APPLICATION_STATUSES = new Set(["submitted", "in_review", "interview", "offer", "hired", "rejected", "withdrawn"]);

function normalizeEmploymentType(value) {
  if (!value) {
    return null;
  }

  const normalized = String(value).trim().toLowerCase().replace(/\s+/g, "-");
  const map = {
    internship: "Internship",
    "full-time": "Full-time",
    fulltime: "Full-time",
    "full_time": "Full-time",
    "part-time": "Contract",
    parttime: "Contract",
    contract: "Contract",
    apprenticeship: "Apprenticeship",
  };

  return map[normalized] || null;
}

function parsePositiveInt(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return Math.floor(parsed);
}

function parseNullableNumber(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function statusToFlags(status = "draft") {
  const normalized = String(status || "draft").toLowerCase();

  switch (normalized) {
    case "open":
    case "published":
      return { is_public: true, is_active: true };
    case "paused":
      return { is_public: false, is_active: true };
    case "closed":
      return { is_public: true, is_active: false };
    default:
      return { is_public: false, is_active: false };
  }
}

function flagsToStatus(job) {
  if (job.is_active && job.is_public) {
    return "open";
  }
  if (job.is_active && !job.is_public) {
    return "paused";
  }
  if (!job.is_active && job.is_public) {
    return "closed";
  }
  return "draft";
}

async function getRecruiterContext(recruiterId) {
  const { data, error } = await supabase
    .from("recruiter_profiles")
    .select("recruiter_id, company_id")
    .eq("recruiter_id", recruiterId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
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

async function upsertHeadcount(jobId, openings) {
  const parsed = parsePositiveInt(openings);

  if (!parsed) {
    await supabase
      .from("job_requirements")
      .delete()
      .eq("job_id", jobId)
      .eq("requirement_type", "headcount");
    return null;
  }

  const { data: existing, error: lookupError } = await supabase
    .from("job_requirements")
    .select("requirement_id")
    .eq("job_id", jobId)
    .eq("requirement_type", "headcount")
    .maybeSingle();

  if (lookupError) {
    throw lookupError;
  }

  if (existing) {
    const { error: updateError } = await supabase
      .from("job_requirements")
      .update({ description: String(parsed) })
      .eq("requirement_id", existing.requirement_id);

    if (updateError) {
      throw updateError;
    }
  } else {
    const { error: insertError } = await supabase
      .from("job_requirements")
      .insert([
        {
          job_id: jobId,
          requirement_type: "headcount",
          description: String(parsed),
          order_index: 0,
        },
      ]);

    if (insertError) {
      throw insertError;
    }
  }

  return parsed;
}

async function getHeadcountMap(jobIds) {
  if (!jobIds.length) {
    return new Map();
  }

  const { data, error } = await supabase
    .from("job_requirements")
    .select("job_id, description")
    .in("job_id", jobIds)
    .eq("requirement_type", "headcount");

  if (error) {
    throw error;
  }

  const map = new Map();
  for (const row of data || []) {
    const parsed = parsePositiveInt(row.description);
    map.set(row.job_id, parsed);
  }
  return map;
}

function toClientJob(job, openings, applicationsCount = 0) {
  const status = flagsToStatus(job);
  const isInternship = job.employment_type === "Internship";

  return {
    job_id: job.job_id,
    title: job.title,
    job_function: job.department || null,
    employment_type: job.employment_type,
    work_mode: job.work_mode || null,
    location: job.location || "",
    description: job.description || "",
    responsibilities: job.responsibilities || null,
    qualifications: job.qualifications || null,
    skills: job.skills || [],
    experience_level: job.experience_level || null,
    application_deadline: job.application_deadline,
    apply_link: job.apply_link || null,
    salary_ctc: isInternship ? null : job.salary_max,
    stipend_amount: isInternship ? job.salary_max : null,
    compensation_notes: job.compensation_details || null,
    openings: openings ?? null,
    status,
    is_public: job.is_public,
    is_active: job.is_active,
    company_id: job.company_id,
    recruiter_id: job.recruiter_id,
    applications_count: applicationsCount,
    created_at: job.created_at,
    updated_at: job.updated_at,
  };
}

router.get("/", async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const profile = await getRecruiterContext(recruiterId);
    if (!profile) {
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

    const jobList = jobs || [];
    const jobIds = jobList.map((job) => job.job_id);
    const headcounts = await getHeadcountMap(jobIds);

    const normalized = jobList.map((job) => {
      const applicationsCount = job.job_applications?.[0]?.count ?? 0;
      const { job_applications, ...rest } = job;
      return toClientJob(rest, headcounts.get(job.job_id) ?? null, applicationsCount);
    });

    return res.status(200).json({ message: "Jobs retrieved", data: normalized });
  } catch (error) {
    console.error("Error listing jobs:", error);
    return res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

router.post("/", async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const profile = await getRecruiterContext(recruiterId);
    if (!profile || !profile.company_id) {
      return res.status(409).json({ message: "Complete your company profile before posting jobs" });
    }

    const title = req.body.title ? String(req.body.title).trim() : "";
    const location = req.body.location ? String(req.body.location).trim() : "";
    const description = req.body.description ? String(req.body.description).trim() : "";
    const employmentType = normalizeEmploymentType(req.body.employment_type || req.body.positionType || "");

    if (!title || !location || !description) {
      return res.status(400).json({ message: "title, location, and description are required" });
    }

    if (!employmentType) {
      return res.status(400).json({ message: "employment_type is invalid" });
    }

    const salaryCtc = parseNullableNumber(req.body.salary_ctc);
    const stipendAmount = parseNullableNumber(req.body.stipend_amount);
    const salaryMin = employmentType === "Internship" ? stipendAmount : salaryCtc;
    const salaryMax = employmentType === "Internship" ? stipendAmount : salaryCtc;

    const { is_public, is_active } = statusToFlags(req.body.status);

    const payload = {
      recruiter_id: recruiterId,
      company_id: profile.company_id,
      title,
      department: req.body.job_function || null,
      employment_type: employmentType,
      work_mode: req.body.work_mode || null,
      location,
      salary_min: salaryMin,
      salary_max: salaryMax,
      currency: req.body.currency || "INR",
      compensation_details: req.body.compensation_notes || null,
      description,
      responsibilities: req.body.responsibilities || null,
      qualifications: req.body.qualifications || null,
      skills: Array.isArray(req.body.skills) ? req.body.skills : null,
      experience_level: req.body.experience_level || null,
      application_deadline: req.body.application_deadline || null,
      apply_link: req.body.apply_link || null,
      is_public,
      is_active,
      expires_at: req.body.expires_at || null,
    };

    const { data: job, error } = await supabase
      .from("job_postings")
      .insert([payload])
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    const openings = await upsertHeadcount(job.job_id, req.body.openings);

    return res.status(201).json({
      message: "Job created",
      data: toClientJob(job, openings, 0),
    });
  } catch (error) {
    console.error("Error creating job:", error);
    return res.status(500).json({ message: "Failed to create job" });
  }
});

router.get("/:jobId", async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { jobId } = req.params;

    const { data: job, error } = await supabase
      .from("job_postings")
      .select("*")
      .eq("job_id", jobId)
      .eq("recruiter_id", recruiterId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const headcounts = await getHeadcountMap([job.job_id]);

    return res.status(200).json({
      message: "Job retrieved",
      data: toClientJob(job, headcounts.get(job.job_id) ?? null, 0),
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    return res.status(500).json({ message: "Failed to fetch job" });
  }
});

router.put("/:jobId", async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { jobId } = req.params;

    const { data: existingJob, error: fetchError } = await supabase
      .from("job_postings")
      .select("*")
      .eq("job_id", jobId)
      .eq("recruiter_id", recruiterId)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (!existingJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    const title = req.body.title ? String(req.body.title).trim() : existingJob.title;
    const location = req.body.location ? String(req.body.location).trim() : existingJob.location;
    const description = req.body.description ? String(req.body.description).trim() : existingJob.description;
    const employmentType = normalizeEmploymentType(req.body.employment_type || existingJob.employment_type);

    if (!title || !location || !description) {
      return res.status(400).json({ message: "title, location, and description are required" });
    }

    if (!employmentType) {
      return res.status(400).json({ message: "employment_type is invalid" });
    }

    const salaryCtc = parseNullableNumber(req.body.salary_ctc);
    const stipendAmount = parseNullableNumber(req.body.stipend_amount);
    const salaryMin = employmentType === "Internship" ? stipendAmount : salaryCtc;
    const salaryMax = employmentType === "Internship" ? stipendAmount : salaryCtc;
    const incomingStatus = req.body.status || flagsToStatus(existingJob);

    const { is_public, is_active } = statusToFlags(incomingStatus);

    const updatePayload = {
      title,
      department: req.body.job_function ?? existingJob.department,
      employment_type: employmentType,
      work_mode: req.body.work_mode ?? existingJob.work_mode,
      location,
      salary_min: salaryMin,
      salary_max: salaryMax,
      currency: req.body.currency || existingJob.currency || "INR",
      compensation_details: req.body.compensation_notes ?? existingJob.compensation_details,
      description,
      responsibilities: req.body.responsibilities ?? existingJob.responsibilities,
      qualifications: req.body.qualifications ?? existingJob.qualifications,
      skills: Array.isArray(req.body.skills) ? req.body.skills : existingJob.skills,
      experience_level: req.body.experience_level ?? existingJob.experience_level,
      application_deadline: req.body.application_deadline ?? existingJob.application_deadline,
      apply_link: req.body.apply_link ?? existingJob.apply_link,
      is_public,
      is_active,
      expires_at: req.body.expires_at ?? existingJob.expires_at,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedJob, error: updateError } = await supabase
      .from("job_postings")
      .update(updatePayload)
      .eq("job_id", jobId)
      .eq("recruiter_id", recruiterId)
      .select("*")
      .single();

    if (updateError) {
      throw updateError;
    }

    const openings = await upsertHeadcount(jobId, req.body.openings);
    const headcounts = openings ?? (await getHeadcountMap([jobId])).get(jobId) ?? null;

    return res.status(200).json({
      message: "Job updated",
      data: toClientJob(updatedJob, headcounts, 0),
    });
  } catch (error) {
    console.error("Error updating job:", error);
    return res.status(500).json({ message: "Failed to update job" });
  }
});

router.patch("/:jobId/status", async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { jobId } = req.params;
    const { status } = req.body;

    if (!ALLOWED_JOB_STATUSES.has(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const ownsJob = await assertJobOwnership(jobId, recruiterId);
    if (!ownsJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    const { is_public, is_active } = statusToFlags(status);

    const { data: job, error } = await supabase
      .from("job_postings")
      .update({ is_public, is_active, updated_at: new Date().toISOString() })
      .eq("job_id", jobId)
      .eq("recruiter_id", recruiterId)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    const headcounts = await getHeadcountMap([jobId]);

    return res.status(200).json({
      message: "Job status updated",
      data: toClientJob(job, headcounts.get(jobId) ?? null, 0),
    });
  } catch (error) {
    console.error("Error updating job status:", error);
    return res.status(500).json({ message: "Failed to update status" });
  }
});

router.get("/:jobId/applications", async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { jobId } = req.params;

    const ownsJob = await assertJobOwnership(jobId, recruiterId);
    if (!ownsJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    const { data: applications, error } = await supabase
      .from("job_applications")
      .select(
        `application_id,
         job_id,
         user_id,
         resume_version_id,
         cover_letter,
         portfolio_url,
         status,
         current_stage,
         applied_at,
         updated_at,
         personal_details:user_id (
           first_name,
           last_name,
           personal_email,
           phone_number,
           institute_roll_no
         )`
      )
      .eq("job_id", jobId)
      .order("applied_at", { ascending: false });

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
    const recruiterId = req.user.id;
    const { jobId } = req.params;

    const ownsJob = await assertJobOwnership(jobId, recruiterId);
    if (!ownsJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    const applicantId = parsePositiveInt(req.body.user_id ?? req.body.student_user_id);
    if (!applicantId) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const { data: candidate, error: candidateError } = await supabase
      .from("personal_details")
      .select("user_id")
      .eq("user_id", applicantId)
      .maybeSingle();

    if (candidateError) {
      throw candidateError;
    }

    if (!candidate) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    const status = APPLICATION_STATUSES.has(req.body.status) ? req.body.status : "submitted";

    const { data: application, error } = await supabase
      .from("job_applications")
      .insert([
        {
          job_id: jobId,
          user_id: applicantId,
          resume_version_id: req.body.resume_version_id || null,
          cover_letter: req.body.cover_letter || null,
          portfolio_url: req.body.portfolio_url || null,
          status,
          current_stage: req.body.current_stage || "Application Review",
        },
      ])
      .select("*")
      .single();

    if (error) {
      if (error.code === "23505") {
        return res.status(409).json({ message: "Candidate has already applied" });
      }
      throw error;
    }

    const { data: personal, error: personalError } = await supabase
      .from("personal_details")
      .select("first_name, last_name, personal_email, phone_number, institute_roll_no")
      .eq("user_id", applicantId)
      .maybeSingle();

    if (personalError) {
      throw personalError;
    }

    return res.status(201).json({
      message: "Application created",
      data: {
        ...application,
        first_name: personal?.first_name ?? null,
        last_name: personal?.last_name ?? null,
        personal_email: personal?.personal_email ?? null,
        phone_number: personal?.phone_number ?? null,
        institute_roll_no: personal?.institute_roll_no ?? null,
      },
    });
  } catch (error) {
    console.error("Error creating application:", error);
    return res.status(500).json({ message: "Failed to create application" });
  }
});

module.exports = router;
