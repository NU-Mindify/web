import React, { useEffect, useState } from "react";
import "../../css/questions/addQuestion.css";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { CheckCircle2Icon, XCircle } from "lucide-react";
import { API_URL } from "../../Constants";
import ValidationModal from "../../components/ValidationModal/ValidationModal.jsx";

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

  return (
    <div className="add-ques-main-container">
      <input
        type="hidden"
        id="category"
        name="category"
        value={question.category}
      />

      <div className="add-ques-header">
        <div className="add-ques-sub-header">
          <h1 className="text-2xl font-bold font-[poppins] text-black">
            Add Question
          </h1>
          <div className="w-[50px] h-[50px] bg-red-600"></div>
        </div>

        <h2 className="text-black">Create Question for {categoryName}</h2>
      </div>

      <div className="ques-container">
        <h1 className="w-full text-black">
          Question
        </h1>
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
          <h1 className="text-black">
            Level:
          </h1>
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
          <h1 className="text-black">
            Difficulty:
          </h1>
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
        <h1 className="w-full text-black">
          Options:
        </h1>
        {question.choices.map((choice, idx) => (
          <div className="w-[80%] flex flex-row my-2" key={choice.letter}>
            <label className="!swap swap-rotate !w-[15%] flex justify-center items-center">
              <input
                type="checkbox"
                name="correctLetter"
                className="my-auto me-2 h-[70px]"
                checked={question.answer === choice.letter}
                onChange={(e) => onAnswerChange(e)}
                value={choice.letter}
              />
              <CheckCircle2Icon className="swap-on h-8 w-8" />
              <XCircle className="swap-off h-8 w-8" />
            </label>
            <div
              className={`${
                question.answer === choice.letter
                  ? "bg-green-500"
                  : "bg-red-300"
              } border border-black/20 rounded px-4 rounded-e-none border-e-0 h-full flex items-center`}
            >
              {choice.letter.toUpperCase()}
            </div>
            <div className="w-full flex flex-col">
              <textarea
                className="w-full h-[70px] text-sm bg-white border border-black text-black"
                required
                disabled={isFormDisabled}
                value={choice.text}
                onChange={(e) => onChoiceChange(e, idx)}
              ></textarea>
              <textarea
                className="w-full h-[70px] text-sm bg-white border border-black text-black"
                placeholder="Enter Rationale"
                value={choice.rationale}
                onChange={(e) => onChoiceChangeRationale(e, idx)}
              ></textarea>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full flex flex-col justify-center items-center bg-blue-500">
        <label htmlFor="Rationale" className="w-full text-black">
          Rationale:
        </label>
        <textarea
          id="Rationale"
          className="w-11/12 text-black h-[100px] bg-white"
          placeholder="Type the rationale here..."
          disabled={isFormDisabled}
          value={question.rationale}
          onChange={(e) =>
            setQuestion({ ...question, rationale: e.target.value })
          }
        ></textarea>
      </div>

      <div className="w-full bg-violet-400 flex justify-center items-center">
        <button
          className="w-[200px] h-[50px] btn btn-success"
          onClick={handleAddQuestion}
        >
          Add Question
        </button>
      </div>

      <div className="flex gap-2 p-4">
        <button
          className="btn btn-neutral grow bg-[#FFC300] text-black border-0"
          onClick={addToDB}
        >
          Save
        </button>

        <button
          className="btn btn-neutral btn-outline grow"
          onClick={() => {
            nav("/question", {
              state: { category, categoryName, catSelected: true },
            });
          }}
        >
          Back
        </button>
      </div>

      <div className="w-full bg-red-300 p-4">
        {allQuestions.map((q, idx) => (
          <div key={idx} className="mb-2">
            <h1 className="font-bold">{q.question}</h1>
            <h2>{q.category}</h2>
          </div>
        ))}
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

export default AddQuestion;
