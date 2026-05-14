import {
  useEffect,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  useNavigate,
} from "react-router-dom";

import {
  Bell,
  Clock3,
  CalendarDays,
  Info,
} from "lucide-react";

import {
  getUnreadCount,
  markAllRead,
} from "../../../utils/announcementStore";

/* ==================================================
   🚀 ACTIVITY LOGGER
================================================== */

import {
  addLog,
} from "../../../utils/activityLogger";
import API_BASE_URL from "../../../config/api";
/* ==================================================
   API
================================================== */

const ANN_API =
  `${API_BASE_URL}/api/admin/announcements`;

/* ==================================================
   COMPONENT
================================================== */

export default function AnnouncementSection() {

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

  const [announcements, setAnnouncements] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [unread, setUnread] =
    useState(0);

  /* ==================================================
     FETCH
  ================================================== */

  useEffect(() => {

    setUnread(
      getUnreadCount()
    );

    fetchAnnouncements();

  }, [token]);

  /* ==================================================
     FETCH ANNOUNCEMENTS
  ================================================== */

  const fetchAnnouncements =
    async () => {

      try {

        const res = await fetch(
          ANN_API,
          {

            headers: {

              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data =
          await res.json();

        const formatted =
          Array.isArray(data)

            ? data.map((a) => ({

                ...a,

                created_at_raw:

                  a.created_at ||

                  a.timestamp ||

                  new Date().toISOString(),

                created_at_ts:
                  new Date(

                    a.created_at ||

                    a.timestamp ||

                    new Date().toISOString()

                  ).getTime(),
              }))

            : [];

        setAnnouncements(
          formatted
        );

        /* ==================================================
           🚀 ACTIVITY LOG
        ================================================== */

        if (
          formatted.length > 0
        ) {

          await addLog({

            module:
              "Announcements",

            action:
              "Viewed latest announcements",

            type:
              "info",
          });
        }

      } catch (err) {

        console.error(
          "Announcement error:",
          err
        );

        setAnnouncements([]);
      }

      finally {

        setLoading(false);
      }
    };

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
     DATE FORMAT
  ================================================== */

  const formatDate =
    (timestamp) => {

      const d =
        new Date(timestamp);

      if (
        isNaN(
          d.getTime()
        )
      ) {

        return "Invalid date";
      }

      return d.toLocaleDateString(
        "en-IN",
        {

          day: "numeric",

          month: "short",

          year: "numeric",
        }
      );
    };

  /* ==================================================
     TIME FORMAT
  ================================================== */

  const formatTime =
    (timestamp) => {

      const d =
        new Date(timestamp);

      if (
        isNaN(
          d.getTime()
        )
      ) {

        return "Invalid time";
      }

      return d.toLocaleTimeString(
        "en-IN",
        {

          hour: "2-digit",

          minute: "2-digit",

          hour12: true,
        }
      );
    };

  /* ==================================================
     TIME AGO
  ================================================== */

  const timeAgo =
    (timestamp) => {

      const now =
        Date.now();

      const diff =
        Math.floor(
          (
            now - timestamp
          ) / 1000
        );

      if (diff < 60)
        return "just now";

      if (diff < 3600)
        return `${Math.floor(
          diff / 60
        )} min ago`;

      if (diff < 86400)
        return `${Math.floor(
          diff / 3600
        )} hrs ago`;

      return `${Math.floor(
        diff / 86400
      )} days ago`;
    };

  /* ==================================================
     MARK READ
  ================================================== */

  const handleMarkRead =
    async () => {

      markAllRead();

      setUnread(0);

      /* ==================================================
         🚀 ACTIVITY LOG
      ================================================== */

      await addLog({

        module:
          "Announcements",

        action:
          "Marked all announcements as read",

        type:
          "success",
      });
    };

  /* ==================================================
     LOADING
  ================================================== */

  if (loading) {

    return (

      <div style={styles.loadingWrapper}>

        <div style={styles.loader} />

        <p style={styles.loadingText}>
          Loading announcements...
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
            Announcements
          </h2>

          <p style={styles.subText}>
            Student Control Panel
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
         TOP TITLE
      ================================================== */}

      <div style={styles.topSection}>

        <div style={styles.titleWrap}>

          <Bell size={22} />

          <h3 style={styles.sectionTitle}>
            Latest Updates
          </h3>

        </div>

        {/* ==================================================
           READ BUTTON
        ================================================== */}

        {unread > 0 && (

          <button
            style={styles.readBtn}
            onClick={handleMarkRead}
          >

            Mark all as read
            ({unread})

          </button>
        )}

      </div>

      {/* ==================================================
         EMPTY STATE
      ================================================== */}

      {announcements.length === 0 ? (

        <div style={styles.emptyState}>

          <Info
            size={42}
            color="#94a3b8"
          />

          <h3 style={styles.emptyTitle}>
            No Announcements
          </h3>

          <p style={styles.emptyText}>
            Latest announcements from
            admin will appear here.
          </p>

        </div>

      ) : (

        announcements.map(
          (a, index) => (

            <motion.div

              key={
                a.id ||
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
                  index * 0.05,
              }}

              style={styles.card}
            >

              {/* ==================================================
                 TOP
              ================================================== */}

              <div style={styles.cardTop}>

                <div>

                  <h3 style={styles.title}>
                    {a.title}
                  </h3>

                  <div style={styles.meta}>

                    <div style={styles.metaItem}>

                      <CalendarDays
                        size={13}
                      />

                      <span>
                        {formatDate(
                          a.created_at_ts
                        )}
                      </span>

                    </div>

                    <div style={styles.metaItem}>

                      <Clock3
                        size={13}
                      />

                      <span>
                        {formatTime(
                          a.created_at_ts
                        )}
                      </span>

                    </div>

                  </div>

                </div>

                {/* ==================================================
                   RIGHT
                ================================================== */}

                <div style={styles.rightSide}>

                  {index < unread && (

                    <span style={styles.badge}>
                      NEW
                    </span>
                  )}

                  <span style={styles.timeAgo}>
                    {timeAgo(
                      a.created_at_ts
                    )}
                  </span>

                </div>

              </div>

              {/* ==================================================
                 MESSAGE
              ================================================== */}

              <p style={styles.message}>
                {a.message}
              </p>

            </motion.div>
          )
        )

      )}

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

    gap: 22,
  },

  /* ==================================================
     LOADING
  ================================================== */

  loadingWrapper: {

    height: "60vh",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    flexDirection: "column",

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
     TOP
  ================================================== */

  topSection: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    flexWrap: "wrap",

    gap: 15,
  },

  titleWrap: {

    display: "flex",

    alignItems: "center",

    gap: 10,

    color: "#111827",
  },

  sectionTitle: {

    margin: 0,

    fontSize: 24,

    fontWeight: 800,
  },

  /* ==================================================
     BUTTON
  ================================================== */

  readBtn: {

    background:
      "linear-gradient(135deg,#2563eb,#4f46e5)",

    color: "#ffffff",

    padding: "10px 16px",

    border: "none",

    borderRadius: 12,

    cursor: "pointer",

    fontWeight: 700,

    boxShadow:
      "0 8px 18px rgba(37,99,235,0.22)",
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

    padding: "60px 20px",

    background: "#ffffff",

    borderRadius: 24,

    boxShadow:
      "0 10px 25px rgba(0,0,0,0.06)",

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
     CARD
  ================================================== */

  card: {

    background: "#ffffff",

    padding: 24,

    borderRadius: 22,

    boxShadow:
      "0 10px 25px rgba(0,0,0,0.06)",

    border:
      "1px solid rgba(0,0,0,0.03)",
  },

  cardTop: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "flex-start",

    gap: 20,
  },

  title: {

    margin: 0,

    fontWeight: 800,

    fontSize: 18,

    color: "#111827",
  },

  meta: {

    display: "flex",

    gap: 18,

    flexWrap: "wrap",

    marginTop: 10,
  },

  metaItem: {

    display: "flex",

    alignItems: "center",

    gap: 6,

    fontSize: 12,

    color: "#64748b",
  },

  rightSide: {

    display: "flex",

    flexDirection: "column",

    alignItems: "flex-end",

    gap: 8,
  },

  badge: {

    background:
      "linear-gradient(135deg,#ef4444,#dc2626)",

    color: "#ffffff",

    padding: "4px 10px",

    borderRadius: 999,

    fontSize: 10,

    fontWeight: 700,

    letterSpacing: 0.4,
  },

  timeAgo: {

    fontSize: 12,

    color: "#6b7280",
  },

  message: {

    marginTop: 18,

    fontSize: 15,

    lineHeight: 1.7,

    color: "#334155",
  },
};