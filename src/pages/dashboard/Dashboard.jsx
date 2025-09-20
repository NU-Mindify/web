import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import mindifyLogo from "../../assets/logo/logo.svg";
import BarGraph from "../../components/barGraph/BarGraph";
import CountUp from "../../components/CountUp/CountUp";
import { API_URL, branches, categories, levels, modes } from "../../Constants";
import { UserLoggedInContext } from "../../contexts/Contexts";
import "../../css/dashboard/dashboard.css";
import { ActiveContext } from "../../contexts/Contexts";

export default function Dashboard() {
  const { currentWebUser } = useContext(UserLoggedInContext);


  const {
    setSelected,
  } = useContext(ActiveContext);

  const navigate = useNavigate();

  const [studentCount, setStudentCount] = useState(0);
  const [students, setStudents] = useState([]);

  const [webUsersCount, setWebUsersCount] = useState(0);
  const [webUsers, setWebUsers] = useState([]);

  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingUserCount, setPendingUserCount] = useState(0);

  const [attempts, setAttempts] = useState([]);
  const [avgScoresByWorld, setAvgScoresByWorld] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAttempts, setIsLoadingAttempts] = useState(false);

  const [topBadges, setTopBadges] = useState([]);
  const [loadingBadges, setLoadingBadges] = useState(false);

  const [mostChallengingWorld, setMostChallengingWorld] = useState(null);
  const [mostChallengingWorldScore, setMostChallengingWorldScore] = useState(null);

  const [classicLeaderboards, setClassicLeaderboards] = useState([]);
  const [leaderboardsMastery, setLeaderboardsMastery] = useState([]);
  const [loadingDataClassic, setLoadingDataClassic] = useState(false);
  const [loadingDataMastery, setLoadingDataMastery] = useState(false);
  const [leaderboardMode, setLeaderboardMode] = useState("classic");
  
  const [averageSession, setAverageSession] = useState(0)
  const [loadingSession, setLoadingSession] = useState(false)

  console.log("The id is", currentWebUser._id);
  console.log(currentWebUser.lifespan);

  axios.post(`${API_URL}/addLogs`, {
    name: `${currentWebUser.firstName} ${currentWebUser.lastName}`,
    branch: currentWebUser.branch,
    action: "Logged In",
    description: "-",
    useravatar: currentWebUser.useravatar
  });
  
  axios.put(`${API_URL}/tryUpdateTTL`, {
    user_id: currentWebUser._id
  });

  useEffect(() => {
    if (!currentWebUser?.token) return;
    fetchStudents();
    fetchAttempts();
    fetchTopClassicLeaderboard();
    fetchTopMasteryLeaderboard();
    fetchPendingUsers();
    fetchAverageSession()
  }, [currentWebUser]);


  async function fetchAverageSession(){
    setLoadingSession(true)
    try{
      const {data} = await axios.get(`${API_URL}/getAverageSession`)
     
      setAverageSession(Number(data.averageSessionTime.toFixed(2)));
      
    }
    catch(error){
      console.error("Error fetching top leaderboards:", error.message);
    }
    finally{
      setLoadingSession(false)
    }
  }

  

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

  //fetch badges data

  const fetchTopBadges = async () => {
    setLoadingBadges(true);
    try {
      const response = await axios.get(`${API_URL}/getTopEarnedBadges`);
      setTopBadges(response.data); // Adjust according to your API response structure
    } catch (error) {
      console.error("Error fetching top badges:", error.message);
    } finally {
      setLoadingBadges(false);
    }
  };

  useEffect(() => {
    if (!currentWebUser?.token) return;
    fetchTopBadges();
  }, [currentWebUser]);

  //set amount of students
  useEffect(() => {
    setStudentCount(students.length);
  }, [students]);

  useEffect(() => {
    setWebUsersCount(webUsers.length);
  }, [webUsers]);

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
        // console.log(response.data);
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
      // console.log("Pending Users: " + pendingUsers);
      setWebUsers(res.data);
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

      // console.log(response.data);
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
        <div className="dashboard-header-content">
          <h1 className="header-text-dashboard text-2xl sm:text-3xl md:text-4xl lg:text-[40px]">Dashboard</h1>
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

        <div className="dashboard-header-logo">
          <img src={mindifyLogo} alt="logo-icon" className="dashboard-logo" />
        </div>
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
              <h1 className="dashboard-title mb-2 -mt-1 font-[Poppins] text-[18px] font-bold">
                Total Students
              </h1>
              <h1 className="dashboard-title font-[Poppins] font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[50px] mt-3">
                <CountUp end={studentCount} />
              </h1>
            </div>
          )}
        </div>

        <div className="analytics-properties-dashboard">
          {isLoading ? (
            <div className="loading-overlay-dashboard">
              <div className="spinner"></div>
              <p>Fetching data...</p>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center flex-col">
              <h1 className="dashboard-title mb-2 -mt-1 font-[Poppins] text-[18px] font-bold">
                Total Web Users
              </h1>
              <h1 className="dashboard-title font-[Poppins] font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[50px] mt-3">
                <CountUp end={webUsersCount} />
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
              <h1 className="dashboard-title mb-2 -mt-5 font-[Poppins] text-[18px] font-bold text-center">
                Overall Average Score
              </h1>

              <h2 className="dashboard-title font-[Poppins] font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[50px] mt-3">
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
          {isLoadingAttempts ? (
            <div className="loading-overlay-dashboard">
              <div className="spinner"></div>
              <p>Fetching data...</p>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center flex-col">
              <h1 className="dashboard-title mb-3 mt-3 font-[Poppins] text-[18px] font-bold text-center">
                Most Challenging World
              </h1>
              {mostChallengingWorld === "N/A" ? (
                <h2 className="text-3xl font-bold">No Data</h2>
              ) : (
                <>
                  <h2 className="text-xl capitalize -mt-3 mb-1 text-black shadow-black font-[Poppins] font-semibold text-[15px] text-center">
                    {mostChallengingWorld + " Psychology"}
                  </h2>
                  <h2 className="dashboard-title font-[Poppins] font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[50px] mt-3">
                    <CountUp end={mostChallengingWorldScore} decimals={2} />%
                  </h2>

                  <h2 className="text-[16px] italic -mt-1 mb-1 text-black font-[Poppins] capitalize">
                    Average Score
                  </h2>
                </>
              )}
            </div>
          )}
        </div>

        <div className="analytics-properties-dashboard">
          {loadingSession ? (
            <div className="loading-overlay-dashboard">
              <div className="spinner"></div>
              <p>Fetching data...</p>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center flex-col">
              <h1 className="dashboard-title mb-3 mt-3 font-[Poppins] text-[18px] font-bold text-center">
                Students Average Session
              </h1>

                <>
                  <h2 className="dashboard-title font-[Poppins] font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[50px] mt-3 text-center">
                    <CountUp end={averageSession} decimals={2} />s
                  </h2>

                </>
              
            </div>
          )}
        </div>

        {["super admin", "sub admin"].includes(currentWebUser.position?.toLowerCase()) && (
          <div className="analytics-properties-dashboard">
            {isLoadingAttempts ? (
              <div className="loading-overlay-dashboard">
                <div className="spinner"></div>
                <p>Fetching data...</p>
              </div>
            ) : (
              <div
                className="w-full h-full flex items-center justify-center flex-col cursor-pointer"
                onClick={() => {
                  navigate("/account/approval")
                  setSelected("account")
                }}
              >
                {isLoading ? (
                  <div className="loading-overlay-dashboard">
                    <div className="spinner"></div>
                    <p>Fetching data...</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center flex-col">
                    <h1 className="dashboard-title mb-2 -mt-1 font-[Poppins] text-[18px] font-bold">
                      Pending Accounts
                    </h1>
                    <h1 className="dashboard-title font-[Poppins] font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[50px] mt-3">
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
        )}
      </div>


      {/* Unified Grid for Titles + Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 mt-4">
        {/* Reports (title + content) */}
        <div className="col-span-1 md:col-span-2">
          {/* Reports Title */}
          <h1 className="reports-title-properties-dashboard mb-2 text-lg sm:text-xl md:text-2xl lg:text-[26px]">Reports</h1>

          {/* Reports Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Students */}
            <div className="total-students-container-dashboard">
              {isLoadingAttempts ? (
                <div className="loading-overlay-dashboard">
                  <div className="spinner"></div>
                  <p>Fetching data...</p>
                </div>
              ) : (
                <div className="w-full h-10/12 flex flex-col justify-center items-center p-4">
                  <div className="w-full flex flex-col -mt-10 mb-4">
                    <h1 className="text-black font-bold font-[poppins] text-lg sm:text-xl md:text-2xl lg:text-[26px]">
                      Total Students
                    </h1>
                    <p className="text-black font-[poppins] text-[18px] -mt-2">
                      per campus
                    </p>
                  </div>
                  <BarGraph data={branchData} />
                </div>
              )}
            </div>

            {/* Top Badges */}
            <div className="badges-container-dashboard">
              <div className="w-full h-10/12 flex flex-col p-4">
                <h1 className="text-black font-bold font-[poppins] text-lg sm:text-xl md:text-2xl lg:text-[26px]">
                  Top Badges
                </h1>

                {loadingBadges ? (
                  <div className="loading-overlay-dashboard">
                    <div className="spinner"></div>
                    <p>Loading badges...</p>
                  </div>
                ) : (
                  <ul className="badge-list-dashboard">
                    {topBadges.length === 0 ? (
                      <li>No badges earned yet.</li>
                    ) : (
                      topBadges.map((badge, idx) => (
                      <li
                        key={badge.id || idx}
                        className="flex items-center gap-2 sm:gap-3 p-1 sm:p-2
                                  border-b border-gray-200 last:border-none 
                                  hover:bg-gray-50 rounded-lg transition"
                      >
                      {/* Rank Number */}
                      <span className="w-5 text-xs sm:text-sm font-bold text-gray-600">
                        {idx + 1}.
                      </span>

                      {/* Badge Icon */}
                      <img
                        src={badge.iconUrl}
                        alt={badge.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-md shadow-sm"
                      />

                      {/* Badge Info */}
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-xs sm:text-sm">
                          {badge.name}
                        </div>
                        <div className="text-gray-500 text-[10px] sm:text-xs">
                          Level {badge.level || 1}
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-full mt-1">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                            style={{ width: `${badge.percentage || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Percentage */}
                      <div className="text-[10px] sm:text-sm font-semibold text-gray-700 ml-2">
                        {badge.percentage ? badge.percentage.toFixed(2) : "0.00"}%
                      </div>
                    </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard (title + box together) */}
        <div className="col-span-1">
          <h1 className="leaderboard-title-properties-dashboard mb-2 text-lg sm:text-xl md:text-2xl lg:text-[26px]">
            Leaderboard
          </h1>

          <button
            className="leaderboards-container-dashboard cursor-pointer"
            style={{
              padding: "1rem",
              backgroundColor: "#fff",
              borderRadius: "8px",
            }}
            onClick={() => {
                  navigate("/leaderboard")
                  setSelected("leaderboard")
                }}
            >
            {/* Toggle Buttons */}
            <div className="flex bg-[#F5F6F8] p-2 rounded-xl w-full sm:w-[280px] mb-4 sticky top-0 z-10">
              <button
                onClick={() => setLeaderboardMode("classic")}
                className={`w-1/2 py-1 sm:py-2 rounded-xl font-semibold text-xs sm:text-sm
                  ${
                    leaderboardMode === "classic"
                      ? "bg-white !text-blue-900  shadow-sm"
                      : "bg-transparent !text-gray-400"
                  }`}
              >
                Competition
              </button>
              <button
                onClick={() => setLeaderboardMode("mastery")}
                className={`w-1/2 py-1 sm:py-2 rounded-xl font-semibold text-xs sm:text-sm
                  ${
                    leaderboardMode === "mastery"
                      ? "bg-white !text-blue-900  shadow-sm"
                      : "bg-transparent !text-gray-400"
                  }`}
              >
                Mastery
              </button>
            </div>

            {/* Leaderboard Table */}
            {(leaderboardMode === "classic" ? loadingDataClassic : loadingDataMastery) ? (
              <div
                className="loading-overlay-dashboard flex flex-col items-center justify-center"
                style={{ height: "150px" }}
              >
                <div className="spinner"></div>
                <p>Loading {leaderboardMode} leaderboard...</p>
              </div>
            ) : (
            <div className="overflow-hidden">
              <table className="w-full border-collapse text-[11px] sm:text-xs md:text-sm">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="text-black border-b border-gray-200 text-center">
                    <th className="px-1 py-2 whitespace-nowrap">User</th>
                    <th className="px-1 py-2 whitespace-nowrap">Branch</th>
                    <th className="px-1 py-2 whitespace-nowrap">World</th>
                    <th className="px-1 py-2 whitespace-nowrap">Score</th>
                    <th className="px-1 py-2 whitespace-nowrap">Time</th>
                  </tr>
                </thead>
              </table>

              {/* Scrollable Data */}
            <div className="max-h-60 sm:max-h-70 md:max-h-80 lg:max-h-96 overflow-y-auto">
              <table className="w-full border-collapse text-[11px] sm:text-xs md:text-sm">
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
                          className="border-b border-gray-100 text-center"
                        >
                          <td className="text-black px-1 py-1">
                            {index + 1}. {user.username || "Unknown"}
                          </td>
                          <td className="text-black px-1 py-1 uppercase">
                            {user.branch || item.branch || "N/A"}
                          </td>
                          <td className="text-black px-1 py-1 capitalize">
                            {item.category || "N/A"}
                          </td>
                          <td className="text-black px-1 py-1">{scorePercent}</td>
                          <td className="text-black px-1 py-1 text-[11px] sm:text-xs">
                            {formatTime(item.time_completion)}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            </div>

            )}
          </button>
        </div>

      </div>
    </div>
  );
}

