/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import search from "../../assets/students/search-01.svg";
import chevron from "../../assets/glossary/dropdown.svg";
import settings from "../../assets/students/settings.svg";
import samplepic from "../../assets/students/sample-minji.svg";
import "../../css/students/students.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL, branches, categories, modes, levels } from "../../Constants";
import AnimatedProgressBar from "../../components/animatedProgressBar/AnimatedProgressBar";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    fetchStudents();
    fetchAllProgress();
    fetchAttempts();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const { data } = await axios.get(`${API_URL}/getUsers`);
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoadingStudents(false);
    }
  };

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

  const fetchAttempts = async () => {
    try {
      const categoryList = categories.map((c) => c.category).join(",");
      const levelList = levels.join(",");
      const modeList = modes.map((m) => m.mode).join(",");

      const response = await axios.get(`${API_URL}/getAnalytics`, {
        params: {
          categories: categoryList,
          levels: levelList,
          mode: modeList,
        },
      });

      console.log(response.data);
      setAttempts(response.data);
    } catch (error) {
      console.error("Error fetching analytics data:", error.message);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const renderProgressCard = (studentId, worldTitle, worldKey, label) => (
    <div className="per-world-progress-card" key={worldKey}>
      <h1 className="text-black font-bold">{worldTitle}</h1>
      <p className="text-black">{label}</p>
      <AnimatedProgressBar
        label="Classic"
        percent={
          ((progressData[studentId]?.classic?.[worldKey] || 0) / 10) * 100
        }
        color="bg-[#FFBF1A]"
      />
      <AnimatedProgressBar
        label="Mastery"
        percent={
          ((progressData[studentId]?.mastery?.[worldKey] || 0) / 10) * 100
        }
        color="bg-[#FFBF1A]"
      />
    </div>
  );

  const progressWorlds = [
    { title: "Abnormal Psychology", key: "abnormal", label: "World 1" },
    {
      title: "Developmental Psychology",
      key: "developmental",
      label: "World 2",
    },
    {
      title: "Psychological Assessment",
      key: "psychological",
      label: "World 3",
    },
    { title: "Industrial Psychology", key: "industrial", label: "World 4" },
    { title: "General Psychology", key: "general", label: "World 5" },
  ];

  return (
    <div className="students-main-container">
      <div className="student-header">
        <h1 className="student-title">View Students</h1>
        <div className="student-search-bar">
          <img src={search} className="search-icon" alt="search icon" />
          <input
            type="text"
            className="student-search-input"
            placeholder="Search for a student"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="student-titles-container">
        <div className="student-header-info">
          <h1 className="student-title-info">Student ID</h1>
          <h1 className="student-title-info">Name</h1>
          <h1 className="student-title-info">Branch</h1>
          <h1 className="student-title-info">Action</h1>
        </div>
      </div>

      <div className="student-users-container">
        {loadingStudents ? (
          <div className="loading-overlay-students">
            <div className="spinner"></div>
            <p>Fetching data...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="no-students-found">
            <p className="text-black mt-10 text-3xl">No student found.</p>
          </div>
        ) : (
          currentStudents.map((student) => (
            <div
              className={
                openDropdown === student.student_id
                  ? "active-student-card"
                  : "student-card"
              }
              key={student.student_id}
            >
              <h1 className="student-info">{student.student_id}</h1>
              <div className="name-img-container">
                <img
                  src={samplepic}
                  alt={student.username}
                  className="mini-avatar"
                />
                <h1 className="student-info">{student.username}</h1>
              </div>
              <h1 className="student-info">
                {branches.find((branch) => branch.id === student.branch)
                  ?.name || "Unknown Branch"}
              </h1>
              <div className="student-action-container">
                <img src={settings} alt="settings" className="setting-icon" />
                <img
                  src={chevron}
                  alt="chevron"
                  className="chevron-icon"
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === student.student_id
                        ? null
                        : student.student_id
                    )
                  }
                />
              </div>

              {openDropdown === student.student_id && (
                <div className="student-progress-container">
                  {progressWorlds.map((world) =>
                    renderProgressCard(
                      student._id,
                      world.title,
                      world.key,
                      world.label
                    )
                  )}
                </div>
              )}

              {openDropdown === student.student_id && (
                <div className="student-progress-container">
                  <div className="per-world-progress-card">
                    <h1>Abnormal Psychology</h1>
                    <h1>Attempts: </h1>
                    <h1>Classic Average Score: </h1>
                    <h1>Mastery Average Score: </h1>
                  </div>
                  <div className="per-world-progress-card">
                    <h1>Developmental Psychology</h1>
                    <h1>Attempts: </h1>
                    <h1>Classic Average Score: </h1>
                    <h1>Mastery Average Score: </h1>
                  </div>
                  <div className="per-world-progress-card">
                    <h1>Psychological Psychology</h1>
                    <h1>Attempts: </h1>
                    <h1>Classic Average Score: </h1>
                    <h1>Mastery Average Score: </h1>
                  </div>
                  <div className="per-world-progress-card">
                    <h1>Industrial Psychology</h1>
                    <h1>Attempts: </h1>
                    <h1>Classic Average Score: </h1>
                    <h1>Mastery Average Score: </h1>
                  </div>
                  <div className="per-world-progress-card">
                    <h1>General Psychology</h1>
                    <h1>Attempts: </h1>
                    <h1>Classic Average Score: </h1>
                    <h1>Mastery Average Score: </h1>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="student-footer">
        <div className="student-pagination-container">
          <h1 className="text-black">
            Showing{" "}
            {filteredStudents.length === 0
              ? 0
              : (currentPage - 1) * studentsPerPage + 1}{" "}
            to{" "}
            {Math.min(currentPage * studentsPerPage, filteredStudents.length)}{" "}
            of {filteredStudents.length}
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
