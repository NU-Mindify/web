import React, { useState } from "react";
import '../ExportDropdown/ExportDropdown.css'
import { Download } from "lucide-react";

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
      <button className="export-btn" onClick={handleToggle} style={{ cursor: "pointer" }}>
        <Download size={22} />
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