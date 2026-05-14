import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API_BASE_URL from "../../config/api";
const API = `${API_BASE_URL}/api/auth/`;

const DeveloperDashboard = () => {
  const [collegeName, setCollegeName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);

  const [visiblePasswords, setVisiblePasswords] = useState({});

  /* ================= FETCH ================= */
  const fetchColleges = async () => {
    try {
      const res = await fetch(`${API}get-colleges`);
      const data = await res.json();
      setColleges(data.colleges || []);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  /* ================= TOGGLE ================= */
  const togglePassword = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this college?")) return;

    try {
      const res = await fetch(`${API}delete-college/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      fetchColleges();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  /* ================= ADD ================= */
  const handleAddCollege = async (e) => {
    e.preventDefault();

    if (!collegeName || !adminEmail || !password || !confirmPassword) {
      alert("All fields required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}create-college`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          college_name: collegeName,
          admin_email: adminEmail,
          password: password,
        }),
      });

      const data = await res.json();

      console.log("RESPONSE:", data);

      if (!res.ok) {
        alert(data.error); // 🔥 now shows real backend error
        return;
      }

      alert("College Created Successfully ✅");

      fetchColleges();

      setCollegeName("");
      setAdminEmail("");
      setPassword("");
      setConfirmPassword("");

    } catch (err) {
      console.error(err);
      alert("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <motion.h1 style={title}>Developer Control Panel</motion.h1>

      <div style={grid}>
        {/* LEFT */}
        <div style={card}>
          <h3 style={sectionTitle}>Create College Admin</h3>

          <form onSubmit={handleAddCollege}>
            <input style={input}
              placeholder="College Name"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
            />

            <input style={input}
              placeholder="Admin Email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
            />

            <div style={passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={passwordInput}
              />
              <span style={eye} onClick={() => setShowPassword(!showPassword)}>👁</span>
            </div>

            <div style={passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={passwordInput}
              />
              <span style={eye} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>👁</span>
            </div>

            <button style={btn}>
              {loading ? "Creating..." : "Add College"}
            </button>
          </form>
        </div>

        {/* RIGHT */}
        <div style={card}>
          <h3 style={sectionTitle}>Registered Colleges</h3>

          {colleges.length === 0 ? (
            <p style={muted}>No colleges added yet</p>
          ) : (
            colleges.map((c) => (
              <div key={c.id} style={collegeItem}>
                <b>{c.college_name}</b>
                <div style={{ fontSize: 13 }}>{c.admin_email}</div>

                <div style={passwordWrapper}>
                  <input
                    type="text"
                    value={
                      visiblePasswords[c.id]
                        ? "Password is securely stored 🔒"
                        : "********"
                    }
                    readOnly
                    style={passwordInput}
                  />
                  <span style={eye} onClick={() => togglePassword(c.id)}>👁</span>
                </div>

                <button style={deleteBtn}
                  onClick={() => handleDelete(c.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;

/* ================= STYLES ================= */

const page = {
  padding: 40,
  minHeight: "100vh",
  background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
};

const title = {
  fontSize: 28,
  fontWeight: 800,
  marginBottom: 30,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 30,
};

const card = {
  background: "#fff",
  padding: 25,
  borderRadius: 15,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const sectionTitle = {
  marginBottom: 15,
  fontWeight: 700,
};

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 10,
  border: "1px solid #e5e7eb",
};

const passwordWrapper = {
  position: "relative",
  marginBottom: 12,
};

const passwordInput = {
  width: "100%",
  padding: "12px 40px 12px 12px",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
};

const eye = {
  position: "absolute",
  right: 12,
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
};

const btn = {
  width: "100%",
  padding: 12,
  borderRadius: 12,
  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const collegeItem = {
  marginTop: 12,
  padding: 12,
  background: "#f1f5f9",
  borderRadius: 10,
};

const deleteBtn = {
  marginTop: 8,
  padding: 6,
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const muted = {
  color: "#6b7280",
};