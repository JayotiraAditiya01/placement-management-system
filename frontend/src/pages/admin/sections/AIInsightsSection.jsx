const AIInsightsSection = ({ students }) => {

  /* ===== SIMPLE ML LOGIC (RULE-BASED FOR NOW) ===== */

  const calculateProbability = (s) => {
    let score = 0;

    // CGPA
    if (s.cgpa >= 8) score += 30;
    else if (s.cgpa >= 6) score += 20;
    else score += 10;

    // Skills
    if (s.skills) {
      const skillCount = s.skills.split(",").length;
      score += Math.min(skillCount * 5, 25);
    }

    // Projects (basic assumption from bio)
    if (s.bio && s.bio.length > 50) score += 15;

    // Resume
    if (s.resume) score += 10;

    // LinkedIn
    if (s.linkedin) score += 10;

    return Math.min(score, 100);
  };

  /* ===== PROCESS DATA ===== */

  const processed = students.map((s) => ({
    ...s,
    probability: calculateProbability(s),
  }));

  const high = processed.filter((s) => s.probability >= 70);
  const medium = processed.filter((s) => s.probability >= 40 && s.probability < 70);
  const low = processed.filter((s) => s.probability < 40);

  /* ===== UI ===== */

  return (
    <div style={container}>

      <h2>AI Placement Insights</h2>

      {/* SUMMARY */}
      <div style={statsGrid}>
        <StatBox title="High Chance" value={high.length} color="#16a34a" />
        <StatBox title="Medium Chance" value={medium.length} color="#eab308" />
        <StatBox title="At Risk" value={low.length} color="#dc2626" />
      </div>

      {/* HIGH */}
      <Section title="🔥 High Probability Students" data={high} />

      {/* MEDIUM */}
      <Section title="⚠️ Medium Probability Students" data={medium} />

      {/* LOW */}
      <Section title="❌ At Risk Students" data={low} />

    </div>
  );
};

export default AIInsightsSection;



/* ================= COMPONENTS ================= */

const StatBox = ({ title, value, color }) => (
  <div style={{ ...statCard, borderLeft: `5px solid ${color}` }}>
    <p>{title}</p>
    <h3>{value}</h3>
  </div>
);

const Section = ({ title, data }) => (
  <div style={card}>
    <h3>{title}</h3>

    {data.length === 0 && <p>No students</p>}

    {data.map((s) => (
      <div key={s.id} style={studentRow}>
        <div>
          <strong>{s.name}</strong>
          <div style={subText}>{s.branch}</div>
        </div>

        <div style={probabilityBox(s.probability)}>
          {s.probability}%
        </div>
      </div>
    ))}
  </div>
);



/* ================= STYLES ================= */

const container = {
  display: "flex",
  flexDirection: "column",
  gap: 30,
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
  gap: 20,
};

const statCard = {
  background: "#fff",
  padding: 20,
  borderRadius: 16,
};

const card = {
  background: "#fff",
  padding: 25,
  borderRadius: 20,
};

const studentRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 10,
  borderBottom: "1px solid #eee",
};

const subText = {
  fontSize: 12,
  color: "#64748b",
};

const probabilityBox = (p) => ({
  padding: "6px 12px",
  borderRadius: 12,
  color: "#fff",
  fontWeight: 600,
  background:
    p >= 70 ? "#16a34a" :
    p >= 40 ? "#eab308" :
    "#dc2626",
});