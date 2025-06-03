import React, { use, useEffect, useState } from "react";
import "../../css/questions/addQuestion.css";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { CheckCircle2Icon, XCircle } from "lucide-react";
import { API_URL } from "../../Constants";
import ValidationModal from "../../components/ValidationModal/ValidationModal.jsx";
import Buttons from "../../components/buttons/Buttons.jsx";
import chevronIcon from "../../assets/forAll/chevron.svg";
import closebtn from "../../assets/glossary/close-btn.svg";

function AddQuestion() {
  const nav = useNavigate();
  const location = useLocation();

  const [allQuestions, setAllQuestions] = useState([]);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const categoryFromState = location.state?.category;
    const categoryNameFromState = location.state?.categoryName;
    if (categoryFromState) setCategory(categoryFromState);
    if (categoryNameFromState) setCategoryName(categoryNameFromState);
  }, [location.state]);

  useEffect(() => {
    if (category) {
      setQuestion(getInitialQuestionState());
    }
  }, [category]);

  const getInitialQuestionState = () => ({
    question: "",
    choices: [
      { letter: "a", text: "", rationale: "", isCorrect: true },
      { letter: "b", text: "", rationale: "", isCorrect: false },
      { letter: "c", text: "", rationale: "", isCorrect: false },
      { letter: "d", text: "", rationale: "", isCorrect: false },
    ],
    rationale: "",
    category: category,
    difficulty: "",
    level: 1,
    answer: "a",
  });

  const [question, setQuestion] = useState(getInitialQuestionState);

  const handleAddQuestion = () => {
    const questionCopy = JSON.parse(JSON.stringify(question));
    setAllQuestions((prev) => [...prev, questionCopy]);
    setQuestion(getInitialQuestionState());

    // For debug only — won’t show latest due to async state
    console.log("Added:", questionCopy);
  };

  const addToDB = async () => {
    setIsFormDisabled(true);

    if (allQuestions.length === 0) {
      setValidationMessage(
        "No questions to save. Please add a question first."
      );
      setShowValidationModal(true);
      return;
    }

    try {
      const { data } = await axios.post(`${API_URL}/addQuestion`, allQuestions);
      console.log(data);
      setValidationMessage("Added Successfully");
      setShowValidationModal(true);
      nav(-1);
    } catch (error) {
      console.error(error);
      setValidationMessage(
        error.response?.data?.error?.name || "Submission Failed"
      );
      setShowValidationModal(true);
    } finally {
      setIsFormDisabled(false);
    }
  };

  const onChoiceChange = (e, index) => {
    const newChoices = [...question.choices];
    newChoices[index].text = e.target.value;
    setQuestion({ ...question, choices: newChoices });
  };

  const onChoiceChangeRationale = (e, index) => {
    const newChoices = [...question.choices];
    newChoices[index].rationale = e.target.value;
    setQuestion({ ...question, choices: newChoices });
  };

  const onAnswerChange = (e) => {
    const value = e.target.value.toLowerCase();
    const updatedChoices = question.choices.map((choice) => ({
      ...choice,
      isCorrect: choice.letter === value,
    }));
    setQuestion({ ...question, answer: value, choices: updatedChoices });
  };

  const [dropdownActive, setDropdownActive] = useState(false);

  const [onEdit, setOnEdit] = useState(false)
  return (
    <div className="add-ques-main-container">
      <div className="inputs-question-container">
        <input
          type="hidden"
          id="category"
          name="category"
          value={question.category}
        />

        <div className="add-ques-header">
          <div className="add-ques-sub-header">
            <h1>Add Question</h1>
            <div>
              <img src={closebtn} alt="close" className="w-[50px] h-[50px] cursor-pointer" />
            </div>
          </div>

          <h2>Create Question for {categoryName}</h2>
        </div>

        <div className="ques-container">
          <h3 className="w-full">Question</h3>
          <textarea
            id="Question"
            placeholder="Type here..."
            disabled={isFormDisabled}
            value={question.question}
            onChange={(e) =>
              setQuestion({ ...question, question: e.target.value })
            }
          ></textarea>
        </div>

        <div className="select-container">
          <div>
            <h3>Level:</h3>
            <select
              id="levelSelect"
              disabled={isFormDisabled}
              value={question.level}
              onChange={(e) =>
                setQuestion({ ...question, level: parseInt(e.target.value) })
              }
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3>Difficulty:</h3>
            <select
              id="difficultySelect"
              disabled={isFormDisabled}
              value={question.difficulty}
              onChange={(e) =>
                setQuestion({ ...question, difficulty: e.target.value })
              }
            >
              {["easy", "average", "difficult"].map((val) => (
                <option key={val} value={val}>
                  {val.charAt(0).toUpperCase() + val.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="option-container">
          <h3 className="w-full">Options:</h3>
          {question.choices.map((choice, idx) => (
            <div className="per-choice-container" key={choice.letter}>
              <label className="check-circle-container">
                <input
                  type="checkbox"
                  name="correctLetter"
                  checked={question.answer === choice.letter}
                  onChange={(e) => onAnswerChange(e)}
                  value={choice.letter}
                />
                <CheckCircle2Icon className="swap-on h-8 w-8 text-green-600" />
                <XCircle className="swap-off h-8 w-8 text-red-500" />
              </label>
              <div className={`letter-container`}>
                <h4>{choice.letter.toUpperCase()}.</h4>
              </div>
              <div className="textarea-container">
                <textarea
                  required
                  placeholder="Enter Answer"
                  disabled={isFormDisabled}
                  value={choice.text}
                  onChange={(e) => onChoiceChange(e, idx)}
                ></textarea>
                <textarea
                  required
                  disabled={isFormDisabled}
                  placeholder="Enter Rationale"
                  value={choice.rationale}
                  onChange={(e) => onChoiceChangeRationale(e, idx)}
                  className="border-b border-black"
                ></textarea>
              </div>
            </div>
          ))}
        </div>

        <div className="overall-rationale-container">
          <h3 className="w-full text-black">Rationale:</h3>
          <textarea
            id="Rationale"
            placeholder="Type the rationale here..."
            disabled={isFormDisabled}
            value={question.rationale}
            onChange={(e) =>
              setQuestion({ ...question, rationale: e.target.value })
            }
          ></textarea>
        </div>

        <div className="add-btn-container">
          <Buttons
            text="Add Question"
            onClick={handleAddQuestion}
            addedClassName="btn btn-success"
          />
        </div>
      </div>

      <div className="w-full bg-white rounded-2xl mt-10 px-10 py-5">
        <div className="add-ques-sub-header px-4">
          <h1 className="mb-4">Questions</h1>
        </div>
        <div className="all-questions-container">
          {allQuestions.map((question, idx) => (
            <div key={idx} className="per-question-container">
              <div className="quesetion-chev-holder">
                <h1 className="font-bold">
                  {idx + 1}. {question.question}
                </h1>
                <button
                  onClick={() => {
                    setDropdownActive(!dropdownActive);
                  }}
                >
                  <img
                    src={chevronIcon}
                    alt="chevron"
                    className={`${dropdownActive ? `rotate-180` : `rotate-0`}`}
                  />
                </button>
              </div>

              {dropdownActive && (
                <div className="dropdown-active-container">
                  <div className="level-diff-container">
                    <div className="grid grid-cols-2 text-center">
                      <h1>Level</h1>
                      <h1>Difficulty</h1>
                    </div>
                    <div className="grid grid-cols-2 text-center border border-black h-6/12 mt-2 rounded-xl place-items-center">
                      <h1>{question.level}</h1>
                      <h1>{question.difficulty}</h1>
                    </div>
                  </div>

                  <div className="choices-container">
                    {question.choices.map((choice) => (
                      <div className="per-choice-container" key={choice.letter}>
                        <label className={`check-circle-container ${onEdit ? `cursor-pointer` : `!cursor-default`}`}>
                          <input
                            type="checkbox"
                            name="correctLetter"
                            checked={choice.isCorrect}
                            onChange={(e) => onAnswerChange(e)}
                            value={choice.letter}
                          />
                          <CheckCircle2Icon className="swap-on h-8 w-8 text-green-600" />
                          <XCircle className="swap-off h-8 w-8 text-red-500" />
                        </label>
                        <div className={`letter-container`}>
                          <h4>{choice.letter.toUpperCase()}.</h4>
                        </div>
                        <div className="textarea-container">
                          <textarea
                            required
                            placeholder="Enter Answer"
                            disabled={!onEdit}
                            value={choice.text}
                            onChange={(e) => onChoiceChange(e, idx)}
                          ></textarea>
                          <textarea
                            required
                            disabled={!onEdit}
                            placeholder="Enter Rationale"
                            value={choice.rationale}
                            onChange={(e) => onChoiceChangeRationale(e, idx)}
                            className="border-b border-black"
                          ></textarea>
                        </div>
                      </div>
                    ))}
                  </div>


                  <div className="question-btn-container">
                    
                    {onEdit ? 
                      <Buttons 
                        text="Save"
                        onClick={() => {
                          setOnEdit(!onEdit)
                          alert("save")
                        }}
                        addedClassName="btn btn-success"
                      />
                    : 
                      <Buttons 
                        text="Edit"
                        onClick={() => {
                          setOnEdit(!onEdit)
                          alert("edit")
                        }}
                        addedClassName="btn btn-warning"
                      />
                    }
                    

                    <Buttons 
                      text="Remove"
                      onClick={() => {
                        alert("remove")
                      }}
                      addedClassName="btn btn-error"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="w-full bg-amber-500 flex justify-center py-4">
          <Buttons 
            text="Save"
            onClick={addToDB}
            addedClassName="btn btn-success"
          />
        </div>

        {showValidationModal && (
          <ValidationModal
            message={validationMessage}
            onClose={() => setShowValidationModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default AddQuestion;
