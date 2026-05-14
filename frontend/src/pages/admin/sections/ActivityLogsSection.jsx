import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getLogs,
  deleteLog,
  deleteFilteredLogs,
} from "../../../utils/activityLogger";
import API_BASE_URL from "../../../config/api";
const API =
  `${API_BASE_URL}/api/students/`;

/* ==================================================
   🔥 TIME FORMATTER
================================================== */

const formatISTTime = (
  timestamp
) => {

  if (!timestamp) return "-";

  try {

    return new Date(
      timestamp
    ).toLocaleString(
      "en-IN",
      {
        timeZone:
          "Asia/Kolkata",

        day: "2-digit",

        month: "short",

        year: "numeric",

        hour: "2-digit",

        minute: "2-digit",

        second: "2-digit",

        hour12: true,
      }
    );

  } catch {

    return timestamp;
  }
};

export default function ActivityLogsSection() {

  const token =
    localStorage.getItem(
      "access_token"
    ) ||
    localStorage.getItem(
      "token"
    ) ||
    "";

  const [student, setStudent] =
    useState(null);

  const [logs, setLogs] =
    useState([]);

  const [filter, setFilter] =
    useState("ALL");

  const [showDeleteMenu, setShowDeleteMenu] =
    useState(false);

  const dropdownRef =
    useRef(null);

  /* ==================================================
     INITIAL LOAD
  ================================================== */

  useEffect(() => {

    fetch(`${API}me`, {

      headers: {

        Authorization:
          `Bearer ${token}`,
      },

    })
      .then((res) =>
        res.ok
          ? res.json()
          : null
      )

      .then((data) => {

        if (data) {

          setStudent(data);
        }
      });

    loadLogs();

    const interval =
      setInterval(() => {

        loadLogs();

      }, 2000);

    return () =>
      clearInterval(
        interval
      );

  }, []);

  /* ==================================================
     CLOSE DROPDOWN
  ================================================== */

  useEffect(() => {

    const handleClickOutside =
      (event) => {

        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(
            event.target
          )
        ) {

          setShowDeleteMenu(
            false
          );
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  /* ==================================================
     LOAD LOGS
  ================================================== */

  const loadLogs =
    async () => {

      try {

        let allLogs =
          await getLogs();

        /* ==================================================
           SORT LATEST FIRST
        ================================================== */

        allLogs = (
          allLogs || []
        ).sort(
          (a, b) =>
            new Date(
              b.timestamp
            ) -
            new Date(
              a.timestamp
            )
        );

        setLogs(

          applyFilter(
            allLogs,
            filter
          )
        );

      } catch (err) {

        console.error(
          "Load Logs Error:",
          err
        );
      }
    };

  /* ==================================================
     FILTER
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

        if (
          type === "TODAY"
        ) {

          return (

            logDate.toDateString() ===
            now.toDateString()
          );
        }

        if (
          type === "WEEK"
        ) {

          const weekAgo =
            new Date();

          weekAgo.setDate(
            now.getDate() - 7
          );

          return (
            logDate >=
            weekAgo
          );
        }

        if (
          type === "MONTH"
        ) {

          return (

            logDate.getMonth() ===
              now.getMonth() &&

            logDate.getFullYear() ===
              now.getFullYear()
          );
        }

        return true;
      }
    );
  };

  /* ==================================================
     HANDLE FILTER
  ================================================== */

  const handleFilter =
    async (type) => {

      setFilter(type);

      const allLogs =
        await getLogs();

      setLogs(

        applyFilter(
          allLogs,
          type
        )
      );
    };

  /* ==================================================
     DELETE SINGLE LOG
  ================================================== */

  const handleDeleteLog =
    async (logId) => {

      try {

        const success =
          await deleteLog(
            logId
          );

        if (!success) {

          return;
        }

        const refreshedLogs =
          await getLogs();

        setLogs(

          applyFilter(
            refreshedLogs,
            filter
          )
        );

      } catch (err) {

        console.error(
          "Delete Log Error:",
          err
        );
      }
    };

  /* ==================================================
     DELETE FILTERED LOGS
  ================================================== */

  const handleDeleteFiltered =
    async (type) => {

      try {

        const success =
          await deleteFilteredLogs(
            type
          );

        if (!success) {

          return;
        }

        const refreshedLogs =
          await getLogs();

        setLogs(

          applyFilter(
            refreshedLogs,
            filter
          )
        );

        setShowDeleteMenu(
          false
        );

      } catch (err) {

        console.error(

          "Delete Filtered Logs Error:",
          err
        );
      }
    };

  /* ==================================================
     BADGE COLORS
  ================================================== */

  const getTypeColor =
    (type) => {

      switch (
        (
          type || ""
        ).toLowerCase()
      ) {

        case "success":

          return {

            background:
              "rgba(34,197,94,0.15)",

            color:
              "#22c55e",
          };

        case "error":

          return {

            background:
              "rgba(239,68,68,0.15)",

            color:
              "#ef4444",
          };

        case "student":

          return {

            background:
              "rgba(99,102,241,0.15)",

            color:
              "#4f46e5",
          };

        default:

          return {

            background:
              "rgba(59,130,246,0.15)",

            color:
              "#3b82f6",
          };
      }
    };

  return (

    <div style={styles.container}>

      {/* ==================================================
         HEADER
      ================================================== */}

      <div style={styles.header}>

        <div>

          <h2 style={styles.title}>
            Activity Logs
          </h2>

          <p style={styles.subtitle}>
            Monitor all placement,
            profile and student
            activities
          </p>

        </div>

      </div>

      {/* ==================================================
         FILTER + DELETE
      ================================================== */}

      <div style={styles.topActions}>

        {/* FILTERS */}

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
                handleFilter(
                  f
                )
              }

              style={{
                ...styles.filterBtn,

                background:

                  filter === f
                    ? "linear-gradient(135deg,#2563eb,#4f46e5)"
                    : "#1e293b",

                color:

                  filter === f
                    ? "#fff"
                    : "#cbd5e1",
              }}
            >

              {f}

            </button>
          ))}

        </div>

        {/* DELETE DROPDOWN */}

        <div
          style={
            styles.dropdownWrapper
          }

          ref={dropdownRef}
        >

          <button
            style={
              styles.deleteMainBtn
            }

            onClick={() =>
              setShowDeleteMenu(
                !showDeleteMenu
              )
            }
          >

            Delete Logs ▼

          </button>

          {showDeleteMenu && (

            <div
              style={
                styles.dropdownMenu
              }
            >

              <button
                style={
                  styles.dropdownItem
                }

                onClick={() =>
                  handleDeleteFiltered(
                    "TODAY"
                  )
                }
              >
                Delete Today
              </button>

              <button
                style={
                  styles.dropdownItem
                }

                onClick={() =>
                  handleDeleteFiltered(
                    "WEEK"
                  )
                }
              >
                Delete Week
              </button>

              <button
                style={
                  styles.dropdownItem
                }

                onClick={() =>
                  handleDeleteFiltered(
                    "MONTH"
                  )
                }
              >
                Delete Month
              </button>

              <button
                style={{
                  ...styles.dropdownItem,

                  color:
                    "#ef4444",
                }}

                onClick={() =>
                  handleDeleteFiltered(
                    "ALL"
                  )
                }
              >
                Delete All
              </button>

            </div>
          )}

        </div>

      </div>

      {/* ==================================================
         LOGS
      ================================================== */}

      <div style={styles.card}>

        {logs.length === 0 ? (

          <p style={styles.empty}>
            No activity found
          </p>

        ) : (

          logs.map(
            (log, index) => (

              <div
                key={index}
                style={
                  styles.logItem
                }
              >

                <div
                  style={
                    styles.logTop
                  }
                >

                  <div
                    style={{
                      ...styles.typeBadge,

                      ...getTypeColor(
                        log.type
                      ),
                    }}
                  >

                    {log.type ||
                      "info"}

                  </div>

                  <div
                    style={
                      styles.moduleBadge
                    }
                  >

                    {log.module ||
                      log.category ||
                      "General"}

                  </div>

                </div>

                <div
                  style={
                    styles.logHeader
                  }
                >

                  <span
                    style={
                      styles.action
                    }
                  >

                    {log.action ||
                      log.message}

                  </span>

                  <button
                    style={
                      styles.singleDeleteBtn
                    }

                    onClick={() =>
                      handleDeleteLog(
                        log.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

                {/* ==================================================
                   CLEAN TIME
                ================================================== */}

                <span
                  style={
                    styles.time
                  }
                >

                  {formatISTTime(
                    log.timestamp ||
                    log.time
                  )}

                </span>

              </div>
            )
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

    flexDirection:
      "column",

    gap: 20,
  },

  header: {

    display: "flex",

    justifyContent:
      "space-between",

    alignItems:
      "center",
  },

  title: {

    fontSize: 28,

    fontWeight: "800",

    color: "#0f172a",

    marginBottom: 5,
  },

  subtitle: {

    color: "#64748b",

    fontSize: 14,
  },

  topActions: {

    display: "flex",

    justifyContent:
      "space-between",

    alignItems:
      "center",

    gap: 20,

    flexWrap: "wrap",
  },

  filterBar: {

    display: "flex",

    gap: 10,

    flexWrap: "wrap",
  },

  filterBtn: {

    padding:
      "10px 18px",

    borderRadius: 12,

    border: "none",

    cursor: "pointer",

    fontWeight: "600",

    transition:
      "all 0.2s ease",
  },

  dropdownWrapper: {

    position:
      "relative",
  },

  deleteMainBtn: {

    border: "none",

    padding:
      "11px 18px",

    borderRadius: 12,

    cursor: "pointer",

    fontWeight: "700",

    background:
      "linear-gradient(135deg,#ef4444,#dc2626)",

    color: "#fff",

    fontSize: 14,
  },

  dropdownMenu: {

    position:
      "absolute",

    top: 55,

    right: 0,

    width: 200,

    background:
      "#ffffff",

    borderRadius: 18,

    boxShadow:
      "0 10px 35px rgba(0,0,0,0.12)",

    border:
      "1px solid rgba(148,163,184,0.15)",

    overflow:
      "hidden",

    zIndex: 999,
  },

  dropdownItem: {

    width: "100%",

    padding:
      "14px 18px",

    border: "none",

    background:
      "#fff",

    textAlign:
      "left",

    cursor:
      "pointer",

    fontWeight: "600",

    color: "#0f172a",

    borderBottom:
      "1px solid rgba(226,232,240,0.7)",
  },

  card: {

    background:
      "#ffffff",

    padding: 24,

    borderRadius: 24,

    boxShadow:
      "0 10px 35px rgba(0,0,0,0.06)",

    display: "flex",

    flexDirection:
      "column",

    gap: 18,
  },

  logItem: {

    padding: 18,

    borderRadius: 18,

    background:
      "linear-gradient(135deg,#f8fafc,#ffffff)",

    border:
      "1px solid rgba(148,163,184,0.15)",

    display: "flex",

    flexDirection:
      "column",

    gap: 12,
  },

  logTop: {

    display: "flex",

    alignItems:
      "center",

    gap: 10,

    flexWrap:
      "wrap",
  },

  typeBadge: {

    padding:
      "6px 12px",

    borderRadius:
      999,

    fontSize: 12,

    fontWeight:
      "700",

    textTransform:
      "uppercase",
  },

  moduleBadge: {

    padding:
      "6px 12px",

    borderRadius:
      999,

    background:
      "rgba(99,102,241,0.15)",

    color:
      "#4f46e5",

    fontSize: 12,

    fontWeight:
      "700",
  },

  logHeader: {

    display: "flex",

    justifyContent:
      "space-between",

    alignItems:
      "center",

    gap: 10,
  },

  action: {

    fontWeight:
      "700",

    color:
      "#0f172a",

    fontSize: 15,

    lineHeight: 1.5,
  },

  time: {

    fontSize: 12,

    color:
      "#64748b",

    fontWeight:
      "600",
  },

  singleDeleteBtn: {

    border: "none",

    background:
      "linear-gradient(135deg,#ef4444,#dc2626)",

    color: "#fff",

    padding:
      "8px 14px",

    borderRadius: 10,

    cursor:
      "pointer",

    fontWeight:
      "700",

    fontSize: 12,
  },

  empty: {

    color:
      "#6b7280",

    textAlign:
      "center",

    padding:
      "20px 0",
  },
};