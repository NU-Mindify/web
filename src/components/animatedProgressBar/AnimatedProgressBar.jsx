import React from 'react';

export default function AnimatedProgressBar({ label, percent, color = 'bg-yellow-400' }) {
  return (
    <div className="progress-bar-container">
      <p className="text-black font-bold">{label}</p>
      <div className="flex items-center gap-2 w-[95%]">
        <div className="flex-1 bg-gray-300 rounded-full h-5 overflow-hidden">
          <div
            className={`h-full ${color} transition-all duration-700 ease-in-out`}
            style={{ width: `${percent}%` }}
          ></div>
        </div>
        <span className="text-black font-bold min-w-[40px] text-right">{percent}%</span>
      </div>
    </div>
  );
}
