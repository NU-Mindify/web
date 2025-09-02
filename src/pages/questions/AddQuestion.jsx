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
import Papa from "papaparse";
import { UserLoggedInContext } from "../../contexts/Contexts.jsx";

import OkCancelModal from "../../components/OkCancelModal/OkCancelModal.jsx";
import { add } from "date-fns";

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

  const [OkCancelModalMessage, setOkCancelModalMessage] = useState("");
  const [showOkCancelModal, setShowOkCancelModal] = useState(false);
  const [questionToRemoveIdx, setQuestionToRemoveIdx] = useState(null);
  const [AddSuccessModalMessage, setAddSuccessModalMessage] = useState("");
  const [showAddSuccessModal, setShowAddSuccessModal] = useState(false);

  const [guideIsOpen, setGuideIsOpen] = useState(false);

  const [validationErrors, setValidationErrors] = useState({
    question: "",
    choices: ["", "", "", ""],
    rationale: "",
    difficulty: "",
    timer: "",
    item_number: "",
  });

  const validateQuestion = (q = question) => {
    const errors = {
      question: "",
      choices: ["", "", "", ""],
      rationale: "",
      difficulty: "",
      timer: "",
      item_number: "",
    };

    if (!q.question.trim()) errors.question = "Please enter a question.";

    if (!q.rationale.trim())
      errors.rationale = "Please enter an overall rationale.";

    if (!q.difficulty.trim())
      errors.difficulty = "Please select a difficulty level.";

    if (!q.timer || q.timer <= 0)
      errors.timer = "Please enter a number greater than 0.";

    const choiceTexts = [];
    q.choices.forEach((c, i) => {
      if (!c.text.trim())
        errors.choices[
          i
        ] = `Choice ${c.letter.toUpperCase()} answer is required.`;
      else if (choiceTexts.includes(c.text.trim().toLowerCase()))
        errors.choices[i] = "Duplicate choice text is not allowed.";

      if (!c.rationale.trim())
        errors.choices[i] += errors.choices[i]
          ? " Rationale is required."
          : "Rationale is required.";

      choiceTexts.push(c.text.trim().toLowerCase());
    });

    setValidationErrors(errors);

    // check if any error exists
    const hasError =
      errors.question ||
      errors.rationale ||
      errors.difficulty ||
      errors.timer ||
      errors.item_number ||
      errors.choices.some((err) => err);

    return !hasError;
  };

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
    answer: "a",
    timer: 0,
  });

  const [question, setQuestion] = useState(getInitialQuestionState);

  const handleAddQuestion = () => {
    // validate current question
    const isValid = validateQuestion(question);

    if (!isValid) {
      setValidationMessage("Please fill up all required fields*.");
      setShowValidationModal(true);
      return;
    }

    // If valid, add the question
    const questionCopy = JSON.parse(JSON.stringify(question));
    setAllQuestions((prev) => [...prev, questionCopy]);
    setQuestion(getInitialQuestionState());

    // reset validation errors
    setValidationErrors({
      question: "",
      choices: ["", "", "", ""],
      rationale: "",
      difficulty: "",
      item_number: "",
      timer: "",
    });

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
      const isAdmin =
        currentWebUser.position.toLowerCase() === "professor"
          ? `${API_URL}/addQuestion`
          : `${API_URL}/addQuestionAdmin`;

      const cleanedQuestions = allQuestions.map((q) => ({
        item_number: q.item_number ? String(q.item_number) : "N/A",
        question: q.question || "N/A",
        category: q.category || "N/A",
        difficulty: q.difficulty || "N/A",
        answer: q.answer || "N/A",
        rationale: q.rationale || "N/A",
        timer: q.timer || 0,
        choices: q.choices || [],
      }));

      console.log("=== PAYLOAD TO SEND ===");
      console.log(JSON.stringify(cleanedQuestions, null, 2));

      const { data } = await axios.post(isAdmin, cleanedQuestions, {
        headers: {
          Authorization: `Bearer ${currentWebUser.token}`,
        },
      });

      console.log(data);
      setAddSuccessModalMessage(
        currentWebUser.position.toLowerCase() === "professor"
          ? "Added Successfully! Questions are to be approved by Admin."
          : "Added Successfully!"
      );
      setShowAddSuccessModal(true);

      for (const q of allQuestions) {
        await axios.post(`${API_URL}/addLogs`, {
          name: `${currentWebUser.firstName} ${currentWebUser.lastName}`,
          branch: currentWebUser.branch,
          action: "Add Question",
          description: `${currentWebUser.firstName} Added question "${q.question}" to category "${q.category}"`,
          useravatar: currentWebUser.useravatar,
        });
      }
    } catch (error) {
      console.error("=== FULL ERROR RESPONSE ===", error.response?.data);
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
    const newQ = { ...question, choices: newChoices };
    setQuestion(newQ);
    validateQuestion(newQ);
  };

  const onChoiceChangeRationale = (e, index) => {
    const newChoices = [...question.choices];
    newChoices[index].rationale = e.target.value;
    const newQ = { ...question, choices: newChoices };
    setQuestion(newQ);
    validateQuestion(newQ);
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

  const handleCSVUploadQuestions = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().replace(/\s+/g, " "),
      complete: (results) => {
        const parsedQuestions = results.data
          .filter(
            (row) =>
              row["Item_Number"]?.trim() &&
              row["Question"]?.trim() &&
              row["A"]?.trim() &&
              row["B"]?.trim() &&
              row["C"]?.trim() &&
              row["D"]?.trim() &&
              row["CORRECT ANSWERS"]?.trim() &&
              row["RATIONALE"]?.trim() &&
              row["TIMER"]?.trim()
          )
          .map((row) => {
            const correctAnswer = row["CORRECT ANSWERS"].trim().toLowerCase();
            const timer = parseInt(row["TIMER"]);

            const difficultyMap = {
              E: "easy",
              A: "average",
              D: "difficult",
            };
            const difficulty =
              difficultyMap[row["Difficulty"]?.trim().toUpperCase()] || "N/A";

            const normalizeField = (value) => value?.trim() || "N/A";

            return {
              item_number: row["Item_Number"].trim(),
              question: normalizeField(row["Question"]),
              difficulty,
              rationale: normalizeField(row["RATIONALE"]),
              answer: correctAnswer,
              category: category,
              timer: isNaN(timer) ? 0 : timer,
              choices: [
                {
                  letter: "a",
                  text: normalizeField(row["A"]),
                  rationale: row["A_Rationale"]?.trim() || "",
                  isCorrect: correctAnswer === "a",
                },
                {
                  letter: "b",
                  text: normalizeField(row["B"]),
                  rationale: row["B_Rationale"]?.trim() || "",
                  isCorrect: correctAnswer === "b",
                },
                {
                  letter: "c",
                  text: normalizeField(row["C"]),
                  rationale: row["C_Rationale"]?.trim() || "",
                  isCorrect: correctAnswer === "c",
                },
                {
                  letter: "d",
                  text: normalizeField(row["D"]),
                  rationale: row["D_Rationale"]?.trim() || "",
                  isCorrect: correctAnswer === "d",
                },
              ],
            };
          });

        if (parsedQuestions.length === 0) {
          setValidationMessage("No valid questions found in the CSV.");
          setShowValidationModal(true);
          return;
        }

        setAllQuestions((prev) => [...prev, ...parsedQuestions]);
        setValidationMessage("Import Success!");
        setShowValidationModal(true);
      },
    });
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
                    question.item_number.trim() !== "";

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
          <input
            id="upload-btn"
            type="file"
            accept=".csv"
            onChange={handleCSVUploadQuestions}
            className="hidden"
          />
          <label
            htmlFor="upload-btn"
            className="w-[360px] py-5 px-10 rounded-2xl text-xl text-center font-extrabold transition bg-[#FFC300] text-black hover:bg-[#e6b200] cursor-pointer"
          >
            UPLOAD CSV FILE
          </label>
          <a href="/IMPORT_QUESTIONS_TEMPLATE.csv" download>
            <button className="w-[360px] mt-2 py-5 px-10 rounded-2xl text-xl text-center font-extrabold transition bg-[#FFC300] text-black hover:bg-[#e6b200] cursor-pointer">
              DOWNLOAD CSV TEMPLATE
            </button>
          </a>

          <button
            className="w-[360px] mt-2 py-5 px-10 rounded-2xl text-xl text-center font-extrabold transition bg-[#FFC300] text-black hover:bg-[#e6b200] cursor-pointer"
            onClick={() => setGuideIsOpen(true)}
          >
            VIEW CSV TEMPLATE GUIDE
          </button>

          {guideIsOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-black/20">
              <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">
                    QuestionsTemplate.csv Format
                  </h2>
                  <button
                    onClick={() => setGuideIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <p className="mb-4">
                  The <code>QuestionsTemplate.csv</code> file contains all the
                  question data. Each row represents one question. The columns
                  should appear in the following order:
                </p>

                <div className="bg-gray-100 p-3 rounded mb-4 font-mono text-sm">
                  Difficulty,Item_Number,Question,A,A_Rationale,B,B_Rationale,C,C_Rationale,D,D_Rationale,CORRECT
                  ANSWERS,RATIONALE,TIMER
                </div>

                <h3 className="text-lg font-semibold mb-2">Column Details</h3>
                <table className="w-full border border-gray-300 mb-4">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border px-3 py-2 text-left">
                        CSV Column Headers
                      </th>
                      <th className="border px-3 py-2 text-left">
                        Required or Optional
                      </th>
                      <th className="border px-3 py-2 text-left">
                        Accepted Values
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-3 py-2">Difficulty</td>
                      <td className="border px-3 py-2">Required</td>
                      <td className="border px-3 py-2">
                        E, A, or D (Easy, Medium, Difficult)
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-3 py-2">Item_Number</td>
                      <td className="border px-3 py-2">Required</td>
                      <td className="border px-3 py-2">Numeric value</td>
                    </tr>
                    <tr>
                      <td className="border px-3 py-2">Question</td>
                      <td className="border px-3 py-2">Required</td>
                      <td className="border px-3 py-2">Question text</td>
                    </tr>
                    <tr>
                      <td className="border px-3 py-2">A, B, C, D</td>
                      <td className="border px-3 py-2">Required</td>
                      <td className="border px-3 py-2">Answer choices</td>
                    </tr>
                    <tr>
                      <td className="border px-3 py-2">
                        A_Rationale, B_Rationale, C_Rationale, D_Rationale
                      </td>
                      <td className="border px-3 py-2">Optional</td>
                      <td className="border px-3 py-2">
                        Explanation for each choice
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-3 py-2">CORRECT ANSWERS</td>
                      <td className="border px-3 py-2">Required</td>
                      <td className="border px-3 py-2">A, B, C, or D</td>
                    </tr>
                    <tr>
                      <td className="border px-3 py-2">RATIONALE</td>
                      <td className="border px-3 py-2">Required</td>
                      <td className="border px-3 py-2">
                        Overall explanation (use N/A if none)
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-3 py-2">TIMER</td>
                      <td className="border px-3 py-2">Required</td>
                      <td className="border px-3 py-2">
                        Numeric value in seconds
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h3 className="text-lg font-semibold mt-4 mb-2">Notes</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li>Each row represents one question.</li>
                  <li>
                    There are examples within the downloaded template to guide
                    you.
                  </li>
                  <li>All columns except rationale per choice are required.</li>
                  <li>
                    <strong>Item_Number</strong> and <strong>TIMER</strong> must
                    be numeric values.
                  </li>
                  <li>
                    The <strong>CORRECT ANSWERS</strong> field must match one of
                    the choices (A, B, C, or D).
                  </li>
                  <li>
                    Save the file as <code>.csv</code> (comma-separated values,
                    UTF-8 encoding recommended).
                  </li>
                </ul>

                <div className="flex justify-end"></div>
              </div>
            </div>
          )}

          <h3 className="w-full">
            Question<span>*</span>
          </h3>
          <textarea
            id="Question"
            placeholder="Type here..."
            disabled={isFormDisabled}
            value={question.question}
            onChange={(e) => {
              const newQ = { ...question, question: e.target.value };
              setQuestion(newQ);
              validateQuestion(newQ);
            }}
          ></textarea>
          {validationErrors.question && (
            <span className="text-red-600">{validationErrors.question}</span>
          )}
        </div>

        {/* ITEM NUMBER */}
        <div className="select-container flex gap-6">
          <div className="flex flex-col">
            <h3>
              Item Number:<span>*</span>
            </h3>
            <input
              type="number"
              min="1"
              max="9999"
              placeholder="Enter item number"
              className="w-[200px] h-[40px] mt-2 border border-gray-400 rounded px-2"
              disabled={isFormDisabled}
              value={question.item_number || ""}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "").slice(0, 4); // Up to 4 digits
                setQuestion({ ...question, item_number: value });
              }}
              onKeyDown={(e) => {
                if (
                  [
                    "Backspace",
                    "Tab",
                    "ArrowLeft",
                    "ArrowRight",
                    "Delete",
                  ].includes(e.key)
                ) {
                  return;
                }
                if (!/^\d$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            <div className="h-[20px] mt-1">
              {validationErrors.item_number && (
                <span className="text-red-600">
                  {validationErrors.item_number}
                </span>
              )}
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex flex-col">
            <h3>
              Difficulty:<span>*</span>
            </h3>
            <select
              id="difficultySelect"
              disabled={isFormDisabled}
              value={question.difficulty}
              onChange={(e) => {
                const newQ = { ...question, difficulty: e.target.value };
                setQuestion(newQ);
                validateQuestion(newQ);
              }}
              className="w-[200px] h-[40px] mt-2 border border-gray-400 rounded px-2"
            >
              <option value="">Select a Difficulty</option>
              <option value="easy">Easy</option>
              <option value="average">Average</option>
              <option value="difficult">Difficult</option>
            </select>
            <div className="h-[20px] mt-1">
              {validationErrors.difficulty && (
                <span className="text-red-600">
                  {validationErrors.difficulty}
                </span>
              )}
            </div>
          </div>

          {/* Timer */}
          <div className="flex flex-col">
            <h3>
              Timer:<span>*</span>
            </h3>
            <input
              type="number"
              min="0"
              max="99"
              placeholder="Enter time in seconds"
              className="w-[200px] h-[40px] mt-2 border border-gray-400 rounded px-2"
              disabled={isFormDisabled}
              value={question.timer || ""}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "").slice(0, 2);
                setQuestion({ ...question, timer: value });
              }}
              onKeyDown={(e) => {
                if (
                  [
                    "Backspace",
                    "Tab",
                    "ArrowLeft",
                    "ArrowRight",
                    "Delete",
                  ].includes(e.key)
                ) {
                  return;
                }
                if (!/^\d$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            <div className="h-[20px] mt-1">
              {validationErrors.timer && (
                <span className="text-red-600">{validationErrors.timer}</span>
              )}
            </div>
          </div>
        </div>

        <div className="option-container">
          <h3 className="text-lg font-semibold w-full">
            Options<span>*</span>
          </h3>

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
                  {validationErrors.choices[idx] && (
                    <span className="text-red-600">
                      {validationErrors.choices[idx]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="overall-rationale-container">
          <h3 className="w-full text-black">
            Rationale:<span>*</span>
          </h3>
          <textarea
            id="Rationale"
            placeholder="Type the rationale here..."
            disabled={isFormDisabled}
            value={question.rationale}
            onChange={(e) => {
              const newQ = { ...question, rationale: e.target.value };
              setQuestion(newQ);
              validateQuestion(newQ);
            }}
          ></textarea>
          {validationErrors.rationale && (
            <span className="text-red-600">{validationErrors.rationale}</span>
          )}
        </div>

        <div className="add-btn-container">
          <button
            className="w-[330px] py-5 px-10 rounded-2xl text-2xl font-extrabold transition bg-[#FFC300] text-black hover:bg-[#e6b200] cursor-pointer"
            onClick={handleAddQuestion}
          >
            ADD QUESTION
            {/* <img src={add} className="add-btn" alt="add-btn-icon" /> */}
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
                    <div className="grid grid-cols-3 text-center">
                      <h1>Item Number</h1>
                      <h1>Difficulty</h1>
                      <h1>Timer</h1>
                    </div>
                    <div className="grid grid-cols-3 text-center border border-black h-6/12 mt-2 rounded-xl place-items-center">
                      <h1>{question.item_number || "N/A"}</h1>

                      <h1>
                        {question.difficulty
                          ? question.difficulty.charAt(0).toUpperCase() +
                            question.difficulty.slice(1)
                          : ""}
                      </h1>

                      <h1>{question.timer}s</h1>
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
                      <button
                        className="w-[330px] py-5 px-10 rounded-2xl text-2xl font-extrabold transition bg-[#FFC300] text-black hover:bg-[#e6b200] cursor-pointer"
                        onClick={() => setOnEdit(!onEdit)}
                      >
                        SAVE QUESTION
                      </button>
                    ) : (
                      <button
                        className="w-[330px] py-5 px-10 rounded-2xl text-2xl font-extrabold transition bg-[#FFC300] text-black hover:bg-[#e6b200] cursor-pointer"
                        onClick={() => setOnEdit(!onEdit)}
                      >
                        EDIT QUESTION
                      </button>
                    )}
                    <button
                      className="w-[330px] py-5 px-10 rounded-2xl text-2xl font-extrabold transition bg-red-500 text-black hover:bg-red-600 cursor-pointer"
                      onClick={() => {
                        setQuestionToRemoveIdx(idx);
                        setOkCancelModalMessage(
                          "Are you sure you want to remove this question?"
                        );
                        setShowOkCancelModal(true);
                      }}
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="w-full flex justify-center py-4">
          <button
            className="w-[330px] py-5 px-10 rounded-2xl text-2xl font-extrabold transition bg-[#FFC300] text-black hover:bg-[#e6b200] cursor-pointer"
            onClick={addToDB}
            addedClassName="btn btn-success"
          >
            SAVE QUESTION
          </button>
        </div>

        {showValidationModal && (
          <ValidationModal
            message={validationMessage}
            onClose={() => setShowValidationModal(false)}
          />
        )}

        {showAddSuccessModal && (
          <ValidationModal
            message={AddSuccessModalMessage}
            onClose={() => {
              setShowAddSuccessModal(false);
              nav(-1);
            }}
          />
        )}

        {showBackConfirmModal && (
          <div className="modal-overlay confirm-delete-popup">
            <div className="confirm-dialog">
              <div className="flex justify-center">
                <h2>Unsaved Changes</h2>
              </div>
              <p>
                Leaving this page will discard any unsaved changes. Proceed?
              </p>
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

      {showOkCancelModal && (
        <OkCancelModal
          message={OkCancelModalMessage}
          onConfirm={() => {
            handleRemoveQuestion(questionToRemoveIdx);
            setShowOkCancelModal(false);
            setQuestionToRemoveIdx(null);
          }}
          onCancel={() => {
            setShowOkCancelModal(false);
            setQuestionToRemoveIdx(null);
          }}
        />
      )}
    </div>
  );
}

export default AddQuestion;
