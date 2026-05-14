import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <nav style={navStyle}>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={logo}
      >
        <span style={logoPrimary}>Placement</span>{" "}
        <span style={logoAccent}>AI</span>
      </motion.div>

      {/* Animated Navigation Container */}
      <motion.div
        style={links}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <NavBox to="/">Home</NavBox>
        <NavBox to="/student/login">Student</NavBox>
        <NavBox to="/admin/login">Admin</NavBox>
        <NavBox to="/developer/login">Developer</NavBox>
        <NavBox to="/contact">Contact</NavBox>
      </motion.div>

    </nav>
  );
};

/* ---------- Animation Variants ---------- */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 12,
    },
  },
};

/* ---------- Nav Box Component ---------- */

const NavBox = ({ to, children }) => {
  return (
    <NavLink to={to} style={{ textDecoration: "none" }}>
      {({ isActive }) => (
        <motion.div
          variants={itemVariants}
          whileHover={{
            scale: 1.08,
            boxShadow: "0 0 20px rgba(56, 189, 248, 0.6)",
          }}
          whileTap={{ scale: 0.95 }}
          style={{
            ...boxStyle,
            ...(isActive ? activeBox : {}),
          }}
        >
          {children}
        </motion.div>
      )}
    </NavLink>
  );
};

/* ---------- Styles ---------- */

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "18px 80px",
  background: "rgba(15, 23, 42, 0.95)",
  backdropFilter: "blur(12px)",
  position: "sticky",
  top: 0,
  zIndex: 1000,
  boxShadow: "0 8px 35px rgba(0,0,0,0.35)",
};

const logo = {
  fontWeight: 900,
  fontSize: "24px",
  letterSpacing: "0.5px",
};

const logoPrimary = {
  color: "#e2e8f0",
};

const logoAccent = {
  background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const links = {
  display: "flex",
  gap: "20px",
  alignItems: "center",
};

/* Base Box */
const boxStyle = {
  padding: "9px 20px",
  borderRadius: "14px",
  fontWeight: 600,
  fontSize: "14px",
  color: "#38bdf8",
  background: "rgba(56, 189, 248, 0.08)",
  border: "1px solid rgba(56, 189, 248, 0.3)",
  cursor: "pointer",
  transition: "all 0.3s ease",
  position: "relative",
};

/* Active Box Glow */
const activeBox = {
  background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
  color: "#ffffff",
  boxShadow: "0 0 18px rgba(56, 189, 248, 0.8)",
  border: "1px solid #38bdf8",
};

export default Navbar;
