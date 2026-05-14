import {
  motion,
} from "framer-motion";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Trophy,
  Building2,
  BriefcaseBusiness,
  GraduationCap,
  FileCheck2,
  Activity,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import API_BASE_URL from "../../../config/api";
const API =
  `${API_BASE_URL}/api/students/`;
const DashboardSection = () => {

  const navigate =
    useNavigate();

  /* ==================================================
     STATES
  ================================================== */

  const [student, setStudent] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const token =

    localStorage.getItem(
      "access_token"
    ) ||

    localStorage.getItem(
      "token"
    ) ||

    "";

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

      .then((res) => res.json())

      .then((data) => {

        if (data)
          setStudent(data);

        setLoading(false);
      })

      .catch(() => {

        console.log(
          "Error fetching student"
        );

        setLoading(false);
      });

  }, []);

  /* ==================================================
     LOGOUT
  ================================================== */

  const handleLogout = () => {

    localStorage.clear();

    navigate(
      "/student/login"
    );
  };

  /* ==================================================
     DATA
  ================================================== */

  const name =
    student?.name || "-";

  const section =
    student?.section || "-";

  const branch =
    student?.branch || "-";

  const status =
    student?.status || "PENDING";

  const currentCompany =

    student?.currentCompany ||

    "Not Assigned";

  const currentPhase =

    student?.currentPhase ||

    "No Active Phase";

  const driveName =

    student?.driveName ||

    "No Active Drive";

  const phasesCleared =

    student?.phasesCleared ||

    [];

  const allPhases =

    student?.allPhases ||

    [];

  const placementResult =

    student?.placementResult ||

    status;

  /* ==================================================
     STATUS COLORS
  ================================================== */

  const statusColor = {

    PLACED:
      "#16a34a",

    UNPLACED:
      "#dc2626",

    PENDING:
      "#2563eb",
  };

  /* ==================================================
     PROFILE COMPLETION
  ================================================== */

  const isValid = (value) => {

    if (
      value === null ||
      value === undefined
    ) return false;

    if (
      Array.isArray(value)
    ) return value.length > 0;

    if (
      typeof value === "string"
    ) {

      return (
        value.trim() !== "" &&
        value.trim() !== "-"
      );
    }

    return true;
  };

  /* ==================================================
     PROFILE FIELDS
  ================================================== */

  const fields = [

    student?.name,

    student?.branch,

    student?.section,

    student?.classRollNo,

    student?.universityRollNo,

    student?.cgpa,

    student?.phone,

    student?.city,

    student?.skills,

    student?.languages,

    student?.bio,

    student?.resume,

    student?.linkedin,
  ];

  const filled =
    fields.filter(isValid)
      .length;

  const completion =

    fields.length === 0

      ? 0

      : Math.round(

          (
            filled /
            fields.length
          ) * 100

        );

  /* ==================================================
     PLACEMENT PROGRESS
  ================================================== */

  const placementProgress =

    allPhases.length === 0

      ? 0

      : Math.round(

          (
            phasesCleared.length /
            allPhases.length
          ) * 100

        );

  /* ==================================================
     LOADING
  ================================================== */

  if (loading) {

    return (

      <div style={styles.loadingWrapper}>

        <div style={styles.loader} />

        <p style={styles.loadingText}>
          Loading dashboard...
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

      <div style={styles.cardHeader}>

        <div>

          <h2 style={styles.heading}>
            Dashboard
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
         HERO CARD
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

        style={styles.heroCard}
      >

        <div>

          <h2 style={styles.heroTitle}>
            Welcome back, {name} 👋
          </h2>

          <p style={styles.heroSubtitle}>
            Track your placement
            journey, profile
            completion and interview
            progress in real-time.
          </p>

        </div>

        <div
          style={{
            ...styles.statusBadge,

            background:
              `${statusColor[status]}20`,

            color:
              statusColor[status],
          }}
        >

          {placementResult}

        </div>

      </motion.div>

      {/* ==================================================
         STATS GRID
      ================================================== */}

      <div style={styles.statsGrid}>

        <StatCard

          icon={
            <GraduationCap
              size={22}
            />
          }

          title="Branch"

          value={branch}

          color="#8b5cf6"

          bg="rgba(139,92,246,0.12)"
        />

        <StatCard

          icon={
            <Building2
              size={22}
            />
          }

          title="Current Company"

          value={currentCompany}

          color="#4f46e5"

          bg="rgba(99,102,241,0.12)"
        />

        <StatCard

          icon={
            <BriefcaseBusiness
              size={22}
            />
          }

          title="Current Phase"

          value={currentPhase}

          color="#0284c7"

          bg="rgba(14,165,233,0.12)"
        />

        <StatCard

          icon={
            <Trophy
              size={22}
            />
          }

          title="Placement Status"

          value={placementResult}

          color="#16a34a"

          bg="rgba(34,197,94,0.12)"
        />

      </div>

      {/* ==================================================
         PROGRESS SECTION
      ================================================== */}

      <div style={styles.progressGrid}>

        {/* PROFILE */}

        <div style={styles.card}>

          <div style={styles.progressHeader}>

            <div
              style={styles.progressTitleWrap}
            >

              <FileCheck2
                size={18}
              />

              <h3
                style={
                  styles.sectionTitle
                }
              >

                Profile Completion

              </h3>

            </div>

            <span
              style={
                styles.progressPercent
              }
            >

              {completion}%

            </span>

          </div>

          <div style={styles.progressBar}>

            <motion.div

              initial={{
                width: 0,
              }}

              animate={{
                width:
                  `${completion}%`,
              }}

              transition={{
                duration: 0.7,
              }}

              style={{
                ...styles.progressFill,

                background:
                  "linear-gradient(90deg,#3b82f6,#6366f1)",
              }}
            />

          </div>

          <p style={styles.progressText}>
            Your student profile is{" "}
            {completion}% completed.
          </p>

        </div>

        {/* PLACEMENT */}

        <div style={styles.card}>

          <div style={styles.progressHeader}>

            <div
              style={styles.progressTitleWrap}
            >

              <Activity
                size={18}
              />

              <h3
                style={
                  styles.sectionTitle
                }
              >

                Placement Progress

              </h3>

            </div>

            <span
              style={
                styles.progressPercent
              }
            >

              {placementProgress}%

            </span>

          </div>

          <div style={styles.progressBar}>

            <motion.div

              initial={{
                width: 0,
              }}

              animate={{
                width:
                  `${placementProgress}%`,
              }}

              transition={{
                duration: 0.7,
              }}

              style={{
                ...styles.progressFill,

                background:
                  "linear-gradient(90deg,#22c55e,#16a34a)",
              }}
            />

          </div>

          <p style={styles.progressText}>
            {phasesCleared.length}/
            {allPhases.length} phases
            completed
          </p>

        </div>

      </div>

      {/* ==================================================
         DRIVE CARD
      ================================================== */}

      <div style={styles.card}>

        <div style={styles.sectionHeader}>

          <h3 style={styles.sectionTitle}>
            Active Placement Drive
          </h3>

          <div style={styles.liveBadge}>
            LIVE
          </div>

        </div>

        <div style={styles.driveGrid}>

          <InfoBox
            label="Drive Name"
            value={driveName}
          />

          <InfoBox
            label="Company"
            value={currentCompany}
          />

          <InfoBox
            label="Current Phase"
            value={currentPhase}
          />

          <InfoBox
            label="Section"
            value={section}
          />

        </div>

      </div>

      {/* ==================================================
         TIMELINE PREVIEW
      ================================================== */}

      <div style={styles.card}>

        <div style={styles.sectionHeader}>

          <h3 style={styles.sectionTitle}>
            Placement Journey
          </h3>

          <div style={styles.liveBadge}>
            TRACKER
          </div>

        </div>

        {allPhases.length === 0 ? (

          <div style={styles.emptyBox}>

            No active placement
            journey available

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

                  <div
                    key={
                      phase.id ||
                      index
                    }

                    style={
                      styles.timelineCard
                    }
                  >

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
                          size={18}
                          color="#22c55e"
                        />

                      ) : active ? (

                        <Clock3
                          size={18}
                          color="#eab308"
                        />

                      ) : (

                        <Activity
                          size={18}
                          color="#94a3b8"
                        />

                      )}

                    </div>

                    <div>

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
                          styles.timelineText
                        }
                      >

                        {completed

                          ? "Completed"

                          : active

                          ? "In Progress"

                          : "Pending"}

                      </p>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        )}

      </div>

    </div>
  );
};

export default DashboardSection;

/* ==================================================
   STAT CARD
================================================== */

const StatCard = ({
  icon,
  title,
  value,
  color,
  bg,
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

        color,

        background: bg,
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
   INFO BOX
================================================== */

const InfoBox = ({
  label,
  value,
}) => (

  <div style={styles.infoBox}>

    <p style={styles.infoLabel}>
      {label}
    </p>

    <h4 style={styles.infoValue}>
      {value || "-"}
    </h4>

  </div>
);

/* ==================================================
   STYLES
================================================== */

const styles = {

  container: {

    display: "flex",

    flexDirection: "column",

    gap: 28,
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

  cardHeader: {

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

    marginTop: 5,

    fontSize: 14,

    color: "#6b7280",
  },

  logoutBtn: {

    background:
      "linear-gradient(135deg,#ef4444,#dc2626)",

    color: "#ffffff",

    padding: "12px 20px",

    borderRadius: 14,

    fontWeight: 700,

    cursor: "pointer",

    boxShadow:
      "0 8px 20px rgba(239,68,68,0.25)",
  },

/* ==================================================
   HERO
================================================== */

heroCard: {

  background:
    "linear-gradient(135deg,#4f46e5,#2563eb)",

  padding: 35,

  borderRadius: 28,

  color: "#ffffff",

  display: "flex",

  justifyContent: "space-between",

  alignItems: "center",

  position: "relative",

  overflow: "hidden",

  boxShadow:
    "0 15px 35px rgba(37,99,235,0.28)",

  border:
    "1px solid rgba(255,255,255,0.08)",
},

heroTitle: {

  margin: 0,

  fontSize: 32,

  fontWeight: 800,

  letterSpacing: -0.5,

  color: "#ffffff",

  position: "relative",

  zIndex: 2,
},

heroSubtitle: {

  marginTop: 10,

  maxWidth: 650,

  lineHeight: 1.7,

  fontSize: 15,

  color:
    "rgba(255,255,255,0.88)",

  position: "relative",

  zIndex: 2,
},

statusBadge: {

  padding: "12px 22px",

  borderRadius: 999,

  fontWeight: 800,

  fontSize: 13,

  letterSpacing: 0.5,

  textTransform: "uppercase",

  border:
    "1px solid rgba(255,255,255,0.18)",

  background:
    "rgba(255,255,255,0.16)",

  color: "#ffffff",

  backdropFilter: "blur(12px)",

  WebkitBackdropFilter:
    "blur(12px)",

  boxShadow:
    "0 8px 24px rgba(0,0,0,0.18)",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  minWidth: 110,

  position: "relative",

  zIndex: 2,
},
  /* ==================================================
     STATS
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

    borderRadius: 24,

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

  sectionTitle: {

    margin: 0,

    fontSize: 22,

    fontWeight: 800,

    color: "#111827",
  },

  /* ==================================================
     PROGRESS
  ================================================== */

  progressGrid: {

    display: "grid",

    gridTemplateColumns:
      "1fr 1fr",

    gap: 20,
  },

  progressHeader: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 18,
  },

  progressTitleWrap: {

    display: "flex",

    alignItems: "center",

    gap: 10,
  },

  progressPercent: {

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

  progressText: {

    marginTop: 12,

    color: "#6b7280",
  },

  /* ==================================================
     DRIVE
  ================================================== */

  driveGrid: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",

    gap: 18,
  },

  infoBox: {

    background: "#f9fafb",

    padding: 20,

    borderRadius: 18,

    border:
      "1px solid rgba(0,0,0,0.04)",
  },

  infoLabel: {

    fontSize: 12,

    color: "#6b7280",

    marginBottom: 8,
  },

  infoValue: {

    margin: 0,

    fontSize: 16,

    fontWeight: 700,

    color: "#111827",
  },

  /* ==================================================
     BADGES
  ================================================== */

  liveBadge: {

    padding: "8px 14px",

    borderRadius: 999,

    background:
      "rgba(34,197,94,0.12)",

    color: "#16a34a",

    fontWeight: 700,

    fontSize: 12,
  },

  /* ==================================================
     EMPTY
  ================================================== */

  emptyBox: {

    padding: 40,

    borderRadius: 18,

    background: "#f9fafb",

    textAlign: "center",

    color: "#6b7280",

    fontWeight: 600,
  },

  /* ==================================================
     TIMELINE
  ================================================== */

  timelineWrapper: {

    display: "flex",

    flexDirection: "column",

    gap: 16,
  },

  timelineCard: {

    display: "flex",

    alignItems: "center",

    gap: 16,

    background: "#f9fafb",

    padding: 18,

    borderRadius: 18,
  },

  timelineIcon: {

    width: 46,

    height: 46,

    borderRadius: 14,

    display: "flex",

    alignItems: "center",

    justifyContent: "center",
  },

  timelineTitle: {

    margin: 0,

    fontSize: 15,

    fontWeight: 700,

    color: "#111827",
  },

  timelineText: {

    marginTop: 4,

    fontSize: 13,

    color: "#6b7280",
  },
};