import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= ACTIVITY LOGGER ================= */
import { addLog } from "../../../utils/activityLogger";
import API_BASE_URL from "../../../config/api";
const API = `${API_BASE_URL}/api/students/`;
const LANG_OPTIONS = ["English", "Hindi", "Punjabi", "Hinglish"];

/* 🔥 FIX FUNCTION */
const normalizeUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return "https://" + url;
};

export default function ProfileSection() {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    "";

  const [student, setStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: "",
    branch: "",
    section: "",
    classRollNo: "",
    universityRollNo: "",
    cgpa: "",
    phone: "",
    city: "",
    bio: "",
    skills: "",
    languages: [],
    resumeLink: "",
    linkedin: "",
  });

  /* ================= LOGOUT FUNCTION ================= */
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");

    // ✅ CORRECT ROUTE
    navigate("/student/login");
  };

  /* ================= FETCH ================= */
  useEffect(() => {
    fetch(`${API}me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data) {
          setStudent(data);

          setForm({
            name: data.name || "",
            branch: data.branch || "",
            section: data.section || "",
            classRollNo: data.classRollNo || "",
            universityRollNo: data.universityRollNo || "",
            cgpa: data.cgpa || "",
            phone: data.phone || "",
            city: data.city || "",
            bio: data.bio || "",
            skills: data.skills || "",
            languages: data.languages || [],
            resumeLink: data.resume || "",
            linkedin: data.linkedin || "",
          });

          /* ================= ACTIVITY LOG ================= */
          addLog({
            module: "Student Profile",
            action: "Viewed profile section",
            type: "info",
          });
        }
      });
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleLanguage = (lang) => {
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();

    Object.entries(form).forEach(([k, v]) => {
      if (k === "languages") {
        fd.append(k, JSON.stringify(v));
      } else {
        fd.append(k, v);
      }
    });

    const res = await fetch(API, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    const data = await res.json();

    if (res.ok) {
      setStudent(data);
      setEditMode(false);

      /* ================= PROFILE UPDATE LOG ================= */
      addLog({
        module: "Student Profile",
        action: `${form.name} updated profile`,
        type: "success",
      });

      /* ================= RESUME LOG ================= */
      if (form.resumeLink) {
        addLog({
          module: "Resume",
          action: `${form.name} updated resume link`,
          type: "info",
        });
      }

      /* ================= LINKEDIN LOG ================= */
      if (form.linkedin) {
        addLog({
          module: "LinkedIn",
          action: `${form.name} updated LinkedIn profile`,
          type: "info",
        });
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.headerCard}>
        <div>
          <h2 style={{ margin: 0 }}>Profile</h2>
          <p style={styles.subText}>Student Control Panel</p>
        </div>

        {/* ✅ LOGOUT FIXED */}
        <div style={styles.logoutBtn} onClick={handleLogout}>
          🚪 Logout
        </div>
      </div>

      {!student || editMode ? (
        <div style={styles.card}>
          <h3 style={styles.heading}>Fill Your Profile Details</h3>

          <form onSubmit={handleSubmit} style={styles.formGrid}>
            {input("name", form, handleChange, "Name")}
            {input("branch", form, handleChange, "Branch")}
            {input("section", form, handleChange, "Section")}
            {input("classRollNo", form, handleChange, "Class Roll No")}
            {input("universityRollNo", form, handleChange, "University Roll No")}
            {input("cgpa", form, handleChange, "CGPA")}
            {input("phone", form, handleChange, "Phone")}
            {input("city", form, handleChange, "City")}

            <input
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="Skills (comma separated)"
              style={{ ...styles.input, gridColumn: "span 2" }}
            />

            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Short Bio"
              style={{ ...styles.input, height: 90, gridColumn: "span 2" }}
            />

            <div style={{ gridColumn: "span 2" }}>
              <p style={styles.label}>Preferred Interview Language</p>
              <div style={styles.langWrap}>
                {LANG_OPTIONS.map((lang) => (
                  <label key={lang} style={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={form.languages.includes(lang)}
                      onChange={() => toggleLanguage(lang)}
                    />
                    {lang}
                  </label>
                ))}
              </div>
            </div>

            <input
              name="resumeLink"
              value={form.resumeLink}
              onChange={handleChange}
              placeholder="Resume Drive Link"
              style={{ ...styles.input, gridColumn: "span 2" }}
            />

            <input
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="LinkedIn URL"
              style={{ ...styles.input, gridColumn: "span 2" }}
            />

            <button style={styles.submitBtn}>Submit</button>
          </form>
        </div>
      ) : (
        <div style={styles.card}>
          <h3 style={styles.heading}>Your Profile</h3>

          <div style={styles.grid}>
            <Info label="Name" value={student.name} />
            <Info label="Branch" value={student.branch} />
            <Info label="Section" value={student.section} />
            <Info label="Class Roll No" value={student.classRollNo} />
            <Info label="University Roll No" value={student.universityRollNo} />
            <Info label="CGPA" value={student.cgpa} />
            <Info label="Phone" value={student.phone} />
            <Info label="City" value={student.city} />
            <Info label="Skills" value={student.skills} />
            <Info label="Languages" value={student.languages?.join(", ")} />
            <Info label="Bio" value={student.bio} full />
          </div>

          <div style={styles.actionRow}>
            {student.resume && (
              <a
                href={normalizeUrl(student.resume)}
                target="_blank"
                rel="noreferrer"
                style={styles.linkBtn}
              >
                📄 Resume
              </a>
            )}

            {student.linkedin && (
              <a
                href={normalizeUrl(student.linkedin)}
                target="_blank"
                rel="noreferrer"
                style={styles.linkBtn2}
              >
                🔗 LinkedIn
              </a>
            )}

            <button style={styles.editBtn} onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* COMPONENTS */
const input = (name, form, handleChange, placeholder) => (
  <input
    name={name}
    value={form[name]}
    onChange={handleChange}
    placeholder={placeholder}
    style={styles.input}
  />
);

const Info = ({ label, value, full }) => (
  <div style={{ ...styles.infoCard, ...(full && { gridColumn: "span 2" }) }}>
    <p style={styles.infoLabel}>{label}</p>
    <p style={styles.infoValue}>{value || "-"}</p>
  </div>
);

/* STYLES */
const styles = {
  container: { padding: 20, display: "flex", flexDirection: "column", gap: 20 },

  headerCard: {
    background: "#fff",
    padding: 25,
    borderRadius: 20,
    display: "flex",
    justifyContent: "space-between",
  },

  subText: { margin: 0, fontSize: 14, color: "#6b7280" },

  logoutBtn: {
    background: "#ef4444",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 10,
    cursor: "pointer",
  },

  card: { background: "#fff", padding: 25, borderRadius: 18 },

  heading: { marginBottom: 15 },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 15,
  },

  input: { padding: 12, borderRadius: 10, border: "1px solid #ddd" },

  submitBtn: {
    gridColumn: "span 2",
    padding: 14,
    background: "#2563eb",
    color: "#fff",
    borderRadius: 10,
    border: "none",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 15,
  },

  infoCard: {
    background: "#f9fafb",
    padding: 15,
    borderRadius: 12,
  },

  infoLabel: { fontSize: 12, color: "#6b7280" },
  infoValue: { fontWeight: 600 },

  actionRow: { marginTop: 20, display: "flex", gap: 10 },

  linkBtn: {
    background: "#2563eb",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 8,
    textDecoration: "none",
  },

  linkBtn2: {
    background: "#0ea5e9",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 8,
    textDecoration: "none",
  },

  editBtn: {
    background: "#111827",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 8,
  },

  label: { fontWeight: "600", marginBottom: 8 },
  langWrap: { display: "flex", gap: 10, flexWrap: "wrap" },
  checkbox: { display: "flex", gap: 5 },
};