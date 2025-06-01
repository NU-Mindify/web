import axios from "axios"
import { useEffect, useState } from "react"
import { API_URL, branches } from "../../Constants"
import "../../css/activityLog/activityLog.css"

export default function ActivityLogs() {
    const [allLogs, setAllLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState("All");

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get(`${API_URL}/getLogs`);
                setAllLogs(response.data);
                setFilteredLogs(response.data); // initialize with all
            } catch (error) {
                console.error(error);
            }
        };
        fetchLogs();
    }, []);

    useEffect(() => {
        if (selectedMonth === "All") {
            setFilteredLogs(allLogs);
        } else {
            const filtered = allLogs.filter((log) => {
                const logMonth = new Date(log.createdAt).toLocaleString('en-US', { month: 'long' });
                return logMonth === selectedMonth;
            });
            setFilteredLogs(filtered);
        }
    }, [selectedMonth, allLogs]);

    return (
        <div className="logs-main-container">
            <select 
                className="!w-3/12 !h-[50px] bg-red-400"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
            >
                <option value="All">All Months</option>
                {months.map((month) => (
                    <option key={month} value={month}>{month}</option>
                ))}
            </select>

            <h1 className="text-black">{selectedMonth}</h1>

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
                            <td className="h-[100px]">{branches.find((b) => b.id === log.branch)?.name || "Unknown Branch"}</td>
                            <td className="h-[100px]">{log.action}</td>
                            <td className="h-[100px]">{log.description}</td>
                            <td className="h-[100px]">
                                {new Date(log.createdAt).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
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
