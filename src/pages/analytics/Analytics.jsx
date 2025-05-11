import "../../css/analytics/analytics.css";
import axios from "axios";
import { API_URL, categories, modes, levels } from "../../Constants";
import { useEffect, useState } from "react";
import AnimatedProgressBar from "../../components/animatedProgressBar/AnimatedProgressBar";
import PieChartAttempts from "../../components/PieChart/PieChartAttempts";

export default function Analytics() {
  const [attempts, setAttempts] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [perfectCount, setPerfectCount] = useState(0);

  useEffect(() => {
    fetchAttempts();
    fetchStudents();
  }, []);

  const fetchAttempts = async () => {
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
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/getUsers`);
      setAllStudents(response.data);
    } catch (error) {
      console.error("Error fetching students data:", error.message);
    }
  };

  const attemptedUserIds = new Set(attempts.map((item) => item.user_id?._id));
  const attemptedStudents = allStudents.filter((student) =>
    attemptedUserIds.has(student._id)
  );

  useEffect(() => {
    const perfects = attempts.filter(
      (user) => user.correct === user.total_items && user.total_items > 0
    );
    setPerfectCount(perfects.length);
  }, [attempts]);

  //counts how many got perfect then converts to percentage
  const perfectPercent =
    attempts.length > 0
      ? ((perfectCount / attempts.length) * 100).toFixed(0) + "%" //para whole num
      : 0;

  // Filter and calculate correct percentages for each category
  const filterCategoryData = (category) => {
    const categoryAttempts = attempts.filter(
      (attempt) => attempt.category === category
    );
    return categoryAttempts.length > 0
      ? (
          categoryAttempts.reduce((acc, curr) => {
            const percent = (curr.correct / curr.total_items) * 100;
            return acc + percent;
          }, 0) / categoryAttempts.length
        ).toFixed(0) + "%"
      : 0;
  };

  const abnormalCorrectPercent = filterCategoryData("abnormal");
  const developmentalCorrectPercent = filterCategoryData("developmental");
  const psychologicalCorrectPercent = filterCategoryData("psychological");
  const industrialCorrectPercent = filterCategoryData("industrial");
  const generalCorrectPercent = filterCategoryData("general");

  return (
    <>
      <div className="main-container-analytics">
        <div className="header-container-analytics">
          <h1 className="header-text-properties-analytics">Analytics</h1>
        </div>

        <div className="content-container-analytics">
          {/* GENERAL ANALYTICS */}
          <div className="analytics-container-properties">
            <h1 className="analytics-title-text-properties">
              General Analytics
            </h1>

            <div className="progress-bar-container">
              <p className="text-black font-bold">Total Attempts</p>
              <div className="flex items-center gap-2 w-[95%]">
                <div className="flex-1 bg-gray-300 rounded-full h-5 overflow-hidden">
                  <div
                    className="h-full bg-[#FFBF1A] transition-all duration-700 ease-in-out"
                    style={{ width: `${Math.min(attempts.length, 100)}%` }}
                  ></div>
                </div>
                <span className="text-black font-bold min-w-[40px] text-right">
                  {attempts.length}
                </span>
              </div>
            </div>

            <AnimatedProgressBar
              label="Completion Rate"
              percent={0}
              color="bg-[#FFBF1A]"
            />

            <AnimatedProgressBar
              label="Perfect %"
              percent={parseInt(perfectPercent)}
              color="bg-[#FFBF1A]"
            />
          </div>

          {/* Pie Chart displaying students' attempts */}
          <div className="analytics-container-properties">
            <h1 className="analytics-title-text-properties ">
              Attempted vs Not Attempted Overall
            </h1>
            <div className="flex justify-center items-center" style={{ width: '250px', height: '250px' }}>
              <PieChartAttempts
                allStudents={allStudents}
                attemptedStudents={attemptedStudents}
              />
            </div>
          </div>

          {/* ABNORMAL PSYCH ANALYTICS */}
          <div className="analytics-container-properties">
            <h1 className="analytics-title-text-properties">
              Abnormal Psychology Analytics
            </h1>

            <div className="progress-bar-container">
              <p className="text-black font-bold">Total Attempts</p>
              <div className="flex items-center gap-2 w-[95%]">
                <div className="flex-1 bg-gray-300 rounded-full h-5 overflow-hidden">
                  <div
                    className="h-full bg-[#FFBF1A] transition-all duration-700 ease-in-out"
                    style={{
                      width: `${Math.min(
                        attempts.filter(
                          (attempt) => attempt.category === "abnormal"
                        ).length,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <span className="text-black font-bold min-w-[40px] text-right">
                  {
                    attempts.filter(
                      (attempt) => attempt.category === "abnormal"
                    ).length
                  }
                </span>
              </div>
            </div>

            <AnimatedProgressBar
              label="Correct %"
              percent={parseInt(abnormalCorrectPercent)}
              color="bg-[#FFBF1A]"
            />

            <AnimatedProgressBar
              label="Mastery %"
              percent={0}
              color="bg-[#FFBF1A]"
            />
          </div>

          {/* DEVELOPMENTAL PSYCH ANALYTICS */}
          <div className="analytics-container-properties">
            <h1 className="analytics-title-text-properties">
              Developmental Psychology Analytics
            </h1>

            <div className="progress-bar-container">
              <p className="text-black font-bold">Total Attempts</p>
              <div className="flex items-center gap-2 w-[95%]">
                <div className="flex-1 bg-gray-300 rounded-full h-5 overflow-hidden">
                  <div
                    className="h-full bg-[#FFBF1A] transition-all duration-700 ease-in-out"
                    style={{
                      width: `${Math.min(
                        attempts.filter(
                          (attempt) => attempt.category === "developmental"
                        ).length,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <span className="text-black font-bold min-w-[40px] text-right">
                  {
                    attempts.filter(
                      (attempt) => attempt.category === "developmental"
                    ).length
                  }
                </span>
              </div>
            </div>

            <AnimatedProgressBar
              label="Correct %"
              percent={parseInt(developmentalCorrectPercent)}
              color="bg-[#FFBF1A]"
            />

            <AnimatedProgressBar
              label="Mastery %"
              percent={0}
              color="bg-[#FFBF1A]"
            />
          </div>

          {/* PSYCHO PSYCH ANALYTICS */}
          <div className="analytics-container-properties">
            <h1 className="analytics-title-text-properties">
              Psychological Psychology Analytics
            </h1>

            <div className="progress-bar-container">
              <p className="text-black font-bold">Total Attempts</p>
              <div className="flex items-center gap-2 w-[95%]">
                <div className="flex-1 bg-gray-300 rounded-full h-5 overflow-hidden">
                  <div
                    className="h-full bg-[#FFBF1A] transition-all duration-700 ease-in-out"
                    style={{
                      width: `${Math.min(
                        attempts.filter(
                          (attempt) => attempt.category === "psychological"
                        ).length,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <span className="text-black font-bold min-w-[40px] text-right">
                  {
                    attempts.filter(
                      (attempt) => attempt.category === "psychological"
                    ).length
                  }
                </span>
              </div>
            </div>

            <AnimatedProgressBar
              label="Correct %"
              percent={parseInt(psychologicalCorrectPercent)}
              color="bg-[#FFBF1A]"
            />

            <AnimatedProgressBar
              label="Mastery %"
              percent={0}
              color="bg-[#FFBF1A]"
            />
          </div>

          {/* INDUSTRIAL PSYCH ANALYTICS */}
          <div className="analytics-container-properties">
            <h1 className="analytics-title-text-properties">
              Industrial/Organizational Psychology Analytics
            </h1>

            <div className="progress-bar-container">
              <p className="text-black font-bold">Total Attempts</p>
              <div className="flex items-center gap-2 w-[95%]">
                <div className="flex-1 bg-gray-300 rounded-full h-5 overflow-hidden">
                  <div
                    className="h-full bg-[#FFBF1A] transition-all duration-700 ease-in-out"
                    style={{
                      width: `${Math.min(
                        attempts.filter(
                          (attempt) => attempt.category === "industrial"
                        ).length,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <span className="text-black font-bold min-w-[40px] text-right">
                  {
                    attempts.filter(
                      (attempt) => attempt.category === "industrial"
                    ).length
                  }
                </span>
              </div>
            </div>

            <AnimatedProgressBar
              label="Correct %"
              percent={parseInt(industrialCorrectPercent)}
              color="bg-[#FFBF1A]"
            />

            <AnimatedProgressBar
              label="Mastery %"
              percent={0}
              color="bg-[#FFBF1A]"
            />
          </div>

          {/* GENERAL PSYCH ANALYTICS */}
          <div className="analytics-container-properties">
            <h1 className="analytics-title-text-properties">
              General Psychology Analytics
            </h1>
            <div className="progress-bar-container">
              <p className="text-black font-bold">Total Attempts</p>
              <div className="flex items-center gap-2 w-[95%]">
                <div className="flex-1 bg-gray-300 rounded-full h-5 overflow-hidden">
                  <div
                    className="h-full bg-[#FFBF1A] transition-all duration-700 ease-in-out"
                    style={{
                      width: `${Math.min(
                        attempts.filter(
                          (attempt) => attempt.category === "general"
                        ).length,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <span className="text-black font-bold min-w-[40px] text-right">
                  {
                    attempts.filter((attempt) => attempt.category === "general")
                      .length
                  }
                </span>
              </div>
            </div>

            <AnimatedProgressBar
              label="Correct %"
              percent={parseInt(generalCorrectPercent)}
              color="bg-[#FFBF1A]"
            />

            <AnimatedProgressBar
              label="Mastery %"
              percent={0}
              color="bg-[#FFBF1A]"
            />
          </div>
        </div>
      </div>
    </>
  );
}
