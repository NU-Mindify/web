import React, { use, useContext, useEffect, useState } from "react";
import "../../css/questions/addQuestion.css";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { CheckCircle2Icon, XCircle } from "lucide-react";
import { API_URL } from "../../Constants";
import ValidationModal from "../../components/ValidationModal/ValidationModal.jsx";
import Buttons from "../../components/buttons/Buttons.jsx";
import chevronIcon from "../../assets/forAll/chevron.svg";
import closebtn from "../../assets/glossary/close-btn.svg";
import { UserLoggedInContext } from "../../contexts/Contexts.jsx";

import add from "../../assets/questions/addQuestionbtn.svg";
import edit from "../../assets/questions/editQuestionbtn.svg";
import saveBTN from "../../assets/questions/savebtn.svg";
import remove from "../../assets/questions/removeQuestionbtn.svg";
import save from "../../assets/questions/saveQuestionbtn.svg";


function AddQuestion() {
  const nav = useNavigate();
  const location = useLocation();
  const { currentWebUser } = useContext(UserLoggedInContext);

  const [allQuestions, setAllQuestions] = useState([]);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [showBackConfirmModal, setShowBackConfirmModal] = useState(false);

  const [onEdit, setOnEdit] = useState(false);

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

  useEffect(() => {
  console.log("allQuestions.length =", allQuestions.length);
  console.log("showBackConfirmModal =", showBackConfirmModal);
}, [allQuestions, showBackConfirmModal]);


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
    const {
      question: questionText,
      choices,
      rationale,
      difficulty,
      level,
    } = question;

    for (const choice of choices) {
      if (
        !choice.text ||
        !choice.text.trim() ||
        !choice.rationale ||
        !choice.rationale.trim()
      ) {
        setValidationMessage("All choices must have both text and rationale.");
        setShowValidationModal(true);
        return;
      }
    }

    const choiceTexts = choices.map((c) => c.text.trim().toLowerCase());
    const hasDuplicate = new Set(choiceTexts).size !== choiceTexts.length;
    if (hasDuplicate) {
      setValidationMessage("Duplicate choice texts are not allowed.");
      setShowValidationModal(true);
      return;
    }

    if (!questionText.trim()) {
      setValidationMessage("Please enter a question.");
      setShowValidationModal(true);
      return;
    }

    if (!difficulty.trim()) {
      setValidationMessage("Please select a difficulty level.");
      setShowValidationModal(true);
      return;
    }

    if (!level || level < 1) {
      setValidationMessage("Please select a valid level.");
      setShowValidationModal(true);
      return;
    }

    if (!rationale.trim()) {
      setValidationMessage("Please enter an overall rationale.");
      setShowValidationModal(true);
      return;
    }

    const questionCopy = JSON.parse(JSON.stringify(question));
    setAllQuestions((prev) => [...prev, questionCopy]);
    setQuestion(getInitialQuestionState());

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
      alert("Questions Added Successfully");
      nav(-1);

      for (const q of allQuestions) {
        await axios.post(`${API_URL}/addLogs`, {
          name: `${currentWebUser.firstName} ${currentWebUser.lastName}`,
          branch: currentWebUser.branch,
          action: "Add Question",
          description: `${currentWebUser.firstName} Added question "${q.question}" to category "${q.category}"`,
        });
      };
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

  const [dropdownStates, setDropdownStates] = useState({});

  const onAnswerChangeInList = (e, qIdx) => {
    const value = e.target.value.toLowerCase();
    const updatedQuestions = [...allQuestions];

    const updatedChoices = updatedQuestions[qIdx].choices.map((choice) => ({
      ...choice,
      isCorrect: choice.letter === value,
    }));

    updatedQuestions[qIdx].choices = updatedChoices;
    updatedQuestions[qIdx].answer = value;

    setAllQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...allQuestions];
    updatedQuestions.splice(index, 1);
    setAllQuestions(updatedQuestions);
  };

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
              <button
                className="w-[50px] h-[50px]"
                onClick={() => {
                  const hasUnsavedInput = () => {
                    const formHasInput =
                      question.question.trim() !== "" ||
                      question.choices.some(
                        (c) => c.text.trim() !== "" || c.rationale.trim() !== ""
                      ) ||
                      question.rationale.trim() !== "" ||
                      question.difficulty.trim() !== "" ||
                      question.level !== 1;

                    const listHasQuestions = allQuestions.length > 0;

                    return formHasInput || listHasQuestions;
                  };

                  if (hasUnsavedInput()) {
                    setShowBackConfirmModal(true);
                  } else {
                    nav("/question", {
                      state: { category, categoryName, catSelected: true },
                    });
                  }
                }}
              >
                <img src={closebtn} alt="close" />
              </button>

          </div>

          <h3>Create Question for {categoryName}</h3>
        </div>

        <div className="ques-container">
          <h3 className="w-full">Question<span>*</span></h3>
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
            <h3>Level:<span>*</span></h3>
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
            <h3>Difficulty:<span>*</span></h3>
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
          <h3 className="text-lg font-semibold w-full">Options<span>*</span></h3>

          {question.choices.map((choice, idx) => {
            const isCorrect = question.answer === choice.letter;

            return (
              <div className="per-choice-container" key={choice.letter}>
                <label className="check-circle-container">
                  <input
                    type="checkbox"
                    name="correctLetter"
                    checked={isCorrect}
                    onChange={(e) => onAnswerChange(e)}
                    value={choice.letter}
                    className="hidden"
                  />
                  {isCorrect ? (
                    <CheckCircle2Icon className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                </label>

                <div className="letter-container">
                  <h4>{choice.letter.toUpperCase()}.</h4>
                </div>

                <div className="textarea-container">
                  <textarea
                    required
                    placeholder="Enter Answer"
                    disabled={isFormDisabled}
                    value={choice.text}
                    onChange={(e) => onChoiceChange(e, idx)}
                  />
                  <textarea
                    required
                    placeholder="Enter Rationale"
                    disabled={isFormDisabled}
                    value={choice.rationale}
                    onChange={(e) => onChoiceChangeRationale(e, idx)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="overall-rationale-container">
          <h3 className="w-full text-black">Rationale:<span>*</span></h3>
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
          {/* <Buttons
            text="Add Question"
            onClick={handleAddQuestion}
            addedClassName="btn btn-success"
          /> */}
          <button
            className="add-btn-container"
            onClick={handleAddQuestion}
          >
            <img src={add} className="add-btn" alt="add-btn-icon"/>
          </button>
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
                    setDropdownStates((prev) => ({
                      ...prev,
                      [idx]: !prev[idx],
                    }));
                  }}
                >
                  <img
                    src={chevronIcon}
                    alt="chevron"
                    className={`${
                      dropdownStates[idx] ? `rotate-180` : `rotate-0`
                    }`}
                  />
                </button>
              </div>

              {dropdownStates[idx] && (
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
                        <label
                          className={`check-circle-container ${
                            onEdit ? `cursor-pointer` : `!cursor-default`
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="correctLetter"
                            checked={choice.isCorrect}
                            onChange={(e) => onAnswerChangeInList(e, idx)}
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
                    {onEdit ? (
                      // <Buttons
                      //   text="Save"
                      //   onClick={() => {
                      //     setOnEdit(!onEdit);
                      //   }}
                      //   addedClassName="btn btn-warning"
                      // />
                    <button
                      className=""
                      onClick={() => setOnEdit(!onEdit)}
                    >
                      <img src={saveBTN} className="" alt="save-btn-icon" />
                    </button>

                    ) : (
                      // <Buttons
                      //   text="Edit"
                      //   onClick={() => {
                      //     setOnEdit(!onEdit);
                      //   }}
                      //   addedClassName="btn btn-warning"
                        
                      // />

                    <button
                      className=""
                      onClick={() => setOnEdit(!onEdit)}
                    >
                      <img src={edit} className="" alt="edit-btn-icon" />
                    </button>

                    )}
                    <button
                      className=""                       
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to remove this question?"
                          )
                        ) {
                          handleRemoveQuestion(idx);
                        }
                      }}
                        addedClassName="btn btn-error"
                      >
                        <img src={remove} className="remove-btn" alt="remove-btn-icon"/>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="w-full flex justify-center py-4">
          <button
            className="success-btn"         
            onClick={addToDB}
            addedClassName="btn btn-success"
          >
          <img src={save} className="save-ques-btn" alt="save-btn-icon"/>
          </button>
        </div>

        {showValidationModal && (
          <ValidationModal
            message={validationMessage}
            onClose={() => setShowValidationModal(false)}
          />
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
                    setShowBackConfirmModal(false); // close modal
                    nav("/question", {
                      state: { category, categoryName, catSelected: true },
                    });
                  }}
                >
                  Yes, Go Back
                </button>
                <button className="btn-cancel" onClick={() => setShowBackConfirmModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AddQuestion;
