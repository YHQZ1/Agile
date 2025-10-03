import React, { useState, useContext } from "react";
import { 
  FaHome,
  FaUserFriends,
  FaMapSigns,
  FaProjectDiagram,
  FaVideo,
  FaCode,
  FaBuilding,
  FaChartBar,
  FaCog,
  FaMoon,
  FaSun,
  FaBell
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import "../styles/Recruiter/RecruiterSidebar.css";

const RSidebar = () => {
  const [searchValue, setSearchValue] = useState("");
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <div className={`sidebar ${darkMode ? "dark" : ""}`}>
      <div className="sidebar-header">
        <h2 className="logo">VerQ</h2>
      </div>
      
      <div className="search-container">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search candidates..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <nav className="main-menu">
        <ul>
          <li>
            <NavLink 
              to="/recruiter-dashboard" 
              className={({ isActive }) => isActive ? "active" : ""}
            >
              <FaHome className="icon" /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/candidates" 
              className={({ isActive }) => isActive ? "active" : ""}
            >
              <FaUserFriends className="icon" /> Candidate Pool
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/post-jobs" 
              className={({ isActive }) => isActive ? "active" : ""}
            >
              <FaMapSigns className="icon" /> Post Jobs
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/ongoing-drives" 
              className={({ isActive }) => isActive ? "active" : ""}
            >
              <FaProjectDiagram className="icon" /> Ongoing Drives
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/interviews" 
              className={({ isActive }) => isActive ? "active" : ""}
            >
              <FaVideo className="icon" /> Interviews
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/skills-directory" 
              className={({ isActive }) => isActive ? "active" : ""}
            >
              <FaCode className="icon" /> Skills Directory
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/company-profile" 
              className={({ isActive }) => isActive ? "active" : ""}
            >
              <FaBuilding className="icon" /> Company Profile
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/analytics" 
              className={({ isActive }) => isActive ? "active" : ""}
            >
              <FaChartBar className="icon" /> Analytics
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/settings" 
              className={({ isActive }) => isActive ? "active" : ""}
            >
              <FaCog className="icon" /> Settings
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/notifications" 
              className={({ isActive }) => isActive ? "active" : ""}
            >
              <FaBell className="icon" /> Notifications
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="divider"></div>
      
      <button className="theme-toggle" onClick={toggleDarkMode}>
        {darkMode ? (
          <>
            <FaSun className="icon" /> Light Mode
          </>
        ) : (
          <>
            <FaMoon className="icon" /> Dark Mode
          </>
        )}
      </button>
    </div>
  );
};

export default RSidebar;