import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { API_URL, branches } from "../../Constants";
import "../../css/activityLog/activityLog.css";
import SelectFilter from "../../components/selectFilter/SelectFilter";
import ExportDropdown from "../../components/ExportDropdown/ExportDropdown";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/logo/logo.png";
import { UserLoggedInContext } from "../../contexts/Contexts";
import chevronIcon from "../../assets/forAll/chevron.svg";
import samplepic from "../../assets/students/sample-minji.svg";

export default function ActivityLogs() {
  const [allLogs, setAllLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const { currentUserBranch, currentWebUser } = useContext(UserLoggedInContext);

  const [cardActive, setCardActive] = useState(null);

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

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${API_URL}/getLogs`);
        setAllLogs(response.data);
        setFilteredLogs(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLogs();
  }, []);

  const actions = Array.from(new Set(allLogs.map((log) => log.action)));
  const actionOptions = [{ label: "All", value: "All" }, ...actions.map((a) => ({ label: a, value: a }))];
  const monthOptions = [{ label: "All", value: "All" }, ...months.map((m) => ({ label: m, value: m }))];


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

    setFilteredLogs(logs);
  }, [selectedMonth, selectedAction, allLogs]);


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
      head: [["Date", "Activity", "User", "Details", "Timestamp"]],
      body: rows,
      startY: 30,
    });

    doc.save(
      `${title.replace(" ", "_")}_by_${currentWebUser.firstName}_${currentWebUser.lastName}.pdf`
    );
  };


  return (
    <div className="logs-main-container">
      <div className="logs-header">
        <h1 className="logs-title">Activity Logs</h1>

        <div className="flex flex-wrap items-center justify-between w-full mb-7 mt-5 px-4">

          <div className="flex gap-6">
            <SelectFilter
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              fixOption=""
              disabledOption="Select Action"
              mainOptions={actionOptions}
              getOptionValue={(opt) => opt.value}
              getOptionLabel={(opt) => opt.label}
            />

            <SelectFilter
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              fixOption=""
              disabledOption="Select Month"
              mainOptions={monthOptions}
              getOptionValue={(opt) => opt.value}
              getOptionLabel={(opt) => opt.label}
            />
          </div>

      
          <div className="mt-1">
            <ExportDropdown
              onExport={(format) => {
                if (format === "csv")
                  exportActLogsToCSV(filteredLogs, "Activity_Logs");
                else if (format === "pdf")
                  exportActLogsToPDF(filteredLogs, "Activity_Logs");
              }}
            />
          </div>
        </div>

          <div className="logs-main-container h-screen overflow-y-auto">
            <div className="users-main-container px-10">
            
            <div className="user-table font-bold text-[20px] flex justify-between items-center pb-2 mb-2">
              <div className="w-3/11">Name</div>
              <div className="w-[22%]">Branch</div>
              <div className="w-[22%]">Action</div>
              <div className="w-3/9">Description</div>
              <div className="w-3/11">Timestamp</div>
              <div className="w-[50px]"></div>
            </div>

            {filteredLogs.map((log, index) => (
              <div key={index} className="user-card">
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
                    {branches.find((b) => b.id === log.branch)?.name || "Unknown Branch"}
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
                    {log.description && log.description.length > 60 && (
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

    </div>
    </div>

  );
}
