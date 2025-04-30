import search from '../../assets/students/search-01.svg';
import filter from '../../assets/students/filter.svg';
import branchdropdown from '../../assets/students/branch-dropdown.svg';
import chevron from '../../assets/students/chevron-down.svg';
import settings from '../../assets/students/settings.svg';
import samplepic from '../../assets/students/sample-minji.svg';
import '../../css/students/students.css';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../Constants'


export default function ManageStudents() {

    const [students, setStudents] = useState([]);

    useEffect(()=>{
        fetchStudents();
    }, []);

    const fetchStudents = () => {
        axios.get(`${API_URL}/getUsers`)
        .then((response) => {
            console.log(response.data);
            setStudents(response.data);
            
        })
        .catch((error)=>{
            console.log(error);
        });
    };

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
            />
            <img src={filter} className="icon" alt="filter icon" />
          </div>

          <div className="students-table-header">
            <div className="cell">Student ID</div>
            <div className="cell">Name</div>
            <div className="cell branch-cell">Branch
              <img src={branchdropdown} className="dropdown-icon" alt="dropdown icon" />
            </div>
            <div className="cell">Action</div>
          </div>
          
          <div className="students-body">
            <div className="students-table">
              {students.map(student => (
                <div className="student-row">
                  <div className="cell">{student.student_id}</div>
                  <div className="student-name">
                  <img
                      src={samplepic}
                      className="student-avatar"
                      alt=""
                    />
                    {student.username}
                  </div>
                  <div className="cell">{student.branch}</div>
                  <div className="cell action-cell">
                    <img src={settings} className="icon" alt="dropdown icon" />
                    <img src={chevron} className="icon" alt="chevron icon" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="students-page-indicator">
            <span className="page-info">Showing 2 of 17</span>
            <div className="page-controls">
              <button>{'<'}</button>
                <button>1</button>
                <button className="active">2</button>
                <button>3</button>
                <button>4</button>
                <button>5</button>
                <button>6</button>
                <span>...</span>
              <button>{'>'}</button>
            </div>
          </div>

        </div>
  

  
      </>
    );
  }
