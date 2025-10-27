require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const bodyParser = require("body-parser"); // Remove this
// const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const app = express();

// Render sits behind a proxy – trust first hop so secure cookies work
app.set("trust proxy", 1);

const defaultOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
  process.env.ATS_URL,
]
  .filter(Boolean)
  .map((origin) => origin.trim());

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // mobile apps / curl
  if (defaultOrigins.includes(origin)) return true;

  try {
    const { hostname } = new URL(origin);
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return true;
    }
    return hostname.endsWith(".vercel.app");
  } catch (err) {
    return false;
  }
};

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("🟢 Backend is live!");
});


// post call Routes
const authRoutes = require("./routes/AuthRoute"); 
const personalDetailsRoutes = require("./routes/PersonalDetailsRoute");
const internshipRoute = require("./routes/InternshipRoute");
const volunteerRoutes = require("./routes/VolunteerRoute");
const skillsRoute = require("./routes/SkillsRoute");
const projectsRoute = require("./routes/ProjectRoute"); 
const accomplishmentRoute = require("./routes/AccomplishmentRoute"); 
const extraCurricularRoute = require("./routes/ExtraCurricularRoute");
const competitionRoute = require("./routes/CompetitionRoute"); 


//get calls variables
const personalInformation = require("./routes/Dashboard/personalInformation");
const VolunteerInformation = require("./routes/Dashboard/volunteerInformation");
const InternshipInformation = require("./routes/Dashboard/internshipInformation");
const CompetitionInformation = require("./routes/Dashboard/competitionInformation");
const SkillsInformation = require("./routes/Dashboard/skillsInformation");
const AccomplishmentInformation = require("./routes/Dashboard/accomplishmentInformation");
const ExtraCurricularInformation = require("./routes/Dashboard/extraCurricularInformation");


//post calls routes
app.use("/api/auth", authRoutes);
app.use("/api/personal-details-form", personalDetailsRoutes);
app.use("/api/internship-details-form", internshipRoute);
app.use("/api/volunteer-details-form", volunteerRoutes); 
app.use("/api/skills-form", skillsRoute); // Uncomment if you have a skills route
app.use("/api/projects-form", projectsRoute); 
app.use("/api/accomplishment-form", accomplishmentRoute);
app.use("/api/extra-curricular-form", extraCurricularRoute);
app.use("/api/competitions-form", competitionRoute);

//get calls routes
app.use("/api/personal-information", personalInformation);
app.use("/api/volunteer-information", VolunteerInformation);
app.use("/api/internship-information", InternshipInformation);
app.use("/api/competition-information", CompetitionInformation);
app.use("/api/skills-information", SkillsInformation);
app.use("/api/accomplishment-information", AccomplishmentInformation);
app.use("/api/extra-curricular-information", ExtraCurricularInformation );

// Catch-all handler for non-API routes (frontend served from Vercel)
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return next();
  }
  res.status(404).json({ message: "Route not found" });
});

app.use("/api", (req, res, next) => {
  res.status(404).json({ message: "API route not found" });
});


// Error Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});