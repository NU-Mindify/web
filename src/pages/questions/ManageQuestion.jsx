import { useState } from "react";
import search from "../../assets/search/search.svg";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import '../../css/questions/questions.css'
import SearchBar from "../../components/searchbar/SearchBar";

const categoriesObj = [
  {
    id: "abnormal",
    name: "Abnormal Psychology",
    color: '#eb73e1'
  },
  {
    id: "developmental",
    name: "Developmental Psychology",
    color: '#40ed6b'
  },
  {
    id: "psychological",
    name: "Psychological Assessment",
    color: '#de9645'
  },
  {
    id: "industrial",
    name: "Industrial Psychology",
    color: '#3051d9'
  },
  {
    id: "general",
    name: "General Psychology",
    color: '#f53141'
  },
];

export default function ManageQuestion() {
  const [category, setCategory] = useState(null);
  const navigate = useNavigate();

  const [gotSelected, setGotSelected] = useState(false)

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
    queryKey: ["questionsList", category],
    initialData: [],
    queryFn: getData,
    enabled: gotSelected,
  });

  const addQuestion = () => {
    navigate("/question/add");
  };

  if (isPending) return <div>Loading</div>;

  if (error) return <div>Error: {error}</div>;

  function handleAbnormal(){
    setGotSelected(true)
    
  }

  function handleBack(){
    setGotSelected(false)
  }

  return (
   
    <div className="question-main-container">
      <div className="question-header">
        <div className="title-header">
          {gotSelected ? 
              <>
                <h1 className="quesiton-title">Manage Questions</h1>
                <button className="btn" onClick={addQuestion}>
                  Add Question
                </button>
                <button className="btn btn-error" onClick={handleBack}>
                  Back
                </button> 
              </>
              : 
              <h1 className="quesiton-title">Select Category</h1>
          } 
        </div>
          
          {gotSelected ? <SearchBar className='question-search' /> : ''}
        </div>
      {gotSelected ? 
        <div className="allquesitons-container">
          <div className="flex-grow overflow-auto xl:!h-[76svh] h-[70svh]">
            <div className="p-4 bg-white rounded-2xl text-black gap-4 flex flex-grow flex-col">
              {questions.length === 0 ? (
                <div className="text-center text-gray-500 text-lg">No questions found.</div>
              ) : (
                questions.map((question, index) => (
                  <QuestionCard data={question} key={question._id} index={index} />
                ))
              )}
            </div>
          </div>
        </div>
        : 
        <div className="question-body">
          {categoriesObj.map((elem) => (
            <Category_Choices
            key={elem.id}
            text={elem.name}
            id={elem.id}
            bgColor={elem.color}
            onClick={() => {
              setCategory(elem.id);
              setGotSelected(true);
            }}
          />
          ))}
        </div>
        
      
      }
    </div>
    
    
  );
}

function Category_Choices({ text, id, onClick, bgColor }) {
  return (
    <div className="category-container" key={id} onClick={onClick} style={{backgroundColor: bgColor}}>
      <h1 className="category-text" key={id} onClick={onClick}>{text}</h1>
      <p className="category-quantity" onClick={onClick}>Questions: 2022</p>
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
