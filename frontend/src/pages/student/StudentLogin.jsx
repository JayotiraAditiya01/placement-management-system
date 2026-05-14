import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API_BASE_URL from "../../config/api";
/* 🔥 FIXED API (IMPORTANT) */
const API = `${API_BASE_URL}/api/auth`;

const StudentLogin = () => {
  const navigate = useNavigate();

  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD COLLEGES ================= */
  useEffect(() => {
    const loadColleges = async () => {
      try {
        const res = await fetch(`${API}/get-colleges`);
        
        if (!res.ok) throw new Error("Server error");

        const data = await res.json();
        setColleges(data.colleges || []);
      } catch (err) {
        console.error("COLLEGE LOAD ERROR:", err);
        setError("Backend not reachable");
      }
    };
    loadColleges();
  }, []);

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedCollege) {
      setError("Please select your college");
      return;
    }

    setLoading(true);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(`${API}/student-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password: password.trim(),
          college_name: selectedCollege,
        }),
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Invalid credentials");
        return;
      }

      const data = await res.json();

      /* 🔥 CLEAR OLD SESSION */
      localStorage.clear();

      /* 🔐 STORE TOKEN */
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("role", "STUDENT");
      localStorage.setItem("college", selectedCollege);
      localStorage.setItem("studentEmail", email.toLowerCase());

      navigate("/student/dashboard");

    } catch (err) {
      console.error("LOGIN ERROR:", err);

      if (err.name === "AbortError") {
        setError("Server taking too long (timeout)");
      } else if (err.message.includes("Failed to fetch")) {
        setError("Server not running or wrong API URL");
      } else {
        setError("Backend not reachable");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrapper}>
      <div style={bgWaveOne}></div>
      <div style={bgWaveTwo}></div>

      <motion.div {...fade} style={card}>
        <h2 style={title}>Student Login</h2>
        <p style={subtitle}>Select your college and login</p>

        <form onSubmit={handleLogin}>

          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            required
            style={inputStyle}
          >
            <option value="">Select College</option>
            {colleges.map((college) => (
              <option key={college.id} value={college.college_name}>
                {college.college_name}
              </option>
            ))}
          </select>

          <input
            type="email"
            placeholder="Student Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <div style={passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={passwordInput}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={eyeButton}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {error && (
            <p style={{ color: "#dc2626", fontSize: "14px", marginTop: "10px" }}>
              {error}
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              background: loading
                ? "#9ca3af"
                : "linear-gradient(135deg, #6366f1, #4f46e5)",
            }}
          >
            {loading ? "Authenticating..." : "Login"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default StudentLogin;

/* ================= ICONS ================= */

const Eye = () => (
  <svg width="20" height="20" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOff = () => (
  <svg width="20" height="20" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.94 10.94 0 0112 19C5 19 1 12 1 12a21.27 21.27 0 015.06-6.94"/>
    <path d="M1 1l22 22"/>
  </svg>
);

/* ================= STYLES (UNCHANGED) ================= */

const wrapper = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #eef2ff, #f8f9fc)",
  position: "relative",
  overflow: "hidden",
};

const card = {
  width: "400px",
  padding: "36px",
  background: "rgba(255,255,255,0.7)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  boxShadow: "0 30px 60px rgba(0,0,0,0.08)",
  zIndex: 2,
};

const title = {
  fontWeight: 800,
  fontSize: "24px",
  marginBottom: "8px",
  color: "#1e293b",
};

const subtitle = {
  marginBottom: "24px",
  color: "#64748b",
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "16px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  outline: "none",
  fontSize: "14px",
};

const passwordWrapper = {
  position: "relative",
  marginBottom: "16px",
};

const passwordInput = {
  width: "100%",
  padding: "14px 48px 14px 14px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  outline: "none",
  fontSize: "14px",
};

const eyeButton = {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  height: "24px",
  width: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  border: "none",
  cursor: "pointer",
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  color: "#ffffff",
  fontWeight: 600,
  borderRadius: "14px",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 10px 25px rgba(79,70,229,0.3)",
};

const bgWaveOne = {
  position: "absolute",
  width: "500px",
  height: "500px",
  background: "#6366f1",
  borderRadius: "50%",
  filter: "blur(180px)",
  top: "-150px",
  left: "-100px",
};

const bgWaveTwo = {
  position: "absolute",
  width: "500px",
  height: "500px",
  background: "#4f46e5",
  borderRadius: "50%",
  filter: "blur(180px)",
  bottom: "-150px",
  right: "-100px",
};

const fade = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, type: "spring" },
};