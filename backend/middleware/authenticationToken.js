const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // Extract token from cookies or Authorization header
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user info (e.g., id, email) to the request object
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }

};


module.exports = authenticateToken;