import React, { useState, useRef, useEffect } from "react";
import "../ExportDropdown/ExportDropdown.css";
import { Download } from "lucide-react";

const ExportDropdownPng = ({ onExport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleExport = (format) => {
    onExport(format);
    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="export-dropdown-container" ref={dropdownRef}>
      <button
        className="export-btn mt-2"
        onClick={handleToggle}
        style={{ cursor: "pointer" }}
      >
        <Download size={22} color="black" />
      </button>
      {isOpen && (
        <div className="export-dropdown-menu">
          <button className="text-black" onClick={() => handleExport("csv")}>
            Export as CSV
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportDropdownPng;
