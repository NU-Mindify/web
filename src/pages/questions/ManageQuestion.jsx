import { useState } from "react";
import search from "../../assets/search/search.svg";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

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

export default function ManageQuestion() {
  // const [questions, setQuestions] = useState([]);
  const [category, setCategory] = useState(null);
  const navigate = useNavigate();

  const getData = async () => {
    try {
      console.log("fetching again");
      const { data } = await axios.get(
        `https://nu-mindify-api.vercel.app/api/getQuestions?${
          category ? `category=${category}&level=1` : ""
        }`
      );
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  const {
    isPending,
    error,
    data: questions,
  } = useQuery({
    queryKey: ["questionsList"],
    initialData: [],
    queryFn: getData,
  });

  const addQuestion = () => {
    navigate("/question/add");
  };

  if (isPending) return <div>Loading</div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full md:w-[90%] max-w-[1250px] 2xl:max-w-[1300px] mx-auto flex-col h-fit flex flex-1 gap-2">
      <div className="bg-white p-5 flex flex-col h-fit gap-4 rounded-2xl">
        <div className=" text-primary font-extrabold text-3xl">
          Manage Questions
        </div>
        <div className="flex items-center gap-4">
          <div className="search-bar-leaderboards !w-[90%]">
            <button className="search-btn-leaderboards">
              <img src={search}></img>
            </button>
            <input
              type="text"
              placeholder="Search for question"
              className="search-input-leaderboards"
            />
          </div>
          <button className="btn" onClick={addQuestion}>
            Add Question
          </button>
        </div>
        <div className="filter gap-1 items-center">
          <div className="text-black">Select Category:</div>
          <input
            className="btn filter-reset"
            type="radio"
            name="category"
            aria-label="All"
            onClick={() => setCategory("")}
          />
          {categoriesObj.map((category) => (
            <input
              className="btn"
              type="radio"
              name="category"
              aria-label={category.name}
              value={category.id}
              key={category.id}
              onClick={() => {
                setCategory(category.id);
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex-grow overflow-auto xl:!h-[76svh] h-[70svh]">
        <div className="p-4 bg-white rounded-2xl text-black gap-4 flex flex-grow flex-col ">
          {questions.map((question, index) => (
            <QuestionCard data={question} key={question._id} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
const QuestionCard = ({ data, index }) => {
  return (
    <>
      <div className="collapse collapse-arrow shadow-lg hover:bg-base-300/10 bg-white rounded-md border cursor-pointer h-fit">
        <input type="checkbox" name="question-accordion" />
        <div className="collapse-title font-semibold">
          {index + 1}. {data.question}
        </div>
        <div className="collapse-content text-sm flex justify-between">
          <div>
            {data.choices.map((choice) => (
              <div
                className={choice.isCorrect ? "text-red-500" : ""}
                key={choice.letter}
              >
                {choice.letter}. {choice.text}
              </div>
            ))}
            <div className="mt-4">
              <span className="font-bold">Rationale: </span>
              {data.rationale}
            </div>
            <div className="mt-4">
              <span className="font-bold">Category: </span>
              {categoriesObj.find((categ) => categ.id == data.category).name}
              <span className="font-bold ms-8">Level: </span>
              {data.level}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button className="btn btn-sm btn-outline btn-secondary">Edit</button>
            <button className="btn btn-sm btn-outline btn-error">
              Archive
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
