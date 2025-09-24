import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import chevronIcon from "../../assets/forAll/chevron.svg";
import logo from "../../assets/logo/logo.png";
import samplepic from "../../assets/students/sample-minji.svg";
import ExportDropdown from "../../components/ExportDropdown/ExportDropdown";
import SelectFilter from "../../components/selectFilter/SelectFilter";
import { API_URL, branches } from "../../Constants";
import { ActiveContext, UserLoggedInContext } from "../../contexts/Contexts";
import "../../css/activityLog/activityLog.css";
import Header from "../../components/header/Header";
import PaginationControl from "../../components/paginationControls/PaginationControl";


export default function ActivityLogs() {
  const [allLogs, setAllLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const { currentUserBranch, currentWebUser } = useContext(UserLoggedInContext);
  const { theme, themeWithOpacity } = useContext(ActiveContext)

  const [cardActive, setCardActive] = useState(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const toggleCard = (index) => {
    setCardActive((prev) => (prev === index ? null : index));
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [totalLogs, setTotalLogs] = useState(0);

  useEffect(() => {
    if (!currentWebUser) return;

    const fetchLogs = async () => {
      try {
        const start = startDate ? startDate.toISOString() : "";
        const end = endDate ? endDate.toISOString() : "";

        const response = await axios.get(`${API_URL}/getLogs`, {
          params: {
            page: currentPage,
            limit: usersPerPage,
            action: selectedAction !== "All" ? selectedAction : "",
            month: selectedMonth !== "All" ? selectedMonth : "",
            startDate: start,
            endDate: end,
          },
        });

        let { logs, total } = response.data;

        if (currentWebUser.position?.toLowerCase().trim() !== "super admin") {
          logs = logs.filter(
            (log) => log.position?.toLowerCase().trim() !== "super admin"
          );
        }

        setAllLogs(logs);
        setFilteredLogs(logs);
        setTotalLogs(total);
        console.log("total", total);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLogs();
  }, [
    currentWebUser,
    currentPage,
    selectedAction,
    selectedMonth,
    startDate,
    endDate,
  ]);

  const [allActions, setAllActions] = useState([]);
  useEffect(() => {
    const fetchActions = async () => {
      try {
        const response = await axios.get(`${API_URL}/allActions`);
        console.log("actions", response.data.actions);
        setAllActions(response.data.actions);
      } catch (error) {
        console.error("Error fetching actions:", error);
      }
    };

    fetchActions();
  }, []);

  const actionOptions = [
    { label: "All", value: "All" },
    ...allActions.map((a) => ({ label: a, value: a })),
  ];

  useEffect(() => {
    let logs = allLogs;

    if (selectedMonth && selectedMonth !== "All") {
      logs = logs.filter((log) => {
        const logMonth = new Date(log.createdAt).toLocaleString("en-US", {
          month: "long",
        });
        return logMonth === selectedMonth;
      });
    }

    if (selectedAction && selectedAction !== "All") {
      logs = logs.filter((log) => log.action === selectedAction);
    }

    if (startDate && endDate) {
      logs = logs.filter((log) => {
        const logDate = new Date(log.createdAt);
        const inclusiveEndDate = new Date(endDate);
        inclusiveEndDate.setHours(23, 59, 59, 999);
        return logDate >= startDate && logDate <= inclusiveEndDate;
      });
    }

    setFilteredLogs(logs);
  }, [selectedMonth, selectedAction, startDate, endDate]);

  const currentLogs = filteredLogs;

  //EXPORT TO CSV
  const exportActLogsToCSV = (data, filename) => {
    if (!currentWebUser) {
      alert("User not found. Please log in.");
      return;
    }

    const now = new Date().toLocaleString();
    const headers = ["Date", "Activity", "User", "Details"];
    const rows = data.map((log) => {
      const date = new Date(log.createdAt).toLocaleString();
      const activity = log.action || "";
      const user = log.name || "";
      const details = log.description || "";
      return [date, activity, user, details];
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

  //EXPORT TO PDF
  const exportActLogsToPDF = async (data, title) => {
    if (!currentWebUser) {
      alert("User not found. Please log in.");
      return;
    }

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

    const rows = data.map((log) => {
      const date = new Date(log.createdAt).toLocaleString();
      const activity = log.action || "";
      const user = log.name || "";
      const details = log.description || "";
      return [date, activity, user, details];
    });

    autoTable(doc, {
      head: [["Date", "Activity", "User", "Details"]],
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
    <div className="logs-main-container">
      <div className="w-full h-auto bg-white rounded-xl">
        <Header
          id={"logs"}
          title="Activity Logs"
          exportToCSV={() => exportActLogsToCSV(filteredLogs, "Activity_Logs")}
          exportToPDF={() => exportActLogsToPDF(filteredLogs, "Activity_Logs")}
        />
      </div>

      <div 
        className="w-full h-[calc(100svh-145px)] rounded-xl mt-5"
        style={{ backgroundColor: themeWithOpacity }}
      >
        <div className="w-full h-[80px] flex items-center pl-10">
          <div className="flex gap-6">
            <SelectFilter
              ariaLabel={"Select Action"}
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value);
                setCurrentPage(1);
              }}
              fixOption=""
              disabledOption="Select Action"
              mainOptions={actionOptions}
              getOptionValue={(opt) => opt.value}
              getOptionLabel={(opt) => opt.label}
            />

            <div className="flex items-center gap-4 ml-20">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Start Date"
                className="border px-3 py-2 rounded w-[200px] bg-white"
              />
              <span>-</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="End Date"
                className="border px-3 py-2 rounded w-[200px] bg-white"
              />
            </div>
          </div>
        </div>

        <div className="logs-main-container h-[calc(100svh-305px)] overflow-y-auto">
          <div className="w-full bg-white flex items-center justify-center">
            <div className="w-[90svw] font-bold text-[20px] flex justify-between items-center pb-2">
              <div className="w-3/11">Name</div>
              <div className="w-[22%]">Campus</div>
              <div className="w-[22%]">Action</div>
              <div className="w-3/9">Description</div>
              <div className="w-3/11">Timestamp</div>
            </div>
          </div>
          <div className="users-main-container px-10">
            {currentLogs.map((log, index) => (
              <div
                key={index}
                className="user-card bg-white hover:bg-[#35408E]"
              >
                <div className="user-table flex justify-between items-center">
                  <div className="user-name-cell w-3/12 flex items-center">
                    <img
                      src={log.useravatar || samplepic}
                      alt={log.name || "User"}
                      className="mini-avatar"
                    />
                    <span className="text-[18px] font-medium ml-2">
                      {log.name || "--"}
                    </span>
                  </div>

                  <div className="w-[20%] text-[18px]">
                    {branches.find((b) => b.id === log.branch)?.name ||
                      "Unknown Branch"}
                  </div>

                  <div className="w-[20%] text-[18px]">{log.action}</div>

                  <div
                    className={`w-3/10 text-[18px] mr-5 text-center ${
                      cardActive === index
                        ? "whitespace-normal break-words"
                        : "overflow-hidden whitespace-nowrap text-ellipsis"
                    }`}
                    title={cardActive === index ? "" : log.description}
                  >
                    {log.description || "-"}
                  </div>

                  <div className="w-3/13 text-[18px]">
                    {new Date(log.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>

                  <div className="w-[40px] flex justify-end mr-5">
                    {log.description && log.description.length > 40 && (
                      <button
                        type="button"
                        className={`acc-chevron transition-transform duration-300 ${
                          cardActive === index ? "rotate-180" : "rotate-0"
                        }`}
                        aria-label="Toggle details"
                        onClick={() => toggleCard(index)}
                      >
                        <img
                          src={chevronIcon}
                          alt="toggle details"
                          className="chevron-icon"
                        />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <PaginationControl
          currentPage={currentPage}
          totalItems={totalLogs}
          goToPrevPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          goToNextPage={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, Math.ceil(totalLogs / 10))
            )
          }
        />
      </div>
    </div>
  );
}
