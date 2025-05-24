
import chevronIcon from "../../assets/forAll/chevron.svg";
import settingsIcon from "../../assets/forAll/settings.svg";
import "./accountContentTable.css";

export default function AccountContentsTable({
  columns,
  titles,
  data,
  isLoading,
  cardActive,
  toggleCard,
  sortOrderAsc,
  setSortOrderAsc,
  getBranchName,
}) {


  return (


    <div className="users-main-container">
      <table className="titles-table">
        <thead>
            <tr>
                {titles.map(({ key, label, className }, idx) => (
                    <th key={idx} className={className}>
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
                <p className="text-black mt-10 text-3xl">No user found.</p>
              ) : (
                data.map((user) => (
                  <div
                    key={user.employeenum}
                    className={
                      cardActive === user.employeenum
                        ? "active-user-card"
                        : "user-card"
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
                                      src={user.useravatar}
                                      alt={user.firstName}
                                      className="mini-avatar"
                                    />
                                    {user.lastName.toUpperCase()}, {user.firstName}
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
                                        className={`acc-chevron ${
                                          cardActive === user.employeenum
                                            ? "rotate-180"
                                            : ""
                                        }`}
                                        aria-label="Toggle details"
                                        onClick={() => toggleCard(user.employeenum)}
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
                                case "student_id":
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
                      </tbody>
                    </table>
                    {/* {cardActive === user.employeenum && (
                      <div className="user-details-card">
                        <p>
                          <strong>Email:</strong> {user.email}
                        </p>
                        <p>
                          <strong>Employee Number:</strong> {user.employeenum}
                        </p>
                      </div>
                    )} */}
                  </div>
                ))
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
