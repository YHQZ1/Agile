const requireRecruiter = (req, res, next) => {
  const role = req.user?.role;
  if (role !== "recruiter" && role !== "admin") {
    return res.status(403).json({ message: "Recruiter access required" });
  }
  return next();
};

module.exports = requireRecruiter;
