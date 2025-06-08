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

export default function ActivityLogs() {
  const [allLogs, setAllLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const { currentUserBranch, currentWebUser } = useContext(UserLoggedInContext);

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

    const titles = [
    { key: "name", label: "Name", className: "w-1/4" },
    { key: "branch", label: "Campus", className: "w-1/4" },
    { key: "action", label: "Action", className: "w-1/4" },
    { key: "description", label: "Description", className: "w-1/2" },
    { key: "timestamp", label: "Date", className: "w-1/4" },
  ];


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

        <div className="flex flex-wrap items-center gap-6 w-full mb-7 mt-5 ml-3">
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

          <div className="ml-225 mr-1 mt-1">
            <ExportDropdown
              onExport={(format) => {
                if (format === "csv") exportActLogsToCSV(filteredLogs, "Activity_Logs");
                else if (format === "pdf") exportActLogsToPDF(filteredLogs, "Activity_Logs");
              }}
            />  
          </div>

        </div>

        </div>

      <table className="w-full h-full text-center text-black font-[poppins] text-xl">
        <thead>
          <tr>
            <th className="border border-black">Name</th>
            <th className="border border-black">Branch</th>
            <th className="border border-black">Action</th>
            <th className="border border-black">Description</th>
            <th className="border border-black">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log, index) => (
            <tr key={index}>
              <td className="h-[100px]">{log.name}</td>
              <td className="h-[100px]">
                {branches.find((b) => b.id === log.branch)?.name ||
                  "Unknown Branch"}
              </td>
              <td className="h-[100px]">{log.action}</td>
              <td className="h-[100px]">{log.description}</td>
              <td className="h-[100px]">
                {new Date(log.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
