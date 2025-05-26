import samplepic from "../../assets/students/sample-minji.svg";
import chevronIcon from "../../assets/forAll/chevron.svg";
import settingsIcon from "../../assets/forAll/settings.svg";
import "./userContentsTable.css";

export default function UserContentsTable({
  columns,
  titles,
  data,
  isLoading,
  cardActive,
  toggleCard,
  sortOrderAsc,
  setSortOrderAsc,
  getBranchName,
  cardActiveContent,
}) {
  return (
    <div className="users-main-container">
      <table className="titles-table">
        <thead>
          <tr>
            {titles.map(({ key, label, className }) => (
              <th key={key} className={className}>
                {label}
                {key === "name" && (
                  <button
                    onClick={() => setSortOrderAsc((prev) => !prev)}
                    className="text-black cursor-pointer ml-3"
                  >
                    {sortOrderAsc ? (
                      <img src={chevronIcon} alt="chevron" className="w-4" />
                    ) : (
                      <img
                        src={chevronIcon}
                        alt="chevron"
                        className="rotate-180 w-4"
                      />
                    )}
                  </button>
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            <td colSpan={columns}>
              {isLoading ? (
                <div className="loading-overlay-accounts">
                  <div className="spinner"></div>
                  <p>Fetching data...</p>
                </div>
              ) : data.length === 0 ? (
                <div className="w-full flex justify-center items-center">
                  <p className="text-black mt-10 text-3xl">No user found.</p>
                </div>
              ) : (
                data.map((user) => {
                  const userId = user.employeenum || user.student_id;

                  return (
                    <div
                      key={userId}
                      className={
                        cardActive === userId ? "active-user-card" : "user-card"
                      }
                    >
                      <table className="user-table">
                        <tbody>
                          <tr>
                            {titles.map(({ key }) => {
                              switch (key) {
                                case "name":
                                  return (
                                    <td key={key} className="user-name-cell">
                                      <img
                                        src={user.useravatar || samplepic}
                                        alt={user.firstName || user.first_name}
                                        className="mini-avatar"
                                      />
                                      {(
                                        user.lastName || user.last_name
                                      )?.toUpperCase()}
                                      , {user.firstName || user.first_name}
                                    </td>
                                  );
                                case "position":
                                  return (
                                    <td key={key} className="user-pos-cell">
                                      {user.position}
                                    </td>
                                  );
                                case "branch":
                                  return (
                                    <td key={key} className="user-branch-cell">
                                      {getBranchName(user.branch)}
                                    </td>
                                  );
                                case "email":
                                  return <td key={key}>{user.email}</td>;
                                case "action":
                                  return (
                                    <td key={key} className="user-action-cell">
                                      <div className="action-holder">
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
                                          type="button"
                                          className={`acc-chevron transition-transform duration-300 ${
                                            cardActive === userId
                                              ? "rotate-180"
                                              : "rotate-0"
                                          }`}
                                          aria-label="Toggle details"
                                          onClick={() => toggleCard(userId)}
                                        >
                                          <img
                                            src={chevronIcon}
                                            alt="toggle details"
                                            className="chevron-icon"
                                          />
                                        </button>
                                      </div>
                                    </td>
                                  );
                                case "stud_id":
                                  return (
                                    <td key={key} className="user-pos-cell">
                                      {user.student_id}
                                    </td>
                                  );
                                default:
                                  return <td key={key}>N/A</td>;
                              }
                            })}
                          </tr>
                          <tr>
                            <td colSpan={columns}>
                              {cardActive === userId && cardActiveContent(user)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  );
                })
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
