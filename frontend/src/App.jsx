import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Public Pages
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';

// Student Pages
import Default from "./pages/Student/Default";
import StudentDashboard from "./pages/Student/StudentDashboard";
import OngoingDrives from "./pages/Student/OngoingDrives";
import UpcomingDrives from "./pages/Student/UpcomingDrives";
import ParticipatedDrives from "./pages/Student/ParticipatedDrives";
import Roadmaps from "./pages/Student/Roadmaps";
import Settings from "./pages/Student/Settings";
import JobDetails from "./pages/Student/JobDetails";
import Application from "./pages/Student/Application";
import StudentPerks from "./pages/Student/StudentPerks";
import ATS from "./pages/Student/ATS";
import InterviewArchives from "./pages/Student/InterviewArchives";
import Projects from "./pages/Student/Projects";
import Companies from "./pages/Student/Companies";
import Notifications from "./pages/Student/Notifications";
import Forum from "./pages/Student/Forum";
import StudentDetailsForm from "./pages/Student/StudentDetailsForm";

// Recruiter Pages
import RecruiterDashboard from "./pages/Recruiter/RecruiterDashboard";
import PostJobs from "./pages/Recruiter/PostJobs";
import CompanyProfile from "./pages/Recruiter/CompanyProfile";

// Layout Component
import AppLayout from "./components/AppLayout";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />

          {/* Student Routes */}
          <Route path="/student-form" element={<StudentDetailsForm />} />
          <Route element={<AppLayout userType="student" />}>
            <Route path="/default" element={<Default />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/ongoing-drives" element={<OngoingDrives />} />
            <Route path="/upcoming-drives" element={<UpcomingDrives />} />
            <Route path="/participated-drives" element={<ParticipatedDrives />} />
            <Route path="/job-details/:id" element={<JobDetails />} />
            <Route path="/apply/:id" element={<Application />} />
            <Route path="/roadmaps" element={<Roadmaps />} />
            <Route path="/student-perks" element={<StudentPerks />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/ats-checker" element={<ATS />} />
            <Route path="/interview-archives" element={<InterviewArchives />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/forum" element={<Forum />} />
          </Route>

          {/* Recruiter Routes */}
          <Route element={<AppLayout userType="recruiter" />}>
            <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
            <Route path="/post-jobs" element={<PostJobs />} />
            <Route path="/company-profile" element={<CompanyProfile />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;