import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";

const BarGraph = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        barCategoryGap="20%"
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="label"
          angle={-45}
          textAnchor="end"
          interval={0}
          height={80}
          tick={{ fontSize: 12 }}
        >
          <Label value="NU Campus" offset={-15} position="insideBottom" />
        </XAxis>

        <YAxis>
          <Label
            value="Number of Students"
            angle={-90}
            position="insideLeft"
            offset={20}
            style={{ textAnchor: "middle" }}
          />
        </YAxis>

        <Tooltip />
        <Legend
          verticalAlign="bottom"
          wrapperStyle={{
            position: "relative",
          }}
        />
        <Bar
          dataKey="count"
          fill="#FACC15"
          name="Students"
          stroke="#000"
          strokeWidth={1}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarGraph;
