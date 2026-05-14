import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getLogs,
} from "../../../utils/activityLogger";

import {
  Activity,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import API_BASE_URL from "../../../config/api";
/* ==================================================
   API
================================================== */

const API =
  `${API_BASE_URL}/api/students/`;

/* ==================================================
   COMPONENT
================================================== */

export default function ActivityLogsSection() {

  const navigate =
    useNavigate();

  /* ==================================================
     TOKEN
  ================================================== */

  const token =

    localStorage.getItem(
      "access_token"
    ) ||

    localStorage.getItem(
      "token"
    ) ||

    "";

  /* ==================================================
     STATES
  ================================================== */

  const [logs, setLogs] =
    useState([]);

  const [filter, setFilter] =
    useState("ALL");

  const [loading, setLoading] =
    useState(true);

  /* ==================================================
     FETCH LOGS
  ================================================== */

  useEffect(() => {

    fetchStudentAndLogs();

    const interval =
      setInterval(() => {

        fetchStudentAndLogs();

      }, 3000);

    return () =>
      clearInterval(interval);

  }, []);

  /* ==================================================
     LOGOUT
  ================================================== */

  const handleLogout =
    () => {

      localStorage.clear();

      navigate(
        "/student/login"
      );
    };

  /* ==================================================
     FETCH REAL POSTGRESQL LOGS
  ================================================== */

  const fetchStudentAndLogs =
    async () => {

      try {

        /* ==================================================
           VERIFY STUDENT TOKEN
        ================================================== */

        await fetch(
          `${API}me`,
          {

            headers: {

              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        /* ==================================================
           FETCH REAL LOGS
        ================================================== */

        const storedLogs =
          await getLogs();

        /* ==================================================
           APPLY FILTER
        ================================================== */

        setLogs(

          applyFilter(
            storedLogs,
            filter
          )
        );

        setLoading(false);

      } catch (err) {

        console.error(
          "Activity error:",
          err
        );

        setLoading(false);
      }
    };

  /* ==================================================
     FILTER LOGS
  ================================================== */

  const applyFilter = (
    logs,
    type
  ) => {

    const now =
      new Date();

    return logs.filter(
      (log) => {

        const logDate =
          new Date(
            log.timestamp
          );

        /* TODAY */

        if (
          type === "TODAY"
        ) {

          return (

            logDate.toDateString()

            ===

            now.toDateString()
          );
        }

        /* WEEK */

        if (
          type === "WEEK"
        ) {

          const weekAgo =
            new Date();

          weekAgo.setDate(
            now.getDate() - 7
          );

          return (
            logDate >= weekAgo
          );
        }

        /* MONTH */

        if (
          type === "MONTH"
        ) {

          return (

            logDate.getMonth()

            ===

            now.getMonth()

            &&

            logDate.getFullYear()

            ===

            now.getFullYear()
          );
        }

        return true;
      }
    );
  };

  /* ==================================================
     FILTER BUTTON
  ================================================== */

  const handleFilter =
    (type) => {

      setFilter(type);

      setLogs((prev) =>

        applyFilter(
          prev,
          type
        )
      );
    };

  /* ==================================================
     LOADING
  ================================================== */

  if (loading) {

    return (

      <div style={styles.loadingWrapper}>

        <div style={styles.loader} />

        <p style={styles.loadingText}>
          Loading activity logs...
        </p>

      </div>
    );
  }

  /* ==================================================
     UI
  ================================================== */

  return (

    <div style={styles.container}>

      {/* ==================================================
         HEADER
      ================================================== */}

      <div style={styles.headerCard}>

        <div>

          <h2 style={styles.heading}>
            Activity Logs
          </h2>

          <p style={styles.subText}>
            Real-time student activity tracking
          </p>

        </div>

        <div
          style={styles.logoutBtn}
          onClick={handleLogout}
        >

          🚪 Logout

        </div>

      </div>

      {/* ==================================================
         TITLE
      ================================================== */}

      <div style={styles.sectionTop}>

        <div style={styles.titleWrap}>

          <Activity
            size={22}
          />

          <h2 style={styles.title}>
            Activity Timeline
          </h2>

        </div>

      </div>

      {/* ==================================================
         FILTERS
      ================================================== */}

      <div style={styles.filterBar}>

        {[
          "ALL",
          "TODAY",
          "WEEK",
          "MONTH",
        ].map((f) => (

          <button

            key={f}

            onClick={() =>
              handleFilter(f)
            }

            style={{
              ...styles.filterBtn,

              background:

                filter === f

                  ? "linear-gradient(135deg,#2563eb,#4f46e5)"

                  : "#e5e7eb",

              color:

                filter === f

                  ? "#fff"

                  : "#111827",
            }}
          >

            {f}

          </button>
        ))}

      </div>

      {/* ==================================================
         LOG CARD
      ================================================== */}

      <div style={styles.card}>

        {logs.length === 0 ? (

          <div style={styles.emptyState}>

            <Info
              size={42}
              color="#94a3b8"
            />

            <h3 style={styles.emptyTitle}>
              No Activity Found
            </h3>

            <p style={styles.emptyText}>
              Your student activities
              will appear here in
              real-time.
            </p>

          </div>

        ) : (

          logs.map(
            (log, index) => {

              const type =
                log.type ||
                "info";

              return (

                <motion.div

                  key={
                    log.id ||
                    index
                  }

                  initial={{
                    opacity: 0,
                    y: 10,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    delay:
                      index * 0.04,
                  }}

                  style={
                    styles.logItem
                  }
                >

                  {/* ICON */}

                  <div
                    style={{
                      ...styles.iconBox,

                      background:

                        type === "success"

                          ? "rgba(34,197,94,0.15)"

                          : type === "error"

                          ? "rgba(239,68,68,0.15)"

                          : "rgba(59,130,246,0.15)",
                    }}
                  >

                    {type === "success" ? (

                      <CheckCircle2
                        size={18}
                        color="#22c55e"
                      />

                    ) : type === "error" ? (

                      <AlertCircle
                        size={18}
                        color="#ef4444"
                      />

                    ) : (

                      <Clock3
                        size={18}
                        color="#2563eb"
                      />

                    )}

                  </div>

                  {/* CONTENT */}

                  <div style={styles.logContent}>

                    <div
                      style={
                        styles.logTop
                      }
                    >

                      <span
                        style={
                          styles.action
                        }
                      >

                        {
                          log.action
                        }

                      </span>

                      <span
                        style={
                          styles.time
                        }
                      >

                        {new Date(
                          log.timestamp
                        ).toLocaleString()}

                      </span>

                    </div>

                    <p
                      style={
                        styles.module
                      }
                    >

                      {
                        log.module ||
                        "Student Activity"
                      }

                    </p>

                  </div>

                </motion.div>
              );
            }
          )

        )}

      </div>

    </div>
  );
}

/* ==================================================
   STYLES
================================================== */

const styles = {

  container: {

    display: "flex",

    flexDirection: "column",

    gap: 24,
  },

  /* ==================================================
     LOADING
  ================================================== */

  loadingWrapper: {

    height: "60vh",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    gap: 20,
  },

  loader: {

    width: 45,

    height: 45,

    border:
      "4px solid #e5e7eb",

    borderTop:
      "4px solid #4f46e5",

    borderRadius: "50%",

    animation:
      "spin 1s linear infinite",
  },

  loadingText: {

    color: "#6b7280",

    fontWeight: 600,
  },

  /* ==================================================
     HEADER
  ================================================== */

  headerCard: {

    background: "#ffffff",

    padding: 28,

    borderRadius: 24,

    boxShadow:
      "0 10px 25px rgba(0,0,0,0.06)",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",
  },

  heading: {

    margin: 0,

    fontSize: 30,

    fontWeight: 800,

    color: "#111827",
  },

  subText: {

    marginTop: 6,

    fontSize: 14,

    color: "#6b7280",
  },

  logoutBtn: {

    background:
      "linear-gradient(135deg,#ef4444,#dc2626)",

    color: "#ffffff",

    padding: "12px 20px",

    borderRadius: 14,

    cursor: "pointer",

    fontWeight: 700,

    boxShadow:
      "0 8px 20px rgba(239,68,68,0.25)",
  },

  /* ==================================================
     SECTION TOP
  ================================================== */

  sectionTop: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",
  },

  titleWrap: {

    display: "flex",

    alignItems: "center",

    gap: 10,

    color: "#111827",
  },

  title: {

    margin: 0,

    fontSize: 24,

    fontWeight: 800,
  },

  /* ==================================================
     FILTERS
  ================================================== */

  filterBar: {

    display: "flex",

    gap: 12,

    flexWrap: "wrap",
  },

  filterBtn: {

    padding: "10px 18px",

    borderRadius: 12,

    border: "none",

    cursor: "pointer",

    fontWeight: 700,

    transition: "0.3s",
  },

  /* ==================================================
     CARD
  ================================================== */

  card: {

    background: "#ffffff",

    padding: 24,

    borderRadius: 24,

    boxShadow:
      "0 10px 25px rgba(0,0,0,0.06)",

    display: "flex",

    flexDirection: "column",

    gap: 18,
  },

  /* ==================================================
     EMPTY
  ================================================== */

  emptyState: {

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    textAlign: "center",

    padding: "50px 20px",

    gap: 14,
  },

  emptyTitle: {

    margin: 0,

    fontSize: 22,

    fontWeight: 800,

    color: "#111827",
  },

  emptyText: {

    maxWidth: 450,

    color: "#6b7280",

    lineHeight: 1.7,
  },

  /* ==================================================
     LOG ITEM
  ================================================== */

  logItem: {

    display: "flex",

    alignItems: "flex-start",

    gap: 16,

    padding: 18,

    borderRadius: 18,

    background: "#f9fafb",

    border:
      "1px solid rgba(0,0,0,0.04)",
  },

  iconBox: {

    width: 44,

    height: 44,

    borderRadius: 14,

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    flexShrink: 0,
  },

  logContent: {

    flex: 1,
  },

  logTop: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: 12,
  },

  action: {

    fontWeight: 700,

    color: "#111827",

    lineHeight: 1.5,
  },

  time: {

    fontSize: 12,

    color: "#64748b",

    whiteSpace: "nowrap",
  },

  module: {

    marginTop: 8,

    fontSize: 13,

    color: "#6b7280",
  },
};