import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import "../../css/account/account.css";
import { API_URL, fetchBranches } from "../../Constants";
import searchIcon from "../../assets/students/search-01.svg";
import chevronIcon from "../../assets/forAll/chevron.svg";
import settingsIcon from "../../assets/forAll/settings.svg";
import { UserLoggedInContext } from "../../contexts/Contexts";
import download from "../../assets/leaderboard/file-export.svg";
import Buttons from "../../components/buttons/Buttons";

export default function AccountManagement() {
  const [webUsers, setWebUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardActive, setCardActive] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrderAsc, setSortOrderAsc] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedPosition, setSelectedPosition] = useState("All");
  const [showSuggestions, setShowSuggestions] = useState(true);

  const navigate = useNavigate();
  const usersPerPage = 10;
  const { currentUserBranch, currentWebUser } = useContext(UserLoggedInContext);

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await fetchBranches();
        setBranches(data);
      } catch (error) {
        console.error("Failed to load branches:", error);
      }
    };
    loadBranches();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUserBranch) return;

      setIsLoading(true);
      try {
        const res = await axios.get(
          `${API_URL}/getWebUsers/${currentUserBranch}`
        );
        setWebUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [currentUserBranch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBranch, selectedPosition]);

  const uniquePositions = Array.from(
    new Set(
      webUsers
        .map((user) => user.position)
        .filter((pos) => pos?.toLowerCase() !== "super admin")
    )
  );

  const filteredUsers = webUsers
    .filter((user) => {
      const query = searchQuery.toLowerCase().replace(",", "").trim();
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const reversedName = `${user.lastName} ${user.firstName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(query) || reversedName.includes(query);
      const matchesBranch =
        selectedBranch === "All" || user.branch === selectedBranch;
      const matchesPosition =
        selectedPosition === "All" || user.position === selectedPosition;
      return matchesSearch && matchesBranch && matchesPosition;
    })
    .sort((a, b) => {
      const comparison = a.lastName.localeCompare(b.lastName);
      return sortOrderAsc ? comparison : -comparison;
    });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const toggleCard = (id) => {
    setCardActive((prev) => (prev === id ? null : id));
  };

  const getBranchName = (branchId) =>
    branches.find((b) => b.id === branchId)?.name || "Unknown Branch";

  const searchSuggestions = searchQuery
    ? filteredUsers
        .filter((user) => {
          const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
          const reversedName =
            `${user.lastName} ${user.firstName}`.toLowerCase();
          return (
            fullName.includes(searchQuery.toLowerCase()) ||
            reversedName.includes(searchQuery.toLowerCase())
          );
        })
        .slice(0, 5) // limit to 5 suggestions
    : [];

  return (
    <div className="account-main-container">
      <div className="account-header">
        <h1 className="account-title flex flex-row items-center">
          Account Management
        </h1>

        <div className="acc-sub-header-container">
          <div className="acc-search-bar">
            <img
              src={searchIcon}
              alt="Search"
              className="search-icon w-4 h-4 mr-2"
            />
            <input
              type="text"
              className="acc-search-input text-black font-[Poppins]"
              placeholder="Search for a user"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true); // Re-enable suggestions when typing again
              }}
            />
            {searchSuggestions.length > 0 && showSuggestions && (
              <ul className="search-suggestion-dropdown text-black">
                {searchSuggestions.map((user) => (
                  <li
                    key={user.employeenum}
                    className="search-suggestion-item"
                    onMouseDown={(e) => {
                      e.preventDefault(); // prevent blur
                      setSearchQuery(
                        `${user.lastName.toUpperCase()}, ${user.firstName}`
                      );
                      setShowSuggestions(false); // hide suggestions after selection
                    }}
                  >
                    {user.lastName.toUpperCase()}, {user.firstName}
                  </li>
                ))}
              </ul>
            )}
          </div>


          <Buttons
            text="Add Account"
            onClick={() => navigate("/addaccount")}
            addedClassName="btn btn-warning"
          />


          <img src={download} alt="export" className="acc-export-icon" />
        </div>

        <div className="filter-container">
          <select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            className="acc-position-select"
          >
            <option value="All">All Positions</option>
            {uniquePositions.map((pos, i) => (
              <option key={i} value={pos}>
                {pos}
              </option>
            ))}
          </select>

          {currentWebUser?.position?.toLowerCase() === "super admin" && (
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="acc-branch-select"
            >
              <option value="All">All Branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="titles-container">
        <table className="titles-table">
          <tr>
            <th>
              Name
              <button
                onClick={() => setSortOrderAsc((prev) => !prev)}
                className="text-black hover:bg-[#FFD41C] ml-2"
              >
                {sortOrderAsc ? 
                  <img src={chevronIcon} alt="chevron" className="w-4" />
                  : 
                  <img src={chevronIcon} alt="chevron" className="rotate-180 w-4" />
                }
              </button>
            </th>
            <th className="title-pos-cell">Position</th>
            <th className="title-branch-cell">Branch</th>
            <th className="title-action-cell">Action</th>
          </tr>
        </table>
      </div>

      <div className="users-container">
        {isLoading ? (
          <div className="loading-overlay-accounts">
            <div className="spinner"></div>
            <p>Fetching data...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <p className="text-black mt-10 text-3xl">No user found.</p>
        ) : (
          currentUsers.map((user) => (
            <div
              key={user.employeenum}
              className={
                cardActive === user.employeenum
                  ? "active-user-card"
                  : "user-card"
              }
            >
              <table className="user-table">
                <tr>
                  <td className="user-name-cell">
                    <img
                      src={user.useravatar}
                      alt={user.firstName}
                      className="mini-avatar"
                    />
                    {user.lastName.toUpperCase()}, {user.firstName}
                  </td>
                  <td className="user-pos-cell">{user.position}</td>
                  <td className="user-branch-cell">
                    {getBranchName(user.branch)}
                  </td>
                  <td className="user-action-cell">
                    <div className="action-holder">
                      <button
                        type="button"
                        className="setting-icon bg-transparent border-none p-0"
                      >
                        <img
                          src={settingsIcon}
                          alt="settings"
                          className="acc-setting"
                        />
                      </button>
                      <button
                        type="button"
                        className={`acc-chevron ${
                          cardActive === user.employeenum ? "rotate-180" : ""
                        }`}
                        aria-label="Toggle details"
                        onClick={() => toggleCard(user.employeenum)}
                      >
                        <img
                          src={chevronIcon}
                          alt="toggle details"
                          className="acc-chevron"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              </table>
              {cardActive === user.employeenum && (
                <div className="user-details-card">
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Employee Number:</strong> {user.employeenum}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="acc-footer">
        <div className="pagination-container">
          <h1 className="text-black">
            Showing{" "}
            {filteredUsers.length === 0
              ? 0
              : (currentPage - 1) * usersPerPage + 1}{" "}
            to {Math.min(currentPage * usersPerPage, filteredUsers.length)} of{" "}
            {filteredUsers.length}
          </h1>
          <div className="join">
            <button
              className="join-item btn bg-white text-black"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage <= 1}
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
              disabled={currentPage >= totalPages}
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
