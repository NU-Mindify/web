import React, { useState } from "react";
import Style from "./addQuestion.module.css";
import { useNavigate } from "react-router";
import axios from "axios";

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
  const [isFormDisabled, setIsFormDisabled] = useState(false)
  const [question, setQuestion] = useState({
    question: "",
    choices: [
      {
        letter: "a",
        text: "",
        isCorrect: true
      },
      {
        letter: "b",
        text: "",
        isCorrect: false
      },
      {
        letter: "c",
        text: "",
        isCorrect: false
      },
      {
        letter: "d",
        text: "",
        isCorrect: false
      },
    ],
    rationale:"",
    category: "developmental",
    level: 1,
    answer:"a",
  });
  const nav = useNavigate();

  const addToDB = async () => {
    setIsFormDisabled(true)
    try {
      const { data } = await axios.post("https://nu-mindify-api.vercel.app/api/addQuestion", question)
      console.log(data);
      alert("Added Successfully");
      nav(-1)
    } catch (error) {
      console.error(error);
      alert(error.response.data.error.name)
    }
    setIsFormDisabled(false)
  }

  const onChoiceChange = (e, index) => {
    const newChoices = [...question.choices];
    newChoices[index].text = e.target.value;
    setQuestion({...question, choices: newChoices})
  }
  const onAnswerChange = (e) => {
    const choices = [...question.choices];
    const newChoices = choices.map((choice) => {
      if (choice.letter == e.target.value.toLowerCase()) {
        return { ...choice, isCorrect: true };
      }
      return { ...choice, isCorrect: false };
    });
    setQuestion({...question, choices: newChoices, answer: e.target.value})
  }

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
              <option key={category.id} value={category.id}>{category.name}</option>
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
          <label htmlFor="options">Options:</label>
          <div className="md:!w-[70%] flex">
            <div className="border border-black/20 rounded px-4 rounded-e-none border-e-0 h-full flex items-center">
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
        {["B", "C", "D"].map((letter, index) => (
          <div className={`${Style.row} mt-0`} key={letter}>
            <div className="!w-[30%]"></div>
            <div className="md:!w-[70%] flex">
              <div className="border border-black/20 rounded px-4 rounded-e-none border-e-0 h-full flex items-center">
                {letter}
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

        <label className={Style["row"]}>
          <label htmlFor="Answer">Correct Answer:</label>
          <select
            id="Answer"
            disabled={isFormDisabled}
            value={question.answer}
            onChange={(e) => onAnswerChange(e)}
          >
            {["A", "B", "C", "D"].map((letter) => (
              <option key={letter} value={letter.toLowerCase()}>{letter}</option>
            ))}
          </select>
        </label>

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
              nav(-1);
            }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddQuestion;
