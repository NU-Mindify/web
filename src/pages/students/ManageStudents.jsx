// Cleaned-up ManageStudents and CardActiveContent component code

import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import logo from "../../assets/logo/logo.png";
import searchIcon from "../../assets/students/search-01.svg";
import Buttons from "../../components/buttons/Buttons";
import ExportDropdown from "../../components/ExportDropdown/ExportDropdown";
import SearchBar from "../../components/searchbar/SearchBar";
import SelectFilter from "../../components/selectFilter/SelectFilter";
import UserContentsTable from "../../components/tableForContents/UserContentsTable";
import { API_URL, branches, categories } from "../../Constants";
import { UserLoggedInContext } from "../../contexts/Contexts";
import "../../css/students/students.css";

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

  const [confirmUserDelete, setConfirmUserDelete] = useState(null);
  const [confirmUnarchive, setConfirmUnarchive] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, [currentWebUser]);

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const { data } = await axios.get(`${API_URL}/getUsers`, {
        headers: {
          Authorization: `Bearer ${currentWebUser.token}`,
        },
      });
      const sortedStudents = data.sort((a, b) =>
        (a.last_name || "").localeCompare(b.last_name || "")
      );
      setStudents(sortedStudents);

      setCardActive(null);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoadingStudents(false);
    }
  };

  const filteredStudents = students
    .filter((student) => {
      // console.log("STUDENT CLOTH: "+student.cloth);
      const matchesSearch =
        student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_id?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBranch =
        selectedBranch === "" ||
        selectedBranch === "all" ||
        selectedBranch === "disabled"
          ? true
          : student.branch === selectedBranch;

      const matchesArchived = showArchived
        ? student.is_deleted
        : !student.is_deleted;
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



  const handleArchiveClick = (student, action) => {
    if (action === "archive") {
      setConfirmUserDelete(student);
    } else {
      setConfirmUnarchive(student);
     }
   };

  const handleConfirmDelete = async () => {
    if (!confirmUserDelete) return;
    try {
      // Optimistically update UI
      setStudents((prev) =>
        prev.map((s) =>
          s._id === confirmUserDelete._id ? { ...s, is_deleted: true } : s
        )
      );

      await axios.put(`${API_URL}/deleteUser/${confirmUserDelete._id}`, {
        user_id: confirmUserDelete._id,
        is_deleted: true,
      });

      const firstName = confirmUserDelete.first_name || confirmUserDelete.firstName || "";
      const lastName = confirmUserDelete.last_name || confirmUserDelete.lastName || "";

      await axios.post(`${API_URL}/addLogs`, {
        name: `${currentWebUser.first_name || currentWebUser.firstName} ${currentWebUser.last_name || currentWebUser.lastName}`,
        branch: currentWebUser.branch,
        action: "Archived a Student",
        description: `${currentWebUser.first_name || currentWebUser.firstName} archived ${firstName} ${lastName}'s account.`,
        position: currentWebUser.position,
        useravatar: currentWebUser.useravatar,
      });

      await fetchStudents(); // extra sync
    } catch (error) {
      console.error("Error archiving user:", error);
    } finally {
      setConfirmUserDelete(null);
    }
  };

  const handleUnarchiveUser = async () => {
    if (!confirmUnarchive) return;
    try {
      // Optimistically update UI
      setStudents((prev) =>
        prev.map((s) =>
          s._id === confirmUnarchive._id ? { ...s, is_deleted: false } : s
        )
      );

      await axios.put(`${API_URL}/deleteUser/${confirmUnarchive._id}`, {
        user_id: confirmUnarchive._id,
        is_deleted: false,
      });

      const firstName = confirmUnarchive.first_name || confirmUnarchive.firstName || "";
      const lastName = confirmUnarchive.last_name || confirmUnarchive.lastName || "";

      await axios.post(`${API_URL}/addLogs`, {
        name: `${currentWebUser.first_name || currentWebUser.firstName} ${currentWebUser.last_name || currentWebUser.lastName}`,
        branch: currentWebUser.branch,
        action: "Unarchived a Student",
        description: `${currentWebUser.first_name || currentWebUser.firstName} unarchived ${firstName} ${lastName}'s account.`,
        position: currentWebUser.position,
        useravatar: currentWebUser.useravatar,
      });

      await fetchStudents(); 
    } catch (error) {
      console.error("Error unarchiving user:", error);
    } finally {
      setConfirmUnarchive(null);
    }
  };


  return (
    <div className="students-main-container">
      <div className="student-header">
        <h1 className="student-title flex flex-row items-center">
          View Students
        </h1>
        <div className="stud-sub-header-container">
          <SearchBar
            value={searchTerm}
            handleChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a student"
            icon={searchIcon}
            addedClassName="w-[80%] h-[50px] ml-1"
          />

          <div className="flex gap-2">
            {currentWebUser.position.toLowerCase() === "super admin" && (
              <SelectFilter
                ariaLabel="Filter by Branch"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                disabledOption="Select Branch"
                fixOption="All Branches"
                mainOptions={branches}
                getOptionValue={(branch) => branch.id}
                getOptionLabel={(branch) => branch.name}
                addedClassName="ml-3"
              />
            )}

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
      </div>
      <div className="flex bg-gray-100 p-1 rounded-xl w-[300px] ml-4 mb-8">
        <button
          onClick={() => setShowArchived(false)}
          className={`all-archive-btn ${showArchived || "active"} w-1/2`}
        >
          All Students
        </button>

        <button
          onClick={() => setShowArchived(true)}
          className={`all-archive-btn ${showArchived && "active"} w-1/2`}
        >
          Archive
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
        cardActiveContent={(student) => (
          <CardActiveContent
            student={student}
            fetchUsers={fetchStudents}
            setCardActive={setCardActive}
          />
        )}
        onArchiveClick={handleArchiveClick} 
      />

      {confirmUnarchive && (
        <div className="modal-overlay confirm-delete-popup !w-[100%] !h-[100%]">
          <div className="confirm-dialog !h-auto min-h-[180px] max-h-[300px]">
            <h2>Confirm Unarchive</h2>
            <p className="text-black text-[13px]">
              Are you sure you want to unarchive "
              <strong>
                {confirmUnarchive.first_name || confirmUnarchive.firstName}{" "}
                {confirmUnarchive.last_name || confirmUnarchive.lastName}
              </strong>
              "?
            </p>
            <div className="popup-buttons">
              <Buttons
                text="Yes, Unarchive"
                addedClassName="btn btn-delete"
                onClick={handleUnarchiveUser}
              />
              <Buttons
                text="Cancel"
                addedClassName="btn btn-cancel"
                onClick={() => setConfirmUnarchive(null)}
              />
            </div>
          </div>
        </div>
      )}

      {confirmUserDelete && (
        <div className="modal-overlay confirm-delete-popup !w-[100%] !h-[100%]">
          <div className="confirm-dialog !h-auto min-h-[180px] max-h-[300px]">
            <h2>Confirm Archive</h2>
            <p className="text-black text-[13px]">
              Are you sure you want to archive "
              <strong>
                {confirmUserDelete.first_name || confirmUserDelete.firstName}{" "}
                {confirmUserDelete.last_name || confirmUserDelete.lastName}
              </strong>
              "?
            </p>
            <div className="popup-buttons">
              <Buttons
                text="Yes, Archive"
                addedClassName="btn btn-delete"
                onClick={handleConfirmDelete}
              />
              <Buttons
                text="Cancel"
                addedClassName="btn btn-cancel"
                onClick={() => setConfirmUserDelete(null)}
              />
            </div>
          </div>
        </div>
      )}


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

function CardActiveContent({ student, fetchUsers, setCardActive }) {
  const [loadingData, setLoadingData] = useState(false);
  const [competitionModeData, setCompetitionModeData] = useState([]);
  const [masteryModeData, setMasteryModeData] = useState([]);
  const [reviewModeData, setReviewModeData] = useState([]);
  const { currentWebUser } = useContext(UserLoggedInContext);
  const [userBadges, setUserBadges] = useState([]);
  const [recentAct, setRecentAct] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);

  const studentId = student._id;

  console.log("STUDENT ID:", studentId);
  
  
  useEffect(() => {
    async function fetchRecentSessions(){
      try{
        const {data} = await axios.get(`${API_URL}/getRecentSessions?id=${studentId}`);
        setRecentSessions(data);
        console.log("recent sessions", data);
      }
      catch(error){
        console.error("Error fetching recent sessions:", error.message);
      }
    }

    if(studentId) fetchRecentSessions();
  }, [studentId]);

  
  

  useEffect(() => {
    const fetchRecentAttempts = async () => {
      try {
        setLoadingData(true);
        const { data } = await axios.get(
          `${API_URL}/getUserRecentAttempts?user_id=${studentId}`
        );
        setRecentAct(data);
        console.log("recent", data);
        

      } catch (error) {
        console.error("Error fetching student data:", error.message);
      } finally {
        setLoadingData(false);
      }
    };
    if (studentId) fetchRecentAttempts();
  }, [studentId]);


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
        console.error("Error fetching student data:", error.message);
      } finally {
        setLoadingData(false);
      }
    };
    if (studentId) fetchAttempts();
  }, [studentId]);

  useEffect(() => {
    fetchUserBadges();
  }, []);

  const fetchUserBadges = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/getUserBadges?user_id=${studentId}`
      );
      setUserBadges(data);
      console.log("badges", data);
    } catch (error) {
      console.error("Error fetching user badges:", error.message);
    }
  };

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
  

 

  return (
    <>
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
                            title={`Stage ${level} - ${score}/${total} (${Math.round(
                              (score / total) * 100
                            )}%)`}
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
                        const masteryAttempt =
                          highestMasteryScores[category.id];
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
                  <div className="w-full flex justify-around px-20 mt-5">
                    <Buttons
                      text="View Student Details"
                      onClick={async () => {
                        console.log("ITEMS", student.items);
                        navigate("/students/overall", {
                          state: {
                            competitionData: competitionModeData,
                            masteryData: masteryModeData,
                            reviewData: reviewModeData,
                            studentFirstName: student.first_name,
                            studentLastName: student.last_name,
                            studentId: student.student_id,
                            studentBranch: student.branch,
                            studentBadges: userBadges,
                            recentAct: recentAct,
                            studentAvatar: student.avatar,
                            studentCloth: student.cloth,
                            studentItems: student.items,
                            studentSessions: recentSessions
                          },
                        });
                      }}
                      addedClassName="btn btn-warning !w-[250px] bg-[#FFBF1A] hover:brightness-105 !text-black font-[Poppins]"
                      disabled={loadingData}
                    />

                    {/* {student.is_deleted ? (
                      <Buttons
                        text="Unarchive Student"
                        onClick={() => {
                          setUnarchiveUser(!unarchiveUser);
                        }}
                        addedClassName="btn btn-error ml-20 !w-[250px]"
                      />
                    ) : (
                      <Buttons
                        text="Archive Student"
                        onClick={() => {
                          setConfirmDeleteuser(!confirmDeleteUser);
                        }}
                        addedClassName="btn btn-error ml-20"
                      />
                    )} */}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* {confirmDeleteUser && (
        <div className="modal-overlay confirm-delete-popup !w-[100%] !h-[100%] flex items-center justify-center">
          <div className="confirm-dialog flex justify-center items-center flex-col">
            <h2>Confirm Archive</h2>
            <p className="text-black text-base">
              Are you sure you want to archive "
              <strong>
                {student.first_name} {student.last_name}
              </strong>
              "?
            </p>
            <div className="popup-buttons">
              <Buttons
                text="Yes, Archive"
                addedClassName="btn btn-delete"
                onClick={handleDeleteStudent}
              />
              <Buttons
                text="Cancel"
                addedClassName="btn btn-cancel"
                onClick={() => {
                  setConfirmDeleteuser(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {unarchiveUser && (
        <div className="modal-overlay confirm-delete-popup !w-[100%] !h-[100%] flex items-center justify-center">
          <div className="confirm-dialog flex justify-center items-center flex-col">
            <h2>Confirm Unarchive</h2>
            <p className="text-black text-base">
              Are you sure you want to unarchive "
              <strong>
                {student.first_name} {student.last_name}
              </strong>
              "?
            </p>
            <div className="popup-buttons">
              <Buttons
                text="Yes, Unarchive"
                addedClassName="btn btn-delete"
                onClick={handleUnarchiveStudent}
              />
              <Buttons
                text="Cancel"
                addedClassName="btn btn-cancel"
                onClick={() => {
                  setConfirmDeleteuser(false);
                }}
              />
            </div>
          </div>
        </div>
      )} */}
    </>
  );
}
