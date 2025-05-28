import React from 'react';

export default function AnimatedProgressBar({ label, percent, color = 'bg-yellow-400' }) {
  return (
    <div className="progress-bar-container">
      <p className="text-black font-bold">{label}</p>
      <div className="flex items-center gap-2 w-full">
        <div className="w-[100%] bg-gray-300 rounded-full h-5 overflow-hidden">
          <div
            className={`h-full ${color} transition-all duration-500 ease-in-out `}
            style={{ width: `${percent}%` }}
          ></div>
        </div>
        <span className="text-black font-bold text-right">{percent}%</span>
      </div>
    </div>
  );
}
