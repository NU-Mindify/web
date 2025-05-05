import React, { useState } from "react";
import '../ExportDropdown/ExportDropdown.css'
import download from "../../assets/leaderboard/file-export.svg";

const ExportDropdown = ({ onExport }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleExport = (format) => {
    onExport(format);
    setIsOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="export-dropdown-container">
      <button className="export-btn" onClick={handleToggle}>
        <img src={download} alt="Export" style={{ cursor: "pointer" }} />
      </button>
      {isOpen && (
        <div className="export-dropdown-menu">
          <button className="text-black" onClick={() => handleExport("csv")}>Export as CSV</button>
          <button className="text-black" onClick={() => handleExport("pdf")}>Export as PDF</button>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;