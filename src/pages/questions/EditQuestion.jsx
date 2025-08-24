import React, { useState } from "react";
import axios from "axios";
import Buttons from "../../components/buttons/Buttons.jsx";
import closebtn from "../../assets/glossary/close-btn.svg";
import "../../css/questions/editQuestion.css";
import ValidationModal from "../../components/ValidationModal/ValidationModal.jsx";
import { API_URL, categories } from "../../Constants";

function EditQuestion({ question, isOpen, onClose, onChange, hasChanges, queryClient, category }) {
  const [showValidation, setShowValidation] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSaveClick = async () => {
    // Collect missing fields
    const missing = [];

    if (!question.question?.trim()) missing.push("Question text");
    if (!question.category) missing.push("Category");
    if (!question.level) missing.push("Level");
    if (!question.difficulty) missing.push("Difficulty");
    if (!question.timer && question.timer !== 0) missing.push("Timer");
    if (!question.rationale) missing.push("Rationale");

    // Check choices
    question.choices.forEach((c, i) => {
      if (!c.text?.trim()) missing.push(`Choice ${c.letter} text`);
    });

    // Ensure an answer is selected
    if (!question.answer) missing.push("Correct Answer");

    // If missing, show validation
    if (missing.length > 0) {
      setValidationMessage(`Please fill in: ${missing.join(", ")}`);
      setShowValidation(true);
      return;
    }

    try {
    setLoading(true);

    const payload = {
      question: question.question,
      category: question.category,
      level: question.level,
      timer: question.timer,
      difficulty: question.difficulty,
      choices: question.choices.map((c) => ({
        letter: c.letter,
        text: c.text,
        rationale: c.rationale || "",
        isCorrect: question.answer === c.letter,
      })),
      rationale: question.rationale || "",
      answer: question.answer,
      is_deleted: question.is_deleted || false,
    };

    await axios.put(`${API_URL}/updateQuestion/${question._id}`, payload);

    // 🔄 Refresh question list
    queryClient.invalidateQueries(["questionsList", category]);

    onClose();
  } catch (err) {
    console.error("Failed to update question:", err);
    alert("Failed to update question. Please try again.");
  } finally {
    setLoading(false);
  }
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
          {/* Question */}
          <h1 className="edit-title-container">Question *</h1>
          <textarea
            className="edit-input"
            value={question.question}
            onChange={(e) => onChange("question", e.target.value)}
          />

          {/* Category */}
          <h1 className="edit-title-container">Category *</h1>
          <select
            className="edit-input"
            value={question.category || ""}
            onChange={(e) => onChange("category", e.target.value)}
          >
            <option value="" hidden>Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Level */}
          <h1 className="edit-title-container">Level *</h1>
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

          {/* Difficulty */}
          <h1 className="edit-title-container">Difficulty *</h1>
          <select
            className="edit-input"
            value={question.difficulty}
            onChange={(e) => onChange("difficulty", e.target.value)}
          >
            <option value="" hidden>Select Difficulty</option>
            {["easy", "average", "difficult"].map((val) => (
              <option key={val} value={val}>
                {val.charAt(0).toUpperCase() + val.slice(1)}
              </option>
            ))}
          </select>

          {/* Timer */}
          <h1 className="edit-title-container">Timer (seconds) *</h1>
          <input
            type="number"
            min="0"
            max="300"
            placeholder="Enter time in seconds"
            className="edit-input"
            value={question.timer || ""}
            onChange={(e) => onChange("timer", parseInt(e.target.value))}
          />

          {/* Options */}
          <h1 className="edit-title-container">Options *</h1>
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
                  placeholder="Enter Rationale (optional)"
                  value={choice.rationale}
                  onChange={(e) =>
                    onChange("choiceRationale", e.target.value, idx)
                  }
                />
              </div>
            );
          })}

          {/* Overall Rationale */}
          <h1 className="edit-title-container">Rationale (optional)</h1>
          <textarea
            className="edit-textarea"
            value={question.rationale}
            onChange={(e) => onChange("rationale", e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="buttons">
          <Buttons
            text={loading ? "Saving..." : "Save"}
            onClick={handleSaveClick}
            addedClassName={`btn btn-success ${
              !hasChanges || loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!hasChanges || loading}
          />
          <Buttons
            text="Cancel"
            onClick={onClose}
            addedClassName="btn btn-error"
            disabled={loading}
          />
        </div>
      </div>

      {/* Validation */}
      {showValidation && (
        <ValidationModal
          message={validationMessage}
          onClose={() => setShowValidation(false)}
        />
      )}
    </div>
  );
}

export default EditQuestion;
