import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL, branches } from "../../Constants";
import "../../css/activityLog/activityLog.css";
import SelectFilter from "../../components/selectFilter/SelectFilter";

export default function ActivityLogs() {
  const [allLogs, setAllLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedAction, setSelectedAction] = useState("");

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

  const actions = [...new Set(allLogs.map((log) => log.action))];

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

  return (
    <div className="logs-main-container">
      <div className="w-full bg-amber-200">
        <SelectFilter
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          fixOption="All Actions"
          disabledOption="Select Action"
          mainOptions={[...new Set(allLogs.map((log) => log.action))]}
          getOptionValue={(opt) => opt}
          getOptionLabel={(opt) => opt}
          className="!w-3/12 !h-[50px] bg-green-400 ml-4"
        />
        <SelectFilter
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          fixOption="All Months"
          disabledOption="Select Month"
          mainOptions={months}
          getOptionValue={(opt) => opt}
          getOptionLabel={(opt) => opt}
          className="!w-3/12 !h-[50px] bg-red-400"
        />
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
