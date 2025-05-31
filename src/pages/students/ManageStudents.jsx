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
import ExportDropdown from "../../components/ExportDropdown/ExportDropdown";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/logo/logo.png";
import { useNavigate } from "react-router";

export default function ManageStudents() {
  const { currentWebUser } = useContext(UserLoggedInContext);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [cardActive, setCardActive] = useState(null);
  const [sortOrder, setSortOrder] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState("disabled");
  const [currentPage, setCurrentPage] = useState(1);

  const [showArchived, setShowArchived] = useState(false);


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

      const matchesArchived = showArchived ? student.is_deleted : !student.is_deleted;
      return matchesSearch && matchesBranch && matchesArchived;
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

  //EXPORT TO CSV
  const exportToCSV = (data, filename) => {
    const now = new Date().toLocaleString();
    const headers = ["Name", "Student ID", "Campus"];
    const rows = data.map((student) => {
      const firstName = student.first_name || "";
      const lastName = student.last_name || "";
      const fullName = `${lastName.toUpperCase()} ${firstName}`.trim();

      return [
        fullName,
        student.student_id,
        branches.find((branch) => branch.id === student.branch)?.name || "N/A",
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        `Exported by: ${currentWebUser.firstName} ${currentWebUser.lastName}`,
        `Exported on: ${now}`,
        "",
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${filename}_by_${currentWebUser.firstName} ${currentWebUser.lastName}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //convert logo to base64 para lumabas sa pdf
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

  //EXPORT TO PDF
  const exportToPDF = async (data, title) => {
    const logoBase64 = await getBase64FromUrl(logo);
    const now = new Date().toLocaleString();
    const doc = new jsPDF();
    doc.text(`${title}`, 14, 10);
    doc.text(
      `Exported by: ${currentWebUser.firstName} ${currentWebUser.lastName}`,
      14,
      18
    );
    doc.text(`Exported on: ${now}`, 14, 26);

    const pageWidth = doc.internal.pageSize.getWidth();
    const logoWidth = 30;
    const logoHeight = 15;
    const xPos = pageWidth - logoWidth - 10;
    doc.addImage(logoBase64, "PNG", xPos, 10, logoWidth, logoHeight);

    const rows = data.map((student) => {
      const fullName = `${(student.last_name || "").toUpperCase()} ${
        student.first_name || ""
      }`.trim();
      const studentId = student.student_id || "";
      const campus =
        branches.find((branch) => branch.id === student.branch)?.name || "N/A";

      return [fullName, studentId, campus];
    });

    autoTable(doc, {
      head: [["Name", "Student ID", "Campus"]],
      body: rows,
      startY: 30,
    });

    doc.save(
      `${title.replace(" ", "_")}_by_${currentWebUser.firstName}_${
        currentWebUser.lastName
      }.pdf`
    );
  };

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

          <ExportDropdown
            onExport={(format) => {
              if (format === "csv") {
                exportToCSV(filteredStudents, "Students_List");
              } else if (format === "pdf") {
                exportToPDF(filteredStudents, "Students_List");
              }
            }}
          />
        </div>
       
      </div>
        <div className="flex bg-gray-100 p-1 rounded-xl w-[500px]">
          <button 
            onClick={() => setShowArchived(false)}
            className={`all-archive-btn ${showArchived || "active" } w-1/2`}>
            Show All Students
          </button>

          <button 
            onClick={() => setShowArchived(true)}
            className={`all-archive-btn ${showArchived && "active" } w-1/2`}>
            Archive Students
          </button>
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
  const [loadingData, setLoadingData] = useState(false);
  const [competitionModeData, setCompetitionModeData] = useState([]);
  const [masteryModeData, setMasteryModeData] = useState([]);
  const [reviewModeData, setReviewModeData] = useState([]);
  const { currentWebUser } = useContext(UserLoggedInContext);

  const studentId = student._id;

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setLoadingData(true);
        const { data } = await axios.get(
          `${API_URL}/getUserAttempts?user_id=${studentId}`
        );
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

  const navigate = useNavigate();
  const [masteryPercentage, setMasteryPercentage] = useState(0);

  return (
    <div className="text-black p-2">
      {loadingData ? (
        <div className="loading-overlay-accounts">
          <div className="spinner"></div>
          <p>Fetching data...</p>
        </div>
      ) : (
        <table className="w-full border-collapse mt-2 bg-transparent">
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
                  <h1 className="mt-4">Competition</h1>
                  <div className="flex justify-center items-center">
                    {levels.map((level) => {
                      const attemptKey = `${category.id}-${level}`;
                      const attempt = classicHighestScores[attemptKey];
                      const score = attempt ? attempt.correct : 0;
                      const total = attempt ? attempt.total_items : 0;
                      const color = getScoreColor(score / total);
                      return (
                        <div
                          key={level}
                          className={`w-[20px] h-[20px] mr-1 rounded-md ${color} text-xs text-center text-black flex items-center justify-center mt-2 border border-black`}
                          title={`Stage ${level} - Score: ${score}/${total}`}
                        >
                          {score > 0 ? score : ""}
                        </div>
                      );
                    })}
                  </div>

                  <div className="w-full flex justify-between items-center pr-4 mt-4">
                    <h1>Mastery</h1>
                    <h1>
                      {highestMasteryScores[category.id]?.percentage ?? 0}%
                    </h1>
                  </div>

                  <div className="mt-1">
                    {(() => {
                      const masteryAttempt = highestMasteryScores[category.id];
                      // const score = masteryAttempt?.score ?? 0;
                      const percentage = masteryAttempt?.percentage ?? 0;
                      const total = masteryAttempt?.total_items ?? 0;
                      const correct = masteryAttempt?.correct ?? 0;

                      let color = "bg-white";
                      if (percentage === 100) {
                        color = "bg-green-500";
                      } else if (percentage >= 80) {
                        color = "bg-orange-300";
                      } else if (percentage > 0) {
                        color = "bg-gray-500 text-white";
                      }

                      return (
                        <div className="w-full flex items-center justify-center">
                          <div className="w-11/12 h-5 bg-gray-200 rounded-md overflow-hidden  border border-black">
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
                <div className="w-full flex items-center justify-center mt-3">
                  <Buttons
                    text="View Student Details"
                    onClick={async () => {
                      await axios.post(`${API_URL}/addLogs`, {
                        name: `${currentWebUser.firstName} ${currentWebUser.lastName}`,
                        branch: currentWebUser.branch,
                        action: "View Student Details",
                        description: `${currentWebUser.firstName} viewed the details of ${student.last_name}, ${student.first_name}`,
                      });

                      navigate("/students/overall", {
                        state: {
                          competitionData: competitionModeData,
                          masteryData: masteryModeData,
                          reviewData: reviewModeData,
                          studentFirstName: student.first_name,
                          studentLastName: student.last_name,
                          studentId: student.student_id,
                          studentBranch: student.branch,
                        },
                      });
                    }}
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
