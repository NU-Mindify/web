import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartAttempts = ({ allStudents = [], attemptedStudents = [] }) => {
  const attemptedCount = attemptedStudents.length;
  const notAttemptedCount = allStudents.length - attemptedCount;

  const data = {
    labels: [`Takers: ${attemptedCount}`, `Non-Takers: ${notAttemptedCount}`],
    datasets: [
      {
        label: "Students",
        data: [attemptedCount, notAttemptedCount],
        backgroundColor: [" #FFBF1A", "#35408E"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h3
        className="text-lg font-semibold text-center mb-4 text-black font-[Poppins]"
        style={{ visibility: "hidden" }}
      >
        Attempt Status
      </h3>
      {attemptedCount > 0 || notAttemptedCount > 0 ? (
        <Pie data={data} options={options} />
      ) : (
        <p className="text-center text-gray-500 font-[Poppins]">
          No data found
        </p>
      )}
    </div>
  );
};

export default PieChartAttempts;
