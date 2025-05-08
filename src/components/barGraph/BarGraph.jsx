// src/components/barGraph/BarGraph.jsx
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function BarGraph({ data }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((item) => item.label),
        datasets: [
          {
            label: "Students",
            data: data.map((item) => item.count),
            backgroundColor: "#4F46E5",
            borderRadius: 8,
            barThickness: 40,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
            title: {
              display: true,
              text: "Number of Students",
            },
          },
          x: {
            title: {
              display: true,
              text: "Branch",
            },
          },
        },
      },
    });
  }, [data]);

  return (
    <div className="w-full h-full">
      <canvas ref={chartRef} />
    </div>
  );
}
