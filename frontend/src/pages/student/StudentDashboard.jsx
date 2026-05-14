import { useEffect, useState } from "react";
import StudentSidebar from "../../components/student/StudentSidebar";

// SECTIONS
import DashboardSection from "./sections/DashboardSection";
import ProfileSection from "./sections/ProfileSection";
import AnnouncementSection from "./sections/AnnouncementSection";
import PlacementStatusSection from "./sections/PlacementStatusSection";
import AnalyticsSection from "./sections/AnalyticsSection";
import ActivityLogsSection from "./sections/ActivityLogsSection";
import SettingsSection from "./sections/SettingsSection";

export default function StudentDashboard() {
  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    "";

  const [active, setActive] = useState("dashboard");

  useEffect(() => {
    if (!token) {
      window.location.href = "/student/login";
    }
  }, [token]);

  const renderSection = () => {
    switch (active) {
      case "dashboard":
        return <DashboardSection />;
      case "profile":
        return <ProfileSection />;
      case "announcements":
        return <AnnouncementSection />;
      case "placement":
        return <PlacementStatusSection />;
      case "analytics":
        return <AnalyticsSection />;
      case "activity":
        return <ActivityLogsSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div style={styles.layout}>
      {/* 🔥 PERMANENT SIDEBAR */}
      <StudentSidebar active={active} setActive={setActive} />

      {/* 🔥 MAIN CONTENT */}
      <div style={styles.main}>
        <div style={styles.content}>
          {renderSection()}
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  layout: {
    display: "flex",
  },

  main: {
    marginLeft: 250, // 🔥 MUST match sidebar width
    flex: 1,
    background: "#f3f4f6",
    minHeight: "100vh",
  },

  content: {
    padding: 20,
  },
};