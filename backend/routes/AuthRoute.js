const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../config/supabaseClient");
const authenticateToken = require("../middleware/authenticationToken"); // Import the authentication middleware
const { NODE_ENV, JWT_SECRET } = require("../config/env");
const router = express.Router();

const isProduction = NODE_ENV === "production";
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
    const { data: user, error: lookupError } = await supabase
      .from("authentication")
      .select("*")
      .eq("primary_email", email)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token with email in the payload
    const tokenPayload = { id: user.id, email: user.primary_email, role: user.role };
    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send the token as an HTTP-only cookie
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({ message: "Login successful", token, user: tokenPayload });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  let { role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const allowedRoles = ["student", "recruiter"];
  role = typeof role === "string" ? role.toLowerCase().trim() : "student";
  if (!allowedRoles.includes(role)) {
    role = "student";
  }

  try {
    const { data: existingUser, error: userLookupError } = await supabase
      .from("authentication")
      .select("id")
      .eq("primary_email", email)
      .maybeSingle();

    if (userLookupError) {
      throw userLookupError;
    }

    if (existingUser) {
      return res.status(409).json({ message: "User already exists. Please log in." });
    }

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data: newUser, error: insertError } = await supabase
      .from("authentication")
      .insert([
        {
          primary_email: email,
          password: hashedPassword,
          role,
        },
      ])
      .select("*")
      .single();

    if (insertError) {
      throw insertError;
    }

    // Generate JWT token with email in the payload
    const tokenPayload = { id: newUser.id, email: newUser.primary_email, role: newUser.role };
    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send the token as an HTTP-only cookie to avoid XSS attacks
    res.cookie("token", token, cookieOptions);

    return res.status(201).json({ message: "Sign-up successful", token, user: tokenPayload });
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
  const decoded = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ message: "Token valid", user: decoded });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});


module.exports = router;