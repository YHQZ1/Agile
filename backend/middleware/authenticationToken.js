const jwt = require("jsonwebtoken");
const supabase = require("../config/supabaseClient");
const { JWT_SECRET } = require("../config/env");

const authenticateToken = async (req, res, next) => {
  // Extract token from cookies or Authorization header
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
  const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.role) {
      try {
        const { data: authRow, error: lookupError } = await supabase
          .from("authentication")
          .select("role")
          .eq("id", decoded.id)
          .maybeSingle();

        if (lookupError) {
          console.error("Error resolving user role:", lookupError);
        }

        if (authRow?.role) {
          decoded.role = authRow.role;
        }
      } catch (lookupError) {
        console.error("Error resolving user role:", lookupError);
      }
    }

    req.user = decoded; // Attach the decoded user info (e.g., id, email, role) to the request object
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }

};


module.exports = authenticateToken;