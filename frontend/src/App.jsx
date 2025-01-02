import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import LoginOtpPage from "./Pages/LoginOtpPage";
import OtpVerificationPage from "./Pages/OtpVerificationPage";
import Dashboard from "./Pages/dashboard";
import TaskScreen from "./Pages/TaskScreen";
import Analytics from "./Pages/Analytics";
import FileUpload from "./Pages/FileUpload";
import Header from "./components/Header";
import Snowflakes from "./components/Snowflakes"; // Import the Snowflakes component

function App() {
  // State to manage theme
  const [theme, setTheme] = useState("light");

  // Load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme") || "light";
    setTheme(savedTheme);
  }, []);

  return (
    <Router>
      <MainContent theme={theme} setTheme={setTheme} />
    </Router>
  );
}

function MainContent({ theme, setTheme }) {
  // Get the current location (route)
  const location = useLocation();

  return (
    <div className={`app-container ${theme}`}>
      <Snowflakes /> {/* Render Snowflakes globally */}

      {/* Conditionally render Header based on the current route */}
      {location.pathname !== "/" && location.pathname !== "/verify-otp" && (
        <Header theme={theme} setTheme={setTheme} />
      )}

      <Routes>
        <Route path="/" element={<LoginOtpPage />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />
        <Route path="/dashboard" element={<Dashboard theme={theme} />} />
        <Route path="/tasks" element={<TaskScreen theme={theme} />} />
        <Route path="/analytics" element={<Analytics theme={theme} />} />
        <Route path="/UploadFiles" element={<FileUpload theme={theme} />} />
      </Routes>
    </div>
  );
}

export default App;
