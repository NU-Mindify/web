import { useState } from "react";
import search from "../../assets/search/search.svg";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import '../../css/questions/questions.css'
import SearchBar from "../../components/searchbar/SearchBar";
import { API_URL } from "../../Constants";
import abnormal from '../../assets/questions/abnormalBG.png'
import developmental from '../../assets/questions/developmentalBG.png'
import general from '../../assets/questions/generalBG.png'
import industrial from '../../assets/questions/industrialBG.png'
import psychological from '../../assets/questions/psychologicalBG.png'


const categoriesObj = [
  {
    id: "abnormal",
    name: "Abnormal Psychology",
    bg: abnormal
  },
  {
    id: "developmental",
    name: "Developmental Psychology",
    bg: developmental
  },
  {
    id: "psychological",
    name: "Psychological Assessment",
    bg: psychological
  },
  {
    id: "industrial",
    name: "Industrial Psychology",
    bg: industrial
  },
  {
    id: "general",
    name: "General Psychology",
    bg: general
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
        `${API_URL}/getQuestions?${
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


  function handleBack(){
    setGotSelected(false)
  }

  function Category_Choices({ text, id, onClick, bgImage }) {
    return (
      
      <div className="category-container" onClick={onClick} key={id}>
        <img src={bgImage} className="category-bg" />
        <h1 className="category-text">{text}</h1>
        <p className="category-quantity">Questions: 2022</p>
        
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

  return (
   
    <div className="question-main-container">
      <div className="question-header">
        <div className="title-header">
          {gotSelected ? 
              <>
                <h1 className="quesiton-title">Manage Questions</h1>
                <div className="add-ques-container">
                  <button className="btn" onClick={addQuestion}>
                    Add Question
                  </button>
                  <button className="btn btn-error" onClick={handleBack}>
                    Back
                  </button> 
                </div>
                
              </>
              : 
              <h1 className="quesiton-title">Select Category</h1>
          } 
        </div>
          
          {gotSelected ? 
            
            <div className="ques-search-container">
              <SearchBar className='question-search' /> 
            </div>
            : 
            ''
          }
        </div>
      {gotSelected ? 
        <div className="allquesitons-container">
          <div className="ques-sub-container">
            <div className="allques-main-holder">
              {questions.length === 0 ? (
                <div className="text-center text-gray-500 text-xl">No questions found.</div>
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
              bgImage={elem.bg}
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