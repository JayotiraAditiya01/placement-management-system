import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ CORRECT PATH
import PlacementTrendChart from "../../../charts/PlacementTrendChart";
import API_BASE_URL from "../../../config/api";
const API = `${API_BASE_URL}/api/students/`;

export default function AnalyticsSection() {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    "";

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setStudent(data);
        setLoading(false);
      });
  }, [token]);

  /* 🔥 LOGOUT */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/student/login");
  };

  /* ================= CALCULATIONS ================= */

  const calculateCompletion = () => {
    if (!student) return 0;

    let total = 10;
    let filled = 0;

    if (student.name) filled++;
    if (student.branch) filled++;
    if (student.section) filled++;
    if (student.cgpa) filled++;
    if (student.phone) filled++;
    if (student.city) filled++;
    if (student.skills) filled++;
    if (student.languages?.length > 0) filled++;
    if (student.resume) filled++;
    if (student.linkedin) filled++;

    return Math.round((filled / total) * 100);
  };

  const skillsCount = student?.skills
    ? student.skills.split(",").length
    : 0;

  const langCount = student?.languages?.length || 0;

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      {/* 🔥 HEADER CARD (NEW) */}
      <div style={styles.headerCard}>
        <div>
          <h2 style={{ margin: 0 }}>Analytics</h2>
          <p style={styles.subText}>Student Control Panel</p>
        </div>

        <div style={styles.logoutBtn} onClick={handleLogout}>
          🚪 Logout
        </div>
      </div>

      {/* EXISTING CONTENT (UNCHANGED) */}
      <h2 style={styles.heading}>📊 Analytics</h2>

      {/* STATS */}
      <div style={styles.grid}>
        <StatCard title="Profile Completion" value={`${calculateCompletion()}%`} />
        <StatCard title="Skills Added" value={skillsCount} />
        <StatCard title="Languages" value={langCount} />
        <StatCard title="Status" value={student?.status || "PENDING"} />
      </div>

      {/* INSIGHT */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Profile Insights</h3>

        <p style={styles.text}>
          {calculateCompletion() < 50
            ? "⚠️ Your profile is incomplete. Add more details to improve placement chances."
            : calculateCompletion() < 80
            ? "👍 Good profile! Add a few more details to strengthen it."
            : "🔥 Excellent profile! You are placement ready."}
        </p>
      </div>

      {/* CHART */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Placement Trend</h3>

        {PlacementTrendChart ? (
          <PlacementTrendChart />
        ) : (
          <p style={styles.muted}>Chart not available</p>
        )}
      </div>
    </div>
  );
}

/* COMPONENT */
const StatCard = ({ title, value }) => (
  <div style={styles.statCard}>
    <p style={styles.statTitle}>{title}</p>
    <p style={styles.statValue}>{value}</p>
  </div>
);

/* STYLES */
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
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

  logoutBtn: {
    background: "#ef4444",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 600,
  },

  loading: {
    padding: 20,
  },

  heading: {
    fontSize: 22,
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 15,
  },

  statCard: {
    background: "#fff",
    padding: 18,
    borderRadius: 14,
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
  },

  statTitle: {
    fontSize: 13,
    color: "#6b7280",
  },

  statValue: {
    fontSize: 22,
    fontWeight: "bold",
  },

  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
  },

  cardTitle: {
    fontWeight: "600",
    marginBottom: 10,
  },

  text: {
    color: "#444",
  },

  muted: {
    color: "#6b7280",
  },
};