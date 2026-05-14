import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { addLog } from "../../../utils/activityLogger";
import API_BASE_URL from "../../../config/api";
const API = `${API_BASE_URL}/api/students/`;
/* ================= IST TIME ================= */
const getISTTime = () => {

  return new Date().toLocaleString(
    "en-IN",
    {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }
  );
};

/* ================= LINK FIX ================= */
const normalizeUrl = (url) => {

  if (!url) return "";

  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  return `https://${url}`;
};

const StudentsSection = ({
  students = [],
  refresh
}) => {

  const token =
    localStorage.getItem(
      "access_token"
    ) || "";

  const [search, setSearch] =
    useState("");

  const [openViewId, setOpenViewId] =
    useState(null);

  const [openActionId, setOpenActionId] =
    useState(null);

  const [openDriveId, setOpenDriveId] =
    useState(null);

  /* 🔥 LIVE LOCAL STATUS */
  const [localStatuses, setLocalStatuses] =
    useState({});

  /* DEBUG */
  useEffect(() => {

    console.log(
      "📦 Students received:",
      students
    );

  }, [students]);

  /* ================= ML PROBABILITY ================= */
  const calculateProbability = (s) => {

    let score = 0;

    if (s?.cgpa >= 8) score += 30;
    else if (s?.cgpa >= 6) score += 20;
    else score += 10;

    if (s?.skills) {

      const skillCount =
        s.skills.split(",").length;

      score += Math.min(
        skillCount * 5,
        25
      );
    }

    if (
      s?.bio &&
      s.bio.length > 50
    ) {
      score += 15;
    }

    if (s?.resume) score += 10;

    if (s?.linkedin) score += 10;

    return Math.min(score, 100);
  };

  /* ================= RESUME SCORE ================= */
  const calculateResumeScore = (s) => {

    let score = 0;

    if (s?.resume) score += 25;

    if (
      s?.skills &&
      s.skills.split(",").length >= 3
    ) {
      score += 25;
    }

    if (s?.linkedin) score += 15;

    if (
      s?.bio &&
      s.bio.length > 50
    ) {
      score += 20;
    }

    if (s?.cgpa >= 7) score += 15;

    return score;
  };

  /* ================= SEARCH ================= */
  const filteredStudents = useMemo(() => {

    return (students || []).filter(
      (s) =>
        s?.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        s?.email
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        s?.branch
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  }, [students, search]);

  /* ================= STATUS UPDATE ================= */
  const updateStatus = async (
    id,
    status,
    name
  ) => {

    try {

      console.log(
        "🔄 Updating:",
        id,
        status
      );

      const res = await fetch(
        `${API}mark/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {

        throw new Error(
          data?.error ||
          "Update failed"
        );
      }

      /* 🔥 LIVE UI STATUS */
      setLocalStatuses((prev) => ({
        ...prev,
        [id]: status,
      }));

      /* 🔥 ACTIVITY LOGGER */
await addLog({

  module:
    "Placement Tracker",

  action:
    `${name} updated to ${status}`,

  type:
    status === "PLACED"
      ? "success"
      : "error",
});

      if (refresh) {
        await refresh();
      }

    } catch (err) {

      console.error(
        "❌ Error:",
        err
      );

      await addLog({

  module:
    "System Error",

  action:
    `Failed to update ${name}`,

  type:
    "error",
});

    } finally {

      setOpenActionId(null);
    }
  };

  /* ================= UI ================= */
  return (

    <div style={card}>

      <h3 style={heading}>
        Student Profiles
      </h3>

      <input
        placeholder="Search by name, email, branch..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        style={searchBar}
      />

      {filteredStudents.length === 0 && (

        <p style={emptyText}>
          No students found
        </p>

      )}

      {filteredStudents.map((s) => {

        const sid = s.id;

        const probability =
          calculateProbability(s);

        const resumeScore =
          calculateResumeScore(s);

        /* 🔥 LIVE STATUS */
        const liveStatus =
          localStatuses[sid] ||
          s?.status ||
          s?.placementResult ||
          "PENDING";

        return (

          <div
            key={sid}
            style={studentCard}
          >

            {/* HEADER */}
            <div style={studentHeader}>

              <div>

                <div style={studentName}>
                  {s.name || "N/A"}
                </div>

                <div style={studentBranch}>

                  {s.branch}

                  {" • "}

                  Status:
                  {" "}

                  <span
                    style={statusText(
                      liveStatus
                    )}
                  >
                    {liveStatus}
                  </span>

                </div>

                <div
                  style={probabilityBox(
                    probability
                  )}
                >
                  {probability}%
                  Placement Probability
                </div>

              </div>

              <div style={buttonGroup}>

                <button
                  style={viewBtn}
                  onClick={() =>
                    setOpenViewId(
                      openViewId === sid
                        ? null
                        : sid
                    )
                  }
                >
                  View
                </button>

                <button
                  style={driveBtn}
                  onClick={() =>
                    setOpenDriveId(
                      openDriveId === sid
                        ? null
                        : sid
                    )
                  }
                >
                  Drive Status
                </button>

                <button
                  style={actionBtn}
                  onClick={() =>
                    setOpenActionId(
                      openActionId === sid
                        ? null
                        : sid
                    )
                  }
                >
                  Action
                </button>

              </div>

            </div>

            {/* DRIVE STATUS */}
            <AnimatePresence>

              {openDriveId === sid && (

                <motion.div
                  {...expand}
                  style={driveStatusBox}
                >

                  <div style={driveGrid}>

                    {/* DRIVE NAME */}
                    <div style={driveCard}>

                      <div style={driveLabel}>
                        Placement Drive
                      </div>

                      <div style={driveValue}>
                        {s.currentCompany ||
                          "Not Assigned"}
                      </div>

                    </div>

                    {/* PHASE COUNT */}
                    <div style={driveCard}>

                      <div style={driveLabel}>
                        Total Cleared Phases
                      </div>

                      <div style={clearedCircle}>
                        {s
                          ?.phasesCleared
                          ?.length || 0}
                      </div>

                    </div>

                    {/* OVERALL STATUS */}
                    <div style={driveCard}>

                      <div style={driveLabel}>
                        Overall Status
                      </div>

                      <div
                        style={overallStatus(
                          liveStatus
                        )}
                      >
                        {liveStatus}
                      </div>

                    </div>

                  </div>

                  {/* PHASES */}
                  <div style={phaseSection}>

                    <div style={phaseTitle}>
                      Cleared Phases:
                    </div>

                    {s?.phasesCleared
                      ?.length > 0 ? (

                      <div
                        style={
                          phaseChipWrapper
                        }
                      >

                        {s.phasesCleared.map(
                          (
                            phase,
                            index
                          ) => (

                            <div
                              key={index}
                              style={
                                phaseChip
                              }
                            >

                              Phase {index + 1}
                              :
                              {" "}
                              {phase}

                            </div>

                          )
                        )}

                      </div>

                    ) : (

                      <div
                        style={
                          noPhaseText
                        }
                      >
                        No phases cleared yet
                      </div>

                    )}

                  </div>

                </motion.div>

              )}

            </AnimatePresence>

            {/* VIEW */}
            <AnimatePresence>

              {openViewId === sid && (

                <motion.div
                  {...expand}
                  style={detailBox}
                >

                  <DetailGrid
                    student={s}
                  />

                  <div style={resumeBox}>

                    <h4>
                      📊 Resume Quality Score
                    </h4>

                    <div
                      style={resumeScoreStyle(
                        resumeScore
                      )}
                    >
                      {resumeScore}%
                    </div>

                  </div>

                  <div style={linkSection}>

                    {s.resume && (

                      <a
                        href={normalizeUrl(
                          s.resume
                        )}
                        target="_blank"
                        rel="noreferrer"
                        style={primaryLink}
                      >
                        📄 Resume
                      </a>

                    )}

                    {s.linkedin && (

                      <a
                        href={normalizeUrl(
                          s.linkedin
                        )}
                        target="_blank"
                        rel="noreferrer"
                        style={secondaryLink}
                      >
                        🔗 LinkedIn
                      </a>

                    )}

                  </div>

                </motion.div>

              )}

            </AnimatePresence>

            {/* ACTION */}
            <AnimatePresence>

              {openActionId === sid && (

                <motion.div
                  {...expand}
                  style={actionBox}
                >

                  <button
                    style={placedBtn}
                    onClick={() =>
                      updateStatus(
                        sid,
                        "PLACED",
                        s.name
                      )
                    }
                  >
                    Mark Placed
                  </button>

                  <button
                    style={unplacedBtn}
                    onClick={() =>
                      updateStatus(
                        sid,
                        "UNPLACED",
                        s.name
                      )
                    }
                  >
                    Mark Unplaced
                  </button>

                </motion.div>

              )}

            </AnimatePresence>

          </div>
        );
      })}
    </div>
  );
};

export default StudentsSection;

/* ================= COMPONENT ================= */

const DetailGrid = ({
  student
}) => (

  <div style={detailGrid}>

    {Object.entries({

      Email: student.email,

      Phone: student.phone,

      City: student.city,

      Section: student.section,

      "Class Roll":
        student.classRollNo,

      "University Roll":
        student.universityRollNo,

      CGPA: student.cgpa,

      Skills: student.skills,

      Languages:
        Array.isArray(
          student.languages
        )
          ? student.languages.join(
              ", "
            )
          : student.languages,

      Bio: student.bio,

    }).map(([k, v]) => (

      <div
        key={k}
        style={infoBox}
      >

        <span style={infoLabel}>
          {k}
        </span>

        <span style={infoValue}>
          {v || "-"}
        </span>

      </div>

    ))}

  </div>
);

/* ================= STYLES ================= */

const card = {
  background: "#fff",
  padding: 30,
  borderRadius: 20,
  boxShadow:
    "0 6px 15px rgba(0,0,0,0.06)"
};

const heading = {
  marginBottom: 15,
  fontSize: "20px",
  fontWeight: "600"
};

const searchBar = {
  width: "100%",
  padding: 12,
  borderRadius: 12,
  border: "1px solid #ddd",
  marginBottom: 20
};

const emptyText = {
  color: "#6b7280"
};

const studentCard = {
  background: "#f9fafb",
  padding: 20,
  borderRadius: 16,
  marginBottom: 18
};

const studentHeader = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center"
};

const studentName = {
  fontWeight: 700,
  fontSize: 22
};

const studentBranch = {
  fontSize: 13,
  color: "#64748b",
  marginTop: 4
};

const statusText = (
  status
) => ({
  color:
    status === "PLACED"
      ? "#16a34a"
      : status === "UNPLACED"
      ? "#dc2626"
      : "#f59e0b",
  fontWeight: 700
});

const buttonGroup = {
  display: "flex",
  gap: 10
};

const viewBtn = {
  padding: "6px 14px",
  borderRadius: 12,
  border: "none",
  background: "#e5e7eb",
  cursor: "pointer"
};

const driveBtn = {
  padding: "6px 14px",
  borderRadius: 12,
  border: "none",
  background: "#0f172a",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600
};

const actionBtn = {
  padding: "6px 14px",
  borderRadius: 12,
  border: "none",
  background: "#4f46e5",
  color: "#fff",
  cursor: "pointer"
};

const driveStatusBox = {
  marginTop: 18,
  padding: 18,
  borderRadius: 14,
  background: "#fff",
  border:
    "1px solid #e2e8f0"
};

const driveGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: 16
};

const driveCard = {
  background: "#f8fafc",
  padding: 16,
  borderRadius: 14,
  border:
    "1px solid #e2e8f0"
};

const driveLabel = {
  fontSize: 12,
  color: "#64748b",
  marginBottom: 10,
  fontWeight: 600
};

const driveValue = {
  fontWeight: 700,
  fontSize: 18
};

const clearedCircle = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  background: "#4f46e5",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700
};

const phaseSection = {
  marginTop: 22
};

const phaseTitle = {
  fontSize: 14,
  fontWeight: 700,
  marginBottom: 12,
  color: "#334155"
};

const phaseChipWrapper = {
  display: "flex",
  flexWrap: "wrap",
  gap: 12
};

const phaseChip = {
  padding: "9px 14px",
  borderRadius: 999,
  background:
    "rgba(34,197,94,0.12)",
  color: "#16a34a",
  fontSize: 13,
  fontWeight: 700,
  border:
    "1px solid rgba(34,197,94,0.18)"
};

const noPhaseText = {
  color: "#64748b",
  fontSize: 13
};

const overallStatus = (
  status
) => ({
  display: "inline-block",
  padding: "9px 14px",
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 700,
  color: "#fff",
  background:
    status === "PLACED"
      ? "#16a34a"
      : status === "UNPLACED"
      ? "#dc2626"
      : "#f59e0b"
});

const detailBox = {
  marginTop: 16,
  padding: 16,
  borderRadius: 14,
  background: "#fff"
};

const detailGrid = {
  display: "grid",
  gridTemplateColumns:
    "1fr 1fr",
  gap: 12
};

const infoBox = {
  background: "#f1f5f9",
  padding: 10,
  borderRadius: 10
};

const infoLabel = {
  fontSize: 11,
  color: "#64748b"
};

const infoValue = {
  display: "block",
  fontWeight: 600,
  marginTop: 4
};

const linkSection = {
  marginTop: 14,
  display: "flex",
  gap: 10,
  flexWrap: "wrap"
};

const primaryLink = {
  padding: "7px 14px",
  background: "#4f46e5",
  color: "#fff",
  borderRadius: 10,
  textDecoration: "none"
};

const secondaryLink = {
  padding: "7px 14px",
  background: "#e2e8f0",
  color: "#111827",
  borderRadius: 10,
  textDecoration: "none"
};

const actionBox = {
  marginTop: 12,
  padding: 12,
  borderRadius: 12,
  background: "#fff"
};

const placedBtn = {
  padding: "6px 12px",
  borderRadius: 10,
  background: "#16a34a",
  color: "#fff",
  border: "none",
  marginRight: 10,
  cursor: "pointer"
};

const unplacedBtn = {
  padding: "6px 12px",
  borderRadius: 10,
  background: "#dc2626",
  color: "#fff",
  border: "none",
  cursor: "pointer"
};

const expand = {
  initial: {
    opacity: 0,
    y: -8
  },
  animate: {
    opacity: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    y: -8
  }
};

const probabilityBox = (p) => ({
  marginTop: 8,
  padding: "6px 12px",
  borderRadius: 10,
  fontSize: 12,
  fontWeight: 600,
  color: "#fff",
  display: "inline-block",
  background:
    p >= 70
      ? "#16a34a"
      : p >= 40
      ? "#eab308"
      : "#dc2626",
});

const resumeBox = {
  marginTop: 20,
  padding: 15,
  borderRadius: 12,
  background: "#f8fafc"
};

const resumeScoreStyle = (
  score
) => ({
  fontSize: 22,
  fontWeight: 700,
  marginTop: 10,
  color:
    score >= 70
      ? "#16a34a"
      : score >= 40
      ? "#eab308"
      : "#dc2626"
});