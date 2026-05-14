import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../config/api";
export default function SettingsSection() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH STUDENT DATA ================= */
  useEffect(() => {
    const token =
      localStorage.getItem("access_token") ||
      localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please login again.");
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/api/students/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Unauthorized request");
        }
        return res.json();
      })
      .then((data) => {
        const normalizedStudent = {
          name: data.name || "Not available",
          email: data.email || data.student_email || "Not available",
          branch: data.branch || "N/A",
          section: data.section || "N/A",
          id: data.id || data.student_id || "N/A",
        };

        setStudent(normalizedStudent);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Settings Error:", err);
        setError("Unable to load student info");
        setLoading(false);
      });
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/student/login");
  };

  /* ================= SYSTEM INFO ================= */
  const systemInfo = {
    version: "v2.0.0",
    backend: "Flask (Python)",
    database: "PostgreSQL",
    lastLogin: new Date().toLocaleString(),
  };

  return (
    <div style={styles.container}>
      {/* 🔥 TOP HEADER CARD */}
      <div style={styles.headerCard}>
        <div>
          <h2 style={{ margin: 0 }}>Settings</h2>
          <p style={styles.subText}>Student Control Panel</p>
        </div>

        <div style={styles.logoutTop} onClick={handleLogout}>
          🚪 Logout
        </div>
      </div>

      {/* ================= STUDENT INFO ================= */}
      <div style={styles.card}>
        <h2 style={styles.heading}>⚙️ Settings</h2>

        {loading ? (
          <p style={styles.loadingText}>Loading student info...</p>
        ) : error ? (
          <p style={styles.errorText}>{error}</p>
        ) : (
          <>
            <InfoRow label="Name" value={student.name} />
            <InfoRow label="Email" value={student.email} />
            <InfoRow label="Branch" value={student.branch} />
            <InfoRow label="Section" value={student.section} />
            <InfoRow label="Role" value="Student" />
            <InfoRow label="Student ID" value={student.id} />
          </>
        )}
      </div>

      {/* ================= SYSTEM INFO ================= */}
      <div style={styles.card}>
        <h3 style={styles.subHeading}>💻 System Info</h3>

        <InfoRow label="Version" value={systemInfo.version} />
        <InfoRow label="Backend" value={systemInfo.backend} />
        <InfoRow label="Database" value={systemInfo.database} />
        <InfoRow label="Last Login" value={systemInfo.lastLogin} />
      </div>

      {/* ================= BOTTOM LOGOUT ================= */}
      <button style={styles.logoutBtn} onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
}

/* COMPONENT */
const InfoRow = ({ label, value }) => (
  <div style={styles.infoRow}>
    <span style={styles.label}>{label}</span>
    <span style={styles.value}>{value}</span>
  </div>
);

/* STYLES */
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 25,
  },

  /* 🔥 HEADER */
  headerCard: {
    background: "#fff",
    padding: 25,
    borderRadius: 20,
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  subText: {
    margin: 0,
    fontSize: 14,
    color: "#6b7280",
  },

  logoutTop: {
    background: "#ef4444",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 600,
  },

  card: {
    background: "#ffffff",
    padding: 25,
    borderRadius: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  },

  heading: {
    marginBottom: 15,
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
  },

  subHeading: {
    marginBottom: 10,
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  label: {
    fontWeight: "600",
    color: "#475569",
  },

  value: {
    color: "#0f172a",
    fontWeight: "500",
  },

  loadingText: {
    color: "#6b7280",
  },

  errorText: {
    color: "#dc2626",
    fontWeight: "500",
  },

  logoutBtn: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#fff",
    border: "none",
    padding: "14px",
    borderRadius: 12,
    cursor: "pointer",
    width: "180px",
    fontWeight: "600",
    fontSize: "15px",
    boxShadow: "0 8px 20px rgba(220,38,38,0.3)",
  },
};