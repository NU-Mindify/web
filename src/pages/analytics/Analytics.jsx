import axios from "axios";
import { useContext, useEffect, useState, useMemo, useCallback } from "react";
import CountUp from "../../components/CountUp/CountUp";
import AccountsCreatedChart from "../../components/LineChart/AccountsCreatedChart";
import AttemptsChart from "../../components/LineChart/AttemptsChart";
import PieChartAttempts from "../../components/PieChart/PieChartAttempts";
import { API_URL, branches, categories, levels, modes } from "../../Constants";
import {
  ActiveContext,
  UserLoggedInContext,
} from "../../contexts/Contexts.jsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "../../css/analytics/analytics.css";
import Header from "../../components/header/Header.jsx";

const averageScorePercentage = (attempts) => {
  if (!attempts || attempts.length === 0) return 0;

  // Sum of (correct / total_items) for each attempt
  const totalPercentSum = attempts.reduce((sum, attempt) => {
    if (!attempt.total_items || attempt.total_items === 0) return sum; // avoid division by zero
    return sum + attempt.correct / attempt.total_items;
  }, 0);

  // Average percentage (0 to 1), multiply by 100 to get %
  return (totalPercentSum / attempts.length) * 100;
};


export default function Analytics() {
  const { currentWebUser } = useContext(UserLoggedInContext);
  const { theme, themeWithOpacity } = useContext(ActiveContext);

  const [attempts, setAttempts] = useState([]);
  const [masteryAttempts, setMasteryAttempts] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  const [selectedBranch, setSelectedBranch] = useState(
    currentWebUser.position.toLowerCase() === "super admin"
      ? "all"
      : currentWebUser.branch
  );
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [attemptsViewMode, setAttemptsViewMode] = useState("daily");
  const [accountsViewMode, setAccountsViewMode] = useState("daily");

  useEffect(() => {
    if (currentWebUser.token) {
      fetchAttempts();
      fetchStudents();
    }
  }, [currentWebUser.token]);

  const fetchAttemptsMastery = useCallback(async () => {
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

      // console.log("Fetched attempts:", response.data);
      setMasteryAttempts(response.data);
    } catch (error) {
      console.error("Error fetching analytics data:", error.message);
    }
  }, []);

  const fetchAttempts = useCallback(async () => {
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

      // console.log("Fetched attempts:", response.data);
      setAttempts(response.data);
      // Fetch mastery attempts right after competition/review attempts
      fetchAttemptsMastery();
    } catch (error) {
      console.error("Error fetching analytics data:", error.message);
    }
  }, [fetchAttemptsMastery]);

  const fetchStudents = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/getUsers`, {
        headers: {
          Authorization: `Bearer ${currentWebUser.token}`,
        },
      });
      setAllStudents(response.data);
    } catch (error) {
      console.error("Error fetching students data:", error.message);
    }
  }, [currentWebUser.token]);

  // Filter students based on selected branch
  const filteredStudents = useMemo(() =>
    selectedBranch === "all"
      ? allStudents
      : allStudents.filter((student) => student.branch === selectedBranch)
  , [allStudents, selectedBranch]);

  const filteredStudentIds = useMemo(() => new Set(filteredStudents.map((s) => s._id)), [filteredStudents]);

  // Filtered attempts by student and category
  const filteredAttempts = useMemo(() => {
    const byStudent = selectedBranch === "all"
        ? attempts
        : attempts.filter((attempt) => filteredStudentIds.has(attempt.user_id?._id));

    return selectedCategory === "all"
        ? byStudent
        : byStudent.filter((attempt) => attempt.category === selectedCategory);
  }, [attempts, selectedBranch, selectedCategory, filteredStudentIds]);

  const competitionAttempts = useMemo(() =>
    filteredAttempts.filter((a) => a.mode === "competition")
  , [filteredAttempts]);

  const reviewAttempts = useMemo(() =>
    filteredAttempts.filter((a) => a.mode === "review")
  , [filteredAttempts]);

  // Get IDs of students who attempted after filtering
  const filteredAttemptedUserIds = useMemo(() =>
    new Set(filteredAttempts.map((attempt) => attempt.user_id?._id))
  , [filteredAttempts]);

  // Filter students who have attempted
  const filteredAttemptedStudents = useMemo(() =>
    filteredStudents.filter((student) => filteredAttemptedUserIds.has(student._id))
  , [filteredStudents, filteredAttemptedUserIds]);

  //mastery filters
  const filteredMasteryAttempts = useMemo(() => {
    const byStudent = selectedBranch === "all"
        ? masteryAttempts
        : masteryAttempts.filter((attempt) => filteredStudentIds.has(attempt.user_id?._id));

    return selectedCategory === "all"
        ? byStudent
        : byStudent.filter((attempt) => attempt.category === selectedCategory);
  }, [masteryAttempts, selectedBranch, selectedCategory, filteredStudentIds]);

  //add other mode filters + mastery mode filters
  const totalFilteredAttemptsCount = useMemo(() =>
    filteredAttempts.length + filteredMasteryAttempts.length
  , [filteredAttempts, filteredMasteryAttempts]);

  const competitionAvgPercent = useMemo(() => averageScorePercentage(competitionAttempts), [competitionAttempts]);
  const reviewAvgPercent = useMemo(() => averageScorePercentage(reviewAttempts), [reviewAttempts]);
  const filteredMasteryAvgPercent = useMemo(() => averageScorePercentage(filteredMasteryAttempts), [filteredMasteryAttempts]);

  const [mode, setMode] = useState("competition");
  const [level, setLevel] = useState(1);
  const [category, setCateogry] = useState("developmental");
  const [showCompe, setShowCompe] = useState(true);

  const [totalScorePerCampus, setTotalScorePerCampus] = useState([
    { branch: "manila", totalStudents: 0, averageScore: 0 },
    { branch: "baliwag", totalStudents: 0, averageScore: 0 },
    { branch: "cebu", totalStudents: 0, averageScore: 0 },
    { branch: "fairview", totalStudents: 0, averageScore: 0 },
    { branch: "eastortigas", totalStudents: 0, averageScore: 0 },
    { branch: "laspinas", totalStudents: 0, averageScore: 0 },
    { branch: "lipa", totalStudents: 0, averageScore: 0 },
    { branch: "clark", totalStudents: 0, averageScore: 0 },
    { branch: "laguna", totalStudents: 0, averageScore: 0 },
    { branch: "dasmarinas", totalStudents: 0, averageScore: 0 },
    { branch: "bacolod", totalStudents: 0, averageScore: 0 },
    { branch: "alabang", totalStudents: 0, averageScore: 0 },
    { branch: "iloilo", totalStudents: 0, averageScore: 0 },
    { branch: "moa", totalStudents: 0, averageScore: 0 },
  ]);

  useEffect(() => {
    fetchPerformanceOnCampuses();
  }, [mode, level, category]);

  const fetchPerformanceOnCampuses = useCallback(async () => {
    let categoryToUse = selectedCategory;
    if (selectedCategory === "all") {
      categoryToUse = "";
    }

    try {
      let query = `${API_URL}/getLeaderboard?mode=${mode}&category=${category}`;
      if (showCompe) {
        query += `&level=${level}`;
      }

      const response = await axios.get(query);

      const data = response.data;
      // console.log("the data are", data);

      const userLevelHighScoresMap = new Map();

      data.forEach((entry) => {
        const user = entry.user_id;
        if (!user || !user._id) return;

        // console.log("entry", entry);

        const userId = user._id;
        const correct = entry.correct;
        const total_items = entry.total_items;
        const time_completion = entry.time_completion;

        const groupingKey = mode === "mastery" ? entry.category : entry.level;

        if (!userLevelHighScoresMap.has(userId)) {
          userLevelHighScoresMap.set(userId, new Map());
        }

        const userScoresByGroupingKey = userLevelHighScoresMap.get(userId);
        const existingScoreForGroupingKey =
          userScoresByGroupingKey.get(groupingKey);

        if (
          !existingScoreForGroupingKey ||
          correct > existingScoreForGroupingKey.correct
        ) {
          userScoresByGroupingKey.set(groupingKey, {
            user_id: userId,
            correct,
            total_items,
            time_completion,
            level: entry.level ?? null,
            category: entry.category ?? null,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            branch: user.branch,
            avatar: user.avatar,
          });
        }
      });

      const allHighScores = [];
      userLevelHighScoresMap.forEach((groupingKeyScoresMap) => {
        groupingKeyScoresMap.forEach((scoreEntry) => {
          allHighScores.push(scoreEntry);
        });
      });

      // console.log(
      //   "All high scores for all users across all levels/categories:",
      //   allHighScores
      // );

      const highScoresPerGroupingKeyMap = new Map();

      const totalItemsPerGroupingKey = new Map();

      allHighScores.forEach((student) => {
        const groupingKey =
          mode === "mastery" ? student.category : student.level;
        const keyToUse = groupingKey ?? "Uncategorized";

        if (!totalItemsPerGroupingKey.has(keyToUse)) {
          totalItemsPerGroupingKey.set(keyToUse, student.total_items || 0);
        }
      });

      highScoresPerGroupingKeyMap.forEach((students) => {
        students.sort((a, b) => b.correct - a.correct);
      });

      const highScoresPerGroup = Object.fromEntries(
        highScoresPerGroupingKeyMap
      );
      // console.log(
      //   "All high scores grouped by level/category:",
      //   highScoresPerGroup
      // );

      const branchStatsMap = new Map();
      allHighScores.forEach((student) => {
        const branch = student.branch;
        if (!branchStatsMap.has(branch)) {
          branchStatsMap.set(branch, {
            branch,
            totalStudents: 0,
            totalScore: 0,
          });
        }

        const branchData = branchStatsMap.get(branch);
        branchData.totalStudents += 1;
        branchData.totalScore += student.correct;
        // console.log("branchData", branchData);
      });

      setTotalScorePerCampus((prevState) =>
        prevState.map((campus) => {
          const match = branchStatsMap.get(campus.branch);
          if (match) {
            const { totalStudents, totalScore } = match;

            const groupingKey = mode === "mastery" ? categoryToUse : level;
            const keyToUse = groupingKey || "Uncategorized";
            const totalItems = totalItemsPerGroupingKey.get(keyToUse) || 1;

            const avgScore = totalStudents
              ? totalScore / (totalStudents * totalItems)
              : 0;

            return {
              ...campus,
              totalStudents,
              averageScore: avgScore,
            };
          } else {
            return {
              ...campus,
              totalStudents: 0,
              averageScore: 0,
            };
          }
        })
      );
    } catch (error) {
      console.error("Error fetching analytics data:", error.message);
    }
  }, [mode, category, showCompe, level, selectedCategory]);

  //csv Export
  const exportAttemptsAccountsCSV = useCallback((
    allAttempts,
    allStudents,
    attemptsViewMode,
    accountsViewMode,
  ) => {
    const now = new Date().toLocaleString();

    const groupByDate = (data, viewMode, keyGetter) => {
      const map = {};
      data.forEach((item) => {
        const key = keyGetter(item);
        if (!map[key]) map[key] = 0;
        map[key]++;
      });
      return Object.entries(map).map(([date, count]) => [date, count]);
    };

    const getFormattedDate = (dateStr, mode) => {
      const date = new Date(dateStr);
      return mode === "daily"
        ? date.toLocaleDateString()
        : `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}`;
    };

    const attemptsPerTime = groupByDate(allAttempts, attemptsViewMode, (a) =>
      getFormattedDate(a.createdAt, attemptsViewMode)
    );
    const accountsPerTime = groupByDate(allStudents, accountsViewMode, (s) =>
      getFormattedDate(s.createdAt, accountsViewMode)
    );

    const attemptedIds = new Set(allAttempts.map((a) => a.user_id?._id));
    const takers = allStudents.filter((s) => attemptedIds.has(s._id)).length;
    const nonTakers = allStudents.length - takers;

    const categoryNames = {
      developmental: "Developmental Psychology",
      abnormal: "Abnormal Psychology",
      psychological: "Psychological Psychology",
      industrial: "Industrial Psychology",
      general: "General Psychology",
    };

    const categoryCounts = {};
    allAttempts.forEach((a) => {
      const cat = a.category;
      if (!cat) return;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const csvSections = [
      `Exported on:,${now}`,
      "",
      "Attempts Per " + (attemptsViewMode === "daily" ? "Day" : "Month"),
      "Date,Number of Attempts",
      ...attemptsPerTime.map((row) => row.join(",")),
      "",
      "Accounts Created Per " +
        (accountsViewMode === "daily" ? "Day" : "Month"),
      "Date,Number of Accounts",
      ...accountsPerTime.map((row) => row.join(",")),
      "",
      "Takers vs Non-Takers",
      "Category,Count",
      `Takers,${takers}`,
      `Non-Takers,${nonTakers}`,
      "",
      "Attempts per Category",
      "Category,Number of Attempts",
      ...Object.entries(categoryCounts).map(
        ([cat, count]) => `${categoryNames[cat] || cat},${count}`
      ),
      "",
      "Summary Scores",
      "Competition Average %,Review Average %,Mastery Average %",
      `${competitionAvgPercent ?? ""},${reviewAvgPercent ?? ""},${
        filteredMasteryAvgPercent ?? ""
      }`,
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvSections.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Analytics_Report_by_${currentWebUser.firstName} ${currentWebUser.lastName}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [competitionAvgPercent, reviewAvgPercent, filteredMasteryAvgPercent]);

  //PDF Export
  const exportAttemptsAccountsPDF = useCallback((allAttempts, allStudents) => {
    const doc = new jsPDF();
    const now = new Date().toLocaleString();
    doc.text(`Analytics Report`, 14, 10);
    doc.text(`Exported on: ${now}`, 14, 18);

    const getFormattedDate = (dateStr, mode) => {
      const date = new Date(dateStr);
      return mode === "daily"
        ? date.toLocaleDateString()
        : `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}`;
    };

    const groupByDate = (data, viewMode, keyGetter) => {
      const map = {};
      data.forEach((item) => {
        const key = keyGetter(item);
        if (!map[key]) map[key] = 0;
        map[key]++;
      });
      return Object.entries(map);
    };

    const attemptsPerTime = groupByDate(allAttempts, attemptsViewMode, (a) =>
      getFormattedDate(a.createdAt, attemptsViewMode)
    );
    const accountsPerTime = groupByDate(allStudents, accountsViewMode, (s) =>
      getFormattedDate(s.createdAt, accountsViewMode)
    );

    autoTable(doc, {
      startY: 28,
      head: [["Date", "Number of Attempts"]],
      body: attemptsPerTime,
      theme: "striped",
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Date", "Number of Accounts"]],
      body: accountsPerTime,
      theme: "striped",
    });

    const attemptedIds = new Set(allAttempts.map((a) => a.user_id?._id));
    const takers = allStudents.filter((s) => attemptedIds.has(s._id)).length;
    const nonTakers = allStudents.length - takers;

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Category", "Count"]],
      body: [
        ["Takers", takers],
        ["Non-Takers", nonTakers],
      ],
      theme: "striped",
    });

    const categoryNames = {
      developmental: "Developmental Psychology",
      abnormal: "Abnormal Psychology",
      psychological: "Psychological Psychology",
      industrial: "Industrial Psychology",
      general: "General Psychology",
    };
    const categoryCounts = {};
    allAttempts.forEach((a) => {
      const cat = a.category;
      if (!cat) return;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const categoryTable = Object.entries(categoryCounts).map(([cat, count]) => [
      categoryNames[cat] || cat,
      count,
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Category", "Number of Attempts"]],
      body: categoryTable,
      theme: "striped",
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Competition Avg %", "Review Avg %", "Mastery Avg %"]],
      body: [
        [
          competitionAvgPercent.toFixed(2),
          reviewAvgPercent.toFixed(2),
          filteredMasteryAvgPercent.toFixed(2),
        ],
      ],
    });

    doc.save(
      `Analytics_Report_${currentWebUser.firstName}_${currentWebUser.lastName}.pdf`
    );
  }, [competitionAvgPercent, reviewAvgPercent, filteredMasteryAvgPercent]);

  //Export handler
  const handleExport = useCallback((format) => {
    const allAttempts = filteredAttempts.concat(filteredMasteryAttempts);
    if (format === "csv") {
      exportAttemptsAccountsCSV(
        allAttempts,
        filteredStudents,
        attemptsViewMode,
        accountsViewMode
      );
    } else if (format === "pdf") {
      exportAttemptsAccountsPDF(allAttempts, filteredStudents);
    }
  }, [filteredAttempts, filteredMasteryAttempts, exportAttemptsAccountsCSV, exportAttemptsAccountsPDF, filteredStudents, attemptsViewMode, accountsViewMode]);

  return (
    <>
      <div className="main-container-analytics" id="main-cont-analytics">
        <div className="w-full h-[100px] rounded-xl">
          <Header
            id={"analytics"}
            title={`Analytics for ${
              branches.find((branch) => branch.id === selectedBranch)?.name ||
              "All Branches"
            }`}
            exportToCSV={() =>
              exportAttemptsAccountsCSV(
                filteredAttempts.concat(filteredMasteryAttempts),
                filteredStudents,
                attemptsViewMode,
                accountsViewMode
              )
            }
            exportToPDF={() =>
              exportAttemptsAccountsPDF(
                filteredAttempts.concat(filteredMasteryAttempts),
                filteredStudents
              )
            }
            firstSelectValue={selectedCategory}
            firstSelectOnChange={(e) => setSelectedCategory(e.target.value)}
            firstSelectDisabledOption="Select Category"
            firstSelectFixOption="All Categories"
            firstSelectMainOptions={categories}
            firstSelectGetOptionValue={(category) => category.id}
            firstSelectGetOptionLabel={(category) => category.name}
            firstSelectAddedClassName="!w-[150px] xl:!w-[250px] "
            secondSelectValue={selectedBranch}
            secondSelectOnChange={(e) => setSelectedBranch(e.target.value)}
            secondSelectDisabledOption="Select Branch"
            secondSelectFixOption="All Branches"
            secondSelectMainOptions={branches}
            secondSelectGetOptionValue={(branch) => branch.id}
            secondSelectGetOptionLabel={(branch) => branch.name}
            secondSelectAddedClassName="!w-[150px]  xl:!w-[250px] mr-5"
          />
        </div>

        <div className="w-full h-[calc(100svh-140px)] mt-5 rounded-xl flex justify-between overflow-hidden">
          <div
            className="w-[49%] h-full flex flex-col items-center overflow-y-auto py-5 rounded-xl"
            style={{ backgroundColor: themeWithOpacity }}
          >
            <div className="w-[95%]">
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <h1
                    className={`text-lg md:text-2xl font-[Poppins] font-bold
                  ${theme === "#202024" ? "!text-white" : "!text-black"}`}
                  >
                    Attempts per{" "}
                    {attemptsViewMode === "daily" ? "Day" : "Month"}
                  </h1>

                  <div className="flex bg-gray-100 p-[2px] rounded-lg w-[180px] ">
                    <button
                      onClick={() => setAttemptsViewMode("daily")}
                      className={`w-1/2 py-1 text-sm rounded-lg font-bold transition-all duration-200
                        ${
                          attemptsViewMode === "daily"
                            ? "bg-white !text-blue-900 shadow-sm"
                            : "bg-transparent !text-gray-400"
                        }`}
                    >
                      Daily
                    </button>

                    <button
                      onClick={() => setAttemptsViewMode("monthly")}
                      className={`w-1/2 py-1 text-sm rounded-lg font-bold transition-all duration-200
                        ${
                          attemptsViewMode === "monthly"
                            ? "bg-white !text-blue-900  shadow-sm"
                            : "bg-transparent !text-gray-400"
                        }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>

                <div className="line-graph-container">
                  <AttemptsChart
                    attempts={filteredAttempts.concat(filteredMasteryAttempts)}
                    viewMode={attemptsViewMode}
                    setViewMode={setAttemptsViewMode}
                  />
                </div>
              </div>
            </div>

            <div className="w-[95%] mt-6">
              <div className="flex items-center justify-between mb-2">
                <h1
                  className={`text-lg md:text-2xl font-[Poppins] font-bold text-black
                  ${theme === "#202024" ? "!text-white" : "!text-black"}`}
                >
                  Accounts Created per{" "}
                  {accountsViewMode === "daily" ? "Day" : "Month"}
                </h1>

                <div className="flex bg-[#F5F6F8] p-[2px] rounded-lg w-[180px]">
                  <button
                    onClick={() => setAccountsViewMode("daily")}
                    className={`w-1/2 py-1 text-sm rounded-lg font-bold transition-all duration-200
                      ${
                        accountsViewMode === "daily"
                          ? "bg-white !text-blue-900  shadow-sm"
                          : "bg-transparent !text-gray-400"
                      }`}
                  >
                    Daily
                  </button>

                  <button
                    onClick={() => setAccountsViewMode("monthly")}
                    className={`w-1/2 py-1 text-sm rounded-lg font-bold transition-all duration-200
                      ${
                        accountsViewMode === "monthly"
                          ? "bg-white !text-blue-900 shadow-sm"
                          : "bg-transparent !text-gray-400"
                      }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              <div className="line-graph-container">
                <AccountsCreatedChart
                  accounts={allStudents}
                  viewMode={accountsViewMode}
                  setViewMode={setAccountsViewMode}
                />
              </div>
            </div>
          </div>

          <div
            className="w-[49%] h-full flex flex-col rounded-xl overflow-y-auto"
            style={{ backgroundColor: themeWithOpacity }}
          >
            <div className="w-full h-full flex flex-col items-center p-5 ">
              <div className="analytics-content-properties !h-auto">
                <h1
                  className={`analytics-title-text-properties ${
                    theme === "#202024" ? "!text-white" : "!text-black"
                  }`}
                >
                  Analytics for{" "}
                  {categories.find(
                    (category) => category.id === selectedCategory
                  )?.name || "All Categories"}
                </h1>

                <div className="progress-bar-container">
                  {[
                    {
                      label: "Competition Attempts",
                      value: competitionAttempts.length,
                    },
                    { label: "Review Attempts", value: reviewAttempts.length },
                    {
                      label: "Mastery Attempts",
                      value: filteredMasteryAttempts.length,
                    },
                    {
                      label: "Competition Average Score",
                      value: competitionAvgPercent.toFixed(0),
                      isPercent: true,
                    },
                    {
                      label: "Review Average Score",
                      value: reviewAvgPercent.toFixed(0),
                      isPercent: true,
                    },
                    {
                      label: "Mastery Average Score",
                      value: filteredMasteryAvgPercent.toFixed(0),
                      isPercent: true,
                    },
                    {
                      label: "Total Attempts",
                      value: totalFilteredAttemptsCount,
                    },
                  ].map(({ label, value, isPercent }, idx) => (
                    <div
                      key={idx}
                      className="total-attempts-container"
                      style={{ backgroundColor: theme }}
                    >
                      <h1
                        className={`total-attempts-label ${
                          theme === "#202024" ? "!text-white" : "!text-black"
                        }`}
                      >
                        {label}
                      </h1>
                      <p className={`total-attempts-num
                        ${theme === "#202024" ? "!text-white" : '!text-black'}`}
                      >
                        <CountUp end={value} />
                        {isPercent ? "%" : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="analytics-content-properties">
                <h1 
                  className={`analytics-title-text-properties
                  ${theme === "#202024" ? "!text-white" : '!text-black'}`}
                >
                  {" "}
                  {categories.find(
                    (category) => category.id === selectedCategory
                  )?.name || "All Categories"}
                </h1>
                <p 
                  className={`font-[Poppins]
                  ${theme === "#202024" ? "!text-white" : '!text-black'}`}
                >
                  Takers vs Non-Takers
                </p>
                <div className="w-[100%] flex items-center justify-center">
                  <div className="pie-chart-properties">
                    <PieChartAttempts
                      allStudents={filteredStudents}
                      attemptedStudents={filteredAttemptedStudents}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
