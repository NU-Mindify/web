/* eslint-disable jsx-a11y/no-static-element-interactions */
import { use, useContext, useEffect, useState } from "react";
import search from "../../assets/search/search.svg";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";
import "../../css/questions/questions.css";
import SearchBar from "../../components/searchbar/SearchBar";
import { API_URL } from "../../Constants";
import abnormal from "../../assets/questions/abnormal.png";
import developmental from "../../assets/questions/developmental.png";
import general from "../../assets/questions/generalBG.png";
import industrial from "../../assets/questions/industrial.png";
import psychological from "../../assets/questions/psychologicalBG.png";
import back from "../../assets/questions/angle-left.svg";
import { Plus } from "lucide-react";

import ExportDropdown from "../../components/ExportDropdown/ExportDropdown";
import { ActiveContext } from "../../contexts/Contexts";
import Buttons from "../../components/buttons/Buttons";
import { useQueryClient } from "@tanstack/react-query";

const categoriesObj = [
  {
    id: "abnormal",
    name: "Abnormal Psychology",
    bg: abnormal,
  },
  {
    id: "developmental",
    name: "Developmental Psychology",
    bg: developmental,
  },
  {
    id: "psychological",
    name: "Psychological Assessment",
    bg: psychological,
  },
  {
    id: "industrial",
    name: "Industrial Psychology",
    bg: industrial,
  },
  {
    id: "general",
    name: "General Psychology",
    bg: general,
  },
];

export default function ManageQuestion() {
  const [showArchived, setShowArchived] = useState(false);
  const [restore, setRestore] = useState(false);

  const { subSelected, setSubSelected } = useContext(ActiveContext);

  const [totalQuestion, setTotalQuestion] = useState([]);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [questionToDeleteId, setQuestionToDeleteId] = useState(null);
  const [showRestoreConfirmModal, setShowRestoreConfirmModal] = useState(false);
  const [questionToRestoreId, setQuestionToRestoreId] = useState(null);
  const queryClient = useQueryClient();


  useEffect(() => {
    getTotalQuestion();
  }, []);

  const getTotalQuestion = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/getTotalQuestions`);
      setTotalQuestion(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching total questions:", error);
    }
  };

  const location = useLocation();
  useEffect(() => {
    const category = location.state?.category;
    const categoryName = location.state?.categoryName;
    const catSelected = location.state?.catSelected;

    if (category && catSelected) {
      setCategory(category);
      setGotSelected(true);
      setSelectedCat(categoryName);
    }
  }, [location.state]);

  const navigate = useNavigate();

  const [searchQuestion, setSearchQuestion] = useState("");

  const [category, setCategory] = useState(null);
  const [gotSelected, setGotSelected] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);

  const getData = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/getQuestions?${category ? `category=${category}` : ""}`
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
    navigate("/question/add", {
      state: {
        category,
        categoryName: selectedCat,
      },
    });
  };

  const confirmDeleteQuestion = async () => {
    try {
      await axios.put(`${API_URL}/deleteQuestion/${questionToDeleteId}`, {
        question_id: questionToDeleteId,
        is_deleted: true,
      });
      setShowDeleteConfirmModal(false);
      setQuestionToDeleteId(null);
      queryClient.invalidateQueries(["questionsList", category]); 
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

    const confirmRestoreQuestion = async () => {
    try {
      await axios.put(`${API_URL}/deleteQuestion/${questionToRestoreId}`, {
        question_id: questionToRestoreId,
        is_deleted: false,
      });
      setShowRestoreConfirmModal(false);
      setQuestionToRestoreId(null);
      queryClient.invalidateQueries(["questionsList", category]);
    } catch (error) {
      console.error("Error restoring Question:", error);
    }
  };

  if (isPending) return <div>Loading</div>;

  if (error) return <div>Error: {error}</div>;

  function handleBack() {
    setGotSelected(false);
    setSubSelected("");
  }

  

  function Category_Choices({ text, id, onClick, bgImage }) {
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <div className="category-container" onClick={onClick} key={id}>
        <img src={bgImage} className="category-bg" alt="bgImages" />
        <h1 className="category-text">{text}</h1>
        <p className="category-quantity">
          Questions:{" "}
          {totalQuestion.find((category) => category._id === id)?.count || 0}
        </p>
      </div>
    );
  }

  const QuestionCard = ({ data, index }) => {
    return (
      <div className="collapse collapse-arrow question-card">
        <input type="checkbox" name="question-accordion" />

        <div className="collapse-title question-details">
          <div className="question-summary">
            {index + 1}. {data.question}
          </div>
        </div>

        <div className="collapse-content question-content">
          {data.choices.map((choice) => (
            <label
              key={choice.letter}
              className={`choice ${choice.isCorrect ? "choice-correct" : ""}`}
            >
              <span className="choice-indicator">
                {choice.isCorrect && <span className="choice-fill"></span>}
              </span>
              <span>
                <strong>{choice.letter}.</strong> {choice.text}
              </span>
            </label>
          ))}

          <div className="rationale-box">
            <p>
              <strong>Rationale:</strong>
            </p>
            <p>{data.rationale}</p>
          </div>

          <div className="question-meta">
            <div>
              <div>
                <strong>Category:</strong>{" "}
                {
                  categoriesObj.find((categ) => categ.id === data.category)
                    ?.name
                }
              </div>
              <div>
                <strong>LEVEL:</strong> {data.level}
              </div>
            </div>
          </div>
          {showArchived ? (
            <div className="question-actions">
              <button className="btn-action !bg-gray-500" disabled>
                Edit
              </button>
              <button
                onClick={() => {
                  setQuestionToRestoreId(data._id);
                  setShowRestoreConfirmModal(true);
                }}
                className="btn-action"
              >
                Restore
              </button>
            </div>
          ) : (
            <div className="question-actions">
              <button className="btn-action">Edit</button>
                <button
                  onClick={() => {
                    setQuestionToDeleteId(data._id);
                    setShowDeleteConfirmModal(true);
                  }}
                  className="btn-action"
                >
                  Delete
                </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="question-main-container">
      <div className="question-header">
        <div className="title-header">
          {gotSelected ? (
            <div className="title-content">
              <div className="title-left">
                <button
                  className="back-button cursor-pointer"
                  onClick={handleBack}
                >
                  <img src={back} alt="back arrow" className="back-icon" />
                </button>
                <h1 className="question-title">{selectedCat}</h1>
              </div>

              <div className="w-1/3 h-full">
                <p className="question-count text-right">
                  Total Questions: {questions.length}
                </p>
              </div>
            </div>
          ) : (
            <h1 className="question-title">Select Category</h1>
          )}
        </div>

        {gotSelected && (
          <div className="question-controls-container flex flex-col mt-5 mb-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="">
                <div className="search-bar-question border">
                  <button className="search-btn-question">
                    <img src={search} alt="search icon" className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    placeholder="Search questions..."
                    className="search-input-question min-w-[200px]"
                    onChange={(e) => setSearchQuestion(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between md:justify-around gap-2">
                <Buttons
                  text={
                    <span className="flex items-center">
                      <Plus className="w-5 h-5 text-white mr-2" />
                      Add Question
                    </span>
                  }
                  onClick={addQuestion}
                  addedClassName="btn btn-warning !w-[250px]"
                />

                <div className="pt-1">
                  <ExportDropdown />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full justify-start">
              <div className="flex bg-gray-100 p-1 rounded-xl w-[300px]">
                <button
                  onClick={() => setShowArchived(false)}
                  className={`all-archive-btn ${
                    showArchived || "active"
                  } w-1/2`}
                >
                  All Questions
                </button>

                <button
                  onClick={() => setShowArchived(true)}
                  className={`all-archive-btn ${
                    showArchived && "active"
                  } w-1/2`}
                >
                  Archive
                </button>
              </div>

              <div className="sort-container relative">
                <select id="sort" className="sort-select pl-8">
                  <option value="" disabled selected hidden>
                    Sort by:
                  </option>
                  <option value="level-asc">ALL</option>
                  <option value="level-asc">Level (1 → 10)</option>
                  <option value="level-desc">Level (10 → 1)</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              <div className="sort-container relative">
                <select id="filter" className="sort-select pl-8">
                  <option value="" disabled selected hidden>
                    Filter Level:
                  </option>
                  <option value="1">Level 1</option>
                  <option value="2">Level 2</option>
                  <option value="3">Level 3</option>
                  <option value="4">Level 4</option>
                  <option value="5">Level 5</option>
                  <option value="6">Level 6</option>
                  <option value="7">Level 7</option>
                  <option value="8">Level 8</option>
                  <option value="9">Level 9</option>
                  <option value="10">Level 10</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      {gotSelected ? (
        <div className="allquesitons-container">
          <div className="ques-sub-container">
            <div className="allques-main-holder">
              {questions.filter(
                (q) =>
                  q.is_deleted === showArchived &&
                  q.question
                    .toLowerCase()
                    .includes(searchQuestion.trim().toLowerCase())
              ).length === 0 ? (
                <div className="text-center text-gray-500 text-xl">
                  No matching questions found.
                </div>
              ) : (
                questions
                  .filter((question) => {
                    const matchArchived = question.is_deleted === showArchived;
                    const matchSearch = question.question
                      .toLowerCase()
                      .includes(searchQuestion.trim().toLowerCase());
                    return matchArchived && matchSearch;
                  })
                  .map((question, index) => (
                    <QuestionCard
                      data={question}
                      key={question._id}
                      index={index}
                    />
                  ))
              )}
            </div>
          </div>
        </div>
      ) : (
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
                setSelectedCat(elem.name);
                setSubSelected(elem.id);
              }}
            />
          ))}
        </div>
      )}

      {showDeleteConfirmModal && (
        <div className="modal-overlay confirm-delete-popup">
          <div className="confirm-dialog">
            <div className="flex justify-center">
              <h2>Delete Confirmation</h2>
            </div>
            <p>Are you sure you want to delete this question?</p>
            <div className="popup-buttons">
              <button className="btn-delete" onClick={confirmDeleteQuestion}>
                Yes, Delete
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowDeleteConfirmModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showRestoreConfirmModal && (
        <div className="modal-overlay confirm-delete-popup">
          <div className="confirm-dialog">
            <div className="flex justify-center">
              <h2>Restore Confirmation</h2>
            </div>
            <p>Are you sure you want to restore this question?</p>
            <div className="popup-buttons">
              <button className="btn-delete" onClick={confirmRestoreQuestion}>
                Yes, Restore
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowRestoreConfirmModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
