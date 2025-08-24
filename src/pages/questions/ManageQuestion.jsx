/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useContext, useEffect, useState } from "react";
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
import EditQuestion from "./EditQuestion";

import ExportDropdown from "../../components/ExportDropdown/ExportDropdown";
import { ActiveContext, UserLoggedInContext } from "../../contexts/Contexts";
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
  const { currentWebUser } = useContext(UserLoggedInContext);
  const [showArchived, setShowArchived] = useState(false);
  const [restore, setRestore] = useState(false);

  const { subSelected, setSubSelected } = useContext(ActiveContext);

  const [totalQuestion, setTotalQuestion] = useState([]);
  const [totalDeletedQuestion, setTotalDeletedQuestion] = useState([]);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [questionToDeleteId, setQuestionToDeleteId] = useState(null);
  const [showRestoreConfirmModal, setShowRestoreConfirmModal] = useState(false);
  const [questionToRestoreId, setQuestionToRestoreId] = useState(null);
  const queryClient = useQueryClient();
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedQuestions, setUploadedQuestions] = useState([]);
  
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [originalQuestion, setOriginalQuestion] = useState(null);


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split("\n").filter((line) => line.trim() !== "");

        const headers = lines[0].split(",").map((h) => h.trim());
        const newQuestionsFromCSV = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map((s) => s.trim());
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = values[index];
          });

          if (!rowData["Question"] || !rowData["Overall Rationale"] || !rowData["Category"] || !rowData["Level"]) {
            console.warn(`Skipping row ${i + 1} due to missing essential data.`);
            continue;
          }

          const choices = [];
          let correctAnswerLetter = "";

          const choiceLetters = ['a', 'b', 'c', 'd'];
          for (let j = 0; j < 4; j++) {
            const choiceTextCol = `Choice ${String.fromCharCode(65 + j)} Text`;
            const choiceIsCorrectCol = `Choice ${String.fromCharCode(65 + j)} isCorrect`;

            if (rowData[choiceTextCol] !== undefined && rowData[choiceIsCorrectCol] !== undefined) {
              const isCorrect = rowData[choiceIsCorrectCol].toLowerCase() === 'true';
              choices.push({
                letter: choiceLetters[j],
                text: rowData[choiceTextCol],
                isCorrect: isCorrect,
              });
              if (isCorrect) {
                correctAnswerLetter = choiceLetters[j];
              }
            }
          }

          const questionObj = {
            question: rowData["Question"],
            choices: choices,
            rationale: rowData["Overall Rationale"],
            category: rowData["Category"],
            level: parseInt(rowData["Level"], 0),
            answer: correctAnswerLetter,
            difficulty: rowData["Difficulty"] || "Unknown"
          };
          newQuestionsFromCSV.push(questionObj);
        }
        setUploadedQuestions(newQuestionsFromCSV);
      };
      reader.readAsText(file);
    } else {
      setSelectedFile(null);
      setUploadedQuestions([]);
    }
  };

  const handleConfirmCSVUpload = () => {
    console.log("questions are", uploadedQuestions);
    
    if (uploadedQuestions.length === 0) {
      alert(
        "No questions parsed from the CSV file. Please check the file content and format."
      );
      return;
    }


    for (const question of uploadedQuestions) {
      if (
        !question.question.trim() ||
        question.choices.length === 0 ||
        !question.rationale.trim() ||
        !question.category.trim() ||
        isNaN(question.level)
      ) {
        alert("Please ensure all questions in the CSV have a question, choices, rationale, category, and a valid numeric level.");
        return;
      }
    }

    axios
      .post(`${API_URL}/addQuestion`, uploadedQuestions, {
        headers: {
          Authorization: `Bearer ${currentWebUser.token}`,
        },
      })
      .then(() => {
        alert("Questions from CSV added successfully!");
        setSelectedFile(null);
        setUploadedQuestions([]);

        Promise.all(
          uploadedQuestions.map((q) =>
            axios.post(`${API_URL}/addLogs`, {
              name: `${currentWebUser.firstName} ${currentWebUser.lastName}`,
              branch: currentWebUser.branch,
              action: "Add Question from CSV",
              description: `${currentWebUser.firstName} Added question "${q.question}" to category "${q.category}" from CSV upload.`,
            })
          )
        );
      })
      .catch((error) => {
        console.error("Error adding questions from CSV:", error);
        alert(`Failed to add questions from CSV. Please try again. Error: ${error.response?.data?.error?.message || error.message}`);
      });
  };

  useEffect(() => {
    getTotalQuestion();
    getTotalDeletedQuestion();
  }, []);

  const getTotalQuestion = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/getTotalQuestions`);
      setTotalQuestion(data);
      console.log("total quest", data);
    } catch (error) {
      console.error("Error fetching total questions:", error);
    }
  };

  const getTotalDeletedQuestion = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/getTotalDeletedQuestions`);
      setTotalDeletedQuestion(data);
      console.log("total deleted quest", data);
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
        `${API_URL}/getQuestionsWeb?${category ? `category=${category}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${currentWebUser.token}`,
          },
        }
      );
      console.log("category questions", data);
      
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
      await axios.put(
        `${API_URL}/deleteQuestion/${questionToDeleteId}`,
        {
          question_id: questionToDeleteId,
          is_deleted: true,
        },
        {
          headers: {
            Authorization: `Bearer ${currentWebUser.token}`,
          },
        }
      );
      setShowDeleteConfirmModal(false);
      setQuestionToDeleteId(null);
      queryClient.invalidateQueries(["questionsList", category]);
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const confirmRestoreQuestion = async () => {
    try {
      await axios.put(
        `${API_URL}/deleteQuestion/${questionToRestoreId}`,
        {
          question_id: questionToRestoreId,
          is_deleted: false,
        },
        {
          headers: {
            Authorization: `Bearer ${currentWebUser.token}`,
          },
        }
      );
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
    setSearchQuestion("");
  }

  



  function Category_Choices({ text, id, onClick, bgImage }) {
    return (
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
                  setEditingQuestion(data);  
                  setOriginalQuestion(JSON.parse(JSON.stringify(data))); 
                  setShowEditModal(true);
                }}
                className="btn-action"
              >
                Restore
              </button>
            </div>
          ) : (
            <div className="question-actions">
              <button
                className="btn-action"
                onClick={() => {
                  setEditingQuestion(JSON.parse(JSON.stringify(data))); 
                  setOriginalQuestion(JSON.parse(JSON.stringify(data))); 
                  setShowEditModal(true);  
                }}
              >
                Edit
              </button>


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
                  className="back-button cursor-pointer mt-5"
                  onClick={handleBack}
                >
                  <img src={back} alt="back arrow" className="back-icon" />
                </button>
                <h1 className="question-title">{selectedCat}</h1>
              </div>

              <div className="w-1/3 h-full mr-5">
                <p className="question-count text-right">
                  Total Questions: 
                  {showArchived ? totalDeletedQuestion.find((cat) => cat._id === subSelected)?.count || 0
                  : totalQuestion.find((cat) => cat._id === subSelected)?.count || 0}
                </p>
              </div>
            </div>
          ) : (
            <h1 className="question-title">Select Category</h1>
          )}
        </div>

        {gotSelected && (
          <div className="question-controls-container flex flex-col mt-5 mb-4">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div className="flex-1 min-w-[250px]">
                <div className="search-bar-question border">
                  <button className="search-btn-question">
                    <img src={search} alt="search icon" className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    placeholder="Search questions..."
                    className="search-input-question w-full"
                    onChange={(e) => setSearchQuestion(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <label className="bg-black cursor-pointer !text-white px-4 py-2 rounded">
                    Upload CSV
                    <input
                      type="file"
                      className="hidden"
                      accept=".csv"
                      onChange={handleFileChange}
                    />
                  </label>
                  {selectedFile && uploadedQuestions.length > 0 && (
                    <Buttons
                      text={`Upload ${uploadedQuestions.length} Questions`}
                      onClick={handleConfirmCSVUpload}
                      addedClassName="btn btn-primary"
                    />
                  )}
                  {selectedFile && uploadedQuestions.length === 0 && (
                    <p className="text-sm text-gray-500">Parsing CSV...</p>
                  )}
                </div>
                <Buttons
                  text={
                    <span className="flex items-center !text-white">
                      Add Question
                    </span>
                  }
                  onClick={addQuestion}
                  addedClassName="btn btn-warning !w-[200px] !text-white"
                />
                <div className="pb-2">
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

      <EditQuestion
        question={editingQuestion}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onChange={(field, value, idx) => {
          setEditingQuestion(prev => {
            if (!prev) return prev;
            const updated = { ...prev };

            if (field === "choiceText") {
              const choices = [...updated.choices];
              choices[idx] = { ...choices[idx], text: value };
              updated.choices = choices;
            } else if (field === "choiceRationale") {
              const choices = [...updated.choices];
              choices[idx] = { ...choices[idx], rationale: value };
              updated.choices = choices;
            } else {
              updated[field] = value;
            }
            return updated;
          });
        }}
        hasChanges={
          originalQuestion &&
          JSON.stringify(originalQuestion) !== JSON.stringify(editingQuestion)
        }
        queryClient={queryClient}
        category={category}   
      />

    </div>
  );
}