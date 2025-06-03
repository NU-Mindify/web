import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AttemptsChart({ attempts, viewMode, setViewMode }) {
  const groupAttempts = useMemo(() => {
    const grouped = attempts.reduce((acc, attempt) => {
      if (!attempt.createdAt) return acc;

      const key =
        viewMode === "monthly"
          ? attempt.createdAt.slice(0, 7) // YYYY-MM
          : attempt.createdAt.slice(0, 10); // YYYY-MM-DD

      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([date, count]) => ({ date, attempts: count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [attempts, viewMode]);

  const formatDate = (date) => {
    if (viewMode === "monthly") {
      const d = new Date(date + "-01");
      return d.toLocaleString("default", { month: "short", year: "numeric" });
    } else {
      const d = new Date(date);
      return d.toLocaleDateString("default", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-2">
        <button
          onClick={() =>
            setViewMode((prev) => (prev === "daily" ? "monthly" : "daily"))
          }
          className="bg-[#35408E] text-white px-4 py-1 rounded cursor-pointer hover:bg-[#FFBF1A] hover:text-black"
        >
          Switch to {viewMode === "daily" ? "Monthly" : "Daily"}
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={groupAttempts} className="text-black">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            className="text-black"
          />
          <YAxis allowDecimals={false} />
          <Tooltip labelFormatter={formatDate} />
          <Line
            type="monotone"
            dataKey="attempts"
            stroke="#35408E"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
