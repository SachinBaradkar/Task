import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginOtpPage.css";

function LoginOtpPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.successMessage || ''; // Retrieve success message from state

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleGetOtpClick = async () => {
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.", { position: "bottom-center", autoClose: 3000 });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("https://task-586i.onrender.com/api/auth/send-otp", { email });
      if (response.data.message === "OTP sent successfully") {
        navigate("/verify-otp", { state: { email, successMessage: "OTP sent to your email." } });
      } else {
        toast.error(response.data.message || "Failed to send OTP.", { position: "bottom-center", autoClose: 3000 });
      }
    } catch (error) {
      toast.error("Error sending OTP. Please try again.", { position: "bottom-center", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, { position: "bottom-center", autoClose: 3000 });
    }
  }, [successMessage]);

  return (
    <div className="page-container">
      <ToastContainer position="bottom-center" autoClose={3000} />
      <div className="background-rectangle">
        <div className="left-card">
          <img src="/cleverpe_logo.png" alt="Logo" className="logo" />
          <h1>WELCOME</h1>
          <p>to the CleverPe Task Manager !!</p>
        </div>
        <div className="right-content">
          <h1>Login</h1>
          <p>Enter your email address to get OTP</p>
          <input
            type="email"
            placeholder="Email Address"
            className="email-input"
            value={email}
            onChange={handleEmailChange}
          />
          <button className="send-otp-button" onClick={handleGetOtpClick} disabled={loading}>
            {loading ? "Sending..." : "Get OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginOtpPage;
