import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* ✅ API IMPORT */
import API_BASE_URL from "../../config/api";

const DeveloperLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /* ================= LOGIN HANDLER ================= */
  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      /* ✅ PRODUCTION SAFE API */
      const response = await fetch(
        `${API_BASE_URL}/api/auth/developer-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setError(
          data.error ||
          data.message ||
          "Login failed"
        );

        setLoading(false);
        return;
      }

      /* ✅ CLEAR OLD SESSION */
      localStorage.clear();

      /* ✅ STORE AUTH DATA */
      localStorage.setItem(
        "access_token",
        data.access_token
      );

      localStorage.setItem(
        "role",
        data.role
      );

      localStorage.setItem(
        "email",
        data.email || email
      );

      /* ✅ NAVIGATE */
      navigate("/developer/dashboard");

    } catch (err) {

      console.error("Developer Login Error:", err);

      setError(
        "Server not reachable"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div style={container}>

      {/* BACKGROUND EFFECTS */}
      <div style={gradientOverlay}></div>
      <div style={blobOne}></div>
      <div style={blobTwo}></div>

      {/* LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          type: "spring"
        }}
        style={card}
      >

        <h2 style={title}>
          💻 Developer Access
        </h2>

        <p style={subtitle}>
          Secure AI Control Panel Login
        </p>

        <form
          onSubmit={handleLogin}
          style={{ width: "100%" }}
        >

          <input
            type="email"
            placeholder="Developer Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            style={input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            style={input}
          />

          {error && (
            <p style={errorText}>
              {error}
            </p>
          )}

          <motion.button
            whileHover={{
              scale: 1.05
            }}
            whileTap={{
              scale: 0.95
            }}
            type="submit"
            disabled={loading}
            style={{
              ...button,
              opacity: loading ? 0.7 : 1
            }}
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </motion.button>

        </form>

      </motion.div>

    </div>
  );
};

export default DeveloperLogin;

/* ================= STYLES ================= */

const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  overflow: "hidden",
  background:
    "linear-gradient(135deg, #0f172a, #1e293b)"
};

const gradientOverlay = {
  position: "absolute",
  width: "200%",
  height: "200%",
  background:
    "radial-gradient(circle at 30% 30%, rgba(56,189,248,0.15), transparent 40%), radial-gradient(circle at 70% 70%, rgba(14,165,233,0.15), transparent 40%)",
  zIndex: 0
};

const card = {
  width: "420px",
  padding: "45px",
  borderRadius: "22px",
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(25px)",
  boxShadow:
    "0 25px 80px rgba(0,0,0,0.6)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  zIndex: 2,
  border:
    "1px solid rgba(255,255,255,0.1)"
};

const title = {
  color: "#38bdf8",
  fontSize: "28px",
  fontWeight: 900,
  marginBottom: "10px"
};

const subtitle = {
  color: "#94a3b8",
  fontSize: "14px",
  marginBottom: "35px"
};

const input = {
  width: "100%",
  padding: "14px 16px",
  marginBottom: "20px",
  borderRadius: "14px",
  border:
    "1px solid rgba(255,255,255,0.1)",
  background:
    "rgba(255,255,255,0.08)",
  color: "#ffffff",
  outline: "none",
  fontSize: "14px"
};

const button = {
  width: "100%",
  padding: "16px",
  borderRadius: "16px",
  border: "none",
  background:
    "linear-gradient(135deg, #38bdf8, #0ea5e9)",
  color: "#fff",
  fontWeight: 700,
  fontSize: "16px",
  cursor: "pointer",
  boxShadow:
    "0 0 25px rgba(56, 189, 248, 0.6)"
};

const errorText = {
  color: "#ef4444",
  fontSize: "14px",
  marginBottom: "10px"
};

const blobOne = {
  position: "absolute",
  width: "500px",
  height: "500px",
  background: "#38bdf8",
  borderRadius: "50%",
  filter: "blur(180px)",
  top: "-150px",
  left: "-150px",
  zIndex: 0
};

const blobTwo = {
  position: "absolute",
  width: "500px",
  height: "500px",
  background: "#0ea5e9",
  borderRadius: "50%",
  filter: "blur(180px)",
  bottom: "-150px",
  right: "-150px",
  zIndex: 0
};