import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

const BarGraph = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 0, right: 0, left: 0, bottom: 20 }}
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
          <Label value="NU Campus" offset={-10} position="insideBottom" />
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
        <Bar
          dataKey="count"
          fill="#444EB2"
          stroke="#000000"
          strokeWidth={1}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarGraph;
