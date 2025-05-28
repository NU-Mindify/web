import React, { useEffect, useState } from "react";
import Style from "./addQuestion.module.css";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { CheckCircle2Icon, XCircle } from "lucide-react";
import { API_URL } from "../../Constants";
import ValidationModal from "../../components/ValidationModal/ValidationModal.jsx";

const [validationMessage, setValidationMessage] = useState("");
const [showValidationModal, setShowValidationModal] = useState(false);

const categoriesObj = [
  {
    id: "abnormal",
    name: "Abnormal Psychology",
  },
  {
    id: "developmental",
    name: "Developmental Psychology",
  },
  {
    id: "psychological",
    name: "Psychological Assessment",
  },
  {
    id: "industrial",
    name: "Industrial Psychology",
  },
  {
    id: "general",
    name: "General Psychology",
  },
];

function AddQuestion() {
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [question, setQuestion] = useState({
    question: "",
    choices: [
      {
        letter: "a",
        text: "",
        isCorrect: true,
      },
      {
        letter: "b",
        text: "",
        isCorrect: false,
      },
      {
        letter: "c",
        text: "",
        isCorrect: false,
      },
      {
        letter: "d",
        text: "",
        isCorrect: false,
      },
    ],
    rationale: "",
    category: "developmental",
    level: 1,
    answer: "a",
  });
  const nav = useNavigate();

  const addToDB = async () => {
    setIsFormDisabled(true);
    try {
      const { data } = await axios.post(`${API_URL}/addQuestion`, question);
      console.log(data);
      setValidationMessage("Added Successfully");
      setShowValidationModal(true);

      nav(-1);
    } catch (error) {
      console.error(error);
      setValidationMessage(error.response.data.error.name);
      setShowValidationModal(true);
    }
    setIsFormDisabled(false);
  };

  const onChoiceChange = (e, index) => {
    const newChoices = [...question.choices];
    newChoices[index].text = e.target.value;
    setQuestion({ ...question, choices: newChoices });
  };
  const onAnswerChange = (e) => {
    const choices = [...question.choices];
    const newChoices = choices.map((choice) => {
      if (choice.letter == e.target.value.toLowerCase()) {
        return { ...choice, isCorrect: true };
      }
      return { ...choice, isCorrect: false };
    });
    setQuestion({ ...question, choices: newChoices, answer: e.target.value });
  };

  const location = useLocation();
  const [category, setCategory] = useState(null);
  const [categoryName, setCategoryName] = useState(null);

  useEffect(() => {
    const categoryFromState = location.state?.category;
    const categoryNameFromState = location.state?.categoryName;

    if (categoryFromState) {
      setCategory(categoryFromState);
    }

    if (categoryNameFromState) {
      setCategoryName(categoryNameFromState);
    }
  }, [location.state]);

  return (
    <div
      className="flex justify-center h-full bg-transparent"
      data-theme="light"
    >
      <div className="bg-white p-8 flex flex-col gap-2 m-auto w-[500px] rounded-xl">
        <h1 className="text-2xl font-bold text-center mb-4">Add Question</h1>

        <label className={Style["row"]}>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            disabled={isFormDisabled}
            value={question.category}
            onChange={(e) =>
              setQuestion({ ...question, category: e.target.value })
            }
          >
            {categoriesObj.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className={Style["row"]}>
          <label htmlFor="level">Level:</label>
          <select
            id="level"
            disabled={isFormDisabled}
            value={question.level}
            onChange={(e) =>
              setQuestion({ ...question, level: e.target.value })
            }
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num}>{num}</option>
            ))}
          </select>
        </label>

        <div className={Style["row"]}>
          <label htmlFor="Question">Question</label>
          <textarea
            name="Question"
            id="Question"
            className="textarea"
            placeholder="Type your question here..."
            disabled={isFormDisabled}
            value={question.question}
            onChange={(e) =>
              setQuestion({ ...question, question: e.target.value })
            }
          ></textarea>
        </div>

        <div className={`${Style.row} flex`}>
          <label htmlFor="options" className="md:!w-[20%]">
            Options:
          </label>
          <div className="md:!w-[80%] flex">
            <label className="!swap swap-rotate !w-[15%]">
              <input
                type="checkbox"
                name="correctLetter"
                class="my-auto me-2"
                checked={question.answer === "a"}
                onChange={(e) => onAnswerChange(e)}
                value={"a"}
              />
              <CheckCircle2Icon className="swap-on h-8 w-8" size={10} />
              <XCircle className="swap-off h-8 w-8" size={10} />
            </label>
            <div
              className={`${
                question.answer == "a" ? "bg-green-500" : "bg-red-300"
              } border border-black/20 rounded px-4 rounded-e-none border-e-0 h-full flex items-center transition`}
            >
              A
            </div>
            <textarea
              className="!grow !rounded-s-none text-sm"
              required
              id="options"
              disabled={isFormDisabled}
              value={question.choices[0].text}
              onChange={(e) => onChoiceChange(e, 0)}
            ></textarea>
          </div>
        </div>
        {["b", "c", "d"].map((letter, index) => (
          <div className={`${Style.row} mt-0`} key={letter}>
            <div className="!w-[20%]"></div>
            <div className="md:!w-[80%] flex">
              <label className="!swap swap-rotate !w-[15%]">
                <input
                  type="checkbox"
                  name="correctLetter"
                  class="my-auto me-2"
                  checked={question.answer === letter}
                  onChange={(e) => onAnswerChange(e)}
                  value={letter}
                />
                <CheckCircle2Icon className="swap-on h-8 w-8" size={8} />
                <XCircle className="swap-off h-8 w-8" size={8} />
              </label>
              <div
                className={`${
                  question.answer == letter ? "bg-green-500" : "bg-red-300"
                } border border-black/20 rounded px-4 rounded-e-none border-e-0 h-full flex items-center transition`}
              >
                {letter.toUpperCase()}
              </div>
              <textarea
                className="!grow !rounded-s-none text-sm"
                required
                disabled={isFormDisabled}
                value={question.choices[index + 1].text}
                onChange={(e) => onChoiceChange(e, index + 1)}
              ></textarea>
            </div>
          </div>
        ))}

        <div className={Style["row"]}>
          <label htmlFor="Rationale">Rationale: </label>
          <textarea
            name="Rationale"
            id="Rationale"
            className="textarea"
            placeholder="Type the rationale here..."
            disabled={isFormDisabled}
            value={question.rationale}
            onChange={(e) =>
              setQuestion({ ...question, rationale: e.target.value })
            }
          ></textarea>
        </div>

        <div className="flex gap-2">
          <button
            className="btn btn-neutral grow"
            onClick={() => {
              console.log(question);
              addToDB();
            }}
          >
            Save
          </button>
          <button
            className="btn btn-neutral btn-outline grow"
            onClick={() => {
              nav("/question", {
                state: {
                  category: category,
                  categoryName: categoryName,
                  catSelected: true,
                },
              });
            }}
          >
            Back
          </button>
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

export default AddQuestion;
