// src/components/ThemeToggle.js
import React from "react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="theme-toggle">
            <label className="switch">
                <input type="checkbox" checked={theme === "dark"} onChange={toggleTheme} />
                <span className="slider round"></span>
            </label>
        </div>
    );
};

export default ThemeToggle;
