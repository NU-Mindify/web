import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AccountsCreatedChart({
  accounts,
  viewMode,
  setViewMode,
}) {

  const groupedData = useMemo(() => {
    if (!accounts || accounts.length === 0) return [];

    const grouped = accounts.reduce((acc, account) => {
      if (!account.createdAt) return acc;


      const key =
        viewMode === "monthly"
          ? account.createdAt.slice(0, 7) // YYYY-MM
          : account.createdAt.slice(0, 10); // YYYY-MM-DD

      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([date, count]) => ({ date, accountsCreated: count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [accounts, viewMode]);

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

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={groupedData} className="text-black">
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
            dataKey="accountsCreated"
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
