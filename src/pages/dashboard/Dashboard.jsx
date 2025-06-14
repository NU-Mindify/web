import { useContext } from "react";
import "../../css/dashboard/dashboard.css";
import Chart from "chart.js/auto";
import { ActiveContext, UserLoggedInContext } from "../../contexts/Contexts";
import BarGraph from "../../components/barGraph/BarGraph";
import axios from "axios";
import { useState, useEffect } from "react";
import { API_URL, categories, modes, levels, branches } from "../../Constants";
import { useNavigate } from "react-router-dom";
import CountUp from "../../components/CountUp/CountUp";

export default function Dashboard() {
  const { currentWebUser } = useContext(UserLoggedInContext);
  const navigate = useNavigate();

  const [studentCount, setStudentCount] = useState(0);
  const [students, setStudents] = useState([]);

  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingUserCount, setPendingUserCount] = useState(0);

  const [attempts, setAttempts] = useState([]);
  const [avgScoresByWorld, setAvgScoresByWorld] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAttempts, setIsLoadingAttempts] = useState(false);

  const [mostChallengingWorld, setMostChallengingWorld] = useState(null);
  const [mostChallengingWorldScore, setMostChallengingWorldScore] =
    useState(null);

  const [bestPerformingWorld, setBestPerformingWorld] = useState(null);
  const [bestPerformingWorldScore, setBestPerformingWorldScore] =
    useState(null);

  const [classicLeaderboards, setClassicLeaderboards] = useState([]);
  const [leaderboardsMastery, setLeaderboardsMastery] = useState([]);
  const [loadingDataClassic, setLoadingDataClassic] = useState(false);
  const [loadingDataMastery, setLoadingDataMastery] = useState(false);
  const [leaderboardMode, setLeaderboardMode] = useState("classic");

  useEffect(() => {
    if (!currentWebUser?.token) return;
    fetchStudents();
    fetchAttempts();
    fetchTopClassicLeaderboard();
    fetchTopMasteryLeaderboard();
    fetchPendingUsers();
  }, [currentWebUser]);

  const fetchTopClassicLeaderboard = async () => {
    setLoadingDataClassic(true);
    try {
      const response = await axios.get(`${API_URL}/getTopLeaderboards`, {
        params: { mode: "competition" },
      });
      setClassicLeaderboards(response.data);
    } catch (error) {
      console.error("Error fetching top leaderboards:", error.message);
    } finally {
      setLoadingDataClassic(false);
    }
  };

  const fetchTopMasteryLeaderboard = async () => {
    setLoadingDataMastery(true);
    try {
      const response = await axios.get(`${API_URL}/getTopLeaderboards`, {
        params: { mode: "mastery" },
      });
      setLeaderboardsMastery(response.data);
    } catch (error) {
      console.error("Error fetching top leaderboards:", error.message);
    } finally {
      setLoadingDataMastery(false);
    }
  };

  //set amount of students
  useEffect(() => {
    setStudentCount(students.length);
  }, [students]);

  //fetch students data
  const fetchStudents = async () => {
    setIsLoading(true);
    axios
      .get(`${API_URL}/getUsers`, {
        headers: {
          Authorization: `Bearer ${currentWebUser.token}`,
        },
      })
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

  //set amount of pending users
  useEffect(() => {
    setPendingUserCount(pendingUsers.length);
  }, [pendingUsers]);

  //fetch pending users data
  const fetchPendingUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/getWebUsers/`);
      let pendingUsers = res.data.filter((user) => user.isApproved === false);

      setPendingUsers(pendingUsers);
      console.log("Pending Users: " + pendingUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //fetch attempts data
  const fetchAttempts = async () => {
    setIsLoadingAttempts(true);
    try {
      const categoryList = categories.map((c) => c.id).join(",");
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

  //calculates for lowest average score per world to get the most challenging world
  useEffect(() => {
    if (attempts.length === 0) return;

    const categoryScores = {};

    attempts.forEach(({ category, correct }) => {
      if (!category) return;

      if (!categoryScores[category]) {
        categoryScores[category] = { correctSum: 0, attempts: 0 };
      }

      categoryScores[category].correctSum += correct;
      categoryScores[category].attempts += 1;
    });

    let lowestAvg = Infinity;
    let bottomCategory = null;

    for (const category in categoryScores) {
      const { correctSum, attempts } = categoryScores[category];
      const avgScore = correctSum / attempts;

      if (avgScore < lowestAvg) {
        lowestAvg = avgScore;
        bottomCategory = category;
      }
    }

    if (bottomCategory) {
      setMostChallengingWorld(bottomCategory);
      setMostChallengingWorldScore(
        parseFloat(((lowestAvg / 8) * 100).toFixed(2))
      );
    } else {
      setMostChallengingWorld("N/A");
      setMostChallengingWorldScore(null);
    }
  }, [attempts]);

  //calculates the highest average score per world to get the best performing world
  useEffect(() => {
    if (attempts.length === 0) return;

    const categoryScores = {};

    attempts.forEach(({ category, correct, total_items }) => {
      if (!category || total_items === 0) return;

      if (!categoryScores[category]) {
        categoryScores[category] = { correct: 0, total: 0 };
      }

      categoryScores[category].correct += correct;
      categoryScores[category].total += total_items;
    });

    let highestAvg = -1;
    let topCategory = null;

    for (const category in categoryScores) {
      const { correct, total } = categoryScores[category];
      const avgScore = (correct / total) * 8;

      if (avgScore > highestAvg) {
        highestAvg = avgScore;
        topCategory = category;
      }
    }

    if (topCategory) {
      setBestPerformingWorld(topCategory);
      setBestPerformingWorldScore(
        parseFloat(((highestAvg / 8) * 100).toFixed(2))
      );
    } else {
      setBestPerformingWorld("N/A");
      setBestPerformingWorldScore(null);
    }
  }, [attempts]);

  // TODO: Loading screen
  if (!currentWebUser) {
    return;
  }
  const branch =
    branches.find((branch) => branch.id === currentWebUser.branch)?.name ||
    "Unknown Branch";

  //get no. of students per branch
  const branchData = branches
    .map((branch) => {
      const studentCount = students.filter(
        (s) => s.branch === branch.id
      ).length;
      return {
        label: branch.name,
        count: studentCount,
      };
    })
    .sort((a, b) => b.count - a.count);

  const formatTime = (seconds) => {
    if (seconds < 60) {
      return `${seconds.toFixed(2)}s`;
    } else {
      const mins = Math.floor(seconds / 60);
      const secs = (seconds % 60).toFixed(0);
      return `${mins}m ${secs}s`;
    }
  };

  return (
    <div className="main-container-dashboard">
      <div className="dashboard-header">
        <h1 className="header-text-dashboard">Dashboard</h1>
        <h2 className="header-greeting-dashboard">
          {`Hi, ${currentWebUser.firstName} 
          ${
            currentWebUser?.position?.toLowerCase() === "super admin"
              ? "My lord"
              : `from ${branch}`
          }. 
          Welcome back to NU Mindify!`}
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
            <div className="w-full h-full flex items-center justify-center flex-col">
              <h1 className="dashboard-title mb-2 font-[Poppins] text-[23px]">
                Total Students
              </h1>
              <h1 className="dashboard-title font-[Poppins] font-bold text-[50px] mt-3">
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
            <div className="w-full h-full flex items-center justify-center flex-col">
              <h1 className="dashboard-title mb-2 font-[Poppins] text-[23px]">
                Overall Average Score
              </h1>

              <h2 className="text-3xl font-bold font-[Poppins] text-[50px] text-black mt-3">
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
          {isLoadingAttempts ? (
            <div className="loading-overlay-dashboard">
              <div className="spinner"></div>
              <p>Fetching data...</p>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center flex-col">
              <h1 className="dashboard-title mb-2 font-[Poppins]">
                Most Challenging World
              </h1>
              {mostChallengingWorld === "N/A" ? (
                <h2 className="text-3xl font-bold">No Data</h2>
              ) : (
                <>
                  <h2 className="text-xl capitalize mb-1 text-[#FFBF1A] font-[Poppins]">
                    {mostChallengingWorld + " Psychology"}
                  </h2>
                  <h2 className="text-[20px] capitalize mb-1 text-black font-[Poppins]">
                    Average Score
                  </h2>
                  <h2 className="text-3xl font-bold text-black font-[Poppins] text-[50px]">
                    <CountUp end={mostChallengingWorldScore} decimals={2} />%
                  </h2>
                </>
              )}
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
            <div className="w-full h-full flex items-center justify-center flex-col cursor-pointer" onClick={() => navigate("/account/approval")}>
              {isLoading ? (
                <div className="loading-overlay-dashboard">
                  <div className="spinner"></div>
                  <p>Fetching data...</p>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center flex-col">
                  <h1 className="dashboard-title mb-2 font-[Poppins] text-[23px]">
                    Pending Accounts
                  </h1>
                  <h1 className="dashboard-title font-[Poppins] font-bold text-[50px] mt-3">
                    <CountUp end={pendingUserCount} />
                  </h1>
                </div>
              )}
              {/* {bestPerformingWorld === "N/A" ? (
                <h2 className="text-3xl font-bold">No Data</h2>
              ) : (
                <>
                  <h2 className="text-xl capitalize mb-1 font-[Poppins] text-[#FFBF1A]">
                    {bestPerformingWorld + " Psychology"}
                  </h2>
                  <h2 className="text-[20px] capitalize mb-1 text-black font-[Poppins]">
                    Average Score
                  </h2>
                  <h2 className="text-3xl font-bold text-black font-[Poppins] text-[50px]">
                    <CountUp end={bestPerformingWorldScore} decimals={2} />%
                  </h2>
                </>
              )} */}
            </div>
          )}
        </div>
      </div>

      <div className="reports-title-container-dashboard">
        <h1 className="reports-title-properties-dashboard">Reports</h1>
      </div>

      <div className="reports-content-container-dashboard">
        <div className="total-students-container-dashboard">
          {isLoadingAttempts ? (
            <div className="loading-overlay-dashboard">
              <div className="spinner"></div>
              <p>Fetching data...</p>
            </div>
          ) : (
            <div className="w-full h-10/12 flex flex-col justify-center items-center p-4">
              <div className="w-full flex flex-col mb-4">
                <h1 className="text-black text-2xl font-bold font-[poppins]">
                  Total Students
                </h1>
                <p className="text-black font-[poppins]">per campus</p>
              </div>
              <BarGraph data={branchData} />
            </div>
          )}
        </div>
        <div className="badges-container-dashboard">
          <h1 className="text-black">Badges Placeholder</h1>
        </div>
        <div
          className="leaderboards-container-dashboard"
          style={{
            overflowX: "auto",
            padding: "1rem",
            backgroundColor: "#fff",
            borderRadius: "8px",
          }}
        >
          <div className="flex bg-[#F5F6F8] p-1 rounded-xl w-[300px] mb-4">
            <button
              onClick={() => setLeaderboardMode("classic")}
              className={`w-1/2 py-2  rounded-xl font-semibold 
              ${
                leaderboardMode === "classic"
                  ? "bg-white  text-[#FFA500] shadow-sm"
                  : "bg-transparent text-gray-400"
              }`}
            >
              Competition
            </button>

            <button
              onClick={() => setLeaderboardMode("mastery")}
              className={`w-1/2 py-2  rounded-xl font-semibold
              ${
                leaderboardMode === "mastery"
                  ? "bg-white text-[#FFD700] shadow-sm"
                  : "bg-transparent text-gray-400"
              }`}
            >
              Mastery
            </button>
          </div>

          {(
            leaderboardMode === "classic"
              ? loadingDataClassic
              : loadingDataMastery
          ) ? (
            <div
              className="loading-overlay-dashboard"
              style={{ height: "150px" }}
            >
              <div className="spinner"></div>
              <p>Loading {leaderboardMode} leaderboard...</p>
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                fontSize: "0.85rem",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  className="text-black"
                  style={{ borderBottom: "1px solid #ddd" }}
                >
                  <th className="leaderboard-th">Username</th>
                  <th className="leaderboard-th">Branch</th>
                  <th className="leaderboard-th">World</th>
                  <th className="leaderboard-th">Score (%)</th>
                  <th className="leaderboard-th">Time (s)</th>
                </tr>
              </thead>
              <tbody>
                {(leaderboardMode === "classic"
                  ? classicLeaderboards
                  : leaderboardsMastery
                )
                  .map((item) => ({
                    ...item,
                    calculatedScore: item.total_items
                      ? (item.correct / item.total_items) * 100
                      : 0,
                  }))
                  .sort((a, b) => b.calculatedScore - a.calculatedScore)
                  .slice(0, 10)
                  .map((item, index) => {
                    const user = item.user_id || {};
                    const scorePercent = item.total_items
                      ? item.calculatedScore.toFixed(0) + "%"
                      : "N/A";

                    return (
                      <tr
                        key={item._id}
                        style={{
                          borderBottom: "1px solid #eee",
                          textAlign: "center",
                        }}
                      >
                        <td className="text-black" style={{ padding: "6px" }}>
                          {index + 1}. {user.username || "Unknown"}
                        </td>
                        <td
                          className="text-black"
                          style={{ padding: "6px", textTransform: "uppercase" }}
                        >
                          {user.branch || item.branch || "N/A"}
                        </td>
                        <td
                          className="text-black"
                          style={{
                            padding: "6px",
                            textTransform: "capitalize",
                          }}
                        >
                          {item.category || "N/A"}
                        </td>
                        <td className="text-black" style={{ padding: "6px" }}>
                          {scorePercent}
                        </td>
                        <td className="text-black px-2 py-1 text-center text-sm">
                          {formatTime(item.time_completion)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
