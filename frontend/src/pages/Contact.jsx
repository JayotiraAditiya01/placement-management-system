import { motion } from "framer-motion";
import { useState } from "react";
import API_BASE_URL from "../config/api";

const Contact = () => {

  // ✅ STATE
  const [loading, setLoading] = useState(false);

  // ✅ BACKEND URL
  const API_BASE = API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const message = e.target.message.value;
    const file = e.target.file.files[0];

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("message", message);

      if (file) {
        formData.append("file", file);
      }

      const res = await fetch(`${API_BASE}/api/send-feedback`, {
        method: "POST",
        body: formData
      });

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (res.ok && data.success) {

        alert("✅ Message sent successfully!");

        e.target.reset();

      } else {

        throw new Error(
          data.error || "Failed to send message"
        );
      }

    } catch (error) {

      alert("❌ " + error.message);

    } finally {

      setLoading(false);
    }
  };

  return (
    <div style={page}>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={heading}
      >
        Contact Us
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={subHeading}
      >
        Feedback, bugs, or collaboration — feel free to reach out.
      </motion.p>

      {/* MAIN GRID */}
      <div style={grid}>

        {/* PROJECT LEAD */}
        <motion.div
          style={highlightCard}
          whileHover={{ scale: 1.03 }}
        >

          <h3 style={highlightTitle}>
            Project Lead
          </h3>

          <Detail
            label="👤 Name"
            value="Jayotira Aditiya"
          />

          <Detail
            label="📧 Email"
            value={
              <a
                href="mailto:j.aditiya01@gmail.com"
                style={link}
              >
                j.aditiya01@gmail.com
              </a>
            }
          />

          <Detail
            label="📞 Phone"
            value="8091225369"
          />

          <Detail
            label="💼 LinkedIn"
            value={
              <a
                href="https://www.linkedin.com/in/jayotira-aditiya-78587a320"
                target="_blank"
                rel="noreferrer"
                style={link}
              >
                View Profile
              </a>
            }
          />

          <div style={badge}>
            👑 Founder & Lead Full Stack Developer
          </div>

          {/* 🔥 TECH STACK */}
          <div style={techStack}>
            <span style={techItem}>⚛️ React</span>
            <span style={techItem}>🐍 Flask</span>
            <span style={techItem}>🐘 PostgreSQL</span>
            <span style={techItem}>🧠 ML</span>
          </div>

        </motion.div>

        {/* FORM */}
        <motion.div
          style={card}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
        >

          <h3 style={cardTitle}>
            Send Feedback
          </h3>

          <form onSubmit={handleSubmit}>

            <input
              name="name"
              placeholder="Your Name"
              required
              style={input}
            />

            <input
              name="email"
              type="email"
              placeholder="Your Email"
              required
              style={input}
            />

            <textarea
              name="message"
              placeholder="Describe your issue or feedback"
              required
              style={textarea}
            />

            <input
              type="file"
              name="file"
              style={input}
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                ...button,
                opacity: loading ? 0.7 : 1
              }}
              disabled={loading}
            >
              {loading
                ? "Sending..."
                : "Send Message"}
            </motion.button>

          </form>

        </motion.div>
      </div>

      {/* CONTRIBUTORS */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={contributorsTitle}
      >
        🤝 Contributors
      </motion.h2>

      <div style={contributorsGrid}>

        {/* Jashan */}
        <motion.div
          style={highlightCard}
          whileHover={{ scale: 1.03 }}
        >

          <h3 style={highlightTitle}>
            Contributor
          </h3>

          <Detail
            label="👤 Name"
            value="Jashan Gulati"
          />

          <Detail
            label="📧 Email"
            value={
              <a
                href="mailto:gulati2510@gmail.com"
                style={link}
              >
                gulati2510@gmail.com
              </a>
            }
          />

          <div style={badge}>
            🛠 Testing & QA Support
          </div>

        </motion.div>

        {/* Keshav */}
        <motion.div
          style={highlightCard}
          whileHover={{ scale: 1.03 }}
        >

          <h3 style={highlightTitle}>
            Contributor
          </h3>

          <Detail
            label="👤 Name"
            value="Keshav Singh"
          />

          <Detail
            label="📧 Email"
            value={
              <a
                href="mailto:keshavth024@gmail.com"
                style={link}
              >
                keshavth024@gmail.com
              </a>
            }
          />

          <div style={badge}>
            🎨 UI/UX Feedback Contributor
          </div>

        </motion.div>

        {/* Arjotbir */}
        <motion.div
          style={highlightCard}
          whileHover={{ scale: 1.03 }}
        >

          <h3 style={highlightTitle}>
            Contributor
          </h3>

          <Detail
            label="👤 Name"
            value="Arjotbir Kaur"
          />

          <Detail
            label="📧 Email"
            value={
              <a
                href="mailto:jotbir18@gmail.com"
                style={link}
              >
                jotbir18@gmail.com
              </a>
            }
          />

          <div style={badge}>
            📄 Documentation & Research Support
          </div>

        </motion.div>

      </div>

      {/* THANK YOU */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={thankYou}
      >
        ❤️ Thank you for helping improve this project.
        Your feedback genuinely matters.
      </motion.div>

    </div>
  );
};

/* COMPONENT */
const Detail = ({ label, value }) => (
  <div style={detailRow}>
    <span style={detailLabel}>
      {label}
    </span>

    <span style={detailValue}>
      {value}
    </span>
  </div>
);

/* STYLES */

const page = {
  minHeight: "100vh",
  padding: "40px 60px",
  background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
};

const heading = {
  fontSize: "38px",
  fontWeight: 800,
  textAlign: "center",
};

const subHeading = {
  textAlign: "center",
  color: "#6b7280",
  marginBottom: "40px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1.2fr 1.8fr",
  gap: "30px",
};

const highlightCard = {
  background: "linear-gradient(160deg, #4f46e5, #6366f1)",
  color: "#ffffff",
  padding: "28px",
  borderRadius: "22px",
  boxShadow: "0 25px 60px rgba(79,70,229,0.35)",
  transition: "0.3s",
};

const highlightTitle = {
  fontWeight: 800,
  fontSize: "18px",
  marginBottom: "16px",
};

const detailRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "12px",
};

const detailLabel = {
  fontWeight: 600,
};

const detailValue = {
  fontWeight: 500,
};

const link = {
  color: "#ffffff",
  textDecoration: "underline",
  fontWeight: "600",
};

const badge = {
  marginTop: "20px",
  padding: "10px 12px",
  background: "rgba(255,255,255,0.15)",
  borderRadius: "12px",
  textAlign: "center",
  fontWeight: 600,
};

const techStack = {
  marginTop: "18px",
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  justifyContent: "center"
};

const techItem = {
  background: "rgba(255,255,255,0.2)",
  padding: "6px 10px",
  borderRadius: "10px",
  fontSize: "13px",
  fontWeight: "600"
};

const card = {
  background: "#ffffff",
  padding: "30px",
  borderRadius: "20px",
  boxShadow: "0 20px 45px rgba(0,0,0,0.08)",
};

const cardTitle = {
  fontWeight: 700,
  marginBottom: "18px",
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "14px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
};

const textarea = {
  width: "100%",
  padding: "12px",
  height: "120px",
  marginBottom: "14px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
};

const button = {
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  background: "#4f46e5",
  color: "#ffffff",
  fontWeight: 600,
  border: "none",
  cursor: "pointer",
};

const contributorsTitle = {
  marginTop: "50px",
  textAlign: "center",
  fontSize: "22px",
  fontWeight: "700",
};

const contributorsGrid = {
  marginTop: "20px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px",
};

const thankYou = {
  marginTop: "50px",
  textAlign: "center",
  fontSize: "16px",
  color: "#374151",
};

export default Contact;