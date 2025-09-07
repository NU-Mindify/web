import axios from "axios";
import Papa from "papaparse";
import { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import closebtn from "../../assets/glossary/close-btn.svg";
import deletebtn from "../../assets/glossary/delete-icon.svg";
import Buttons from "../../components/buttons/Buttons";
import ValidationModal from "../../components/ValidationModal/ValidationModal.jsx";
import { API_URL } from "../../Constants";
import { UserLoggedInContext } from "../../contexts/Contexts.jsx";
import "../../css/glossary/addGlossary.css";

import { ChevronDown, ChevronUp } from "lucide-react";

export default function AddTerm() {
  const [newTerm, setNewTerm] = useState([
    { word: "", meaning: "", tags: "", is_deleted: false },
  ]);
  const [tagInput, setTagInput] = useState("");
  const navigate = useNavigate();
  const { currentWebUser } = useContext(UserLoggedInContext);

  const [termToDeleteIndex, setTermToDeleteIndex] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const [validationMessage, setValidationMessage] = useState("");
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showBackConfirmModal, setShowBackConfirmModal] = useState(false);

  const [guideIsOpen, setGuideIsOpen] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedTerms = [...newTerm];
    updatedTerms[index][field] = value;
    setNewTerm(updatedTerms);
  };

  //for buttoons
  const handleAddMoreTerm = () => {
    setNewTerm([
      ...newTerm,
      { word: "", meaning: "", tags: [], is_deleted: false },
    ]);
  };

  const handleDeleteTerm = (index) => {
    const term = newTerm[index];
    // Check if term has any data filled in
    if (
      term.word.trim() !== "" ||
      term.meaning.trim() !== "" ||
      (term.tags && term.tags !== "")
    ) {
      setTermToDeleteIndex(index);
      setShowDeleteConfirmModal(true);
    } else {
      // no , delete immediately
      const updatedTerms = newTerm.filter((_, i) => i !== index);
      setNewTerm(updatedTerms);
    }
  };

  const confirmDeleteTerm = () => {
    if (termToDeleteIndex !== null) {
      const updatedTerms = newTerm.filter((_, i) => i !== termToDeleteIndex);
      setNewTerm(updatedTerms);
      setTermToDeleteIndex(null);
      setShowDeleteConfirmModal(false);
    }
  };

  const cancelDeleteTerm = () => {
    setTermToDeleteIndex(null);
    setShowDeleteConfirmModal(false);
  };

  const handleCreateNewTerm = () => {
    for (const term of newTerm) {
      if (
        !term.word.trim() ||
        !term.meaning.trim() ||
        (Array.isArray(term.tags) ? term.tags.length === 0 : !term.tags.trim())
      ) {
        setValidationMessage("Please fill in all required fields.");
        setShowValidationModal(true);
        return;
      }
    }

    Promise.all(
      newTerm.map((term) =>
        axios.post(`${API_URL}/addTerm`, term, {
          headers: {
            Authorization: `Bearer ${currentWebUser.token}`,
          },
        })
      )
    )
      .then(() => {
        setValidationMessage("Added successfully!");
        setShowValidationModal(true);
        setNewTerm([{ word: "", meaning: "", tags: [], is_deleted: false }]);

        // Log each added term
        Promise.all(
          newTerm.map((term) =>
            axios.post(`${API_URL}/addLogs`, {
              name: `${currentWebUser.firstName} ${currentWebUser.lastName}`,
              branch: currentWebUser.branch,
              action: "Add Term",
              description: `${currentWebUser.firstName} added a term "${term.word}" with meaning "${term.meaning}".`,
              useravatar: currentWebUser.useravatar,
            })
          )
        );
      })
      .catch((error) => {
        console.error("Error adding term:", error);
        setValidationMessage("Failed to add term. Please try again.");
        setShowValidationModal(true);
      });
  };

  const handleBack = () => {
    const hasUnsavedInput = newTerm.some(
      (term) =>
        term.word.trim() !== "" ||
        term.meaning.trim() !== "" ||
        (Array.isArray(term.tags)
          ? term.tags.length > 0
          : term.tags.trim() !== "")
    );

    if (hasUnsavedInput) {
      setShowBackConfirmModal(true);
    } else {
      navigate("/glossary");
    }
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data
          .filter((row) => {
            return row.word?.trim() && row.meaning?.trim() && row.tags?.trim();
          })
          .map((row) => ({
            word: capitalize(row.word || ""),
            meaning: capitalize(row.meaning || ""),
            tags: row.tags || "",
            is_deleted: false,
          }));

        setNewTerm((prev) => [...prev, ...parsedData]);
      },
    });
  };

  const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  return (
    <div className="add-term-page-wrapper">
      <div className="add-term-main-container">
        <div className="add-term-header">
          <h1 className="add-term-title">Add Terminology</h1>
          <button className="close-btn" onClick={handleBack}>
            <img src={closebtn} alt="close btn" />
          </button>
        </div>

          <div className="w-full flex justify-end relative pb-10" ref={dropdownRef}>
          <div className="flex items-center gap-2">
            {/* Hidden input for CSV Upload */}
            <input
              id="upload-btn"
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
            />

            {/* Upload Button */}
            <label
              htmlFor="upload-btn"
              className="px-5 py-2 sm:px-6 sm:py-3 rounded-2xl text-base sm:text-lg 
                        font-bold transition bg-[#FFC300] text-black 
                        hover:bg-[#e6b200] cursor-pointer"
            >
              Upload CSV File
            </label>

            {/* Dropdown Trigger */}
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="px-4 py-2 sm:px-5 sm:py-3 rounded-2xl bg-[#FFC300] text-black hover:bg-[#e6b200] transition"
            >
              {showDropdown ? <ChevronUp size={25} /> : <ChevronDown size={25} />}
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 top-[110%] w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <a
                  href="/IMPORT_TERMS_TEMPLATE.csv"
                  download
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Download CSV Template
                </a>
                <button
                  onClick={() => {
                    setGuideIsOpen(true);
                    setShowDropdown(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  View CSV Template Guide
                </button>
              </div>
            )}
          </div>
        </div>


        <div className="add-term-contents">
          {newTerm.map((term, index) => (
            <div className="term-section" key={index}>
              <div className="term-header">
                <select
                  className="w-10"
                  value={term.tags || ""}
                  onChange={(e) =>
                    handleInputChange(index, "tags", e.target.value)
                  }
                  aria-label="Select Category"
                >
                  <option value="">Choose Category</option>
                  <option value="Abnormal Psychology">Abnormal Psychology</option>
                  <option value="Developmental Psychology">Developmental Psychology</option>
                  <option value="Psychological Psychology">Psychological Psychology</option>
                  <option value="Industrial Psychology">Industrial Psychology</option>
                  <option value="General Psychology">General Psychology</option>
                  <option value="Theories of Personality">Theories of Personality</option>
                </select>
                {newTerm.length > 1 && (
                  <button
                    type="button"
                    className="delete-term-btn"
                    onClick={() => handleDeleteTerm(index)}
                  >
                    <img
                      src={deletebtn}
                      alt="delete-button"
                      className="delete-icon-btn"
                    />
                  </button>
                )}
              </div>

              <div className="term-input-row">
                <div className="term-input-column">
                  <input
                    type="text"
                    placeholder="Enter Term"
                    value={term.word}
                    onChange={(e) => {
                      const value = e.target.value;
                      const capitalized =
                        value.charAt(0).toUpperCase() + value.slice(1);
                      handleInputChange(index, "word", capitalized);
                    }}
                  />
                  <div className="term-label">
                    Term <span className="required-asterisk">*</span>
                  </div>
                </div>

                <div className="term-input-column">
                  <input
                    type="text"
                    placeholder="Enter Definition"
                    value={term.meaning}
                    onChange={(e) => {
                      const value = e.target.value;
                      const capitalized =
                        value.charAt(0).toUpperCase() + value.slice(1);
                      handleInputChange(index, "meaning", capitalized);
                    }}
                  />
                  <div className="term-label">
                    Definition <span className="required-asterisk">*</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="add-more-term-btn"
            onClick={handleAddMoreTerm}
          >
            + Add more term
          </button>

          {guideIsOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-black/20">
            <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">ImportTerms.csv Format</h2>
                <button
                  onClick={() => setGuideIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="mb-4">
                The <code>ImportTerms.csv</code> file contains all the terms and
                their meanings. Each row represents one term. The columns should
                appear in the following order:
              </p>

              <div className="bg-gray-100 p-3 rounded mb-4 font-mono text-sm">
                word,meaning,tags
              </div>

              <h3 className="text-lg font-semibold mb-2">Column Details</h3>
              <table className="w-full border border-gray-300 mb-4">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-3 py-2 text-left">CSV Column Headers</th>
                    <th className="border px-3 py-2 text-left">Required or Optional</th>
                    <th className="border px-3 py-2 text-left">Accepted Values</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-3 py-2">word</td>
                    <td className="border px-3 py-2">Required</td>
                    <td className="border px-3 py-2">The term or word</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">meaning</td>
                    <td className="border px-3 py-2">Required</td>
                    <td className="border px-3 py-2">Definition or explanation of the word</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">tags</td>
                    <td className="border px-3 py-2">Required</td>
                    <td className="border px-3 py-2">Category of the term</td>
                  </tr>
                </tbody>
              </table>

              <h3 className="text-lg font-semibold mt-4 mb-2">Notes</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Each row represents one term.</li>
                <li>All fields are <strong>required</strong>.</li>
                <li><strong>Tags</strong> represent the category of the term.</li>
                <li>There is an example within the downloaded template to guide you.</li>
                <li>Save the file as <code>.csv</code> (comma-separated values, UTF-8 encoding recommended).</li>
                <li>Do not include commas in the <strong>word</strong> or <strong>meaning</strong> fields unless enclosed in quotes.</li>
              </ul>

              <div className="flex justify-end">
            </div>
          </div>
        </div>
      )}
        </div>

        <div className="create-container">
          <Buttons
            text="Add Terms"
            onClick={handleCreateNewTerm}
            addedClassName="btn btn-warning"
          />
        </div>
      </div>
      {showValidationModal && (
        <ValidationModal
          message={validationMessage}
          onClose={() => setShowValidationModal(false)}
        />
      )}

      {showDeleteConfirmModal && (
        <div className="modal-overlay confirm-delete-popup">
          <div className="confirm-dialog">
            <h2>Confirm Delete</h2>
            <p>
              Are you sure you want to delete this term? You have unsaved data.
            </p>
            <div className="popup-buttons">
              <button className="btn-delete" onClick={confirmDeleteTerm}>
                Yes, Delete
              </button>
              <button className="btn-cancel" onClick={cancelDeleteTerm}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showBackConfirmModal && (
        <div className="modal-overlay confirm-delete-popup">
          <div className="confirm-dialog">
            <div className="flex justify-center">
              <h2>Unsaved Changes</h2>
            </div>
            <p>You have unsaved input. Are you sure you want to go back?</p>
            <div className="popup-buttons">
              <button
                className="btn-delete"
                onClick={() => {
                  setShowBackConfirmModal(false);
                  navigate("/glossary");
                }}
              >
                Yes, Go Back
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowBackConfirmModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
