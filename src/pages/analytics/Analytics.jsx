import "../../css/analytics/analytics.css";
import axios from "axios";
import { API_URL, categories, modes, levels, branches } from "../../Constants";
import { useContext, useEffect, useState } from "react";
import PieChartAttempts from "../../components/PieChart/PieChartAttempts";
import SelectFilter from "../../components/selectFilter/SelectFilter";
import CountUp from "../../components/CountUp/CountUp";
import AttemptsChart from "../../components/LineChart/AttemptsChart";
import AccountsCreatedChart from "../../components/LineChart/AccountsCreatedChart";
import { UserLoggedInContext } from "../../contexts/Contexts.jsx";
import { Download } from "lucide-react";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import ExportDropdownPng from "../../components/ExportDropdown/ExportDropdownPng.jsx";

export default function Analytics() {
  const { currentWebUser } = useContext(UserLoggedInContext);

  const [attempts, setAttempts] = useState([]);
  const [masteryAttempts, setMasteryAttempts] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  const [selectedBranch, setSelectedBranch] = useState(currentWebUser.position.toLowerCase() === "super admin" ? "all":currentWebUser.branch);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [attemptsViewMode, setAttemptsViewMode] = useState("daily");
  const [accountsViewMode, setAccountsViewMode] = useState("daily");

  useEffect(() => {
    fetchAttempts();
    fetchStudents();
    fetchAttemptsMastery();
  }, []);

  const fetchAttempts = async () => {
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
    } catch (error) {
      console.error("Error fetching analytics data:", error.message);
    }
  };

  const fetchAttemptsMastery = async () => {
    try {
      const categoryList = categories.map((c) => c.id).join(",");

      const response = await axios.get(`${API_URL}/getAnalytics`, {
        params: {
          categories: categoryList,
          levels: "",
          mode: "mastery",
        },
      });

      // console.log("Fetched attempts:", response.data);
      setMasteryAttempts(response.data);
    } catch (error) {
      console.error("Error fetching analytics data:", error.message);
    }
  };

  const fetchStudents = async () => {
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
  };

  // Filter students based on selected branch
  const filteredStudents =
    selectedBranch === "all"
      ? allStudents
      : allStudents.filter((student) => student.branch === selectedBranch);

  const filteredStudentIds = new Set(filteredStudents.map((s) => s._id));

  // Filtered attempts by student and category
  const filteredAttemptsByStudent =
    selectedBranch === "all"
      ? attempts
      : attempts.filter((attempt) =>
          filteredStudentIds.has(attempt.user_id?._id)
        );

  const filteredAttempts =
    selectedCategory === "all"
      ? filteredAttemptsByStudent
      : filteredAttemptsByStudent.filter(
          (attempt) => attempt.category === selectedCategory
        );

  const competitionAttempts = filteredAttempts.filter(
    (a) => a.mode === "competition"
  );
  const reviewAttempts = filteredAttempts.filter((a) => a.mode === "review");

  // Get IDs of students who attempted after filtering
  const filteredAttemptedUserIds = new Set(
    filteredAttempts.map((attempt) => attempt.user_id?._id)
  );

  // Filter students who have attempted
  const filteredAttemptedStudents = filteredStudents.filter((student) =>
    filteredAttemptedUserIds.has(student._id)
  );

  //mastery filters
  const filteredMasteryAttemptsByStudent =
    selectedBranch === "all"
      ? masteryAttempts
      : masteryAttempts.filter((attempt) =>
          filteredStudentIds.has(attempt.user_id?._id)
        );

  const filteredMasteryAttempts =
    selectedCategory === "all"
      ? filteredMasteryAttemptsByStudent
      : filteredMasteryAttemptsByStudent.filter(
          (attempt) => attempt.category === selectedCategory
        );

  //add other mode filters + mastery mode filters
  const totalFilteredAttemptsCount =
    filteredAttempts.length + filteredMasteryAttempts.length;

  const averageScorePercentage = (attempts) => {
    if (attempts.length === 0) return 0;

    // Sum of (correct / total_items) for each attempt
    const totalPercentSum = attempts.reduce((sum, attempt) => {
      if (!attempt.total_items || attempt.total_items === 0) return sum; // avoid division by zero
      return sum + attempt.correct / attempt.total_items;
    }, 0);

    // Average percentage (0 to 1), multiply by 100 to get %
    return (totalPercentSum / attempts.length) * 100;
  };

  const competitionAvgPercent = averageScorePercentage(competitionAttempts);
  const reviewAvgPercent = averageScorePercentage(reviewAttempts);
  const filteredMasteryAvgPercent = averageScorePercentage(
    filteredMasteryAttempts
  );

  //export to CSV
  const exportAttemptsAccountsCSV = (
    allAttempts,
    allStudents,
    attemptsViewMode,
    accountsViewMode
  ) => {
    const now = new Date().toLocaleString();

    // Helper to group by date/month
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

    // Takers vs Non-Takers
    const attemptedIds = new Set(allAttempts.map((a) => a.user_id?._id));
    const takers = allStudents.filter((s) => attemptedIds.has(s._id)).length;
    const nonTakers = allStudents.length - takers;

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
    ];

    // Category breakdown
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

    csvSections.push(
      "",
      "Attempts per Category",
      "Category,Number of Attempts",
      ...Object.entries(categoryCounts).map(
        ([cat, count]) => `${categoryNames[cat] || cat},${count}`
      )
    );

    csvSections.push(
      "",
      "Summary Scores",
      "Competition Average %,Review Average %,Mastery Average %",
      `${competitionAvgPercent ?? ""},${reviewAvgPercent ?? ""},${
        filteredMasteryAvgPercent ?? ""
      }`
    );

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
  };

  return (
    <>
      <div className="main-container-analytics" id="main-cont-analytics">
        <div className="header-container-analytics">
          <h1 className="h-full w-full !text-[32px]">
            Analytics for{" "}
            {branches.find((branch) => branch.id === selectedBranch)?.name ||
              "All Branches"}
          </h1>

          <div className="flex flex-row justify-between w-full lg:w-[50%] mt-3 lg:mt-1.5">
            <div className="analytics-filter-container">
              <SelectFilter
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                disabledOption="Select Category"
                fixOption="All Categories"
                mainOptions={categories}
                getOptionValue={(category) => category.id}
                getOptionLabel={(category) => category.name}
                addedClassName="ml-3 !w-[150px] xl:!w-[250px] "
              />
              {currentWebUser?.position?.toLowerCase() === "super admin" && (
                <SelectFilter
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  disabledOption="Select Branch"
                  fixOption="All Branches"
                  mainOptions={branches}
                  getOptionValue={(branch) => branch.id}
                  getOptionLabel={(branch) => branch.name}
                  addedClassName="ml-3 !w-[150px]  xl:!w-[250px]"
                />
              )}
            </div>

            <ExportDropdownPng
              onExport={(format) => {
                if (format === "csv") {
                  exportAttemptsAccountsCSV(
                    filteredAttempts.concat(filteredMasteryAttempts),
                    filteredStudents,
                    attemptsViewMode,
                    accountsViewMode
                  );
                }
              }}
            />
          </div>
        </div>

        <div className="content-container-analytics">
          <div className="analytics-container-properties">
            <div className="w-[95%]">
              <h1 className="text-2xl md:text-4xl font-[Poppins] font-bold text-black">
                Attempts per {attemptsViewMode === "daily" ? "Day" : "Month"}
              </h1>

              <div className="line-graph-container">
                <AttemptsChart
                  attempts={filteredAttempts.concat(filteredMasteryAttempts)}
                  viewMode={attemptsViewMode}
                  setViewMode={setAttemptsViewMode}
                />
              </div>
            </div>

            <div className="w-[95%] mt-6">
              <h1 className="text-2xl md:text-4xl font-[Poppins] font-bold text-black">
                Accounts Created per{" "}
                {accountsViewMode === "daily" ? "Day" : "Month"}
              </h1>
              <div className="line-graph-container">
                <AccountsCreatedChart
                  accounts={allStudents}
                  viewMode={accountsViewMode}
                  setViewMode={setAccountsViewMode}
                />
              </div>
            </div>
          </div>

          {/* RIGHT CONT */}

          <div className="w-full md:w-[50%] bg-white rounded-xl flex flex-col items-center p-5">
            <div className="analytics-content-properties !h-auto">
              <h1 className="analytics-title-text-properties">
                Analytics for{" "}
                {categories.find((category) => category.id === selectedCategory)
                  ?.name || "All Categories"}
              </h1>

              <div className="progress-bar-container">
                <div className="total-attempts-container">
                  <h1 className="total-attempts-label">Competition Attempts</h1>
                  <p className="total-attempts-num">
                    <CountUp end={competitionAttempts.length} />
                  </p>
                </div>

                <div className="total-attempts-container">
                  <h1 className="total-attempts-label">Review Attempts</h1>
                  <p className="total-attempts-num">
                    <CountUp end={reviewAttempts.length} />
                  </p>
                </div>

                <div className="total-attempts-container">
                  <h1 className="total-attempts-label">Mastery Attempts</h1>
                  <p className="total-attempts-num">
                    <CountUp end={filteredMasteryAttempts.length} />
                  </p>
                </div>

                <div className="total-attempts-container">
                  <h1 className="total-attempts-label">
                    Competition Average Score
                  </h1>
                  <p className="total-attempts-num">
                    <CountUp end={competitionAvgPercent.toFixed(0)} />%
                  </p>
                </div>

                <div className="total-attempts-container">
                  <h1 className="total-attempts-label">Review Average Score</h1>
                  <p className="total-attempts-num">
                    <CountUp end={reviewAvgPercent.toFixed(0)} />%
                  </p>
                </div>

                <div className="total-attempts-container">
                  <h1 className="total-attempts-label">
                    Mastery Average Score
                  </h1>
                  <p className="total-attempts-num">
                    <CountUp end={filteredMasteryAvgPercent.toFixed(0)} />%
                  </p>
                </div>

                <div className="total-attempts-container">
                  <h1 className="total-attempts-label">Total Attempts</h1>
                  <p className="total-attempts-num">
                    <CountUp end={totalFilteredAttemptsCount} />
                  </p>
                </div>
              </div>
            </div>

            <div className="analytics-content-properties">
              <h1 className="analytics-title-text-properties">
                {" "}
                {categories.find((category) => category.id === selectedCategory)
                  ?.name || "All Categories"}
              </h1>
              <p className="text-black font-[Poppins]">Takers vs Non-Takers</p>
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
    </>
  );
}
