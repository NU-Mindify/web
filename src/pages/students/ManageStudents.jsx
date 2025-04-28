import dropdown from '../../assets/glossary/dropdown.svg';
import '../../css/students/students.css';

export default function ManageStudents() {
    return (
      <>
        <div className="manage-students">
          <h1 className="header-title">Manage Students</h1>
  
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search for a student"
            />
          </div>
        </div>
  
        <div className="s-table">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>
                  Branch <span className="sort-arrow">▼</span>
                </th>
                <th>Action</th>
              </tr>
            </thead>
  
            <tbody>
              <tr>
                <td>20XX-123456</td>
                <td className="student-name">
                  <img
                    src=""
                    className="student-avatar"
                    alt=""
                  />
                  Gianette Lim
                </td>
                <td>NU MOA</td>
  
                <td className="flex items-center gap-2">
                  <button className="action-btn">
                    <i className="fa-solid fa-gear"></i>
                  </button>
                  <img src={dropdown} className="mainIcon" alt="dropdown icon" />
                </td>
  
              </tr>
            </tbody>
          </table>
        </div>
  
      </>
    );
  }