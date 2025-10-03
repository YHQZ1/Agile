import React, { useState, useContext, useEffect, useRef } from "react";
import { 
  FaThLarge,
  FaMapSigns,
  FaTasks,
  FaCalendarCheck,
  FaClipboardCheck,
  FaBell,
  FaCog,
  FaSun,
  FaMoon,
  FaBuilding,
  FaGift,
  FaLaptop,
  FaFileAlt,
  FaUsers,
  FaMicrophone,
  FaBars,
  FaTimes,
  FaQuestionCircle,
  FaHistory,
  FaFire,
  FaBriefcase,
  FaCode,
  FaUniversity,
  FaClipboardList,
  FaArchive,
  FaRedo,
  FaSyncAlt
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import "../styles/Student/StudentSidebar.css";
import { LogOut } from "lucide-react";

const StudentSidebar = () => {
  const [searchValue, setSearchValue] = useState("");
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const toggleRef = useRef(null);

  // Helper function to determine if a route is active
  const isActiveRoute = ({ isActive }) => isActive ? "active" : "";

  // Toggle sidebar visibility on mobile
  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState);
  };

  // Close sidebar
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Effect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle clicks outside the sidebar to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && sidebarOpen && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target) &&
          toggleRef.current && 
          !toggleRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, sidebarOpen]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  const handleLogoutFunctionality = () => {
    handleLogout();
    closeSidebar();
  }

  return (
    <>
      {/* Mobile toggle button - always visible on mobile */}
      {isMobile && (
        <button 
          ref={toggleRef}
          className={`mobile-toggle ${darkMode ? "dark" : ""}`}
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <FaTimes className="icon" /> : <FaBars className="icon" />}
        </button>
      )}
      
      {/* Sidebar - always visible on desktop, conditionally visible on mobile */}
      <div 
        ref={sidebarRef}
        className={`sidebar ${darkMode ? "dark" : ""} ${isMobile ? "mobile" : ""} ${sidebarOpen ? "open" : ""}`}
      >
        <div className="sidebar-header">
          {!isMobile ? (
            <h2 className="logo">VerQ</h2>
          ) : (
            <>
              <div className="logo-icon">VerQ</div>
              <button className="close-sidebar" onClick={closeSidebar}>
                <FaTimes />
              </button>
            </>
          )}
        </div>
        
        {!isMobile && (
          <div className="search-container">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        )}

        <nav className="main-menu">
          <ul>
            <li>
              <NavLink to="/student-dashboard" className={isActiveRoute} title="Dashboard" onClick={closeSidebar}>
                <FaThLarge className="icon" /> 
                <span className="menu-text">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/roadmaps" className={isActiveRoute} title="Roadmaps" onClick={closeSidebar}>
                <FaMapSigns className="icon" /> 
                <span className="menu-text">Roadmaps</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/ongoing-drives" className={isActiveRoute} title="Ongoing Drives" onClick={closeSidebar}>
                <FaTasks className="icon" /> 
                <span className="menu-text">Ongoing Drives</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/upcoming-drives" className={isActiveRoute} title="Upcoming Drives" onClick={closeSidebar}>
                <FaCalendarCheck className="icon" /> 
                <span className="menu-text">Upcoming Drives</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/participated-drives" className={isActiveRoute} title="Participated Drives" onClick={closeSidebar}>
                <FaClipboardCheck className="icon" /> 
                <span className="menu-text">Participated Drives</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/companies" className={isActiveRoute} title="Companies" onClick={closeSidebar}>
                <FaBuilding className="icon" /> 
                <span className="menu-text">Companies</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/projects" className={isActiveRoute} title="Projects" onClick={closeSidebar}>
                <FaLaptop className="icon" /> 
                <span className="menu-text">Projects</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/forum" className={isActiveRoute} title="Discussion Forum" onClick={closeSidebar}>
                <FaUsers className="icon" /> 
                <span className="menu-text">Discussion Forum</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/ats-checker" className={isActiveRoute} title="ATS Checker" onClick={closeSidebar}>
                <FaFileAlt className="icon" /> 
                <span className="menu-text">ATS Checker</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/interview-archives" className={isActiveRoute} title="Interview Archives" onClick={closeSidebar}>
                <FaArchive className="icon" /> 
                <span className="menu-text">Interview Archives</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/student-perks" className={isActiveRoute} title="Student Perks" onClick={closeSidebar}>
                <FaGift className="icon" /> 
                <span className="menu-text">Student Perks</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/notifications" className={isActiveRoute} title="Notifications" onClick={closeSidebar}>
                <FaBell className="icon" /> 
                <span className="menu-text">Notifications</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings" className={isActiveRoute} title="Settings" onClick={closeSidebar}>
                <FaCog className="icon" /> 
                <span className="menu-text">Settings</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/" className={isActiveRoute} title="Settings" onClick={handleLogoutFunctionality}>
                <LogOut className="icon" /> 
                <span className="menu-text">Logout</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="divider"></div>
        
        <div className="theme-toggle-container">
          <button className="theme-toggle" onClick={toggleDarkMode} title={darkMode ? "Light Mode" : "Dark Mode"}>
            {darkMode ? (
              <>
                <FaSun className="icon" /> 
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <FaMoon className="icon" /> 
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}
    </>
  );
};

export default StudentSidebar;