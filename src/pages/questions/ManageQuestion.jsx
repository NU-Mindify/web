/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import logo from "../../assets/logo/logo.png";
import abnormal from "../../assets/questions/abnormal.png";
import back from "../../assets/questions/angle-left.svg";
import developmental from "../../assets/questions/developmental.png";
import general from "../../assets/questions/generalBG.png";
import industrial from "../../assets/questions/industrial.png";
import psychological from "../../assets/questions/psychologicalBG.png";
import search from "../../assets/search/search.svg";
import { API_URL, categories } from "../../Constants";
import "../../css/questions/questions.css";
import EditQuestion from "./EditQuestion";

import { useQueryClient } from "@tanstack/react-query";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Buttons from "../../components/buttons/Buttons";
import ExportDropdown from "../../components/ExportDropdown/ExportDropdown";
import { ActiveContext, UserLoggedInContext } from "../../contexts/Contexts";

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
  

  const { subSelected, setSubSelected, } = useContext(ActiveContext);
  

  const [totalQuestion, setTotalQuestion] = useState([]);
  const [totalDeletedQuestion, setTotalDeletedQuestion] = useState([]);

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [questionToDeleteId, setQuestionToDeleteId] = useState(null);

  const [showRestoreConfirmModal, setShowRestoreConfirmModal] = useState(false);
  const [questionToRestoreId, setQuestionToRestoreId] = useState({});

  const queryClient = useQueryClient();
  const [showEditModal, setShowEditModal] = useState(false);


  const [editingQuestion, setEditingQuestion] = useState(null);
  const [originalQuestion, setOriginalQuestion] = useState(null);



  useEffect(() => {
    getTotalQuestion();
    getTotalDeletedQuestion();
  }, []);

  const getTotalQuestion = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/getTotalQuestions`);
      setTotalQuestion(data);
      // console.log("total quest", data);
    } catch (error) {
      console.error("Error fetching total questions:", error);
    }
  };

  const getTotalDeletedQuestion = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/getTotalDeletedQuestions`);
      setTotalDeletedQuestion(data);
      // console.log("total deleted quest", data);
    } catch (error) {
      console.error("Error fetching total questions:", error);
    }
  };

  const [category, setCategory] = useState(null);
  const [gotSelected, setGotSelected] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);

  const location = useLocation();
  useEffect(() => {
    const isSelected = location.state?.gotSelected;
    const category = location.state?.category;
    const categoryName = location.state?.categoryName;
    const catSelected = location.state?.catSelected;

    if (category && catSelected) {
      setCategory(category);
      setGotSelected(isSelected || true);
      setSelectedCat(categoryName);
    }
  }, [location.state]);

  const navigate = useNavigate();

  const [searchQuestion, setSearchQuestion] = useState("");

  

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
      // console.log("category questions", data);

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

  const [newestSort, setNewestSort] = useState("newest");

  function handleSortingByDate(e) {
    const value = e.target.value;
    setNewestSort(value);
  }

  const [difficultySort, setDifficultySort] = useState("");

  function handleSortingByDifficulty(e) {
    const value = e.target.value;
    setDifficultySort(value);
  }

  const confirmDeleteQuestion = async () => {
    try {
      await axios.put(
        `${API_URL}/deleteQuestion/${questionToDeleteId._id}`,
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

      axios.post(`${API_URL}/addLogs`, {
        name: `${currentWebUser.firstName} ${currentWebUser.lastName}`,
        branch: currentWebUser.branch,
        action: "Delete Question",  
        description: `${currentWebUser.firstName} deleted the question ${questionToDeleteId.question}.`,
        position: currentWebUser.position,
        useravatar: currentWebUser.useravatar,
      })
      queryClient.invalidateQueries(["questionsList", category]);
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const confirmRestoreQuestion = async () => {

    console.log("to be restore",questionToRestoreId);
    
    try {
      await axios.put(
        `${API_URL}/deleteQuestion/${questionToRestoreId._id}`,
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
        axios.post(`${API_URL}/addLogs`, {
        name: `${currentWebUser.firstName} ${currentWebUser.lastName}`,
        branch: currentWebUser.branch,
        action: "Unarchive Question",  
        description: `${currentWebUser.firstName} unarchived the question ${questionToRestoreId.question}.`,
        position: currentWebUser.position,
        useravatar: currentWebUser.useravatar,
      })
      setQuestionToRestoreId({});
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

  const handlesUnapprove = () => {


    navigate("/unapproved", {
      state: {
        category: category,
        categoryName: selectedCat,
      },
    });
  };

  const getBase64FromUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const exportQuestionsToPDF = async (questions, title) => {
    let logoBase64 = "";
    try {
      logoBase64 = await getBase64FromUrl(logo);
    } catch (error) {
      console.error("Error converting logo:", error);
    }

    // Difficulty mapping
    const difficultyMap = {
      easy: "Easy",
      average: "Average",
      difficult: "Difficult",
    };

    const now = new Date().toLocaleString();
    const doc = new jsPDF("p", "mm", "a4");

    doc.setFontSize(14);
    doc.text(`${title}`, 14, 10);
    doc.setFontSize(10);
    doc.text(
      `Exported by: ${currentWebUser.firstName} ${currentWebUser.lastName}`,
      14,
      18
    );
    doc.text(`Exported on: ${now}`, 14, 24);

    // Logo in top-right
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoWidth = 30;
    const logoHeight = 15;
    const xPos = pageWidth - logoWidth - 10;
    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", xPos, 8, logoWidth, logoHeight);
    }

    // Convert questions → table
    const rows = questions.map((q) => {
      const choicesText = q.choices
        .map(
          (c) =>
            `${c.letter}. ${c.text} (${c.rationale || "No rationale"}) ${
              c.letter === q.answer ? "✅" : ""
            }`
        )
        .join("\n");

      return [
        q.item_number || "", // Item #
        q.question,
        categories.find((cat) => cat.id === q.category)?.name || "",
        choicesText,
        difficultyMap[q.difficulty?.toLowerCase()] || "", // Map difficulty
        q.timer || "",
        q.rationale || "",
      ];
    });

    autoTable(doc, {
      head: [
        [
          "Item #",
          "Question",
          "Category",
          "Choices (with rationale, correct marked ✅)",
          "Difficulty",
          "Timer",
          "Overall Rationale",
        ],
      ],
      body: rows,
      startY: 30,
      styles: { fontSize: 5, cellWidth: "wrap" },
      columnStyles: {
        0: { cellWidth: 10 }, 
        1: { cellWidth: 40 }, 
        3: { cellWidth: 70 },
      },
    });

    doc.save(
      `${title.replace(/\s+/g, "_")}_by_${currentWebUser.firstName}_${
        currentWebUser.lastName
      }.pdf`
    );
  };

  const exportQuestionsToCSV = (questions, filename) => {
    const now = new Date().toLocaleString();

    // Difficulty mapping
    const difficultyMap = {
      easy: "Easy",
      average: "Average",
      difficult: "Difficult",
    };

    // CSV headers (removed "Level")
    const headers = [
      "Question",
      "Category",
      "Choice A (Text)",
      "Choice A (Rationale)",
      "Choice B (Text)",
      "Choice B (Rationale)",
      "Choice C (Text)",
      "Choice C (Rationale)",
      "Choice D (Text)",
      "Choice D (Rationale)",
      "Answer",
      "Difficulty",
      "Timer",
      "Overall Rationale",
    ];

    // CSV-safe cell sanitizer
    const sanitize = (cell) => {
      if (cell === null || cell === undefined) return "";
      let str = String(cell);

      // Escape double quotes by doubling them
      str = str.replace(/"/g, '""');

      // Wrap in quotes if contains comma, quote, or newline
      if (/[",\n]/.test(str)) {
        str = `"${str}"`;
      }
      return str;
    };

    const rows = questions.map((q) => {
      // Always enforce A–D order
      const choicesMap = { a: {}, b: {}, c: {}, d: {} };
      q.choices.forEach((c) => {
        choicesMap[c.letter?.toLowerCase()] = c;
      });

      return [
        q.question,
        categories.find((cat) => cat.id === q.category)?.name || q.category,
        choicesMap.a?.text || "",
        choicesMap.a?.rationale || "",
        choicesMap.b?.text || "",
        choicesMap.b?.rationale || "",
        choicesMap.c?.text || "",
        choicesMap.c?.rationale || "",
        choicesMap.d?.text || "",
        choicesMap.d?.rationale || "",
        q.answer || "",
        difficultyMap[q.difficulty?.toLowerCase()] || "",
        q.timer || "",
        q.rationale || "",
      ].map(sanitize);
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        `Exported by: ${currentWebUser.firstName} ${currentWebUser.lastName}`,
        `Exported on: ${now}`,
        "",
        headers.map(sanitize).join(","), // headers safe
        ...rows.map((row) => row.join(",")),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${filename}_by_${currentWebUser.firstName}_${currentWebUser.lastName}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function Category_Choices({ text, id, onClick, bgImage }) {
    return (
      <button className="category-container" onClick={onClick} key={id}>
        <img src={bgImage} className="category-bg" alt="bgImages" />
        <h1 className="category-text">{text}</h1>
        <p className="category-quantity">
          Questions:{" "}
          {totalQuestion.find((category) => category._id === id)?.count || 0}
        </p>
      </button>
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
                <div className="rationale-box">
                  <div>
                    <strong>Rationale:</strong>
                  </div>
                  <div>{choice.rationale || "N/A"}</div>
                </div>
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
                <strong>ITEM NUMBER:</strong> {data.item_number || "N/A"}
              </div>
              <div>
                <strong>TIME:</strong> {data.timer}s
              </div>
              <div>
                <strong>DIFFICULTY:</strong>{" "}
                {data.difficulty
                  ? data.difficulty.charAt(0).toUpperCase() +
                    data.difficulty.slice(1)
                  : ""}
              </div>
            </div>
          </div>
          {showArchived ? (
            <div className="question-actions">
              <button 
                className="btn w-[100px] rounded-xl bg-[#FFBF1A] hover:brightness-105 !text-black font-[Poppins]"
                onClick={() => {
                  setEditingQuestion(data);
                  setOriginalQuestion(JSON.parse(JSON.stringify(data)));
                  setShowEditModal(true);
                }}
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setShowRestoreConfirmModal(true)
                  setQuestionToRestoreId(data)
                }}
                className="btn-action bg-[#FFBF1A] hover:brightness-105 !text-black font-[Poppins]
"
              >
                Restore
              </button>
            </div>
          ) : (
            <div className="question-actions">
              <button
                className="btn-action bg-[#FFBF1A] hover:brightness-105 !text-black font-[Poppins]
"
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
                  setQuestionToDeleteId(data);
                  setShowDeleteConfirmModal(true);
                }}
                className="btn-action bg-[#FFBF1A] hover:brightness-105 !text-black font-[Poppins]
"
              >
                Archive
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
                  {showArchived
                    ? totalDeletedQuestion.find(
                        (cat) => cat._id === subSelected
                      )?.count || 0
                    : totalQuestion.find((cat) => cat._id === subSelected)
                        ?.count || 0}
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
                
                <Buttons
                  text={
                    <span className="flex flex-wrap justify-center sm:justify-between items-center w-full mt-3 gap-2 lg:w-auto lg:mt-0">
                      Add Question
                    </span>
                  }
                  onClick={addQuestion}
                  addedClassName="btn btn-warning !w-[200px] text-black bg-[#FFBF1A] hover:brightness-105 !text-black font-[Poppins]"
                />

                <div className="pb-2">
                  <ExportDropdown
                    onExport={(format) => {
                      if (format === "csv") {
                        exportQuestionsToCSV(questions, "Questions");
                      } else if (format === "pdf") {
                        exportQuestionsToPDF(questions, "Questions");
                      }
                    }}
                  />
                </div>
              </div>
            </div>

           <div className="flex flex-wrap items-center gap-4 w-full">
            {/* Left side group */}
            <div className="flex bg-gray-100 p-1 rounded-xl w-[300px]">
              <button
                onClick={() => setShowArchived(false)}
                className={`all-archive-btn ${showArchived || "active"} w-1/2`}
              >
                All Questions
              </button>

              <button
                onClick={() => setShowArchived(true)}
                className={`all-archive-btn ${showArchived && "active"} w-1/2`}
              >
                Archive
              </button>
            </div>

            <div className="sort-container relative">
              <select
                id="sort"
                className="sort-select pl-8"
                onChange={handleSortingByDate}
              >
                <option value="" disabled selected hidden>
                  Sort by:
                </option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            <div className="sort-container relative">
              <select
                id="filter"
                className="sort-select pl-8"
                onChange={handleSortingByDifficulty}
              >
                <option value="" disabled selected hidden>
                  Filter By Difficulty:
                </option>
                <option value="easy">Easy</option>
                <option value="average">Average</option>
                <option value="difficult">Difficult</option>
              </select>
            </div>

            {/* Right side button */}
            <div className="ml-auto">

            {currentWebUser.position.toLowerCase() === "professor" ?
              <>
              </>
             :
              <button 
                onClick={handlesUnapprove} 
                className="px-4 h-10 bg-[#FFBF1A] font-bold text-black rounded-xl 
                          hover:brightness-105 transition cursor-pointer"
              >
                Show Unapproved Questions
              </button>
             }
              
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

                    const matchDifficulty =
                      !difficultySort ||
                      question.difficulty?.toLowerCase() === difficultySort;

                    return matchArchived && matchSearch && matchDifficulty;
                  })
                  .sort((a, b) => {
                    if (newestSort === "newest") {
                      return b._id.localeCompare(a._id);
                    } else if (newestSort === "oldest") {
                      return a._id.localeCompare(b._id);
                    }
                    return 0;
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
              <h2>Archive Confirmation</h2>
            </div>
            <p>Are you sure you want to archive this question?</p>
            <div className="popup-buttons">
              <button className="btn-delete" onClick={confirmDeleteQuestion}>
                Yes, Archive
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
          setEditingQuestion((prev) => {
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
