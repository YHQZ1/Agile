const express = require("express");
const router = express.Router();
const pool = require("../config/db");
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
    const result = await pool.query(
      "SELECT * FROM recruiter_profiles WHERE user_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Recruiter profile not found" });
    }

    return res.status(200).json({ message: "Recruiter profile retrieved", data: result.rows[0] });
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

  const values = profileColumns.map((column) => payload[column] ?? null);

  try {
    const placeholders = profileColumns
      .map((_, index) => `$${index + 2}`)
      .join(", ");

    const updates = profileColumns
      .map((column, index) => `${column} = EXCLUDED.${column}`)
      .join(", ");

    const query = `
      INSERT INTO recruiter_profiles (user_id, ${profileColumns.join(", ")})
      VALUES ($1, ${placeholders})
      ON CONFLICT (user_id) DO UPDATE SET ${updates}
      RETURNING *;
    `;

    const result = await pool.query(query, [id, ...values]);

    return res.status(201).json({
      message: "Recruiter profile saved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error upserting recruiter profile:", error);
    return res.status(500).json({ message: "Failed to save recruiter profile" });
  }
});

module.exports = router;
