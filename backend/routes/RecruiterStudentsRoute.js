const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const authenticateToken = require("../middleware/authenticationToken");
const requireRecruiter = require("../middleware/requireRecruiter");

router.use(authenticateToken, requireRecruiter);

router.get("/", async (req, res) => {
  const { search } = req.query;

  try {
    let query = supabase
      .from("personal_details")
      .select("user_id, first_name, last_name, institute_roll_no, personal_email, phone_number")
      .order("first_name", { ascending: true })
      .order("last_name", { ascending: true });

    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,institute_roll_no.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return res.status(200).json({ message: "Students retrieved", data: data || [] });
  } catch (error) {
    console.error("Error retrieving students:", error);
    return res.status(500).json({ message: "Failed to fetch students" });
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const { data: personal, error: personalError } = await supabase
      .from("personal_details")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (personalError) {
      throw personalError;
    }

    if (!personal) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    const [internships, volunteering, skills, projects, accomplishments, extraCurricular, competitions] = await Promise.all([
      supabase
        .from("internships")
        .select("*")
        .eq("user_id", userId)
        .order("start_date", { ascending: false }),
      supabase
        .from("volunteering")
        .select("*")
        .eq("user_id", userId)
        .order("start_date", { ascending: false }),
      supabase
        .from("skills")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("accomplishments")
        .select("*")
        .eq("user_id", userId)
        .order("accomplishment_date", { ascending: false, nullsFirst: false }),
      supabase
        .from("extra_curricular")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("competition_events")
        .select("*")
        .eq("user_id", userId)
        .order("event_date", { ascending: false }),
    ]);

    const resultSets = [
      internships,
      volunteering,
      skills,
      projects,
      accomplishments,
      extraCurricular,
      competitions,
    ];

    for (const response of resultSets) {
      if (response.error) {
        throw response.error;
      }
    }

    return res.status(200).json({
      message: "Student profile retrieved",
      data: {
        personal,
        internships: internships.data || [],
        volunteering: volunteering.data || [],
        skills: skills.data || [],
        projects: projects.data || [],
        accomplishments: accomplishments.data || [],
        extra_curricular: extraCurricular.data || [],
        competitions: competitions.data || [],
      },
    });
  } catch (error) {
    console.error("Error retrieving student profile:", error);
    return res.status(500).json({ message: "Failed to fetch student profile" });
  }
});

module.exports = router;
