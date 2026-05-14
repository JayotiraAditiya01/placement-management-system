import { motion } from "framer-motion";

import {
  Users,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Building2,
  BriefcaseBusiness,
  GraduationCap,
  Activity,
} from "lucide-react";

import PlacementTrendChart from "../../../charts/PlacementTrendChart";
import PlacedUnplacedChart from "../../../charts/PlacedUnplacedChart";

const DashboardSection = ({ students }) => {

  /* ==================================================
     MAIN STATS
  ================================================== */

  const total =
    students.length;

  const placed =
    students.filter(
      (s) =>
        s?.status === "PLACED"
    ).length;

  const unplaced =
    students.filter(
      (s) =>
        s?.status === "UNPLACED"
    ).length;

  const pending =
    students.filter(
      (s) =>
        s?.status === "PENDING"
    ).length;

  const placementRate =
    total === 0
      ? 0
      : Math.round(
          (placed / total) * 100
        );

  /* ==================================================
     UNIQUE COMPANIES
  ================================================== */

  const companies = [

    ...new Set(

      students

        .filter(
          (s) =>
            s?.currentCompany
        )

        .map(
          (s) =>
            s.currentCompany
        )

    ),
  ];

  const totalCompanies =
    companies.length;

  /* ==================================================
     BRANCHES
  ================================================== */

  const branches = [

    ...new Set(
      students.map(
        (s) => s.branch
      )
    ),
  ];

  const totalBranches =
    branches.length;

  /* ==================================================
     ACTIVE DRIVES
  ================================================== */

  const activeDrives =
    students.filter(
      (s) =>
        s?.currentPhase
    ).length;

  /* ==================================================
     TOP COMPANY
  ================================================== */

  const companyCounts = {};

  students.forEach((student) => {

    if (
      student?.currentCompany
    ) {

      companyCounts[
        student.currentCompany
      ] =
        (
          companyCounts[
            student.currentCompany
          ] || 0
        ) + 1;
    }
  });

  const topCompany =
    Object.keys(companyCounts)
      .sort(
        (a, b) =>
          companyCounts[b] -
          companyCounts[a]
      )[0] || "N/A";

  return (

    <div style={container}>

      {/* ==================================================
         STATS GRID
      ================================================== */}

      <div style={statsGrid}>

        {/* TOTAL */}
        <motion.div
          whileHover={{
            y: -4,
          }}
          style={statCard}
        >

          <div style={statTop}>

            <div
              style={{
                ...iconWrapper,
                background:
                  "rgba(59,130,246,0.15)",
              }}
            >

              <Users
                size={22}
                color="#2563eb"
              />

            </div>

            <span style={badge}>
              Students
            </span>

          </div>

          <p style={statTitle}>
            Total Students
          </p>

          <h3 style={statValue}>
            {total}
          </h3>

        </motion.div>

        {/* PLACED */}
        <motion.div
          whileHover={{
            y: -4,
          }}
          style={statCard}
        >

          <div style={statTop}>

            <div
              style={{
                ...iconWrapper,
                background:
                  "rgba(34,197,94,0.15)",
              }}
            >

              <CheckCircle2
                size={22}
                color="#22c55e"
              />

            </div>

            <span style={badge}>
              Success
            </span>

          </div>

          <p style={statTitle}>
            Placed Students
          </p>

          <h3 style={statValue}>
            {placed}
          </h3>

        </motion.div>

        {/* UNPLACED */}
        <motion.div
          whileHover={{
            y: -4,
          }}
          style={statCard}
        >

          <div style={statTop}>

            <div
              style={{
                ...iconWrapper,
                background:
                  "rgba(239,68,68,0.15)",
              }}
            >

              <XCircle
                size={22}
                color="#ef4444"
              />

            </div>

            <span style={badge}>
              Pending
            </span>

          </div>

          <p style={statTitle}>
            Unplaced Students
          </p>

          <h3 style={statValue}>
            {unplaced}
          </h3>

        </motion.div>

        {/* RATE */}
        <motion.div
          whileHover={{
            y: -4,
          }}
          style={statCard}
        >

          <div style={statTop}>

            <div
              style={{
                ...iconWrapper,
                background:
                  "rgba(168,85,247,0.15)",
              }}
            >

              <TrendingUp
                size={22}
                color="#9333ea"
              />

            </div>

            <span style={badge}>
              Growth
            </span>

          </div>

          <p style={statTitle}>
            Placement Rate
          </p>

          <h3 style={statValue}>
            {placementRate}%
          </h3>

        </motion.div>

        {/* COMPANIES */}
        <motion.div
          whileHover={{
            y: -4,
          }}
          style={statCard}
        >

          <div style={statTop}>

            <div
              style={{
                ...iconWrapper,
                background:
                  "rgba(249,115,22,0.15)",
              }}
            >

              <Building2
                size={22}
                color="#f97316"
              />

            </div>

            <span style={badge}>
              Hiring
            </span>

          </div>

          <p style={statTitle}>
            Placement Companies
          </p>

          <h3 style={statValue}>
            {totalCompanies}
          </h3>

        </motion.div>

        {/* ACTIVE DRIVES */}
        <motion.div
          whileHover={{
            y: -4,
          }}
          style={statCard}
        >

          <div style={statTop}>

            <div
              style={{
                ...iconWrapper,
                background:
                  "rgba(14,165,233,0.15)",
              }}
            >

              <BriefcaseBusiness
                size={22}
                color="#0284c7"
              />

            </div>

            <span style={badge}>
              Drives
            </span>

          </div>

          <p style={statTitle}>
            Active Placements
          </p>

          <h3 style={statValue}>
            {activeDrives}
          </h3>

        </motion.div>

        {/* BRANCHES */}
        <motion.div
          whileHover={{
            y: -4,
          }}
          style={statCard}
        >

          <div style={statTop}>

            <div
              style={{
                ...iconWrapper,
                background:
                  "rgba(99,102,241,0.15)",
              }}
            >

              <GraduationCap
                size={22}
                color="#4f46e5"
              />

            </div>

            <span style={badge}>
              Academic
            </span>

          </div>

          <p style={statTitle}>
            Total Branches
          </p>

          <h3 style={statValue}>
            {totalBranches}
          </h3>

        </motion.div>

        {/* TOP COMPANY */}
        <motion.div
          whileHover={{
            y: -4,
          }}
          style={statCard}
        >

          <div style={statTop}>

            <div
              style={{
                ...iconWrapper,
                background:
                  "rgba(236,72,153,0.15)",
              }}
            >

              <Activity
                size={22}
                color="#ec4899"
              />

            </div>

            <span style={badge}>
              Top Recruiter
            </span>

          </div>

          <p style={statTitle}>
            Highest Hiring Company
          </p>

          <h3
            style={{
              ...statValue,
              fontSize: 22,
            }}
          >

            {topCompany}

          </h3>

        </motion.div>

      </div>

      {/* ==================================================
         PROGRESS
      ================================================== */}

      <div style={card}>

        <div style={sectionHeader}>

          <h3 style={sectionTitle}>
            Placement Progress
          </h3>

          <span style={progressBadge}>
            {placementRate}% Complete
          </span>

        </div>

        <div style={progressWrapper}>

          <div style={progressBar}>

            <motion.div
              style={{
                ...progressFill,
                width: `${placementRate}%`,
              }}

              initial={{
                width: 0,
              }}

              animate={{
                width: `${placementRate}%`,
              }}

              transition={{
                duration: 0.8,
              }}
            />

          </div>

          <div style={progressInfo}>

            <span style={progressText}>
              {placed} students placed
            </span>

            <span style={progressText}>
              {pending} pending
            </span>

          </div>

        </div>

      </div>

      {/* ==================================================
         CHARTS
      ================================================== */}

      <div style={chartGrid}>

        <motion.div
          whileHover={{
            y: -2,
          }}
          style={card}
        >

          <PlacementTrendChart
            students={students}
          />

        </motion.div>

        <motion.div
          whileHover={{
            y: -2,
          }}
          style={card}
        >

          <PlacedUnplacedChart
            students={students}
          />

        </motion.div>

      </div>

    </div>
  );
};

export default DashboardSection;

/* ==================================================
   STYLES
================================================== */

const container = {

  display: "flex",

  flexDirection: "column",

  gap: 30,
};

const statsGrid = {

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit,minmax(240px,1fr))",

  gap: 22,
};

const statCard = {

  background: "#ffffff",

  padding: 24,

  borderRadius: 22,

  boxShadow:
    "0 10px 25px rgba(0,0,0,0.06)",

  transition: "0.3s",
};

const statTop = {

  display: "flex",

  alignItems: "center",

  justifyContent: "space-between",

  marginBottom: 18,
};

const iconWrapper = {

  width: 50,

  height: 50,

  borderRadius: 16,

  display: "flex",

  alignItems: "center",

  justifyContent: "center",
};

const badge = {

  fontSize: 12,

  fontWeight: 600,

  padding: "6px 12px",

  borderRadius: 999,

  background:
    "rgba(99,102,241,0.1)",

  color: "#4f46e5",
};

const statTitle = {

  color: "#6b7280",

  fontSize: 14,

  marginBottom: 10,
};

const statValue = {

  fontSize: 32,

  fontWeight: 800,

  color: "#111827",

  margin: 0,
};

const card = {

  background: "#ffffff",

  padding: 30,

  borderRadius: 24,

  boxShadow:
    "0 10px 25px rgba(0,0,0,0.06)",
};

const sectionHeader = {

  display: "flex",

  alignItems: "center",

  justifyContent: "space-between",

  marginBottom: 20,
};

const sectionTitle = {

  fontWeight: 800,

  fontSize: 22,

  margin: 0,

  color: "#111827",
};

const progressBadge = {

  padding: "8px 14px",

  borderRadius: 999,

  background:
    "rgba(34,197,94,0.12)",

  color: "#16a34a",

  fontSize: 13,

  fontWeight: 700,
};

const progressWrapper = {

  display: "flex",

  flexDirection: "column",

  gap: 14,
};

const progressBar = {

  height: 14,

  background: "#e5e7eb",

  borderRadius: 999,

  overflow: "hidden",
};

const progressFill = {

  height: "100%",

  background:
    "linear-gradient(90deg,#22c55e,#4ade80)",

  borderRadius: 999,
};

const progressInfo = {

  display: "flex",

  justifyContent: "space-between",

  alignItems: "center",
};

const progressText = {

  fontSize: 14,

  color: "#6b7280",

  fontWeight: 500,
};

const chartGrid = {

  display: "grid",

  gridTemplateColumns:
    "1fr 1fr",

  gap: 25,
};