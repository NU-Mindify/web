import { useContext } from "react";
import "../../css/dashboard/dashboard.css";
import Chart from "chart.js/auto";
import { ActiveContext, UserLoggedInContext } from "../../contexts/Contexts";
import BarGraph from "../../components/barGraph/BarGraph";
import axios from "axios";
import { useState, useEffect } from "react";
import { API_URL, categories, modes, levels, branches } from "../../Constants";
import CountUp from "../../components/CountUp/CountUp";

export default function Dashboard() {
  const { currentWebUser } = useContext(UserLoggedInContext);

  const [studentCount, setStudentCount] = useState(0);
  const [students, setStudents] = useState([]);

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
      setMostChallengingWorldScore(parseFloat(lowestAvg.toFixed(2)));
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
      setBestPerformingWorldScore(parseFloat(highestAvg.toFixed(2)));
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
    .sort((a, b) => b.count - a.count); // sort descending by count

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
          {isLoadingAttempts ? (
            <div className="loading-overlay-dashboard">
              <div className="spinner"></div>
              <p>Fetching data...</p>
            </div>
          ) : (
            <div>
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
                    <CountUp end={mostChallengingWorldScore} decimals={2} /> / 8
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
            <div>
              <h1 className="dashboard-title mb-2 text-black font-[Poppins]">
                Best Performing World
              </h1>
              {bestPerformingWorld === "N/A" ? (
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
                    <CountUp end={bestPerformingWorldScore} decimals={2} /> / 8
                  </h2>
                </>
              )}
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
            <BarGraph data={branchData} />
          )}
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
