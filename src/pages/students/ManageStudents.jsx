import search from '../../assets/students/search-01.svg';
import filter from '../../assets/students/filter.svg';
import branchdropdown from '../../assets/students/branch-dropdown.svg';
import chevron from '../../assets/students/chevron-down.svg';
import settings from '../../assets/students/settings.svg';
import samplepic from '../../assets/students/sample-minji.svg';
import '../../css/students/students.css';


export default function ManageStudents() {
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

              <div className="student-row">
                <div className="cell">20XX-123456</div>
                <div className="student-name">
                <img
                    src={samplepic}
                    className="student-avatar"
                    alt=""
                  />
                  Kim Minji
                </div>
                <div className="cell">NU MOA</div>
                <div className="cell action-cell">
                  <img src={settings} className="icon" alt="dropdown icon" />
                  <img src={chevron} className="icon" alt="chevron icon" />
                </div>
              </div>

              <div className="student-row">
                <div className="cell">20XX-123456</div>
                <div className="student-name">
                <img
                    src={samplepic}
                    className="student-avatar"
                    alt=""
                  />
                  Jang Wonyoung
                </div>
                <div className="cell">NU MOA</div>
                <div className="cell action-cell">
                  <img src={settings} className="icon" alt="dropdown icon" />
                  <img src={chevron} className="icon" alt="chevron icon" />
                </div>
              </div>

              <div className="student-row">
                <div className="cell">20XX-123456</div>
                <div className="student-name">
                <img
                    src={samplepic}
                    className="student-avatar"
                    alt=""
                  />
                  Hanni Pham
                </div>
                <div className="cell">NU MOA</div>
                <div className="cell action-cell">
                  <img src={settings} className="icon" alt="dropdown icon" />
                  <img src={chevron} className="icon" alt="chevron icon" />
                </div>
              </div>

              <div className="student-row">
                <div className="cell">20XX-123456</div>
                <div className="student-name">
                <img
                    src={samplepic}
                    className="student-avatar"
                    alt=""
                  />
                  Danielle Marsh
                </div>
                <div className="cell">NU MOA</div>
                <div className="cell action-cell">
                  <img src={settings} className="icon" alt="dropdown icon" />
                  <img src={chevron} className="icon" alt="chevron icon" />
                </div>
              </div>

              <div className="student-row">
                <div className="cell">20XX-123456</div>
                <div className="student-name">
                <img
                    src={samplepic}
                    className="student-avatar"
                    alt=""
                  />
                  Kang Haerin
                </div>
                <div className="cell">NU MOA</div>
                <div className="cell action-cell">
                  <img src={settings} className="icon" alt="dropdown icon" />
                  <img src={chevron} className="icon" alt="chevron icon" />
                </div>
              </div>

              <div className="student-row">
                <div className="cell">20XX-123456</div>
                <div className="student-name">
                <img
                    src={samplepic}
                    className="student-avatar"
                    alt=""
                  />
                  Lee Hyein
                </div>
                <div className="cell">NU MOA</div>
                <div className="cell action-cell">
                  <img src={settings} className="icon" alt="dropdown icon" />
                  <img src={chevron} className="icon" alt="chevron icon" />
                </div>
              </div>

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