import { motion } from "framer-motion";

import {
  LayoutDashboard,
  Users,
  BarChart3,
  Brain,
  Megaphone,
  Download,
  Settings,
  Activity,
  BriefcaseBusiness,
} from "lucide-react";

const Sidebar = ({ active, setActive }) => {

  /* ================================================== */
  /* MENU ITEMS */
  /* ================================================== */
  const menu = [

    {
      name: "Dashboard",

      icon: (
        <LayoutDashboard size={18} />
      ),
    },

    {
      name: "Students",

      icon: (
        <Users size={18} />
      ),
    },

    /* ================================================== */
    /* 🚀 MOVED PLACEMENT DRIVES BELOW STUDENTS */
    /* ================================================== */
    {
      name: "Placement Drives",

      icon: (
        <BriefcaseBusiness size={18} />
      ),
    },

    {
      name: "Analytics",

      icon: (
        <BarChart3 size={18} />
      ),
    },

    {
      name: "AI Insights",

      icon: (
        <Brain size={18} />
      ),
    },

    {
      name: "Announcements",

      icon: (
        <Megaphone size={18} />
      ),
    },

    {
      name: "Export",

      icon: (
        <Download size={18} />
      ),
    },

    {
      name: "Settings",

      icon: (
        <Settings size={18} />
      ),
    },

    {
      name: "Activity Logs",

      icon: (
        <Activity size={18} />
      ),
    },
  ];

  return (

    <div style={sidebar}>

      {/* ================================================== */}
      {/* LOGO */}
      {/* ================================================== */}

      <div style={logoContainer}>

        <div style={logoCircle}>
          🚀
        </div>

        <div>

          <h2 style={logo}>
            Admin Panel
          </h2>

          <p style={logoSubtext}>
            PlacementAI
          </p>

        </div>

      </div>

      {/* ================================================== */}
      {/* MENU */}
      {/* ================================================== */}

      <div style={menuWrapper}>

        {menu.map((item) => {

          const isActive =
            active === item.name;

          return (

            <motion.div
              key={item.name}

              whileHover={{
                scale: 1.03,
              }}

              whileTap={{
                scale: 0.97,
              }}

              onClick={() =>
                setActive(item.name)
              }

              style={{

                ...menuItem,

                background: isActive

                  ? "linear-gradient(135deg, #4f46e5, #6366f1)"

                  : "transparent",

                color: isActive

                  ? "#ffffff"

                  : "#cbd5e1",

                boxShadow: isActive

                  ? "0 10px 25px rgba(79,70,229,0.35)"

                  : "none",

                border: isActive

                  ? "1px solid rgba(255,255,255,0.08)"

                  : "1px solid transparent",
              }}
            >

              {/* ================================================== */}
              {/* ICON + TEXT */}
              {/* ================================================== */}

              <div style={menuContent}>

                <div style={iconStyle}>
                  {item.icon}
                </div>

                <span>
                  {item.name}
                </span>

              </div>

            </motion.div>
          );
        })}

      </div>

    </div>
  );
};

export default Sidebar;


/* ================================================== */
/* ===================== STYLES ===================== */
/* ================================================== */

const sidebar = {

  width: 260,

  height: "100vh",

  background:
    "linear-gradient(180deg, #0f172a 0%, #111827 100%)",

  padding: "24px 18px",

  position: "fixed",

  left: 0,

  top: 0,

  display: "flex",

  flexDirection: "column",

  borderRight:
    "1px solid rgba(255,255,255,0.06)",

  overflowY: "auto",
};

const logoContainer = {

  display: "flex",

  alignItems: "center",

  gap: "14px",

  marginBottom: "35px",

  paddingBottom: "20px",

  borderBottom:
    "1px solid rgba(255,255,255,0.08)",
};

const logoCircle = {

  width: "50px",

  height: "50px",

  borderRadius: "14px",

  background:
    "linear-gradient(135deg, #4f46e5, #7c3aed)",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  fontSize: "24px",

  boxShadow:
    "0 10px 25px rgba(79,70,229,0.35)",
};

const logo = {

  color: "#ffffff",

  fontWeight: "800",

  fontSize: "22px",

  margin: 0,
};

const logoSubtext = {

  color: "#94a3b8",

  fontSize: "13px",

  marginTop: "4px",
};

const menuWrapper = {

  display: "flex",

  flexDirection: "column",

  gap: "8px",
};

const menuItem = {

  padding: "14px 16px",

  borderRadius: "16px",

  cursor: "pointer",

  transition: "all 0.3s ease",

  fontWeight: "600",

  userSelect: "none",
};

const menuContent = {

  display: "flex",

  alignItems: "center",

  gap: "14px",
};

const iconStyle = {

  display: "flex",

  alignItems: "center",

  justifyContent: "center",
};