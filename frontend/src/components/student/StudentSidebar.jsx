import { motion } from "framer-motion";
import {
  LayoutDashboard,
  User,
  Bell,
  Briefcase,
  BarChart3,
  Activity,
  Settings,
} from "lucide-react";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "Profile", icon: User },
  { id: "announcements", label: "Announcements", icon: Bell },
  { id: "placement", label: "Placement Status", icon: Briefcase },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "activity", label: "Activity Logs", icon: Activity },
  { id: "settings", label: "Settings", icon: Settings },
];

const StudentSidebar = ({ active, setActive }) => {
  return (
    <div style={styles.sidebar}>
      {/* LOGO */}
      <h2 style={styles.logo}>Student Panel</h2>

      {/* MENU */}
      <div style={styles.menu}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActive(item.id)}
              style={{
                ...styles.menuItem,
                ...(isActive ? styles.activeItem : {}),
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentSidebar;

/* ================= STYLES ================= */

const styles = {
  sidebar: {
    width: 250,
    height: "100vh",
    background: "#111827",
    padding: 20,
    position: "fixed",
    left: 0,
    top: 0,
    display: "flex",
    flexDirection: "column",
  },

  logo: {
    color: "#ffffff",
    marginBottom: 30,
    fontWeight: "800",
    fontSize: "20px",
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    borderRadius: 12,
    cursor: "pointer",
    transition: "all 0.3s ease",
    color: "#cbd5f5",
    fontWeight: "500",
  },

  activeItem: {
    background: "#4f46e5",
    color: "#ffffff",
    boxShadow: "0 8px 20px rgba(79,70,229,0.3)",
  },
};