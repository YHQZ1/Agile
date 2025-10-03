// ThemeContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  
  // Add a state for fade-in animation
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.setAttribute(
      "data-theme", 
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Add fade-in effect to all children
  const wrappedChildren = (
    <div style={{
      animation: "fadeIn 0.8s ease-in-out",
      animationFillMode: "forwards"
    }}>
      {children}
    </div>
  );

  // Add the keyframes to document head on component mount
  useEffect(() => {
    // Create style element for the fade-in animation
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(styleEl);

    // Clean up
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {wrappedChildren}
    </ThemeContext.Provider>
  );
};