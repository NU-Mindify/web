import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import "../../css/account/account.css";
import { API_URL, fetchBranches } from "../../Constants";
import searchIcon from "../../assets/students/search-01.svg";
import { UserLoggedInContext } from "../../contexts/Contexts";
import download from "../../assets/leaderboard/file-export.svg";
import Buttons from "../../components/buttons/Buttons";
import SelectFilter from "../../components/selectFilter/SelectFilter";
import SearchBar from "../../components/searchbar/SearchBar";
import UserContentsTable from "../../components/tableForContents/UserContentsTable";
import chevronIcon from "../../assets/forAll/chevron.svg";
import { getAuth, deleteUser } from "firebase/auth";

import OkCancelModal from "../../components/OkCancelModal/OkCancelModal.jsx";
import ValidationModal from "../../components/ValidationModal/ValidationModal.jsx";

export default function ApproveAccount() {
  const [unApproveAccounts, setUnApproveAccounts] = useState([]);
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
  const usersPerPage = 15;
  const { currentUserBranch, currentWebUser } = useContext(UserLoggedInContext);

  // Load branches once
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

  const fetchPendingUsers = async () => {
    if (!currentUserBranch || !currentWebUser) return;

    setIsLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/getWebUsers/${currentUserBranch}`
      );
      let pendingUsers = res.data.filter((user) => user.isApproved === false);

      if (currentWebUser.position.toLowerCase() === "sub admin") {
        pendingUsers = pendingUsers.filter(
          (user) => user.position.toLowerCase() !== "sub admin"
        );
      }

      setUnApproveAccounts(pendingUsers);
      // console.log(pendingUsers.length);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, [currentUserBranch]);

  // Reset page on filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBranch, selectedPosition]);

  // Unique positions, excluding "super admin"
  const uniquePositions = Array.from(
    new Set(
      unApproveAccounts
        .map((user) => user.position)
        .filter((pos) => pos?.toLowerCase() !== "super admin")
    )
  );

  // Filter and sort users
  const filteredUsers = unApproveAccounts
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
    { key: "action", label: "Action", className: "w-1/5" },
  ];

  return (
    <div className="account-main-container">
      <div className="account-header">
        <div className="add-account-header">
          <button
            type="button"
            onClick={() => navigate("/account")}
            className="view-acc-btn"
            disabled={isLoading}
          >
            <img src={chevronIcon} alt="chevron" />
          </button>
          <h1 className="add-account-title">Pending Account</h1>
        </div>

        <div className="acc-sub-header-container mb-8 px-5">
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
              setSearchQuery(
                `${user.lastName.toUpperCase()}, ${user.firstName}`
              );
              setShowSuggestions(false);
            }}
            addedClassName={`${
              currentWebUser.position.toLowerCase() === "super admin"
                ? "w-[65%] h-[50px]"
                : "w-[90%] h-[50px]"
            }`}
          />

          {currentWebUser?.position?.toLowerCase() === "super admin" && (
            <SelectFilter
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              disabledOption="Select Position"
              fixOption="All Positions"
              mainOptions={uniquePositions}
            />
          )}

          {currentWebUser?.position?.toLowerCase() === "super admin" && (
            <SelectFilter
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              disabledOption="Select Campus"
              fixOption="All Campuses"
              mainOptions={branches}
              getOptionValue={(branch) => branch.id}
              getOptionLabel={(branch) => branch.name}
              addedClassName="ml-3"
            />
          )}
        </div>
      </div>

      <UserContentsTable
        columns={4}
        titles={titles}
        data={currentUsers}
        isLoading={isLoading}
        cardActive={cardActive}
        toggleCard={toggleCard}
        sortOrderAsc={sortOrderAsc}
        setSortOrderAsc={setSortOrderAsc}
        getBranchName={getBranchName}
        cardActiveContent={(user) => (
          <CardActiveContent user={user} refreshData={fetchPendingUsers} />
        )}
        isForApprove={true}
        refreshData={() => {
          // Optional: provide a function to refresh the list after approve
          // You could pass this to CardActiveContent via props if needed
        }}
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

function CardActiveContent({ user, refreshData }) {
  const [approveLoading, setApproveLoading] = useState(false);

  const [OkCancelModalMessage, setOkCancelModalMessage] = useState("");
  const [showOkCancelModal, setShowOkCancelModal] = useState(false);
  const [AcceptModalMessage, setAcceptModalMessage] = useState("");
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [showValidationModal, setShowValidationModal] = useState(false);

  const { currentUserBranch, currentWebUser } = useContext(UserLoggedInContext);
  console.log("The user", user._id);

  const handleDecline = async () => {
    setOkCancelModalMessage(
      "Are you sure you want to decline this user? (Declining will delete the user's account)"
    );
    setShowOkCancelModal(true);
  };

  const declineUser = async () => {
    try {
      await axios.delete(`${API_URL}/declineUser/${user._id}`);
      setValidationMessage("User declined and deleted successfully.");
      setShowValidationModal(true);
    } catch (error) {
      console.error("Error deleting user:", error);
      setValidationMessage("Failed to decline user. Please try again.");
      setShowValidationModal(true);
    }
  };

  const handlesApprove = async () => {
    setAcceptModalMessage(
      "Are you sure you want to approve this user? (This action cannot be undone)"
    );
    setShowAcceptModal(true);
  };

  const acceptUser = async () => {
    setApproveLoading(true);

    try {
      await axios.put(`${API_URL}/updateWebUsers/${user._id}`, {
        ...user,
        isApproved: true,
      });

      await axios.post(`${API_URL}/addLogs`, {
        name: `${currentWebUser.firstName} ${currentWebUser.lastName}`,
        branch: currentWebUser.branch,
        action: "Approve Account",
        description: `${currentWebUser.firstName} has approved ${user.lastName}, ${user.firstName} account`,
      });

      setValidationMessage(`User ${user.firstName} ${user.lastName} approved!`);
      setShowValidationModal(true);
    } catch (error) {
      console.error("Error approving user:", error);
      setValidationMessage("Failed to approve user. Please try again.");
      setShowValidationModal(true);
    } finally {
      setApproveLoading(false);
    }
  };

  return (
    <div className="user-details-card">
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Employee Number:</strong> {user.employeenum}
      </p>

      <div className="flex flex-row justify-around items-center px-[200px]">
        <Buttons
          text={approveLoading ? "Approving..." : "Approve"}
          onClick={handlesApprove}
          addedClassName="btn btn-success"
          disabled={approveLoading}
        />
        <Buttons
          text="Decline"
          onClick={handleDecline}
          addedClassName="btn btn-error"
        />
      </div>
      {showValidationModal && (
        <ValidationModal
          message={validationMessage}
          onClose={() => {
            setShowValidationModal(false);
            refreshData(); // Refresh after modal is closed
          }}
        />
      )}

      {showAcceptModal && (
        <OkCancelModal
          message={AcceptModalMessage}
          onConfirm={async () => {
            setShowAcceptModal(false);
            await acceptUser();
          }}
          onCancel={() => setShowAcceptModal(false)}
        />
      )}

      {showOkCancelModal && (
        <OkCancelModal
          message={OkCancelModalMessage}
          onConfirm={async () => {
            setShowOkCancelModal(false);
            await declineUser();
          }}
          onCancel={() => setShowOkCancelModal(false)}
        />
      )}
    </div>
  );
}
