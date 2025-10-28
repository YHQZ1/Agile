const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authenticateToken = require("../middleware/authenticationToken");
const requireRecruiter = require("../middleware/requireRecruiter");

router.use(authenticateToken, requireRecruiter);

router.get("/", async (req, res) => {
  const { search } = req.query;

  try {
    let query = `
      SELECT user_id, first_name, last_name, institute_roll_no, personal_email, phone_number
      FROM personal_details
    `;
    const values = [];

    if (search) {
      query += ` WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR institute_roll_no ILIKE $1`;
      values.push(`%${search}%`);
    }

    query += " ORDER BY first_name ASC, last_name ASC";

    const result = await pool.query(query, values);
    return res.status(200).json({ message: "Students retrieved", data: result.rows });
  } catch (error) {
    console.error("Error retrieving students:", error);
    return res.status(500).json({ message: "Failed to fetch students" });
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const personal = await pool.query(
      "SELECT * FROM personal_details WHERE user_id = $1",
      [userId]
    );

    if (personal.rows.length === 0) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    const [internships, volunteering, skills, projects, accomplishments, extraCurricular, competitions] = await Promise.all([
      pool.query("SELECT * FROM internships WHERE user_id = $1 ORDER BY start_date DESC", [userId]),
      pool.query("SELECT * FROM volunteering WHERE user_id = $1 ORDER BY start_date DESC", [userId]),
      pool.query("SELECT * FROM skills WHERE user_id = $1 ORDER BY created_at DESC", [userId]),
      pool.query("SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC", [userId]),
      pool.query("SELECT * FROM accomplishments WHERE user_id = $1 ORDER BY accomplishment_date DESC NULLS LAST", [userId]),
      pool.query("SELECT * FROM extra_curricular WHERE user_id = $1 ORDER BY created_at DESC", [userId]),
      pool.query("SELECT * FROM competition_events WHERE user_id = $1 ORDER BY event_date DESC", [userId]),
    ]);

    return res.status(200).json({
      message: "Student profile retrieved",
      data: {
        personal: personal.rows[0],
        internships: internships.rows,
        volunteering: volunteering.rows,
        skills: skills.rows,
        projects: projects.rows,
        accomplishments: accomplishments.rows,
        extra_curricular: extraCurricular.rows,
        competitions: competitions.rows,
      },
    });
  } catch (error) {
    console.error("Error retrieving student profile:", error);
    return res.status(500).json({ message: "Failed to fetch student profile" });
  }
});

module.exports = router;
