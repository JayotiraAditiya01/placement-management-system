import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  CheckCircle2,
  Clock3,
  XCircle,
  Building2,
  BriefcaseBusiness,
  GraduationCap,
  Trophy,
  Activity,
  CircleDashed,
  Building,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import PlacedUnplacedChart from "../../../charts/PlacedUnplacedChart";

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

const API =
  `${API_BASE_URL}/api/students/`;

/* ==================================================
   COMPONENT
================================================== */

export default function PlacementStatusSection() {

  const navigate =
    useNavigate();

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

  const [student, setStudent] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /* ==================================================
     FETCH STUDENT
  ================================================== */

  useEffect(() => {

    fetch(
      `${API}me`,
      {

        headers: {

          Authorization:
            `Bearer ${token}`,
        },
      }
    )

      .then((res) =>

        res.ok
          ? res.json()
          : null

      )

      .then(async (data) => {

        if (data) {

          setStudent(data);

          /* ==================================================
             🚀 ACTIVITY LOG
          ================================================== */

          await addLog({

            module:
              "Placement Status",

            action:
              "Viewed placement journey and status",

            type:
              "info",
          });
        }

        setLoading(false);
      })

      .catch((err) => {

        console.error(
          "Student fetch error:",
          err
        );

        setLoading(false);
      });

  }, [token]);

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
     STATUS
  ================================================== */

  const status =
    student?.status ||
    "PENDING";

  const statusColor = {

    PLACED:
      "#16a34a",

    UNPLACED:
      "#dc2626",

    PENDING:
      "#eab308",
  };

  const statusText = {

    PLACED:
      "🎉 Congratulations! You are successfully placed",

    UNPLACED:
      "❌ You are currently unplaced",

    PENDING:
      "⏳ Your placement journey is currently in progress",
  };

  /* ==================================================
     PLACEMENT DATA
  ================================================== */

  const currentCompany =

    student?.currentCompany ||

    "Not Assigned";

  const driveName =

    student?.driveName ||

    "No Active Drive";

  const currentPhase =

    student?.currentPhase ||

    "No Active Phase";

  const placementResult =

    student?.placementResult ||

    status;

  const phasesCleared =

    student?.phasesCleared ||

    [];

  /* ==================================================
     🚀 ONLY ADMIN-CREATED PHASES
  ================================================== */

  const allPhases =

    student?.allPhases ||

    [];

  /* ==================================================
     PROGRESS
  ================================================== */

  const completedPercentage =

    allPhases.length === 0

      ? 0

      : Math.round(

          (
            phasesCleared.length /
            allPhases.length
          ) * 100

        );

  /* ==================================================
     🚀 ACTIVE PHASE LOG
  ================================================== */

  useEffect(() => {

    if (
      currentPhase &&
      currentPhase !== "No Active Phase"
    ) {

      addLog({

        module:
          "Placement Journey",

        action:
          `Currently active in ${currentPhase} phase`,

        type:
          "info",
      });
    }

  }, [currentPhase]);

  /* ==================================================
     LOADING
  ================================================== */

  if (loading) {

    return (

      <div style={styles.loadingWrapper}>

        <div style={styles.loader} />

        <p style={styles.loadingText}>
          Loading placement data...
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
            Placement Status
          </h2>

          <p style={styles.subText}>
            Track your placement journey,
            interview phases and hiring progress
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
         MAIN STATUS CARD
      ================================================== */}

      <motion.div

        initial={{
          opacity: 0,
          y: 20,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        style={styles.statusCard}
      >

        <div
          style={{
            ...styles.statusBar,

            background:
              statusColor[status],
          }}
        >

          <span style={styles.statusLabel}>
            {placementResult}
          </span>

        </div>

        <div style={styles.statusContent}>

          <p style={styles.statusText}>
            {statusText[status]}
          </p>

          <div style={styles.progressSection}>

            <div style={styles.progressTop}>

              <span style={styles.progressTitle}>
                Placement Progress
              </span>

              <span style={styles.progressPercentage}>
                {completedPercentage}%
              </span>

            </div>

            <div style={styles.progressBar}>

              <motion.div

                initial={{
                  width: 0,
                }}

                animate={{
                  width:
                    `${completedPercentage}%`,
                }}

                transition={{
                  duration: 0.8,
                }}

                style={{
                  ...styles.progressFill,

                  background:
                    statusColor[status],
                }}
              />

            </div>

          </div>

        </div>

      </motion.div>

      {/* ==================================================
         LIVE STATS
      ================================================== */}

      <div style={styles.statsGrid}>

        {/* COMPANY */}
        <StatCard

          icon={
            <Building2 size={22} />
          }

          title="Current Company"

          value={currentCompany}

          bg="rgba(99,102,241,0.15)"

          color="#4f46e5"
        />

        {/* DRIVE NAME */}
        <StatCard

          icon={
            <Building size={22} />
          }

          title="Placement Drive"

          value={driveName}

          bg="rgba(236,72,153,0.15)"

          color="#ec4899"
        />

        {/* CURRENT PHASE */}
        <StatCard

          icon={
            <BriefcaseBusiness
              size={22}
            />
          }

          title="Current Phase"

          value={currentPhase}

          bg="rgba(14,165,233,0.15)"

          color="#0284c7"
        />

        {/* RESULT */}
        <StatCard

          icon={
            <Trophy size={22} />
          }

          title="Placement Result"

          value={placementResult}

          bg="rgba(34,197,94,0.15)"

          color="#16a34a"
        />

        {/* PHASES */}
        <StatCard

          icon={
            <GraduationCap
              size={22}
            />
          }

          title="Phases Cleared"

          value={`${phasesCleared.length}/${allPhases.length}`}

          bg="rgba(168,85,247,0.15)"

          color="#9333ea"
        />

      </div>

      {/* ==================================================
         STUDENT INFO
      ================================================== */}

      <div style={styles.card}>

        <h3 style={styles.cardTitle}>
          Student Information
        </h3>

        <div style={styles.grid}>

          <InfoCard
            label="Name"
            value={student?.name}
          />

          <InfoCard
            label="Branch"
            value={student?.branch}
          />

          <InfoCard
            label="Section"
            value={student?.section}
          />

          <InfoCard
            label="CGPA"
            value={student?.cgpa}
          />

          <InfoCard
            label="University Roll No"
            value={
              student?.universityRollNo
            }
          />

          <InfoCard
            label="Class Roll No"
            value={
              student?.classRollNo
            }
          />

        </div>

      </div>

      {/* ==================================================
         PHASE TRACKER
      ================================================== */}

      <div style={styles.card}>

        <div style={styles.sectionHeader}>

          <h3 style={styles.cardTitle}>
            Placement Journey Timeline
          </h3>

          <div style={styles.liveBadge}>

            <Activity size={14} />

            LIVE

          </div>

        </div>

        {/* ==================================================
           NO DRIVE STATE
        ================================================== */}

        {allPhases.length === 0 ? (

          <div style={styles.emptyState}>

            <CircleDashed
              size={45}
              color="#94a3b8"
            />

            <h3 style={styles.emptyTitle}>
              No Active Placement Drive
            </h3>

            <p style={styles.emptyText}>
              Your placement journey
              timeline will appear once
              admin assigns you to a
              placement drive.
            </p>

          </div>

        ) : (

          <div style={styles.timelineWrapper}>

            {allPhases.map(
              (phase, index) => {

                const completed =

                  phasesCleared.includes(
                    phase.phase_name
                  );

                const active =

                  currentPhase ===
                  phase.phase_name;

                return (

                  <motion.div

                    key={
                      phase.id ||
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
                        index * 0.08,
                    }}

                    style={
                      styles.timelineCard
                    }
                  >

                    {/* ICON */}

                    <div
                      style={{
                        ...styles.timelineIcon,

                        background:
                          completed

                            ? "rgba(34,197,94,0.15)"

                            : active

                            ? "rgba(234,179,8,0.15)"

                            : "rgba(148,163,184,0.12)",
                      }}
                    >

                      {completed ? (

                        <CheckCircle2
                          size={20}
                          color="#22c55e"
                        />

                      ) : active ? (

                        <Clock3
                          size={20}
                          color="#eab308"
                        />

                      ) : (

                        <CircleDashed
                          size={20}
                          color="#94a3b8"
                        />

                      )}

                    </div>

                    {/* CONTENT */}

                    <div
                      style={{
                        flex: 1,
                      }}
                    >

                      <h4
                        style={
                          styles.timelineTitle
                        }
                      >

                        {
                          phase.phase_name
                        }

                      </h4>

                      <p
                        style={
                          styles.timelineStatus
                        }
                      >

                        {completed

                          ? "Completed"

                          : active

                          ? "In Progress"

                          : "Pending"}

                      </p>

                    </div>

                  </motion.div>
                );
              }
            )}

          </div>

        )}

      </div>

      {/* ==================================================
         CHART SECTION
      ================================================== */}

      <div style={styles.card}>

        <div style={styles.sectionHeader}>

          <h3 style={styles.cardTitle}>
            Placement Analytics
          </h3>

          <div style={styles.analyticsBadge}>
            Student Insights
          </div>

        </div>

        {PlacedUnplacedChart ? (

          <PlacedUnplacedChart />

        ) : (

          <p style={styles.muted}>
            Chart not available
          </p>

        )}

      </div>

    </div>
  );
}
/* ==================================================
   MINI STAT CARD
================================================== */

const StatCard = ({
  icon,
  title,
  value,
  bg,
  color,
}) => (

  <motion.div

    whileHover={{
      y: -3,
    }}

    style={styles.statCard}
  >

    <div
      style={{
        ...styles.statIcon,

        background: bg,

        color: color,
      }}
    >

      {icon}

    </div>

    <p style={styles.statTitle}>
      {title}
    </p>

    <h3 style={styles.statValue}>
      {value || "-"}
    </h3>

  </motion.div>
);

/* ==================================================
   MINI INFO CARD
================================================== */

const InfoCard = ({
  label,
  value,
}) => (

  <div style={styles.infoCard}>

    <p style={styles.infoLabel}>
      {label}
    </p>

    <p style={styles.infoValue}>
      {value || "-"}
    </p>

  </div>
);

/* ==================================================
   STYLES
================================================== */

const styles = {

  container: {

    display: "flex",

    flexDirection: "column",

    gap: 25,
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

    fontWeight: 500,
  },

  /* ==================================================
     HEADER
  ================================================== */

  headerCard: {

    background: "#ffffff",

    padding: 28,

    borderRadius: 22,

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
     STATUS CARD
  ================================================== */

  statusCard: {

    background: "#ffffff",

    borderRadius: 24,

    overflow: "hidden",

    boxShadow:
      "0 10px 25px rgba(0,0,0,0.06)",
  },

  statusBar: {

    width: "100%",

    padding: "18px 22px",

    display: "flex",

    justifyContent: "center",
  },

  statusLabel: {

    color: "#ffffff",

    fontWeight: 800,

    fontSize: 16,

    letterSpacing: 1,
  },

  statusContent: {

    padding: "35px 28px",
  },

  statusText: {

    textAlign: "center",

    fontSize: 16,

    color: "#4b5563",

    marginBottom: 30,
  },

  /* ==================================================
     PROGRESS
  ================================================== */

  progressSection: {

    display: "flex",

    flexDirection: "column",

    gap: 12,
  },

  progressTop: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",
  },

  progressTitle: {

    fontWeight: 700,

    color: "#111827",
  },

  progressPercentage: {

    fontWeight: 700,

    color: "#111827",
  },

  progressBar: {

    height: 14,

    background: "#e5e7eb",

    borderRadius: 999,

    overflow: "hidden",
  },

  progressFill: {

    height: "100%",

    borderRadius: 999,
  },

  /* ==================================================
     GRID
  ================================================== */

  statsGrid: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",

    gap: 20,
  },

  statCard: {

    background: "#ffffff",

    padding: 24,

    borderRadius: 22,

    boxShadow:
      "0 10px 25px rgba(0,0,0,0.06)",
  },

  statIcon: {

    width: 52,

    height: 52,

    borderRadius: 16,

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    marginBottom: 16,
  },

  statTitle: {

    fontSize: 13,

    color: "#6b7280",

    marginBottom: 8,
  },

  statValue: {

    fontSize: 20,

    fontWeight: 800,

    color: "#111827",

    wordBreak: "break-word",
  },

  /* ==================================================
     COMMON CARD
  ================================================== */

  card: {

    background: "#ffffff",

    padding: 28,

    borderRadius: 24,

    boxShadow:
      "0 10px 25px rgba(0,0,0,0.06)",
  },

  sectionHeader: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 24,
  },

  cardTitle: {

    fontWeight: 800,

    fontSize: 22,

    color: "#111827",

    margin: 0,
  },

  /* ==================================================
     BADGES
  ================================================== */

  liveBadge: {

    display: "flex",

    alignItems: "center",

    gap: 6,

    padding: "8px 12px",

    borderRadius: 999,

    background:
      "rgba(34,197,94,0.12)",

    color: "#16a34a",

    fontWeight: 700,

    fontSize: 12,
  },

  analyticsBadge: {

    padding: "8px 14px",

    borderRadius: 999,

    background:
      "rgba(99,102,241,0.12)",

    color: "#4f46e5",

    fontWeight: 700,

    fontSize: 12,
  },

  /* ==================================================
     INFO GRID
  ================================================== */

  grid: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",

    gap: 18,
  },

  infoCard: {

    background: "#f9fafb",

    padding: 18,

    borderRadius: 18,

    border:
      "1px solid rgba(0,0,0,0.04)",
  },

  infoLabel: {

    fontSize: 12,

    color: "#6b7280",

    marginBottom: 6,
  },

  infoValue: {

    fontWeight: 700,

    fontSize: 15,

    color: "#111827",
  },

  /* ==================================================
     EMPTY STATE
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

    fontSize: 20,

    fontWeight: 700,

    color: "#111827",
  },

  emptyText: {

    maxWidth: 500,

    color: "#6b7280",

    lineHeight: 1.7,
  },

  /* ==================================================
     TIMELINE
  ================================================== */

  timelineWrapper: {

    display: "flex",

    flexDirection: "column",

    gap: 18,
  },

  timelineCard: {

    display: "flex",

    alignItems: "center",

    gap: 18,

    background: "#f9fafb",

    padding: 18,

    borderRadius: 18,

    border:
      "1px solid rgba(0,0,0,0.04)",
  },

  timelineIcon: {

    width: 50,

    height: 50,

    borderRadius: 16,

    display: "flex",

    alignItems: "center",

    justifyContent: "center",
  },

  timelineTitle: {

    margin: 0,

    fontSize: 16,

    fontWeight: 700,

    color: "#111827",
  },

  timelineStatus: {

    marginTop: 6,

    fontSize: 13,

    color: "#6b7280",
  },

  /* ==================================================
     MUTED
  ================================================== */

  muted: {

    color: "#6b7280",
  },
};