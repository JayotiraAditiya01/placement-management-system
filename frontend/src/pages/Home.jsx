import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const firstWord = "Placement".split("");
  const secondWord = "AI".split("");

  return (
    <div style={container}>
      <div style={heroWrapper}>
        
        {/* LEFT */}
        <div style={leftSection}>
          <div style={titleWrapper}>
            {firstWord.map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                style={mainTitle}
              >
                {letter}
              </motion.span>
            ))}

            <span style={{ width: "18px" }} />

            {secondWord.map((letter, index) => (
              <motion.span
                key={`ai-${index}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (firstWord.length + index) * 0.04 }}
                style={mainTitle}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={subtext}
          >
            AI-powered placement recommendation and analytics platform
            designed to intelligently analyze student skills, academic
            performance, and historical placement trends.
          </motion.p>
        </div>

        {/* RIGHT */}
        <div style={rightSection}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/student/login")}
            style={{
              ...modernBtn,
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            }}
          >
            Get Student Access
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/admin/login")}
            style={{
              ...modernBtn,
              background: "#0f172a",
            }}
          >
            Get Admin Access
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/developer/login")}
            style={{
              ...modernBtn,
              background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
            }}
          >
            Get Developer Access
          </motion.button>
        </div>

      </div>
    </div>
  );
};

/* ---------- STYLES ---------- */

const container = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #eef2ff, #f8f9fc)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px 20px",
  overflowX: "hidden",
};

const heroWrapper = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  maxWidth: "1200px",
  gap: "40px",
  flexWrap: "wrap", // 🔥 prevents breaking on small screens
};

const leftSection = {
  flex: 1,
  minWidth: "280px",
};

const rightSection = {
  flex: 1,
  minWidth: "280px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  alignItems: "flex-end",
};

const titleWrapper = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
};

const mainTitle = {
  fontSize: "72px",
  fontWeight: 900,
  color: "#0f172a",
  letterSpacing: "1px",
};

const subtext = {
  marginTop: "20px",
  fontSize: "18px",
  color: "#475569",
  lineHeight: "1.6",
  maxWidth: "520px",
};

const modernBtn = {
  width: "300px",
  padding: "18px",
  borderRadius: "18px",
  color: "#fff",
  fontWeight: 700,
  fontSize: "16px",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
  transition: "all 0.3s ease",
};

export default Home;