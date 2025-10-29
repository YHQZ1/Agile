const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const authenticateToken = require("../middleware/authenticationToken");
const requireRecruiter = require("../middleware/requireRecruiter");

router.use(authenticateToken, requireRecruiter);

const profileColumns = [
  "company_name",
  "industry",
  "company_size",
  "company_email",
  "company_phone",
  "address_line1",
  "address_line2",
  "city",
  "state_province",
  "country",
  "postal_code",
  "website",
  "description",
  "founded_year",
  "logo_url",
];

router.get("/", async (req, res) => {
  try {
    const { id } = req.user;
    const { data, error } = await supabase
      .from("recruiter_profiles")
      .select("*")
      .eq("user_id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ message: "Recruiter profile not found" });
    }

    return res.status(200).json({ message: "Recruiter profile retrieved", data });
  } catch (error) {
    console.error("Error fetching recruiter profile:", error);
    return res.status(500).json({ message: "Failed to fetch recruiter profile" });
  }
});

router.put("/", async (req, res) => {
  const { id } = req.user;
  const payload = { ...req.body };

  if (!payload.company_name || !payload.company_name.trim()) {
    return res.status(400).json({ message: "company_name is required" });
  }

  if (payload.founded_year && Number.isNaN(Number(payload.founded_year))) {
    return res.status(400).json({ message: "founded_year must be a number" });
  }

  try {
    const upsertPayload = {
      user_id: id,
    };

    for (const column of profileColumns) {
      upsertPayload[column] = payload[column] ?? null;
    }

    const { data, error } = await supabase
      .from("recruiter_profiles")
      .upsert([upsertPayload], { onConflict: "user_id" })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json({
      message: "Recruiter profile saved successfully",
      data,
    });
  } catch (error) {
    console.error("Error upserting recruiter profile:", error);
    return res.status(500).json({ message: "Failed to save recruiter profile" });
  }
});

module.exports = router;
