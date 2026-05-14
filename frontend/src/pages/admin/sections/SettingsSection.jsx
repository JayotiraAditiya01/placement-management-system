import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../config/api";
export default function Settings() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH ADMIN DATA ================= */
  useEffect(() => {
    const token =
      localStorage.getItem("access_token") ||
      localStorage.getItem("token"); // 🔥 FIX

    if (!token) {
      setError("No token found. Please login again.");
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/api/admin/profile`, {
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
        console.log("Admin profile:", data);

        // 🔥 SAFE NORMALIZATION
        const normalizedAdmin = {
          email:
            data.admin_email ||
            data.email ||
            data.adminEmail ||
            "Not available",

          college:
            data.college_name ||
            data.college ||
            "Not available",

          id:
            data.id ||
            data.admin_id ||
            "N/A",
        };

        setAdmin(normalizedAdmin);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Settings Error:", err);
        setError("Unable to load admin info");
        setLoading(false);
      });
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  /* ================= SYSTEM INFO ================= */
  const systemInfo = {
    version: "v2.0.0",
    backend: "Flask (Python)",
    database: "PostgreSQL",
    lastLogin: new Date().toLocaleDateString(),
  };

  return (
    <div style={container}>
      {/* ================= ADMIN INFO ================= */}
      <div style={card}>
        <h2 style={heading}>⚙️ Settings</h2>

        {loading ? (
          <p style={loadingText}>Loading admin info...</p>
        ) : error ? (
          <p style={errorText}>{error}</p>
        ) : (
          <>
            <div style={infoRow}>
              <span style={label}>Admin Email</span>
              <span style={value}>{admin.email}</span>
            </div>

            <div style={infoRow}>
              <span style={label}>College Name</span>
              <span style={value}>{admin.college}</span>
            </div>

            <div style={infoRow}>
              <span style={label}>Role</span>
              <span style={value}>Administrator</span>
            </div>

            <div style={infoRow}>
              <span style={label}>Admin ID</span>
              <span style={value}>{admin.id}</span>
            </div>
          </>
        )}
      </div>

      {/* ================= SYSTEM INFO ================= */}
      <div style={card}>
        <h3 style={subHeading}>💻 System Info</h3>

        <div style={infoRow}>
          <span style={label}>Version</span>
          <span style={value}>{systemInfo.version}</span>
        </div>

        <div style={infoRow}>
          <span style={label}>Backend</span>
          <span style={value}>{systemInfo.backend}</span>
        </div>

        <div style={infoRow}>
          <span style={label}>Database</span>
          <span style={value}>{systemInfo.database}</span>
        </div>

        <div style={infoRow}>
          <span style={label}>Last Login</span>
          <span style={value}>{systemInfo.lastLogin}</span>
        </div>
      </div>

      {/* ================= LOGOUT ================= */}
      <button style={logoutBtn} onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  display: "flex",
  flexDirection: "column",
  gap: 25,
};

const card = {
  background: "#ffffff",
  padding: 25,
  borderRadius: 18,
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const heading = {
  marginBottom: 15,
  fontSize: "22px",
  fontWeight: "700",
  color: "#0f172a",
};

const subHeading = {
  marginBottom: 10,
  fontSize: "18px",
  fontWeight: "600",
  color: "#1e293b",
};

const infoRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom: "1px solid #f1f5f9",
};

const label = {
  fontWeight: "600",
  color: "#475569",
};

const value = {
  color: "#0f172a",
  fontWeight: "500",
};

const loadingText = {
  color: "#6b7280",
};

const errorText = {
  color: "#dc2626",
  fontWeight: "500",
};

const logoutBtn = {
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
};