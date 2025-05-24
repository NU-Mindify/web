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
import SelectFilter from "../../components/selectFilter/SelectFilter";
import SearchBar from "../../components/searchbar/SearchBar";
import AccountContentsTable from "../../components/tableForContents/AccountContentsTable";




export default function AccountManagement() {
  const [webUsers, setWebUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardActive, setCardActive] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrderAsc, setSortOrderAsc] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
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
        selectedBranch === "" ||
        selectedBranch === "All" ||
        user.branch === selectedBranch;

      const matchesPosition =
        selectedPosition === "" ||
        selectedPosition === "All" ||
        user.position === selectedPosition;

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
        .slice(0, 5)
    : [];

    const titles = [
      { key: "name", label: "Name", className: "flex flex-row items-center" },
      { key: "position", label: "Position", className: "w-1/4" },
      { key: "branch", label: "Campus", className: "w-1/4" },
      { key: "action", label: "Action", className: "w-1/5" }
    ];

  return (
    <div className="account-main-container">
      <div className="account-header">
        <h1 className="account-title flex flex-row items-center">
          Account Management
        </h1>

        <div className="acc-sub-header-container">
          <SearchBar
            value={searchQuery}
            handleChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            placeholder="Search for a user"
            icon={searchIcon}
            suggestions={searchSuggestions}
            showSuggestions={showSuggestions}
            onSuggestionSelect={(user) => {
              setSearchQuery(`${user.lastName.toUpperCase()}, ${user.firstName}`);
              setShowSuggestions(false);
            }}
            addedClassName="w-[80%] h-[50px]"
          />



          <Buttons
            text="Add Account"
            onClick={() => navigate("/addaccount")}
            addedClassName="btn btn-warning"
          />


          <img src={download} alt="export" className="acc-export-icon" />
        </div>

        <div className="filter-container">

          <SelectFilter
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            disabledOption="Select Position"
            fixOption="All Positions"
            mainOptions={uniquePositions}
          />

          {currentWebUser?.position?.toLowerCase() === "super admin" && (
            <SelectFilter
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              disabledOption="Select Branch"
              fixOption="All Branches"
              mainOptions={branches}
              getOptionValue={(branch) => branch.id}
              getOptionLabel={(branch) => branch.name}
              addedClassName="ml-3"
            />
          )}
        </div>
      </div>

          

      <AccountContentsTable
        columns={4}
        titles={titles}
        data={currentUsers}
        isLoading={isLoading}
        cardActive={cardActive}
        toggleCard={toggleCard}
        sortOrderAsc={sortOrderAsc}
        setSortOrderAsc={setSortOrderAsc}
        getBranchName={getBranchName}
      />

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
