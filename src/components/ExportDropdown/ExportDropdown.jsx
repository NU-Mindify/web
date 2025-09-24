import React, { useState, useRef, useEffect, useContext } from "react";
import "../ExportDropdown/ExportDropdown.css";
import { Download } from "lucide-react";
import { ActiveContext } from "../../contexts/Contexts";



const ExportDropdown = ({ onExport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const {theme} = useContext(ActiveContext)
  

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
        className={`export-btn mt-2
        ${theme === "#202024" ? "!invert !brightness-0" : ''}`}
        onClick={handleToggle}
        style={{ cursor: "pointer" }}
        aria-label="Export Options"
      >
        <Download size={22} color="black" />
      </button>
      {isOpen && (
        <div className="export-dropdown-menu">
          <button className="text-black" onClick={() => handleExport("csv")}>
            Export as CSV
          </button>
          <button className="text-black" onClick={() => handleExport("pdf")}>
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
