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
  FaArchive,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import "../styles/Student/StudentSidebar.css";

const StudentSidebar = () => {
  const [searchValue, setSearchValue] = useState("");
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const toggleRef = useRef(null);
  const navigate = useNavigate();

  const menuItems = [
    { path: "/student-dashboard", label: "Dashboard", icon: <FaThLarge /> },
    { path: "/roadmaps", label: "Roadmaps", icon: <FaMapSigns /> },
    { path: "/ongoing-drives", label: "Ongoing Drives", icon: <FaTasks /> },
    { path: "/upcoming-drives", label: "Upcoming Drives", icon: <FaCalendarCheck /> },
    { path: "/participated-drives", label: "Participated Drives", icon: <FaClipboardCheck /> },
    { path: "/companies", label: "Companies", icon: <FaBuilding /> },
    { path: "/projects", label: "Projects", icon: <FaLaptop /> },
    { path: "/forum", label: "Discussion Forum", icon: <FaUsers /> },
    { path: "/ats-checker", label: "ATS Checker", icon: <FaFileAlt /> },
    { path: "/interview-archives", label: "Interview Archives", icon: <FaArchive /> },
    { path: "/student-perks", label: "Student Perks", icon: <FaGift /> },
    { path: "/notifications", label: "Notifications", icon: <FaBell /> },
    { path: "/settings", label: "Settings", icon: <FaCog /> },
    { path: "/", label: "Logout", icon: <LogOut />, action: "logout" },
  ];

  // Filtered menu list based on search input
  const filteredItems = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const isActiveRoute = ({ isActive }) => (isActive ? "active" : "");

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, sidebarOpen]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  const handleItemClick = (item) => {
    if (item.action === "logout") handleLogout();
    closeSidebar();
  };

  return (
    <>
      {/* Mobile toggle button */}
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

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`sidebar ${darkMode ? "dark" : ""} ${isMobile ? "mobile" : ""} ${
          sidebarOpen ? "open" : ""
        }`}
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
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    className={isActiveRoute}
                    onClick={() => handleItemClick(item)}
                    title={item.label}
                  >
                    <span className="icon">{item.icon}</span>
                    <span className="menu-text">{item.label}</span>
                  </NavLink>
                </li>
              ))
            ) : (
              <li className="no-results">No results found</li>
            )}
          </ul>
        </nav>

        <div className="divider"></div>

        <div className="theme-toggle-container">
          <div className="theme-toggle">
            <div className="theme-label">
              {darkMode ? <FaSun className="icon" /> : <FaMoon className="icon" />}
              <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleDarkMode}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>

      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}
    </>
  );
};

export default StudentSidebar;
