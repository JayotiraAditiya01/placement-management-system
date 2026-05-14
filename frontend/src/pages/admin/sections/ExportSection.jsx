import { useState, useMemo } from "react";
import { addLog } from "../../../utils/activityLogger";

const ExportSection = ({ students }) => {

  const [branch, setBranch] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  /* ================= ML SCORE ================= */
  const getScore = (s) => {

    let score = 0;

    if (s.cgpa >= 8) score += 30;
    else if (s.cgpa >= 6) score += 20;
    else score += 10;

    if (s.skills)
      score += Math.min(
        s.skills.split(",").length * 5,
        25
      );

    if (s.bio && s.bio.length > 50)
      score += 15;

    if (s.resume)
      score += 10;

    if (s.linkedin)
      score += 10;

    return score;
  };

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {

    return students.filter((s) => {

      return (

        (branch === "ALL" ||
          s.branch === branch) &&

        (status === "ALL" ||
          s.status === status)

      );
    });

  }, [students, branch, status]);

  const branches = [

    "ALL",

    ...new Set(
      students.map(
        (s) => s.branch
      )
    ),
  ];

  /* ================= STATS ================= */
  const total = students.length;

  const placed =
    students.filter(
      (s) => s.status === "PLACED"
    ).length;

  const unplaced =
    students.filter(
      (s) => s.status === "UNPLACED"
    ).length;

  /* ================= HEADER FORMAT ================= */
  const formatHeader = (key) => {

    return key

      .replace(
        /([A-Z])/g,
        " $1"
      )

      .replace(
        /^./,
        (str) =>
          str.toUpperCase()
      )

      .trim();
  };

  /* ================= CSV EXPORT ================= */
  const exportCSV = async (
    data,
    name,
    logMessage
  ) => {

    if (
      !data ||
      data.length === 0
    ) {

      alert(
        "No data to export"
      );

      return;
    }

    /* ==================================================
       🚀 PRIORITY HEADERS
    ================================================== */

    const priorityHeaders = [

      "name",

      "section",

      "classRollNo",

      "universityRollNo",

      "email",

      "phone",

      "branch",

      "cgpa",

      "status",

      // ==================================================
      // 🚀 NEW PLACEMENT DRIVE EXPORT FIELDS
      // ==================================================
      "currentCompany",

      "currentPhase",

      "phasesCleared",

      "placementResult",

      "skills",

      "languages",

      "bio",

      "linkedin",

      "resume",

      "city",

      "createdAt",

      "statusUpdatedAt",
    ];

    const allKeys =
      Object.keys(data[0]);

    const remainingKeys =
      allKeys.filter(
        (k) =>
          !priorityHeaders.includes(k)
      );

    const orderedKeys = [

      ...priorityHeaders.filter(
        (k) =>
          allKeys.includes(k)
      ),

      ...remainingKeys,
    ];

    /* ==================================================
       🚀 FORMAT HEADERS
    ================================================== */

    const headers =
      orderedKeys.map(
        formatHeader
      );

    /* ==================================================
       🚀 ROWS
    ================================================== */

    const rows = data.map((s) =>

      orderedKeys.map((h) => {

        let value = s[h];

        if (Array.isArray(value))
          return value.join(" | ");

        if (
          typeof value === "object" &&
          value !== null
        ) {

          return JSON.stringify(value);
        }

        return value ?? "";
      })
    );

    /* ==================================================
       🚀 CSV BUILD
    ================================================== */

    const csv =

      headers.join(",") +

      "\n" +

      rows
        .map((r) =>

          r
            .map(
              (v) => `"${v}"`
            )
            .join(",")

        )
        .join("\n");

    /* ==================================================
       🚀 DOWNLOAD
    ================================================== */

    const blob = new Blob(
      [csv],
      {
        type: "text/csv",
      }
    );

    const link =
      document.createElement("a");

    link.href =
      URL.createObjectURL(blob);

    link.download = name;

    link.click();

    /* ==================================================
       🚀 ACTIVITY LOG
    ================================================== */

    await addLog({

      module: "Export",

      type: "success",

      action: logMessage,
    });
  };

  return (

    <div style={container}>

      {/* ================= STATS ================= */}

      <div style={statsGrid}>

        <StatCard
          title="Total Students"
          value={total}
        />

        <StatCard
          title="Placed"
          value={placed}
        />

        <StatCard
          title="Unplaced"
          value={unplaced}
        />

      </div>

      {/* ================= FILTER PANEL ================= */}

      <div style={card}>

        <h3 style={heading}>
          Export Filters
        </h3>

        <div style={row}>

          <select
            value={branch}

            onChange={(e) =>
              setBranch(
                e.target.value
              )
            }

            style={select}
          >

            {branches.map((b) => (

              <option key={b}>

                {b === "ALL"
                  ? "ALL (Branch)"
                  : b}

              </option>

            ))}

          </select>

          <select
            value={status}

            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }

            style={select}
          >

            <option value="ALL">
              ALL (Status)
            </option>

            <option value="PLACED">
              PLACED
            </option>

            <option value="UNPLACED">
              UNPLACED
            </option>

          </select>

          <button

            style={btnPrimary}

            onClick={() =>

              exportCSV(

                filtered,

                "filtered_students.csv",

                `Exported filtered students (${filtered.length})`
              )

            }
          >

            Export Filtered (
            {filtered.length}
            )

          </button>

        </div>

      </div>

      {/* ================= ADVANCED EXPORT ================= */}

      <div style={card}>

        <h3 style={heading}>
          Advanced Export
        </h3>

        <div style={row}>

          <button

            style={btnSuccess}

            onClick={() =>

              exportCSV(

                students.filter(
                  (s) =>
                    getScore(s) >= 70
                ),

                "high_probability_students.csv",

                "Exported high probability students"
              )

            }
          >

            Export High Probability 📈

          </button>

          <button

            style={btnDanger}

            onClick={() =>

              exportCSV(

                students.filter(
                  (s) =>
                    getScore(s) < 40
                ),

                "at_risk_students.csv",

                "Exported at-risk students"
              )

            }
          >

            Export At Risk ⚠️

          </button>

        </div>

      </div>

    </div>
  );
};

export default ExportSection;


/* ================= COMPONENT ================= */

const StatCard = ({
  title,
  value,
}) => (

  <div style={statCard}>

    <p style={statTitle}>
      {title}
    </p>

    <h3 style={statValue}>
      {value}
    </h3>

  </div>
);


/* ================= STYLES ================= */

const container = {

  display: "flex",

  flexDirection: "column",

  gap: 25,
};

const statsGrid = {

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit,minmax(200px,1fr))",

  gap: 20,
};

const statCard = {

  background: "#fff",

  padding: 20,

  borderRadius: 15,

  boxShadow:
    "0 6px 20px rgba(0,0,0,0.05)",
};

const statTitle = {

  color: "#64748b",
};

const statValue = {

  fontSize: 22,

  fontWeight: 700,
};

const card = {

  background: "#fff",

  padding: 25,

  borderRadius: 20,

  boxShadow:
    "0 6px 20px rgba(0,0,0,0.05)",
};

const heading = {

  marginBottom: 12,

  fontWeight: 700,
};

const row = {

  display: "flex",

  gap: 15,

  flexWrap: "wrap",
};

const select = {

  padding: "10px",

  borderRadius: 10,

  border:
    "1px solid #ddd",
};

const btnPrimary = {

  padding: "10px 16px",

  borderRadius: 10,

  background: "#4f46e5",

  color: "#fff",

  border: "none",

  cursor: "pointer",
};

const btnSuccess = {

  padding: "10px 16px",

  borderRadius: 10,

  background: "#059669",

  color: "#fff",

  border: "none",

  cursor: "pointer",
};

const btnDanger = {

  padding: "10px 16px",

  borderRadius: 10,

  background: "#dc2626",

  color: "#fff",

  border: "none",

  cursor: "pointer",
};