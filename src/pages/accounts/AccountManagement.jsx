import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { API_URL, fetchBranches } from "../../Constants";
import logo from "../../assets/logo/logo.png";
import searchIcon from "../../assets/students/search-01.svg";
import Buttons from "../../components/buttons/Buttons";
import SearchBar from "../../components/searchbar/SearchBar";
import SelectFilter from "../../components/selectFilter/SelectFilter";
import UserContentsTable from "../../components/tableForContents/UserContentsTable";
import { ActiveContext, UserLoggedInContext } from "../../contexts/Contexts";
import "../../css/account/account.css";
import Header from "../../components/header/Header";
import PaginationControl from "../../components/paginationControls/PaginationControl";
import ToggleButton from "../../components/toggleButton/ToggleButton";


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
  const [showArchived, setShowArchived] = useState(false);

  const navigate = useNavigate();
  const usersPerPage = 10;
  const { currentUserBranch, currentWebUser } = useContext(UserLoggedInContext);
  const { theme , themeWithOpacity } = useContext(ActiveContext)

  const [confirmUserDelete, setConfirmUserDelete] = useState(null);
  const [confirmUnarchive, setConfirmUnarchive] = useState(null);

  const [totalItems, setTotalItems] = useState(0);

  const fetchUsers = useCallback(async () => {
    if (!currentUserBranch) return;
    setIsLoading(true);

    try {
      const res = await axios.get(`${API_URL}/getWebUsers`, {
        params: {
          page: currentPage,
          limit: usersPerPage,
          branch: selectedBranch || currentUserBranch,
          position: selectedPosition || "all",
          search: searchQuery || "",
        },
      });

      setWebUsers(res.data.data);
      setTotalItems(res.data.total);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, usersPerPage, selectedBranch, currentUserBranch, selectedPosition, searchQuery]);

  const handleConfirmDelete = useCallback(async () => {
    if (!confirmUserDelete) return;
    try {
      await axios.put(`${API_URL}/deleteWebUser/${confirmUserDelete._id}`, {
        user_id: confirmUserDelete._id,
        is_deleted: true,
      });
      await fetchUsers();
      setCardActive(null);

      await axios.post(`${API_URL}/addLogs`, {
        name: `${currentWebUser.firstName} ${currentWebUser.lastName}`,
        branch: currentWebUser.branch,
        action: "Archived a User",
        description: `${currentWebUser.firstName} archived ${confirmUserDelete.firstName} ${confirmUserDelete.lastName}'s account.`,
        position: currentWebUser.position,
        useravatar: currentWebUser.useravatar,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmUserDelete(null);
    }
  }, [confirmUserDelete, currentWebUser, fetchUsers]);

  const handleUnarchiveUser = useCallback(async () => {
    if (!confirmUnarchive) return;
    try {
      await axios.put(`${API_URL}/deleteWebUser/${confirmUnarchive._id}`, {
        user_id: confirmUnarchive._id,
        is_deleted: false,
      });
      await fetchUsers();
      setCardActive(null);

      await axios.post(`${API_URL}/addLogs`, {
        name: `${currentWebUser.firstName} ${currentWebUser.lastName}`,
        branch: currentWebUser.branch,
        action: "Unarchived a User",
        description: `${currentWebUser.firstName} unarchived ${confirmUnarchive.firstName} ${confirmUnarchive.lastName}'s account.`,
        position: currentWebUser.position,
        useravatar: currentWebUser.useravatar,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmUnarchive(null);
    }
  }, [confirmUnarchive, currentWebUser, fetchUsers]);

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
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBranch, selectedPosition]);

  const uniquePositions = useMemo(() =>
    Array.from(
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
    ), [webUsers, currentWebUser?.position]);

  const filteredUsers = useMemo(() =>
    webUsers
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
    }), [webUsers, currentWebUser?.position, searchQuery, selectedBranch, selectedPosition, showArchived, sortOrderAsc]);

  const currentUsers = filteredUsers; // This is now memoized because filteredUsers is.

  const toggleCard = (id) => {
    setCardActive((prev) => (prev === id ? null : id));
  };

  const getBranchName = useCallback(
    (branchId) =>
      branches.find((b) => b.id === branchId)?.name || "Unknown Branch",
    [branches]
  );

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
    { key: "name", label: "Name", className: "flex flex-row items-center flex-grow" },
    { key: "position", label: "Position", className: "w-1/4" },
    { key: "branch", label: "Campus", className: "w-1/4" },
    { key: "action", label: "Action", className: "w-1/5" },
  ];

  // EXPORT TO CSV for Accounts
  const exportAccountsToCSV = useCallback((data, filename) => {
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
  }, [currentWebUser, branches]);

  // convert logo to base64 para lumabas sa pdf
  const getBase64FromUrl = useCallback(async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }, []);

  // EXPORT TO PDF for Accounts
  const exportAccountsToPDF = useCallback(async (data, title) => {
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
  }, [currentWebUser, branches, getBase64FromUrl]);

  // 🔁 Archive / Unarchive handler for the icon
  const handleArchiveToggle = useCallback(async (user) => {
    try {
      const newStatus = !user.is_deleted; // toggle
      await axios.put(`${API_URL}/deleteWebUser/${user._id}`, {
        user_id: user._id,
        is_deleted: newStatus,
      });

      await fetchUsers();
      setCardActive(null);

      await axios.post(`${API_URL}/addLogs`, {
        name: `${currentWebUser.firstName} ${currentWebUser.lastName}`,
        branch: currentWebUser.branch,
        action: newStatus ? "Archived a User" : "Unarchived a User",
        description: `${currentWebUser.firstName} ${
          newStatus ? "archived" : "unarchived"
        } ${user.firstName} ${user.lastName}'s account.`,
        position: currentWebUser.position,
        useravatar: currentWebUser.useravatar,
      });
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  }, [currentWebUser, fetchUsers]);

  return (
    <div className="account-main-container overflow-hidden">
      <div className="w-full h-[100px] rounded-xl">
        <Header
          id={"account"}
          title={"Account Management"}
          exportToCSV={() =>
            exportAccountsToCSV(filteredUsers, "Accounts_List")
          }
          exportToPDF={() =>
            exportAccountsToPDF(filteredUsers, "Accounts_List")
          }
        />
      </div>

      <div 
        className="w-full h-[calc(100svh-140px)] mt-5 rounded-xl flex flex-col"
        style={{ backgroundColor: themeWithOpacity }}
      >
        <div className="w-full h-[100px] flex justify-between pl-15 pr-30 items-center">
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
            addedClassName="w-[70%] h-[50px]"
          />

          <Buttons
            text="Pending Account"
            onClick={() => navigate("/account/approval")}
            addedClassName="btn !w-[250px]"
          />
        </div>

        <div className="w-full h-[80px]">
          <div className="w-1/2 h-full flex justify-between  items-center">
            <ToggleButton
              showLeftChoice={() => setShowArchived(false)}
              showRightChoice={() => setShowArchived(true)}
              useStateToShow={showArchived}
              textLeftChoice={"All Admins"}
              textRightChoice={"Archive"}
            />

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
          onArchiveClick={(user, action) => {
            if (action === "archive") {
              setConfirmUserDelete(user);
            } else {
              setConfirmUnarchive(user);
            }
          }}
        />

        <PaginationControl
          currentPage={currentPage}
          totalItems={filteredUsers.length}
          goToPrevPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          goToNextPage={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(totalItems / 5)))}
        />

      </div>

      {confirmUnarchive && (
        <div className="modal-overlay confirm-delete-popup !w-[100%] !h-[100%]">
          <div className="confirm-dialog !h-auto min-h-[180px] max-h-[300px]">
            <h2>Confirm Unarchive</h2>
            <p className="text-black text-[13px]">
              Are you sure you want to unarchive "
              <strong>
                {confirmUnarchive.firstName} {confirmUnarchive.lastName}
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
                onClick={() => setConfirmUnarchive(null)}
              />
            </div>
          </div>
        </div>
      )}

      {confirmUserDelete && (
        <div className="modal-overlay confirm-delete-popup !w-[100%] !h-[100%]">
          <div className="confirm-dialog !h-auto min-h-[180px] max-h-[300px]">
            <h2>Confirm Archive</h2>
            <p className="text-black text-[13px]">
              Are you sure you want to archive "
              <strong>
                {confirmUserDelete.firstName} {confirmUserDelete.lastName}
              </strong>
              "?
            </p>
            <div className="popup-buttons">
              <Buttons
                text="Yes, Archive"
                addedClassName="btn !btn-delete"
                onClick={handleConfirmDelete}
              />
              <Buttons
                text="Cancel"
                addedClassName="btn btn-cancel"
                onClick={() => setConfirmUserDelete(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CardActiveContent({ user }) {




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
      </div>
    </>
  );
}
