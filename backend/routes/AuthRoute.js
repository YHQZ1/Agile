const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const authenticateToken = require("../middleware/authenticationToken"); // Import the authentication middleware
const router = express.Router();

const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax",
  maxAge: 60 * 60 * 1000, // 1 hour
};

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if the user exists
    const userQuery = "SELECT * FROM authentication WHERE primary_email = $1";
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found. Please sign up." });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token with email in the payload
    const token = jwt.sign({ id: user.id, email: user.primary_email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send the token as an HTTP-only cookie
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if the user already exists
    const userQuery = "SELECT * FROM authentication WHERE primary_email = $1";
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length > 0) {
      return res.status(409).json({ message: "User already exists. Please log in." });
    }

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery =
      "INSERT INTO authentication (primary_email, password) VALUES ($1, $2) RETURNING *";
    const newUserResult = await pool.query(insertQuery, [email, hashedPassword]);

    const user = newUserResult.rows[0];

    // Generate JWT token with email in the payload
    const token = jwt.sign({ id: user.id, email: user.primary_email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send the token as an HTTP-only cookie to avoid XSS attacks
    res.cookie("token", token, cookieOptions);

    return res.status(201).json({ message: "Sign-up successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/auth/verify
router.get('/verify', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ message: "Token valid", user: decoded });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});


module.exports = router;