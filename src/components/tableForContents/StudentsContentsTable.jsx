import samplepic from "../../assets/students/sample-minji.svg";
import chevronIcon from "../../assets/forAll/chevron.svg";
import settingsIcon from "../../assets/forAll/settings.svg";
import './studentsContentTable.css';

export default function StudentsContentsTable({
    students,
    openDropdown,
    setOpenDropdown,
    branches,
    progressData,
    attempts,
    progressWorlds,
    getStudentAttemptsByWorld,
    renderProgressCard,
    column,
    titles,
    sortOrder,
    setSortOrder,
    isLoading,
    getBranchName
}) {
  if (!students.length) {
    return (
      <div className="no-students-found">
        <p className="text-black mt-10 text-3xl">No student found.</p>
      </div>
    );
  }

  return (
    <>
        <div className="student-users-container">
            <table className="student-titles-table">
                <thead>
                <tr>
                    {titles.map(({ key, label, className }, idx) => (
                    <th key={idx} className={className}>
                        {label}
                        {key === "name" && (
                        <button
                            onClick={() => setSortOrder((prev) => !prev)}
                            className="text-black cursor-pointer ml-3"
                        >
                            {sortOrder ? (
                            <img src={chevronIcon} alt="chevron" className="w-3" />
                            ) : (
                            <img src={chevronIcon} alt="chevron" className="rotate-180 w-4" />
                            )}
                        </button>
                        )}
                    </th>
                    ))}
                </tr>
                </thead>

                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={titles.length}>
                                <div className="loading-overlay-accounts">
                                <div className="spinner"></div>
                                <p>Fetching data...</p>
                                </div>
                            </td>
                        </tr>
                    ) : students.length === 0 ? (
                        <tr>
                            <td colSpan={titles.length}>
                                <p className="text-black mt-10 text-3xl text-center">No student found.</p>
                            </td>
                        </tr>
                    ) : (
                        students.map((student) => {
                        const studentId = String(student._id);
                        const studentWorldData = getStudentAttemptsByWorld(studentId);

                        const studentRow = (
                            <tr key={studentId} className="user-pos-cell">
                            {titles.map(({ key }) => {
                                switch (key) {
                                case "stud_id":
                                    return <td key={key}>{student.student_id}</td>;
                                case "name":
                                    return (
                                    <td key={key} className="user-name-cell">
                                        <img src={samplepic} alt={student.first_name} className="mini-avatar" />
                                        {student.last_name.toUpperCase()}, {student.first_name}
                                    </td>
                                    );
                                case "branch":
                                    return <td key={key} className="user-branch-cell">{getBranchName(student.branch)}</td>;
                                case "action":
                                    return (
                                    <td key={key} className="user-action-cell">
                                        <div className="action-holder">
                                        <button type="button" className="setting-icon bg-transparent border-none p-0">
                                            
                                        </button>
                                        <button
                                            type="button"
                                            className={`acc-chevron ${openDropdown === studentId ? "rotate-180" : ""}`}
                                            onClick={() =>
                                            setOpenDropdown(openDropdown === studentId ? null : studentId)
                                            }
                                        >
                                            <img src={chevronIcon} alt="toggle" className="chevron-icon" />
                                        </button>
                                        </div>
                                    </td>
                                    );
                                default:
                                    return <td key={key}>N/A</td>;
                                }
                            })}
                            </tr>
                        );

                        const expandedRow =
                            openDropdown === studentId ? (
                            <tr key={studentId + "-details"} className="student-progress-row">
                                <td colSpan={titles.length}>
                                <div className="student-progress-container">
                                    {progressWorlds.map((world) => {
                                    const worldStats = studentWorldData[world.key] || {};
                                    const stageScores = worldStats.classicStageScores || Array(10).fill(0);
                                    return renderProgressCard(
                                        studentId,
                                        world.title,
                                        world.key,
                                        world.label,
                                        stageScores
                                    );
                                    })}
                                </div>

                                <div className="student-progress-container">
                                    {progressWorlds.map(({ title, key }) => {
                                    const worldStats = studentWorldData[key] || {
                                        classicScores: [],
                                        masteryScores: [],
                                        classicAttempts: 0,
                                        masteryAttempts: 0,
                                    };

                                    const avg = (arr) =>
                                        arr.length === 0
                                        ? "Not attempted yet"
                                        : `${(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)}/8`;

                                    return (
                                        <div className="per-world-progress-card" key={key}>
                                        <h1>{title}</h1>
                                        <h1>Classic Attempts: {worldStats.classicAttempts || "Not attempted yet"}</h1>
                                        <h1>Classic Average Score: {avg(worldStats.classicScores)}</h1>
                                        <h1>Mastery Attempts: {worldStats.masteryAttempts || "Not attempted yet"}</h1>
                                        <h1>Mastery Average Score: {avg(worldStats.masteryScores)}</h1>
                                        </div>
                                    );
                                    })}
                                </div>
                                </td>
                            </tr>
                            ) : null;

                        return [studentRow, expandedRow];
                        })
                    )}
                </tbody>

            </table>
        </div>


      {/* {students.map((student) => {
        const studentId = String(student._id);
        const studentWorldData = getStudentAttemptsByWorld(studentId);

        return (
          <div
            className={
              openDropdown === studentId
                ? "active-student-card"
                : "student-card"
            }
            key={student.student_id}
          >
            <h1 className="student-info">{student.student_id}</h1>
            <div className="name-img-container">
              <img
                src={samplepic}
                alt={student.first_name}
                className="mini-avatar"
              />
              <h1 className="student-info">
                {student.last_name.toUpperCase()}, {student.first_name}
              </h1>
            </div>
            <h1 className="student-info">
              {branches.find((branch) => branch.id === student.branch)?.name ||
                "Unknown Branch"}
            </h1>

            <div className="student-action-container">
              <button
                type="button"
                className="setting-icon bg-transparent border-none p-0"
            >
                <img
                src={settingsIcon}
                alt="settings"
                className="setting-icon"
                />
            </button>
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === studentId ? null : studentId)
                }
              >
                <img
                  src={chevron}
                  alt="chevron"
                  className="chevron-icons"
                />
              </button>
            </div>

            {openDropdown === studentId && (
              <>
                <div className="student-progress-container">
                  {progressWorlds.map((world) => {
                    const worldStats = studentWorldData[world.key] || {};
                    const stageScores =
                      worldStats.classicStageScores || Array(10).fill(0);
                    return renderProgressCard(
                      studentId,
                      world.title,
                      world.key,
                      world.label,
                      stageScores
                    );
                  })}
                </div>

                <div className="student-progress-container">
                  {progressWorlds.map(({ title, key }) => {
                    const worldStats = studentWorldData[key] || {
                      classicScores: [],
                      masteryScores: [],
                      classicAttempts: 0,
                      masteryAttempts: 0,
                    };

                    const avg = (arr) =>
                      arr.length === 0
                        ? "Not attempted yet"
                        : `${(
                            arr.reduce((a, b) => a + b, 0) / arr.length
                          ).toFixed(2)}/8`;

                    return (
                      <div className="per-world-progress-card" key={key}>
                        <h1>{title}</h1>
                        <h1>
                          Classic Attempts:{" "}
                          {worldStats.classicAttempts || "Not attempted yet"}
                        </h1>
                        <h1>
                          Classic Average Score: {avg(worldStats.classicScores)}
                        </h1>
                        <h1>
                          Mastery Attempts:{" "}
                          {worldStats.masteryAttempts || "Not attempted yet"}
                        </h1>
                        <h1>
                          Mastery Average Score: {avg(worldStats.masteryScores)}
                        </h1>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        );
      })} */}
    </>
  );
}
