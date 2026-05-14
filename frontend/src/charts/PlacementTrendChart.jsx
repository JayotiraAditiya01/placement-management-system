import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

const PlacementTrendChart = () => {
  const [data, setData] = useState([
    { year: "2020", placed: 0 },
    { year: "2021", placed: 0 },
    { year: "2022", placed: 0 },
    { year: "2023", placed: 0 },
    { year: "2024", placed: 0 },
  ]);

  useEffect(() => {
    let step = 0;

    const targetData = [
      { year: "2020", placed: 180 },
      { year: "2021", placed: 240 },
      { year: "2022", placed: 310 },
      { year: "2023", placed: 360 },
      { year: "2024", placed: 420 },
    ];

    const interval = setInterval(() => {
      if (step >= targetData.length) {
        clearInterval(interval);
        return;
      }

      setData((prev) =>
        prev.map((item, index) =>
          index <= step
            ? { ...item, placed: targetData[index].placed }
            : item
        )
      );

      step++;
    }, 1000); // updates every 1 second

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
        Placement Trend (Live)
      </h4>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="placed"
            strokeWidth={3}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlacementTrendChart;
