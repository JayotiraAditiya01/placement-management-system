import { useEffect, useState } from "react";

import PlacementTrendChart
from "../../../charts/PlacementTrendChart";

import PlacedUnplacedChart
from "../../../charts/PlacedUnplacedChart";

const AnalyticsSection = ({ students }) => {

  const [liveStudents, setLiveStudents] =
    useState(students);

  useEffect(() => {

    setLiveStudents(students);

    const interval = setInterval(() => {

      setLiveStudents([...students]);

    }, 3000);

    return () => clearInterval(interval);

  }, [students]);

  /* ================= BASIC ================= */

  const total =
    liveStudents.length;

  const placed =
    liveStudents.filter(
      s => s.status === "PLACED"
    ).length;

  const unplaced =
    liveStudents.filter(
      s => s.status === "UNPLACED"
    ).length;

  const placementRate =
    total
      ? Math.round(
          (placed / total) * 100
        )
      : 0;

  /* ================= MONTHLY DATA ================= */

  const months = [

    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",

    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  const monthlyData =
    months.map(
      (month, index) => {

        const placedCount =
          liveStudents.filter(s => {

            if (!s.statusUpdatedAt)
              return false;

            const d =
              new Date(
                s.statusUpdatedAt
              );

            return (
              d.getMonth() === index &&
              s.status === "PLACED"
            );

          }).length;

        const unplacedCount =
          liveStudents.filter(s => {

            if (!s.statusUpdatedAt)
              return false;

            const d =
              new Date(
                s.statusUpdatedAt
              );

            return (
              d.getMonth() === index &&
              s.status === "UNPLACED"
            );

          }).length;

        return {

          month,

          placed:
            placedCount,

          unplaced:
            unplacedCount,
        };
      }
    );

  /* ================= GROWTH ================= */

  const growth =

    monthlyData[2]?.placed >
    monthlyData[1]?.placed

      ? "📈 Growing"

      : "📉 Declining";

  return (

    <div style={container}>

      {/* ================= HEADER ================= */}

      <div>

        <h2>
          Analytics (Live)
        </h2>

        <p style={subText}>
          Real-time placement tracking
        </p>

      </div>

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

        <StatCard
          title="Placement Rate"
          value={`${placementRate}%`}
        />

      </div>

      {/* ================= EXTRA CARDS ================= */}

      <div style={statsGrid}>

        <StatCard
          title="Growth Trend"
          value={growth}
        />

        <StatCard
          title="Active Students"
          value={total - placed}
        />

      </div>

      {/* ================= MONTHLY GRAPH ================= */}

      <div style={card}>

        <h3>
          📅 Monthly Placement (2026)
        </h3>

        <MonthlyChart
          data={monthlyData}
        />

      </div>

      {/* ================================================== */}
      {/* 🚀 MOVED BRANCH SECTION ABOVE LIVE STATUS */}
      {/* ================================================== */}

      <div style={card}>

        <h3>
          Branch-wise Performance
        </h3>

        {["CSE", "BCA", "AI"].map(
          branch => {

            const bStudents =
              liveStudents.filter(
                s =>
                  s.branch === branch
              );

            const percent =

              bStudents.length === 0

                ? 0

                : Math.round(

                    (
                      bStudents.filter(
                        s =>
                          s.status ===
                          "PLACED"
                      ).length /

                      bStudents.length
                    ) * 100
                  );

            return (

              <div
                key={branch}
                style={branchRow}
              >

                <div style={{
                  width: 100
                }}>
                  {branch}
                </div>

                <div style={progressBar}>

                  <div
                    style={{

                      ...progressFill,

                      width:
                        `${percent}%`
                    }}
                  />

                </div>

                <div>
                  {percent}%
                </div>

              </div>
            );
          }
        )}

      </div>

      {/* ================================================== */}
      {/* 🚀 LIVE STATUS GRAPH NOW BELOW BRANCH */}
      {/* ================================================== */}

      <div style={card}>

        <h3>
          📊 Live Status Distribution
        </h3>

        <PlacedUnplacedChart
          students={liveStudents}
        />

      </div>

    </div>
  );
};

export default AnalyticsSection;


/* ================= MONTHLY CHART ================= */

const MonthlyChart = ({
  data
}) => (

  <div style={{
    marginTop: 20
  }}>

    {data.map((m, i) => (

      <div
        key={i}
        style={monthRow}
      >

        <div style={{
          width: 50
        }}>
          {m.month}
        </div>

        <div style={barContainer}>

          <div
            style={{
              ...placedBar,

              width:
                `${m.placed * 20}px`
            }}
          />

          <div
            style={{
              ...unplacedBar,

              width:
                `${m.unplaced * 20}px`
            }}
          />

        </div>

        <div style={{
          width: 80
        }}>

          {m.placed} / {m.unplaced}

        </div>

      </div>
    ))}

  </div>
);


/* ================= COMPONENT ================= */

const StatCard = ({
  title,
  value
}) => (

  <div style={statCard}>

    <p style={{
      color: "#64748b"
    }}>
      {title}
    </p>

    <h3>
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

const subText = {

  color: "#64748b",
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
};

const card = {

  background: "#fff",

  padding: 20,

  borderRadius: 15,
};

const monthRow = {

  display: "flex",

  alignItems: "center",

  marginBottom: 8,
};

const barContainer = {

  flex: 1,

  display: "flex",

  gap: 4,
};

const placedBar = {

  height: 8,

  background: "#16a34a",

  borderRadius: 5,
};

const unplacedBar = {

  height: 8,

  background: "#dc2626",

  borderRadius: 5,
};

const branchRow = {

  display: "flex",

  alignItems: "center",

  gap: 10,

  marginBottom: 10,
};

const progressBar = {

  flex: 1,

  height: 10,

  background: "#e5e7eb",

  borderRadius: 20,
};

const progressFill = {

  height: "100%",

  background: "#22c55e",

  borderRadius: 20,
};