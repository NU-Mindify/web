/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import search from "../../assets/students/search-01.svg";
import filter from "../../assets/students/filter.svg";
import branchdropdown from "../../assets/students/branch-dropdown.svg";
import chevron from "../../assets/glossary/dropdown.svg";
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
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeCard, setActiveCard] = useState(false);

  const [progressData, setProgressData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [loadingStudents, setLoadingStudents] = useState(false)




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



  return (

    <>
      <div className="students-main-container">

        <div className="student-header">
          <h1 className="student-title">View Students</h1>
          <div className="student-search-bar">
              <img src={search} className="search-icon" alt="search icon" />
              <input
                  type="text"
                  className="student-search-input"
                  placeholder="Search for a student"
                  // value={searchUser}
                  // onChange={(e) => setSearchUser(e.target.value)}
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
          {loadingStudents ? 
            (
              <div className="loading-overlay-students">
                <div className="spinner"></div>
                <p>Fetching data...</p>
              </div>
            ) : 
            (
              students.map((student) => (
                <div
                  className={activeCard === student.student_id ? 'active-student-card' : "student-card"}
                  key={student.student_id}
                >
                  <h1 className="student-info">{student.student_id}</h1>
                  <div className="name-img-container">
                    <img src={samplepic} alt={student.username} className="mini-avatar" />
                    <h1 className="student-info">{student.username}</h1>
                  </div>

                  <h1 className="student-info">{student.branch}</h1>
                  <div className="student-action-container">
                    <img src={settings} alt="settings" className="setting-icon" />
                    <img
                      src={chevron}
                      alt="chevron"
                      className="chevron-icon"
                      onClick={() => {
                        setOpenDropdown(openDropdown === student.student_id ? null : student.student_id);
                        setActiveCard(activeCard === student.student_id ? null : student.student_id);
                      }}
                    />
                  </div>

                  {openDropdown === student.student_id && (
                    <div className="student-progress-container">
                      {[...Array(5)].map((_, i) => (
                        <div className="per-word-progress-card" key={i}>
                          <h1>asd</h1>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
        </div>







        <div className="student-footer">
          <div className="student-pagination-container">
              <h1 className="text-black">
                  Page 1 of
              </h1>

              <div className="join">
                  <button
                      className="join-item btn bg-white text-black"
                  >
                      «
                  </button>
                  <button className="join-item btn bg-white text-black" disabled>
                      Page 
                  </button>
                  <button
                      className="join-item btn bg-white text-black"
                  >
                      »
                  </button>
              </div>
          </div>
        </div>



      </div>
    </>
  );
}
