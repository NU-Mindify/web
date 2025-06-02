import React, { useState } from "react";
import { useNavigate } from "react-router";
import styles from "./addQuestion.module.css";
import add from "../../assets/questions/addQuestionbtn.svg";
import edit from "../../assets/questions/editQuestionbtn.svg";
import remove from "../../assets/questions/removeQuestionbtn.svg";
import save from "../../assets/questions/saveQuestionbtn.svg";
import closebtn from "../../assets/glossary/close-btn.svg";
import chevrondown from "../../assets/questions/chevron-down.svg";
import chevronup from "../../assets/questions/chevron-up.svg";
import correct from "../../assets/questions/rightAnswer-icon.svg";
import wrong from "../../assets/questions/wrongAnswer-icon.svg";
import axios from "axios";
import { API_URL } from "../../Constants";

const Qweqwe = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    question: "",
    level: "1",
    difficulty: "Easy",
    options: [
      { text: "", correct: true, rationale: "" },
      { text: "", correct: false, rationale: "" },
      { text: "", correct: false, rationale: "" },
      { text: "", correct: false, rationale: "" },
    ],
    rationale: "",
  });

  const [expanded, setExpanded] = useState({});

  const handleOptionChange = (index, key, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = { ...updatedOptions[index], [key]: value };

    if (key === "correct") {
      updatedOptions.forEach((opt, i) => {
        opt.correct = i === index;
      });
    }

    setFormData({ ...formData, options: updatedOptions });
  };

  const handleAddQuestion = () => {
    if (!formData.question.trim()) return;
    setQuestions([...questions, formData]);
    setFormData({
      question: "",
      level: "1",
      difficulty: "Easy",
      options: [
      { text: "", correct: true, rationale: "" },
      { text: "", correct: false, rationale: "" },
      { text: "", correct: false, rationale: "" },
      { text: "", correct: false, rationale: "" },
    ],
    rationale: "",
    });
  };

  const toggleExpand = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleRemove = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleBack = () => {
    navigate("/question");
  };

  const addToDB = async () => {
  // Include the current formData if it's not empty
  let updatedQuestions = [...questions];

  // Only push if the question field is filled
  if (formData.question.trim()) {
    updatedQuestions.push(formData);
  }

  try {
    const { data } = await axios.post(`${API_URL}/addQuestion`, updatedQuestions);
    console.log(data);
    // setValidationMessage("Added Successfully");
    // setShowValidationModal(true);
    navigate(-1); // Assuming you want to go back
  } catch (error) {
    console.error(error);
    // setValidationMessage(error.response?.data?.error?.name || "Error adding questions");
    // setShowValidationModal(true);
  }
};


  return (
    <div className={styles.pageWrapper}>
      {/* Add Question container */}
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add Question</h2>
          <button className="close-btn" onClick={handleBack}>
            <img src={closebtn} alt="close btn" />
          </button>
        </div>

        <div className={styles.row}>
          <p className={styles.label}>
            <span>* </span>Question
          </p>
          <input
            type="text"
            value={formData.question}
            placeholder="Type Here"
            onChange={(e) =>
              setFormData({ ...formData, question: e.target.value })
            }
          />
        </div>

        <div className={styles.selectGroup}>
          <div className={styles.selectItem}>
            <p className={styles.label}>
              <span>* </span>Level
            </p>
            <select
              value={formData.level}
              onChange={(e) =>
                setFormData({ ...formData, level: e.target.value })
              }
            >
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Level {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.selectItem}>
            <p className={styles.label}>
              <span>* </span>Difficulty
            </p>
            <select
              value={formData.difficulty}
              onChange={(e) =>
                setFormData({ ...formData, difficulty: e.target.value })
              }
            >
              <option>Easy</option>
              <option>Moderate</option>
              <option>Difficult</option>
            </select>
          </div>
        </div>

        <div className={styles.optionsBox}>
          <p className={styles.optionsTitle}>
            <span>* </span>Options
          </p>
          <hr className={styles.divider} />
          {formData.options.map((opt, index) => (
            <div key={index} className={`${styles.optionRow}`}>
              <label className="relative flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="correctOption"
                  checked={opt.correct}
                  onChange={() => handleOptionChange(index, "correct", true)}
                  className="peer hidden"
                />
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <img
                    src={opt.correct ? correct : wrong}
                    className={`${styles.correctAnswer}`}
                    alt={opt.correct ? "correct" : "wrong"}
                  />
                </div>
              </label>

              <div className={styles.optionTextContainer}>
                <input
                  type="text"
                  className={styles.optionInput}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  value={opt.text}
                  onChange={(e) =>
                    handleOptionChange(index, "text", e.target.value)
                  }
                />

                <input
                  type="text"
                  className={styles.rationaleInput}
                  placeholder="Enter Rationale"
                  value={opt.rationale}
                  onChange={(e) =>
                    handleOptionChange(index, "rationale", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="w-full h-[50px]">
          <h1 className="text-black">Rationale</h1>
          <input
            type="text"
            className={`${styles.rationaleInput} w-full text-black`}
            placeholder="Enter Rationale"
            value={formData.rationale}
            onChange={(e) =>
              setFormData({ ...formData, rationale: e.target.value })
            }
          />
        </div>

        <div className={styles.btnContainer}>
          <button onClick={handleAddQuestion} className={styles.addButton}>
            <img src={add} alt="add-button" className="addbtn" />
          </button>
        </div>
      </div>

      {/* Questions List container */}
      <div className={styles.questionsContainer}>
        <h2 className={styles.questionsHeader}>Questions</h2>

        <div className={styles.questionsScrollContainer}>
          {questions.map((q, i) => (
            <div className={styles.questionItem} key={i}>
              <div
                className={styles.questionHeader}
                onClick={() => toggleExpand(i)}
              >
                <strong>
                  {i + 1}. {q.question}
                </strong>
                {expanded[i] ? (
                  <img src={chevronup} className="chevron-up" />
                ) : (
                  <img src={chevrondown} className="chevron-down" />
                )}
              </div>

              {expanded[i] && (
                <div className="mt-4">
                  <div className={styles.metaRow}>
                    <div>
                      <strong>Level</strong>
                      <br />
                      {q.level}
                    </div>
                    <div>
                      <strong>Difficulty</strong>
                      <br />
                      {q.difficulty}
                    </div>
                  </div>

                  {q.options.map((opt, idx) => (
                    <div key={idx} className="mb-4">
                      <div className="flex items-start gap-2">
                        <span
                          className={
                            opt.correct
                              ? styles.optionIconCorrect
                              : styles.optionIconIncorrect
                          }
                        >
                          <img
                            src={opt.correct ? correct : wrong}
                            alt={opt.correct ? "correct" : "wrong"}
                            className={styles.icon}
                          />
                        </span>
                        <div>
                          <div className={styles.optionText}>
                            {String.fromCharCode(65 + idx)}. {opt.text}
                          </div>
                          <div className={styles.rationaleLine}>
                            {opt.rationale ? (
                              opt.rationale
                            ) : (
                              <span className="text-gray-400 italic">
                                Enter Rationale
                              </span>
                            )}
                          </div>
                          {/* <div className={styles.underline}></div> */}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className={`flex gap-4 mt-4 ${styles.questionActions}`}>
                    <button className={styles.Button}>
                      <img src={edit} alt="edit-button" className="editbtn" />
                    </button>
                    <button
                      className={styles.Button}
                      onClick={() => handleRemove(i)}
                    >
                      <img
                        src={remove}
                        alt="remove-button"
                        className="removebtn"
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.saveButtonContainer}>
          <button className={styles.saveButton}>
            <img
              src={save}
              alt="save-button"
              className="savebtn"
              onClick={addToDB}

            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Qweqwe;
