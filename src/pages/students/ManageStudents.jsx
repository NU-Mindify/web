// Cleaned-up ManageStudents and CardActiveContent component code

import "../../css/students/students.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_URL, branches, categories } from "../../Constants";
import AnimatedProgressBar from "../../components/animatedProgressBar/AnimatedProgressBar";
import { UserLoggedInContext } from "../../contexts/Contexts";
import SearchBar from "../../components/searchbar/SearchBar";
import download from "../../assets/leaderboard/file-export.svg";
import SelectFilter from "../../components/selectFilter/SelectFilter";
import searchIcon from "../../assets/students/search-01.svg";
import UserContentsTable from "../../components/tableForContents/UserContentsTable";
import Buttons from "../../components/buttons/Buttons";


export default function ManageStudents() {
  const { currentWebUser } = useContext(UserLoggedInContext);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [cardActive, setCardActive] = useState(null);
  const [sortOrder, setSortOrder] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState("disabled");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const { data } = await axios.get(`${API_URL}/getUsers`);
      const sortedStudents = data.sort((a, b) =>
        (a.last_name || "").localeCompare(b.last_name || "")
      );
      setStudents(sortedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoadingStudents(false);
    }
  };

  const filteredStudents = students
    .filter((student) => {
      const matchesSearch =
        student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_id?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBranch =
        selectedBranch === "" ||
        selectedBranch === "All" ||
        selectedBranch === "disabled"
          ? true
          : student.branch === selectedBranch;

      return matchesSearch && matchesBranch;
    })
    .sort((a, b) => {
      const comparison = a.last_name.localeCompare(b.last_name);
      return sortOrder ? comparison : -comparison;
    });

  const studentsPerPage = 10;
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const titles = [
    { key: "name", label: "Name", className: "flex flex-row items-center" },
    { key: "stud_id", label: "Student ID", className: "w-1/4" },
    { key: "branch", label: "Campus", className: "w-1/4" },
    { key: "action", label: "Action", className: "w-1/5" },
  ];

  const getBranchName = (branchId) =>
    branches.find((b) => b.id === branchId)?.name || "Unknown Branch";
  const toggleCard = (id) => setCardActive((prev) => (prev === id ? null : id));

  return (
    <div className="students-main-container">
      <div className="student-header">
        <h1 className="account-title flex flex-row items-center">
          View Students
        </h1>
        <div className="acc-sub-header-container">
          <SearchBar
            value={searchTerm}
            handleChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a student"
            icon={searchIcon}
            addedClassName="w-[80%] h-[50px]"
          />

          <SelectFilter
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            disabledOption="Select Branch"
            fixOption="All Branches"
            mainOptions={branches}
            getOptionValue={(branch) => branch.id}
            getOptionLabel={(branch) => branch.name}
            addedClassName="ml-3"
          />

          <img src={download} alt="export" className="acc-export-icon" />
        </div>
      </div>

      <UserContentsTable
        columns={4}
        data={currentStudents}
        titles={titles}
        sortOrderAsc={sortOrder}
        setSortOrderAsc={setSortOrder}
        isLoading={loadingStudents}
        cardActive={cardActive}
        toggleCard={toggleCard}
        getBranchName={getBranchName}
        cardActiveContent={CardActiveContent}
      />

      <div className="student-footer">
        <div className="student-pagination-container">
          <h1 className="text-black">
            Showing{" "}
            {filteredStudents.length === 0 ? 0 : indexOfFirstStudent + 1} to{" "}
            {Math.min(indexOfLastStudent, filteredStudents.length)} of{" "}
            {filteredStudents.length}
          </h1>
          <div className="join">
            <button
              className="join-item btn bg-white text-black"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || filteredStudents.length === 0}
            >
              «
            </button>
            <button className="join-item btn bg-white text-black" disabled>
              Page {currentPage}
            </button>
            <button
              className="join-item btn bg-white text-black"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={
                currentPage === totalPages || filteredStudents.length === 0
              }
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardActiveContent(student) {
  const [attempts, setAttempts] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [competitionModeData, setCompetitionModeData] = useState([]);
  const [masteryModeData, setMasteryModeData] = useState([]);
  const [reviewModeData, setReviewModeData] = useState([]);

  const studentId = student._id;

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setLoadingData(true);
        const { data } = await axios.get(
          `${API_URL}/getUserAttempts?user_id=${studentId}`
        );
        setAttempts(data);
        setCompetitionModeData(
          data.filter((data) => data.mode === "competition")
        );
        const masteryData = data.filter((data) => data.mode === "mastery");
        const hundredItemsOnly = masteryData.filter(
          (data) => data.total_items === 100
        );
        setMasteryModeData(hundredItemsOnly);
        setReviewModeData(data.filter((data) => data.mode === "review"));
      } catch (error) {
        console.error("Error fetching analytics data:", error.message);
      } finally {
        setLoadingData(false);
      }
    };
    if (studentId) fetchAttempts();
  }, [studentId]);

  const getClassicHighestScores = () => {
    const grouped = {};
    competitionModeData.forEach((attempt) => {
      const key = `${attempt.category}-${attempt.level}`;
      const score = attempt.correct / attempt.total_items;
      if (!grouped[key] || score > grouped[key].score) {
        grouped[key] = { ...attempt, score };
      }
    });
    return grouped;
  };

  const classicHighestScores = getClassicHighestScores();
  const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const getScoreColor = (score) => {
    if (score === 1) return "bg-green-500";
    if (score >= 0.8) return "bg-orange-300";
    if (score > 0) return "bg-gray-300";
    return "bg-white";
  };

  const getHighestMasteryScores = () => {
    const grouped = {};
    masteryModeData.forEach((attempt) => {
      const categoryId = attempt.category;
      const score = attempt.correct / attempt.total_items;
      if (!grouped[categoryId] || score > grouped[categoryId].score) {
        grouped[categoryId] = {
          ...attempt,
          score,
          percentage: Math.round(score * 100),
        };
      }
    });
    return grouped;
  };

  const highestMasteryScores = getHighestMasteryScores();

  return (
    <div className="text-black p-2">
      <h2 className="font-bold mb-2 text-white">Student Attempt Summary</h2>
      {loadingData ? (
        <div className="loading-overlay-accounts">
          <div className="spinner"></div>
          <p>Fetching data...</p>
        </div>
      ) : attempts.length === 0 ? (
        <div className="w-full flex justify-center items-center">
          <p>No attempts yet.</p>
        </div>
      ) : (
        <table className="w-full bg-transparent border-collapse">
          <thead>
            <tr className="!bg-transparent border-0">
              {categories.map((category) => (
                <th
                  key={category.id}
                  className="!bg-transparent !text-white !border-none"
                >
                  {category.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {categories.map((category) => (
                <td key={category.id}>
                  <h1>Classic</h1>
                  <div className="flex">
                    {levels.map((level) => {
                      const attemptKey = `${category.id}-${level}`;
                      const attempt = classicHighestScores[attemptKey];
                      const score = attempt ? attempt.correct : 0;
                      const total = attempt ? attempt.total_items : 0;
                      const color = getScoreColor(score / total);
                      return (
                        <div
                          key={level}
                          className={`w-[20px] h-[20px] mr-1 rounded-md ${color} text-xs text-center text-black flex items-center justify-center mt-2`}
                          title={`Stage ${level} - Score: ${score}/${total}`}
                        >
                          {score > 0 ? score : "-"}
                        </div>
                      );
                    })}
                  </div>

                  <h1 className="mt-2">Mastery</h1>
                  <div className="mt-1">
                    {(() => {
                      const masteryAttempt = highestMasteryScores[category.id];
                      // const score = masteryAttempt?.score ?? 0;
                      const percentage = masteryAttempt?.percentage ?? 0;
                      const total = masteryAttempt?.total_items ?? 0;
                      const correct = masteryAttempt?.correct ?? 0;

                      let color = "bg-gray-500";
                      if (percentage === 100) {
                        color = "bg-green-500";
                      } else if (percentage >= 80) {
                        color = "bg-orange-300";
                      } else if (percentage > 0) {
                        color = "bg-gray-500 text-white";
                      } else {
                        color = "bg-white";
                      }

                      return (
                        <div className="w-full flex items-center justify-center">
                          <div className="w-11/12 h-5 bg-gray-200 rounded-md overflow-hidden">
                            <div
                              className={`h-full ${color} text-sm text-black text-center`}
                              style={{ width: `${percentage}%` }}
                              title={`Score: ${correct}/${total} (${percentage}%)`}
                            >
                              {percentage > 0 ? `${percentage}%` : ""}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td colSpan={5} className="pt-3">
                <div className="w-full flex items-center justify-center">
                  <Buttons 
                    text="Show More Details"
                    onClick={() => alert("More details coming soon!")}
                    addedClassName="btn btn-warning !w-[250px]"
                    disabled={loadingData}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
