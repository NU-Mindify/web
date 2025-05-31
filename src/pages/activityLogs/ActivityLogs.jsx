import axios from "axios"
import { useEffect, useState } from "react"
import { API_URL, branches } from "../../Constants"
import "../../css/activityLog/activityLog.css"



export default function ActivityLogs(){

    const [allLogs, setAllLogs] = useState([])

    
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get(`${API_URL}/getLogs`);
                console.log(response.data); 
                setAllLogs(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchLogs();
    }, []);
    
    




    return(
        <>
            <div className="logs-main-container">
                <table className="w-full h-full text-center text-black font-[poppins] text-xl">
                    <tr>
                        <td  className="border border-black">Name</td>
                        <td  className="border border-black">Branch</td>
                        <td  className="border border-black">Action</td>
                        <td  className="border border-black">Description</td>
                        <td  className="border border-black">Timestamp</td>
                    </tr>
                    {
                        allLogs.map((log) => (
                            <tr>
                                <td className="h-[100px]">{log.name}</td>
                                <td className="h-[100px]">{ branches.find((b) => b.id === log.branch)?.name || "Unknown Branch"}</td>
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
                        ))
                    }
                </table>
            </div>
        </>
    )
}