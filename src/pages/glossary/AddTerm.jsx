import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { API_URL } from "../../Constants";
import "../../css/glossary/addGlossary.css";
import closebtn from "../../assets/glossary/close-btn.svg";
import deletebtn from "../../assets/glossary/delete-icon.svg";
import Buttons from "../../components/buttons/Buttons";
import ValidationModal from "../../components/ValidationModal/ValidationModal.jsx";

export default function AddTerm() {
  const [newTerm, setNewTerm] = useState([
    { word: "", meaning: "", tags: [], is_deleted: false },
  ]);
  const [tagInput, setTagInput] = useState("");
  const navigate = useNavigate();

  const [validationMessage, setValidationMessage] = useState("");
  const [showValidationModal, setShowValidationModal] = useState(false);

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
    const updatedTerms = newTerm.filter((_, i) => i !== index);
    setNewTerm(updatedTerms);
  };

  const handleCreateNewTerm = () => {
    for (const term of newTerm) {
      if (!term.word.trim() || !term.meaning.trim() || !term.tags) {
        setValidationMessage("Please fill out all required fields.");
        setShowValidationModal(true);
        return;
      }
    }

    Promise.all(newTerm.map((term) => axios.post(`${API_URL}/addTerm`, term)))
      .then(() => {
        setValidationMessage("Added successfully!");
        setShowValidationModal(true);
        setNewTerm([{ word: "", meaning: "", tags: [], is_deleted: false }]);
      })
      .catch((error) => {
        console.error("Error adding term:", error);
        setValidationMessage("Failed to add term. Please try again.");
        setShowValidationModal(true);
      });
  };

  const handleBack = () => {
    // if (onClose) onClose();
    navigate("/glossary");
  };

  return (
    <div className="add-term-page-wrapper">
      <div className="add-term-main-container">
        <div className="add-term-header">
          <h1 className="add-term-title">Add Terminology</h1>
          <button className="close-btn" onClick={handleBack}>
            <img src={closebtn} alt="close btn" />
          </button>
        </div>

        <div className="add-term-contents">
          {newTerm.map((term, index) => (
            <div className="term-section" key={index}>
              <div className="term-header">
                <select
                  className="w-10"
                  value={term.tags}
                  onChange={(e) =>
                    handleInputChange(index, "tags", e.target.value)
                  }
                >
                  <option value="">Choose Category</option>
                  <option value="AbPsych">Abnormal Psychology</option>
                  <option value="DevPsych">Developmental Psychology</option>
                  <option value="PsychoPsych">Psychological Psychology</option>
                  <option value="IndPsych">Industrial Psychology</option>
                  <option value="GenPsych">General Psychology</option>
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
                    onChange={(e) =>
                      handleInputChange(index, "word", e.target.value)
                    }
                  />
                  <div className="term-label">Term</div>
                </div>

                <div className="term-input-column">
                  <input
                    type="text"
                    placeholder="Enter Definition"
                    value={term.meaning}
                    onChange={(e) =>
                      handleInputChange(index, "meaning", e.target.value)
                    }
                  />
                  <div className="term-label">Definition</div>
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
        </div>

        <div className="create-container">
          <Buttons
            text="Add Terms"
            onClick={handleCreateNewTerm}
            addedClassName="btn btn-warning "
          />
        </div>
      </div>
      {showValidationModal && (
        <ValidationModal
          message={validationMessage}
          onClose={() => setShowValidationModal(false)}
        />
      )}
    </div>
  );
}
