import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

const PlacedUnplacedChart = () => {
  const [data, setData] = useState([
    { name: "Placed", students: 0 },
    { name: "Unplaced", students: 0 },
  ]);

  useEffect(() => {
    let placed = 0;
    let unplaced = 0;

    const targetPlaced = 312;
    const targetUnplaced = 108;

    const interval = setInterval(() => {
      if (placed < targetPlaced) placed += 12;
      if (unplaced < targetUnplaced) unplaced += 6;

      setData([
        { name: "Placed", students: Math.min(placed, targetPlaced) },
        { name: "Unplaced", students: Math.min(unplaced, targetUnplaced) },
      ]);

      if (placed >= targetPlaced && unplaced >= targetUnplaced) {
        clearInterval(interval);
      }
    }, 700); // smooth live update

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "320px",
        background: "#ffffff",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
      }}
    >
      <h4 style={{ marginBottom: "12px", fontWeight: 700 }}>
        Placed vs Unplaced Students (Live)
      </h4>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="students" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlacedUnplacedChart;
