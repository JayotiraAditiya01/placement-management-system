import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API_BASE_URL from "../../config/api";
const AdminLogin = () => {
  const navigate = useNavigate();

  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD COLLEGES ================= */
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/get-colleges`);

        if (!res.ok) throw new Error("Failed to fetch colleges");

        const data = await res.json();
        setColleges(data.colleges || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load colleges");
      }
    };

    fetchColleges();
  }, []);

  /* ================= HANDLE LOGIN ================= */
  const handleLogin = async () => {
    setError("");

    if (!selectedCollege || !password) {
      setError("Select college and enter password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
  `${API_BASE_URL}/api/auth/admin-login`,
  {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            college_name: selectedCollege,
            password: password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      /* 🔥 FIXED TOKEN STORAGE */
      localStorage.clear();
      localStorage.setItem("access_token", data.access_token); // ✅ FIXED
      localStorage.setItem("role", "ADMIN");
      localStorage.setItem("college", data.college);

      navigate("/admin/dashboard");

    } catch (err) {
      console.error(err);
      setError("Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrapper}>
      {/* BACKGROUND BLOBS */}
      <div style={bgWaveOne}></div>
      <div style={bgWaveTwo}></div>

      {/* LOGIN CARD */}
      <motion.div {...fade} style={card}>
        <h2 style={title}>🔐 Admin Login</h2>
        <p style={subtitle}>Select College & Enter Password</p>

        {/* SELECT COLLEGE */}
        <select
          value={selectedCollege}
          onChange={(e) => setSelectedCollege(e.target.value)}
          style={inputStyle}
        >
          <option value="">Select College</option>
          {colleges.map((college) => (
            <option key={college.id} value={college.college_name}>
              {college.college_name}
            </option>
          ))}
        </select>

        {/* PASSWORD FIELD */}
        <div style={passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="College Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        {/* ERROR */}
        {error && <p style={errorText}>{error}</p>}

        {/* LOGIN BUTTON */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogin}
          disabled={loading}
          style={{
            ...buttonStyle,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Authenticating..." : "Login"}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

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

/* ================= STYLES ================= */

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
  marginBottom: "22px",
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
  background: "transparent",
  border: "none",
  cursor: "pointer",
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  background: "linear-gradient(135deg, #0f172a, #1e293b)",
  color: "#ffffff",
  fontWeight: 600,
  borderRadius: "14px",
  border: "none",
  cursor: "pointer",
  transition: "0.3s",
};

const errorText = {
  color: "#dc2626",
  fontSize: "14px",
  marginTop: "6px",
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