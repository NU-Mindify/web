import search from "../../assets/students/search-01.svg";
import filter from "../../assets/students/filter.svg";
import branchdropdown from "../../assets/students/branch-dropdown.svg";
import chevron from "../../assets/students/chevron-down.svg";
import settings from "../../assets/students/settings.svg";
import samplepic from "../../assets/students/sample-minji.svg";
import "../../css/students/students.css";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { API_URL, branches } from "../../Constants";
import AnimatedProgressBar from "../../components/animatedProgressBar/AnimatedProgressBar";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const [progressData, setProgressData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);

  const [loadingStudents, setLoadingStudents] = useState(false)

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  //dropdown for chevron
  const toggleDropdown = (id) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    fetchStudents();
    fetchAllProgress();
  }, []);

  const fetchAllProgress = () => {
    axios
      .get(`${API_URL}/getAllProgress`)
      .then((res) => {
        const mapped = {};
        res.data.forEach((entry) => {
          mapped[entry.user_id] = entry;
        });
        setProgressData(mapped);
      })
      .catch((err) => {
        console.error("Error fetching progress:", err);
      });
  };

  const fetchStudents = async () => {
    setLoadingStudents(true)
    axios
      .get(`${API_URL}/getUsers`)
      .then((response) => {
        // console.log(response.data);
        setStudents(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoadingStudents(false)
      })
  };

  //for search
  const filteredStudents = students.filter(
    (student) =>
      student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //for pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  return (
    <>
      <div className="manage-students">
        <h1 className="header-title">Manage Students</h1>

        <div className="search-bar">
          <img src={search} className="search-icon" alt="search icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search for a student"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* <img src={filter} className="icon" alt="filter icon" /> */}
        </div>

        <div className="students-table-header">
          <div className="cell">Student ID</div>
          <div className="cell">Name</div>
          <div className="cell branch-cell">
            Branch
            <img
              src={branchdropdown}
              className="dropdown-icon"
              alt="dropdown icon"
            />
          </div>
          <div className="cell">Action</div>
        </div>

        <div className="students-body">
          {loadingStudents ? (
            <div className="loading-overlay-students">
                <div className="spinner"></div>
                <p>Fetching data...</p>
            </div>
          ) : (
            <div className="students-table">
            {currentStudents.map((student) => (
              <div key={student.student_id} className="student-row-wrapper">
                <div className="student-row">
                  <div className="cell">{student.student_id}</div>
                  <div className="student-name">
                    <img src={samplepic} className="student-avatar" alt="" />
                    {student.username}
                  </div>
                  <div className="cell">
                    {
                      branches.find((branch) => branch.id === student.branch)
                        .name
                    }
                  </div>
                  <div className="cell action-cell">
                    <img src={settings} className="icon" alt="settings icon" />
                    <img
                      src={chevron}
                      className={`icon chevron-icon ${
                        openDropdownId === student.student_id ? "rotate" : ""
                      }`}
                      alt="chevron icon"
                      onClick={() => toggleDropdown(student.student_id)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </div>

                <div
                  className={`dropdown-content ${
                    openDropdownId === student.student_id ? "open" : ""
                  }`}
                >
                  {/* Abnormal Psychology */}
                  <div className="analytics-box-container">
                    <div className="analytics-properties-students">
                      <p className="analytics-box-title">Abnormal Psychology</p>
                      <p className="analytics-box-subtitle">World 1</p>
                      <div className="progress-bar-container-students">
                        <AnimatedProgressBar
                          label="Classic"
                          percent={
                            ((progressData[student._id]?.classic?.abnormal ||
                              0) /
                              10) *
                            100
                          }
                          color="bg-[#FFBF1A]"
                        />
                        <AnimatedProgressBar
                          label="Mastery"
                          percent={
                            ((progressData[student._id]?.mastery?.abnormal ||
                              0) /
                              10) *
                            100
                          }
                          color="bg-[#FFBF1A]"
                        />
                      </div>
                    </div>

                    {/* Developmental Psychology */}
                    <div className="analytics-properties-students">
                      <p className="analytics-box-title">
                        Developmental Psychology
                      </p>
                      <p className="analytics-box-subtitle">World 2</p>
                      <div className="progress-bar-container-students">
                        <AnimatedProgressBar
                          label="Classic"
                          percent={
                            ((progressData[student._id]?.classic
                              ?.developmental || 0) /
                              10) *
                            100
                          }
                          color="bg-[#FFBF1A]"
                        />
                        <AnimatedProgressBar
                          label="Mastery"
                          percent={
                            ((progressData[student._id]?.mastery
                              ?.developmental || 0) /
                              10) *
                            100
                          }
                          color="bg-[#FFBF1A]"
                        />
                      </div>
                    </div>

                    {/* Psychological Psychology */}
                    <div className="analytics-properties-students">
                      <p className="analytics-box-title">
                        Psychological Psychology
                      </p>
                      <p className="analytics-box-subtitle">World 3</p>
                      <div className="progress-bar-container-students">
                        <AnimatedProgressBar
                          label="Classic"
                          percent={
                            ((progressData[student._id]?.classic
                              ?.psychological || 0) /
                              10) *
                            100
                          }
                          color="bg-[#FFBF1A]"
                        />
                        <AnimatedProgressBar
                          label="Mastery"
                          percent={
                            ((progressData[student._id]?.mastery
                              ?.psychological || 0) /
                              10) *
                            100
                          }
                          color="bg-[#FFBF1A]"
                        />
                      </div>
                    </div>

                    {/* Insdustrial/Organizational Psychology */}
                    <div className="analytics-properties-students">
                      <p className="analytics-box-title">
                        Industrial/Organizational Psychology
                      </p>
                      <p className="analytics-box-subtitle">World 4</p>
                      <div className="progress-bar-container-students">
                        <AnimatedProgressBar
                          label="Classic"
                          percent={
                            ((progressData[student._id]?.classic?.industrial ||
                              0) /
                              10) *
                            100
                          }
                          color="bg-[#FFBF1A]"
                        />
                        <AnimatedProgressBar
                          label="Mastery"
                          percent={
                            ((progressData[student._id]?.mastery?.industrial ||
                              0) /
                              10) *
                            100
                          }
                          color="bg-[#FFBF1A]"
                        />
                      </div>
                    </div>

                    {/* General Psychology */}
                    <div className="analytics-properties-students">
                      <p className="analytics-box-title">General Psychology</p>
                      <p className="analytics-box-subtitle">World 5</p>
                      <div className="progress-bar-container-students">
                        <AnimatedProgressBar
                          label="Classic"
                          percent={
                            ((progressData[student._id]?.classic?.general ||
                              0) /
                              10) *
                            100
                          }
                          color="bg-[#FFBF1A]"
                        />
                        <AnimatedProgressBar
                          label="Mastery"
                          percent={
                            ((progressData[student._id]?.mastery?.general ||
                              0) /
                              10) *
                            100
                          }
                          color="bg-[#FFBF1A]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

        {/* Pagination */}
        <div className="students-page-indicator">
          <span className="page-info">
            Showing {indexOfFirstStudent + 1} to {indexOfLastStudent} of{" "}
            {filteredStudents.length}
          </span>
          <div className="page-controls">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {"<"}
            </button>
            {[
              ...Array(Math.ceil(filteredStudents.length / studentsPerPage)),
            ].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage ===
                Math.ceil(filteredStudents.length / studentsPerPage)
              }
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
