import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/admin/Sidebar";

import DashboardSection from "./sections/DashboardSection";
import StudentsSection from "./sections/StudentsSection";
import ExportSection from "./sections/ExportSection";
import AnnouncementSection from "./sections/AnnouncementSection";
import AnalyticsSection from "./sections/AnalyticsSection";
import AIInsightsSection from "./sections/AIInsightsSection";
import SettingsSection from "./sections/SettingsSection";
import ActivityLogsSection from "./sections/ActivityLogsSection";

/* ================= NEW SECTION ================= */
import PlacementDrivesSection from "./sections/PlacementDrivesSection";

import { getAnnouncements } from "../../utils/announcementStore";
import API_BASE_URL from "../../config/api";
/* ================= API ================= */
const API = `${API_BASE_URL}/api/students/`;

const AdminDashboard = () => {

  const navigate = useNavigate();

  const token =
    localStorage.getItem("access_token") || "";

  const [activeSection, setActiveSection] =
    useState("Dashboard");

  const [students, setStudents] = useState([]);

  const [announcements, setAnnouncements] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  /* ================= INIT ================= */
  useEffect(() => {

    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchStudents();

    setAnnouncements(
      getAnnouncements()
    );

    const interval = setInterval(() => {
      fetchStudents();
    }, 5000);

    return () => clearInterval(interval);

  }, [token]);

  /* ================= FETCH STUDENTS ================= */
  const fetchStudents = async () => {

    try {

      console.log("📡 Fetching students...");

      const res = await fetch(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok)
        throw new Error("Fetch failed");

      const data = await res.json();

      console.log("📦 API Response:", data);

      // 🔥 SAFE EXTRACTION
      const studentList =
        Array.isArray(data.students)
          ? data.students
          : [];

      console.log(
        "✅ Students extracted:",
        studentList
      );

      setStudents(studentList);

    } catch (err) {

      console.error(
        "❌ Fetch Error:",
        err
      );

      setStudents([]);

    } finally {

      setLoading(false);

    }
  };

  /* ================= LOGOUT ================= */
  const logout = () => {

    localStorage.clear();

    navigate("/admin/login");
  };

  /* ================= LOADING ================= */
  if (loading) {

    return (
      <div style={loadingContainer}>

        <div style={loader}></div>

        <p style={loadingText}>
          Loading Dashboard...
        </p>

      </div>
    );
  }

  return (
    <div style={wrapper}>

      {/* ================= SIDEBAR ================= */}
      <Sidebar
        active={activeSection}
        setActive={setActiveSection}
      />

      {/* ================= MAIN ================= */}
      <div style={mainContainer}>

        {/* ================= HEADER ================= */}
        <div style={header}>

          <div>
            <h2 style={title}>
              {activeSection}
            </h2>

            <p style={subtitle}>
              Admin Control Panel
            </p>
          </div>

          <button
            style={logoutBtn}
            onClick={logout}
          >
            🚪 Logout
          </button>

        </div>

        {/* ================= CONTENT ================= */}
        <div style={contentWrapper}>

          {activeSection === "Dashboard" && (
            <DashboardSection
              students={students}
            />
          )}

          {activeSection === "Students" && (
            <StudentsSection
              students={students}
              refresh={fetchStudents}
            />
          )}

          {activeSection === "Export" && (
            <ExportSection
              students={students}
            />
          )}

          {activeSection === "Announcements" && (
            <AnnouncementSection
              announcements={announcements}
              setAnnouncements={setAnnouncements}
            />
          )}

          {activeSection === "Analytics" && (
            <AnalyticsSection
              students={students}
            />
          )}

          {activeSection === "AI Insights" && (
            <AIInsightsSection
              students={students}
            />
          )}

          {/* ================= NEW SECTION ================= */}
          {activeSection === "Placement Drives" && (
            <PlacementDrivesSection />
          )}

          {activeSection === "Settings" && (
            <SettingsSection />
          )}

          {activeSection === "Activity Logs" && (
            <ActivityLogsSection />
          )}

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;

/* ================================================== */
/* ===================== STYLES ===================== */
/* ================================================== */

const wrapper = {
  display: "flex",
  minHeight: "100vh",
  background: "#eef2ff",
};

const mainContainer = {
  marginLeft: 260,
  width: "100%",
  padding: "30px",
  background: "#f4f6fb",
  minHeight: "100vh",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "25px",
  background: "#ffffff",
  padding: "18px 22px",
  borderRadius: "16px",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.05)",
};

const title = {
  fontSize: "26px",
  fontWeight: "800",
  color: "#0f172a",
};

const subtitle = {
  fontSize: "14px",
  color: "#64748b",
};

const logoutBtn = {
  padding: "10px 18px",
  borderRadius: "12px",
  background:
    "linear-gradient(135deg, #111827, #1e293b)",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
};

const contentWrapper = {
  marginTop: "10px",
};

const loadingContainer = {
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "#eef2ff",
};

const loadingText = {
  marginTop: 10,
  color: "#64748b",
};

const loader = {
  width: "50px",
  height: "50px",
  border: "5px solid #e5e7eb",
  borderTop: "5px solid #4f46e5",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};