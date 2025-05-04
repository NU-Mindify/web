import { useContext } from "react";
import "../../css/dashboard/dashboard.css";
import logo from "../../assets/logo/logo.svg";
import Chart from "chart.js/auto";
import { ActiveContext, UserLoggedInContext } from "../../contexts/Contexts";
import BarGraph from "../../components/barGraph/BarGraph";

import axios from "axios";
import { useState, useEffect } from "react";
import { API_URL, categories, modes, levels } from "../../Constants";
import CountUp from "../../components/CountUp/CountUp";

export default function Dashboard() {
  const { currentWebUser } = useContext(UserLoggedInContext);

  const [studentCount, setStudentCount] = useState(0);
  const [students, setStudents] = useState([]);

  const [attempts, setAttempts] = useState([]);
  const [avgScoresByWorld, setAvgScoresByWorld] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAttempts, setIsLoadingAttempts] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchAttempts();
  }, []);

  //set amount of students
  useEffect(() => {
    setStudentCount(students.length);
  }, [students]);

  //fetch students data
  const fetchStudents = async () => {
    setIsLoading(true);
    axios
      .get(`${API_URL}/getUsers`)
      .then((response) => {
        console.log(response.data);
        setStudents(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  //fetch attempts data
  const fetchAttempts = async () => {
    setIsLoadingAttempts(true);
    try {
      const categoryList = categories.map((c) => c.category).join(",");
      const levelList = levels.join(",");
      const modeList = modes.map((m) => m.mode).join(",");

      const response = await axios.get(`${API_URL}/getAnalytics`, {
        params: {
          categories: categoryList,
          levels: levelList,
          mode: modeList,
        },
      });

      console.log(response.data);
      setAttempts(response.data);
    } catch (error) {
      console.error("Error fetching analytics data:", error.message);
    } finally {
      setIsLoadingAttempts(false);
    }
  };

  // Calculate the overall average score
  useEffect(() => {
    if (attempts.length === 0) return;

    let totalCorrect = 0;
    let totalItems = 0;

    attempts.forEach(({ correct, total_items }) => {
      if (typeof correct === "number" && typeof total_items === "number") {
        totalCorrect += correct;
        totalItems += total_items;
      }
    });

    const overallAverage =
      totalItems === 0 ? "N/A" : ((totalCorrect / totalItems) * 100).toFixed(0);

    setAvgScoresByWorld({ overall: overallAverage });
  }, [attempts]);

  // TODO: Loading screen
  if (!currentWebUser) {
    return;
  }
  const branch = currentWebUser.branch.toUpperCase();

  return (
    <div className="main-container-dashboard">
      <div className="dashboard-header">
        <h1 className="header-text-dashboard">Dashboard</h1>
        <h2 className="header-greeting-dashboard">
          Hi, {currentWebUser.firstName} {currentWebUser.lastName} from {branch}
          . Welcome back to NU Mindify!
        </h2>
      </div>

      <div className="analytics-container-dashboard">
        <div className="analytics-properties-dashboard">
          {isLoading ? (
            <div className="loading-overlay-dashboard">
              <div className="spinner"></div>
              <p>Fetching data...</p>
            </div>
          ) : (
            <div className="">
              <h1 className="dashboard-title font-[Poppins]">
                Total Students:
              </h1>
              <h1 className="dashboard-title font-[Poppins] font-bold text-[50px]">
                <CountUp end={studentCount} />
              </h1>
            </div>
          )}
        </div>

        <div className="analytics-properties-dashboard">
          {isLoadingAttempts ? (
            <div className="loading-overlay-dashboard">
              <div className="spinner"></div>
              <p>Fetching data...</p>
            </div>
          ) : (
            <div>
              <h1 className="dashboard-title mb-2 font-[Poppins]">
                Overall Average Score
              </h1>

              <h2 className="text-3xl font-bold font-[Poppins] text-[50px] text-black">
                {avgScoresByWorld.overall === "N/A" ? (
                  "No Data"
                ) : (
                  <CountUp end={parseFloat(avgScoresByWorld.overall)} />
                )}
                {avgScoresByWorld.overall !== "N/A" && "%"}
              </h2>
            </div>
          )}
        </div>

        <div className="analytics-properties-dashboard">
          <h1 className="dashboard-title">
            Average student session time placeholder
          </h1>
        </div>
        <div className="analytics-properties-dashboard">
          <h1 className="dashboard-title">Least Attempted World placeholder</h1>
        </div>
        <div className="analytics-properties-dashboard">
          <h1 className="dashboard-title">Most Attempted World placeholder</h1>
        </div>
      </div>

      <div className="reports-title-container-dashboard">
        <h1 className="reports-title-properties-dashboard">Reports</h1>
      </div>

      {/* <div className="loading-overlay-dashboard">
        <div className="spinner"></div>
        <p>Fetching data...</p>
      </div> */}

      <div className="reports-content-container-dashboard">
        <div className="total-students-container-dashboard">
          <BarGraph />
        </div>
        <div className="badges-container-dashboard">
          <h1 className="text-black">Badges Placeholder</h1>
        </div>
        <div className="leaderboards-container-dashboard">
          <h1 className="text-black">
            Leaderboards per Branch (only top 10) placeholder
          </h1>
        </div>
      </div>
    </div>
  );
}
