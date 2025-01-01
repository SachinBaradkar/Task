import React, { useState, useEffect } from "react";
import "./Header.css";

const Header = ({ theme, setTheme }) => {
    // Toggle theme handler
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("app-theme", newTheme); // Save theme to localStorage
    };

    return (
        <header className={`header ${theme}`}>
            <h1 className="header-title">Task Manager</h1>
            <div className="theme-toggle" onClick={toggleTheme}>
                {theme === "light" ? "🌙" : "☀️"} {/* Moon for light theme, sun for dark */}
            </div>
        </header>
    );
};

export default Header;
