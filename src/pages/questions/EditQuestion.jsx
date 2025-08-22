import React, { useState } from "react";
import Buttons from "../../components/buttons/Buttons.jsx";
import closebtn from "../../assets/glossary/close-btn.svg";
import "../../css/questions/editQuestion.css";
import ValidationModal from "../../components/ValidationModal/ValidationModal.jsx";

function EditQuestion({ question, isOpen, onClose, onSave, onChange, hasChanges }) {
  const [showValidation, setShowValidation] = useState(false);

  if (!isOpen) return null;

  const handleSaveClick = () => {
    if (
      !question.question?.trim() ||
      !question.answer ||
      question.choices.some((c) => !c.text?.trim())
    ) {
      setShowValidation(true);
      return;
    }
    onSave();
  };

  return (
    <div className="modal-overlay">
      <div className="edit-question-container">
        <div className="edit-header">
          <h1 className="edit-title">Edit Question</h1>
          <button className="back-btn" onClick={onClose}>
            <img src={closebtn} alt="close btn" />
          </button>
        </div>

        <div className="edit-content">
          
          <h1 className="edit-title-container">Question</h1>
          <textarea
            className="edit-input"
            value={question.question}
            onChange={(e) => onChange("question", e.target.value)}
          />

          
          <h1 className="edit-title-container">Level</h1>
          <select
            className="edit-input"
            value={question.level}
            onChange={(e) => onChange("level", parseInt(e.target.value))}
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          
          <h1 className="edit-title-container">Difficulty</h1>
          <select
            className="edit-input"
            value={question.difficulty}
            onChange={(e) => onChange("difficulty", e.target.value)}
          >
            {["easy", "average", "difficult"].map((val) => (
              <option key={val} value={val}>
                {val.charAt(0).toUpperCase() + val.slice(1)}
              </option>
            ))}
          </select>

          
          <h1 className="edit-title-container">Timer</h1>
          <input
            type="number"
            min="0"
            max="300"
            placeholder="Enter time in seconds"
            className="edit-input"
            value={question.timer || ""}
            onChange={(e) => onChange("timer", parseInt(e.target.value))}
          />

          
          <h1 className="edit-title-container">Options</h1>
          {question.choices.map((choice, idx) => {
            const isCorrect = question.answer === choice.letter;
            return (
              <div key={choice.letter} className="edit-options-container">
                <label>
                  <input
                    type="radio"
                    name="correctAnswer"
                    value={choice.letter}
                    checked={isCorrect}
                    onChange={() => onChange("answer", choice.letter)}
                  />
                  {choice.letter}
                </label>
                <textarea
                  className="edit-input"
                  placeholder="Enter Answer"
                  value={choice.text}
                  onChange={(e) => onChange("choiceText", e.target.value, idx)}
                />
                <textarea
                  className="edit-input"
                  placeholder="Enter Rationale"
                  value={choice.rationale}
                  onChange={(e) =>
                    onChange("choiceRationale", e.target.value, idx)
                  }
                />
              </div>
            );
          })}

          
          <h1 className="edit-title-container">Rationale</h1>
          <textarea
            className="edit-textarea"
            value={question.rationale}
            onChange={(e) => onChange("rationale", e.target.value)}
          />
        </div>

        
        <div className="buttons">
          <Buttons
            text="Save"
            onClick={handleSaveClick}
            addedClassName={`btn btn-success ${!hasChanges ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!hasChanges}
          />
          <Buttons
            text="Cancel"
            onClick={onClose}
            addedClassName="btn btn-error"
          />
        </div>
      </div>

      
      {showValidation && (
        <ValidationModal
          message="Fill in all required input fields."
          onClose={() => setShowValidation(false)}
        />
      )}
    </div>
  );
}

export default EditQuestion;
