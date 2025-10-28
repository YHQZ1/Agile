const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const authenticateToken = async (req, res, next) => {
  // Extract token from cookies or Authorization header
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.role) {
      try {
        const result = await pool.query(
          "SELECT role FROM authentication WHERE id = $1",
          [decoded.id]
        );
        decoded.role = result.rows[0]?.role;
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