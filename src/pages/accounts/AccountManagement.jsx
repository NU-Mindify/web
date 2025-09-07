import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { API_URL, fetchBranches } from "../../Constants";
import logo from "../../assets/logo/logo.png";
import searchIcon from "../../assets/students/search-01.svg";
import ExportDropdown from "../../components/ExportDropdown/ExportDropdown";
import Buttons from "../../components/buttons/Buttons";
import SearchBar from "../../components/searchbar/SearchBar";
import SelectFilter from "../../components/selectFilter/SelectFilter";
import UserContentsTable from "../../components/tableForContents/UserContentsTable";
import { UserLoggedInContext } from "../../contexts/Contexts";
import "../../css/account/account.css";

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
  const usersPerPage = 15;
  const { currentUserBranch, currentWebUser } = useContext(UserLoggedInContext);

  const [showArchived, setShowArchived] = useState(false);

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

  useEffect(() => {
    fetchUsers();
  }, [currentUserBranch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBranch, selectedPosition]);

 const uniquePositions = Array.from(
  new Set(
    webUsers
      .map((user) => user.position)
      .filter((pos) => {
        if (currentWebUser?.position?.toLowerCase() !== "super admin") {
          return pos?.toLowerCase() !== "super admin";
        }
        return true; 
      })
  )
);


  const filteredUsers = webUsers

    .filter((user) => {
      if (currentWebUser?.position?.toLowerCase() !== "super admin") {
        return user.position?.toLowerCase() !== "super admin";
      }
      return true;
    })
    .filter((user) => user.isApproved === true)
    .filter((user) => {
      const query = searchQuery.toLowerCase().replace(",", "").trim();
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const reversedName = `${user.lastName} ${user.firstName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(query) || reversedName.includes(query);

      const matchesBranch =
        selectedBranch === "" ||
        selectedBranch === "all" ||
        user.branch === selectedBranch;

      const matchesPosition =
        selectedPosition === "" ||
        selectedPosition === "all" ||
        user.position === selectedPosition;

      const matchesArchived = showArchived ? user.is_deleted : !user.is_deleted;
      return (
        matchesSearch && matchesBranch && matchesPosition && matchesArchived
      );
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

  // EXPORT TO CSV for Accounts
  const exportAccountsToCSV = (data, filename) => {
    const now = new Date().toLocaleString();
    const headers = ["Name", "Position", "Campus"];
    const rows = data.map((user) => {
      const firstName = user.firstName || "";
      const lastName = user.lastName || "";
      const fullName = `${lastName.toUpperCase()} ${firstName}`.trim();
      const position = user.position || "N/A";
      const campus =
        branches.find((branch) => branch.id === user.branch)?.name || "N/A";

      return [fullName, position, campus];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        `Exported by: ${currentWebUser.firstName} ${currentWebUser.lastName}`,
        `Exported on: ${now}`,
        "",
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${filename}_by_${currentWebUser.firstName}_${currentWebUser.lastName}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //convert logo to base64 para lumabas sa pdf
  const getBase64FromUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // EXPORT TO PDF for Accounts
  const exportAccountsToPDF = async (data, title) => {
    const logoBase64 = await getBase64FromUrl(logo);
    const now = new Date().toLocaleString();
    const doc = new jsPDF();

    doc.text(`${title}`, 14, 10);
    doc.text(
      `Exported by: ${currentWebUser.firstName} ${currentWebUser.lastName}`,
      14,
      18
    );
    doc.text(`Exported on: ${now}`, 14, 26);

    const pageWidth = doc.internal.pageSize.getWidth();
    const logoWidth = 30;
    const logoHeight = 15;
    const xPos = pageWidth - logoWidth - 10;
    doc.addImage(logoBase64, "PNG", xPos, 10, logoWidth, logoHeight);

    const rows = data.map((user) => {
      const fullName = `${(user.lastName || "").toUpperCase()} ${
        user.firstName || ""
      }`.trim();
      const position = user.position || "";
      const campus =
        branches.find((branch) => branch.id === user.branch)?.name || "N/A";

      return [fullName, position, campus];
    });

    autoTable(doc, {
      head: [["Name", "Position", "Campus"]],
      body: rows,
      startY: 30,
    });

    doc.save(
      `${title.replace(" ", "_")}_by_${currentWebUser.firstName}_${
        currentWebUser.lastName
      }.pdf`
    );
  };

  return (
    <div className="account-main-container overflow-hidden">
      <div className="account-header">
        <h1 className="account-title">Account Management</h1>

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
              setSearchQuery(
                `${user.lastName.toUpperCase()}, ${user.firstName}`
              );
              setShowSuggestions(false);
            }}
            addedClassName="w-[70%] h-[50px] mt-2 ml-1"
          />

          <Buttons
            text="Pending Account"
            onClick={() => navigate("/account/approval")}
            addedClassName="btn btn-warning !w-[250px] ml-28 mt-2"
          />

          <div className="ml-40 mr-1 mt-2">
            <ExportDropdown
              onExport={(format) => {
                if (format === "csv") {
                  exportAccountsToCSV(filteredUsers, "Accounts_List");
                } else if (format === "pdf") {
                  exportAccountsToPDF(filteredUsers, "Accounts_List");
                }
              }}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-6 w-full mb-7 mt-5 ml-3">
          <div className="flex bg-gray-100 p-1 rounded-xl w-[300px]">
            <button
              onClick={() => setShowArchived(false)}
              className={`all-archive-btn ${showArchived || "active"} w-1/2`}
            >
              All Admins
            </button>

            <button
              onClick={() => setShowArchived(true)}
              className={`all-archive-btn ${showArchived && "active"} w-1/2`}
            >
              Archive
            </button>
          </div>

          <SelectFilter
            ariaLabel={"Select Position"}
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            disabledOption="Select Position"
            fixOption="All Positions"
            mainOptions={uniquePositions}
          />

          {currentWebUser?.position?.toLowerCase() === "super admin" && (
            <SelectFilter
              ariaLabel={"Select Campus"}
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
          <CardActiveContent
            user={user}
            fetchUsers={fetchUsers}
            setCardActive={setCardActive}
          />
        )}
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

function CardActiveContent({ user, fetchUsers, setCardActive }) {
  const [confirmUserDelete, setConfirmUserDelete] = useState(false);

  const [confirmUnarchive, setConfirmUnarchive] = useState(false);

  const { currentUserBranch, currentWebUser } = useContext(UserLoggedInContext);

  const handleConfirmDelete = async () => {
    try {
      await axios.put(`${API_URL}/deleteWebUser/${user._id}`, {
        user_id: user._id,
        is_deleted: true,
      });

      await fetchUsers();
      setCardActive(null);

      await axios.post(`${API_URL}/addLogs`, {
        name: `${currentWebUser.firstName} ${currentWebUser.lastName}`,
        branch: currentWebUser.branch,
        action: "Archived a User",
        description: `${currentWebUser.firstName} deleted ${user.firstName} ${user.lastName}'s account.`,
        position: currentWebUser.position,
        useravatar: currentWebUser.useravatar,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setConfirmUserDelete(false);
    }
  };

  const handleUnarchiveUser = async () => {
    try {
      await axios.put(`${API_URL}/deleteWebUser/${user._id}`, {
        user_id: user._id,
        is_deleted: false,
      });

      await fetchUsers();
      setCardActive(null);

      await axios.post(`${API_URL}/addLogs`, {
        name: `${currentWebUser.firstName} ${currentWebUser.lastName}`,
        branch: currentWebUser.branch,
        action: "Unarchive a User",
        description: `${currentWebUser.firstName} unarchived ${user.firstName} ${user.lastName}'s account.`,
        position: currentWebUser.position,
        useravatar: currentWebUser.useravatar,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setConfirmUserDelete(false);
    }
  };

  return (
    <>
      <div className="user-details-card">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Employee Number:</strong> {user.employeenum}
        </p>
        <p>
          <strong>Date Created: </strong>
          {isNaN(new Date(user.createdAt))
            ? "No Date"
            : new Date(user.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
        </p>

        {user.is_deleted ? (
          <Buttons
            text="Unarchive User"
            onClick={() => {
              setConfirmUnarchive(!confirmUnarchive);
            }}
            addedClassName="btn btn-error"
          />
        ) : (
          <Buttons
            text="Archive User"
            onClick={() => {
              setConfirmUserDelete(!confirmUserDelete);
            }}
            addedClassName="btn btn-error"
          />
        )}
      </div>

      {confirmUnarchive && (
        <div className="modal-overlay confirm-delete-popup !w-[100%] !h-[100%]">
          <div className="confirm-dialog !h-10/12">
            <h2>Confirm Unarchive</h2>
            <p className="text-black text-[13px]">
              Are you sure you want to unarchive "
              <strong>
                {user.firstName} {user.lastName}
              </strong>
              "?
            </p>
            <div className="popup-buttons">
              <Buttons
                text="Yes, Unarchive"
                addedClassName="btn btn-delete"
                onClick={handleUnarchiveUser}
              />
              <Buttons
                text="Cancel"
                addedClassName="btn btn-cancel"
                onClick={() => {
                  setConfirmUnarchive(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {confirmUserDelete && (
        <div className="modal-overlay confirm-delete-popup !w-[100%] !h-[100%]">
          <div className="confirm-dialog !h-10/12">
            <h2>Confirm Archive</h2>
            <p className="text-black text-[13px]">
              Are you sure you want to archive "
              <strong>
                {user.firstName} {user.lastName}
              </strong>
              "?
            </p>
            <div className="popup-buttons">
              <Buttons
                text="Yes, Archive"
                addedClassName="btn btn-delete"
                onClick={handleConfirmDelete}
              />
              <Buttons
                text="Cancel"
                addedClassName="btn btn-cancel"
                onClick={() => {
                  setConfirmUserDelete(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
