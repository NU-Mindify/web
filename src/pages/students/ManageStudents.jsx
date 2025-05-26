import "../../css/students/students.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_URL, branches, categories, modes, levels } from "../../Constants";
import AnimatedProgressBar from "../../components/animatedProgressBar/AnimatedProgressBar";
import { UserLoggedInContext } from "../../contexts/Contexts";
import SearchBar from "../../components/searchbar/SearchBar";
import download from "../../assets/leaderboard/file-export.svg";
import SelectFilter from "../../components/selectFilter/SelectFilter";
import searchIcon from "../../assets/students/search-01.svg";
import UserContentsTable from "../../components/tableForContents/UserContentsTable";


export default function ManageStudents() {
  const { currentWebUser } = useContext(UserLoggedInContext);

  const [students, setStudents] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [attempts, setAttempts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [cardActive, setCardActive] = useState(null);
  const [sortOrder, setSortOrder] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState("disabled");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchStudents();
    fetchAllProgress();
    fetchAttempts();
  }, []);

  // FETCH STUDENTS DATA
  // name, email, stud number, ID, branch
  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const { data } = await axios.get(`${API_URL}/getUsers`);
      const sortedStudents = data.sort((a, b) =>
        a.last_name.localeCompare(b.last_name)
      );
      setStudents(sortedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoadingStudents(false);
    }
  };

  // FETCH PROGRESS DATA
  // user ID, kung anong stage na sya
  const fetchAllProgress = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/getAllProgress`);
      const mapped = data.reduce((acc, entry) => {
        acc[entry.user_id] = entry;
        return acc;
      }, {});
      setProgressData(mapped);
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  // FETCH ATTEMPTS DATA
  // user ID, level ng attempt nya, category non, correct and wrong, time completion, mode non, tas kung kelan nya nasagotan
  const fetchAttempts = async () => {
    try {
      const categoryList = categories.map((c) => c.category).join(",");
      const levelList = levels.join(",");
      const modeList = modes.map((m) => m.mode).join(",");

      const { data } = await axios.get(`${API_URL}/getAnalytics`, {
        params: { categories: categoryList, levels: levelList, mode: modeList },
      });
      setAttempts(data);
    } catch (error) {
      console.error("Error fetching analytics data:", error.message);
    }
  };

  // Filter students based on search term and selected branch
  const filteredStudents = students
    .filter((student) => {
      const matchesSearch =
        student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_id?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBranch =
        selectedBranch === "" || selectedBranch === "All"  || selectedBranch === "disabled"
          ? true
          : student.branch === selectedBranch;

      return matchesSearch && matchesBranch;
    })
    .sort((a, b) => {
      const comparison = a.last_name.localeCompare(b.last_name);
      return sortOrder ? comparison : -comparison;
    });

  // Handle pagination logic
  const studentsPerPage = 10;
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  // Render progress card (per world) for each student
  



  // // Configuration of worlds
  // const progressWorlds = [
  //   { title: "Abnormal Psychology", key: "abnormal", label: "World 1" },
  //   {
  //     title: "Developmental Psychology",
  //     key: "developmental",
  //     label: "World 2",
  //   },
  //   {
  //     title: "Psychological Assessment",
  //     key: "psychological",
  //     label: "World 3",
  //   },
  //   { title: "Industrial Psychology", key: "industrial", label: "World 4" },
  //   { title: "General Psychology", key: "general", label: "World 5" },
  // ];

  // // Get attempts data grouped by category for a student
  // const getStudentAttemptsByWorld = (studentId) => {
  //   const studentData = attempts.filter(
  //     (attempt) => String(attempt.user_id._id) === String(studentId)
  //   );

    // const result = {};

    // studentData.forEach((entry) => {
    //   const worldKey = entry.category;
    //   const stage = entry.level - 1;

    //   if (!result[worldKey]) {
    //     result[worldKey] = {
    //       classicStageScores: Array(10).fill(0),
    //       masteryScores: [],
    //       classicScores: [],
    //       classicAttempts: 0,
    //       masteryAttempts: 0,
    //       highestMasteryScore: 0,
    //     };
    //   }

    //   if (entry.mode === "classic") {
    //     result[worldKey].classicAttempts += 1;
    //     result[worldKey].classicStageScores[stage] = Math.max(
    //       result[worldKey].classicStageScores[stage],
    //       entry.correct
    //     );
    //     result[worldKey].classicScores.push(entry.correct);
    //   }

    //   if (entry.mode === "mastery") {
    //     result[worldKey].masteryScores.push(entry.correct);
    //     result[worldKey].masteryAttempts += 1;
    //     result[worldKey].highestMasteryScore = Math.max(
    //       result[worldKey].highestMasteryScore,
    //       entry.correct
    //     );
    //   }
    // });

    // return result;
  // };

  const titles = [
    { key: "name", label: "Name", className: "flex flex-row items-center" },
    { key: "stud_id", label: "Student ID", className: "w-1/4" },
    { key: "branch", label: "Campus", className: "w-1/4" },
    { key: "action", label: "Action", className: "w-1/5" },
  ];

  const getBranchName = (branchId) =>
    branches.find((b) => b.id === branchId)?.name || "Unknown Branch";

  const toggleCard = (id) => {
    setCardActive((prev) => (prev === id ? null : id));
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
            handleChange={
              (e) => {
                setSearchTerm(e.target.value);
              }
              // setShowSuggestions(true);
            }
            placeholder="Search for a student"
            icon={searchIcon}
            // suggestions={searchSuggestions}
            // showSuggestions={showSuggestions}
            // onSuggestionSelect={(user) => {
            //   setSearchQuery(`${user.lastName.toUpperCase()}, ${user.firstName}`);
            //   setShowSuggestions(false);
            // }}
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
      />

      {/* <CardActiveContent /> */}

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


// function CardActiveContent({ studentId, studentWorldData, progressWorlds, renderProgressCard }) {
//   if (!studentWorldData) return null;

//   const avg = (arr) =>
//     arr.length === 0 ? "Not attempted yet" : `${(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)}/8`;

//   return (
//     <>
//       <div className="student-progress-container">
//         {progressWorlds.map((world) => {
//           const worldStats = studentWorldData[world.key] || {};
//           const stageScores = worldStats.classicStageScores || Array(10).fill(0);

//           return renderProgressCard(
//             studentId,
//             world.title,
//             world.key,
//             world.label,
//             stageScores
//           );
//         })}
//       </div>

//       <div className="student-progress-container">
//         {progressWorlds.map(({ title, key }) => {
//           const stats = studentWorldData[key] || {
//             classicScores: [],
//             masteryScores: [],
//             classicAttempts: 0,
//             masteryAttempts: 0,
//           };

//           return (
//             <div key={key} className="student-world-stats text-black">
//               <h2 className="font-semibold">{title}</h2>
//               <p>Classic Avg: {avg(stats.classicScores)}</p>
//               <p>Mastery Avg: {avg(stats.masteryScores)}</p>
//               <p>Classic Attempts: {stats.classicAttempts}</p>
//               <p>Mastery Attempts: {stats.masteryAttempts}</p>
//             </div>
//           );
//         })}
//       </div>

//       const renderProgressCard = (
//   studentId,
//   worldTitle,
//   worldKey,
//   label,
//   stageScores = [],
//   progressData,
//   attempts
// ) => {
//   const masteryProgress = progressData[studentId]?.mastery?.[worldKey] || 0;

//   const worldAttempts = attempts.filter(
//     (a) =>
//       String(a.user_id._id) === String(studentId) &&
//       a.category === worldKey &&
//       a.mode === "classic"
//   );

//   const renderStageBoxes = () =>
//     stageScores.map((score, index) => {
//       const attempt = worldAttempts.find((a) => a.level === index + 1);
//       const totalItems = attempt?.total_items || 8;

//       let color = "bg-white";
//       if (score === totalItems) color = "bg-green-500";
//       else if (score >= totalItems * 0.8) color = "bg-orange-300";
//       else if (score > 0) color = "bg-gray-300";

//       return (
//         <div
//           key={index}
//           className={`w-6 h-6 rounded-md mx-0.5 ${color} text-xs text-center text-black flex items-center justify-center`}
//           title={`Stage ${index + 1} - Score: ${score}/${totalItems}`}
//         >
//           {score > 0 ? score : "-"}
//         </div>
//       );
//     });

//   return (
//     <div className="per-world-progress-card" key={worldKey}>
//       <h1 className="text-black font-bold">{worldTitle}</h1>
//       <p className="text-black">{label}</p>

//       <div className="mb-1">
//         <h2 className="text-black text-sm font-semibold">Classic</h2>
//         <div className="flex flex-wrap">{renderStageBoxes()}</div>
//       </div>

//       <div>
//         <AnimatedProgressBar
//           label="Mastery"
//           percent={Math.min((masteryProgress / 10) * 100, 100)}
//           color="bg-yellow-400"
//         />
//       </div>
//     </div>
//   );
// };
//     </>
//   );
// }
