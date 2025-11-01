const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../config/supabaseClient");
const { NODE_ENV, JWT_SECRET } = require("../config/env");

const router = express.Router();
const isProduction = NODE_ENV === "production";

function getCookieOptions(remember) {
  const maxAge = remember ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    maxAge,
  };
}

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  return res.status(200).json({
    message: "Password reset instructions sent to your email (demo).",
  });
});

router.post("/login", async (req, res) => {
  const { email, password, remember = false } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const { data: user, error: lookupError } = await supabase
      .from("authentication")
      .select("id, primary_email, password, role, is_active")
      .eq("primary_email", email)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up." });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: "Account is disabled." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const tokenPayload = { id: user.id, email: user.primary_email, role: user.role };
    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: remember ? "30d" : "1h",
    });

    res.cookie("token", token, getCookieOptions(remember));
    return res.status(200).json({ message: "Login successful", token, user: tokenPayload });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Failed to login" });
  }
});

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
      .select("id, primary_email, role")
      .single();

    if (insertError) {
      throw insertError;
    }

    const tokenPayload = { id: newUser.id, email: newUser.primary_email, role: newUser.role };
    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, getCookieOptions(false));

    return res.status(201).json({ message: "Sign-up successful", token, user: tokenPayload });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  });
  return res.status(200).json({ message: "Logged out" });
});

router.get("/verify", (req, res) => {
  const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
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