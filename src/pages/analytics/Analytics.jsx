import "../../css/analytics/analytics.css";
import axios from "axios";
import { API_URL, categories, modes, levels } from "../../Constants";
import { useContext, useEffect, useState } from "react";
import AnimatedProgressBar from "../../components/animatedProgressBar/AnimatedProgressBar";
import PieChartAttempts from "../../components/PieChart/PieChartAttempts";
import { branches } from "../../Constants";
import { UserLoggedInContext } from "../../contexts/Contexts";


export default function Analytics() {
  const [attempts, setAttempts] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [perfectCount, setPerfectCount] = useState(0);

  const {currentWebUser} = useContext(UserLoggedInContext)

  const [branch, setBranch] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("all");

  


  useEffect(() => {
    fetchAttempts();
    fetchStudents();
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

  // Filter students based on selected branch
  const filteredStudents = branch
    ? allStudents.filter((student) => student.branch === branch)
    : allStudents;

  // Filter attempts to only include those from students in the selected branch
  const filteredAttempts = branch
    ? attempts.filter((attempt) =>
        filteredStudents.some((student) => student._id === attempt.user_id?._id)
      )
    : attempts;

  // Filtered takers based on filtered students and attempts
  const filteredAttemptedUserIds = new Set(
    filteredAttempts.map((item) => item.user_id?._id)
  );
  const filteredAttemptedStudents = filteredStudents.filter((student) =>
    filteredAttemptedUserIds.has(student._id)
  );

  useEffect(() => {
    const perfects = filteredAttempts.filter(
      (user) => user.correct === user.total_items && user.total_items > 0
    );
    setPerfectCount(perfects.length);
  }, [filteredAttempts]);

  //counts how many got perfect then converts to percentage
  const perfectPercent =
    filteredAttempts.length > 0
      ? ((perfectCount / filteredAttempts.length) * 100).toFixed(0) + "%" //para whole num
      : 0;

  // Filter and calculate correct percentages for each category
  const filterCategoryData = (category, attemptList) => {
    const categoryAttempts = attemptList.filter(
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

  //get takers vs non takers per category
  const getCategoryAttemptedStudents = (category) => {
    const categoryAttempts = filteredAttempts.filter(
      (attempt) => attempt.category === category
    );
    const userIds = new Set(categoryAttempts.map((a) => a.user_id?._id));
    return filteredStudents.filter((student) => userIds.has(student._id));
  };

  const abnormalCorrectPercent = filterCategoryData(
    "abnormal",
    filteredAttempts
  );

  const developmentalCorrectPercent = filterCategoryData(
    "developmental",
    filteredAttempts
  );

  const psychologicalCorrectPercent = filterCategoryData(
    "psychological",
    filteredAttempts
  );

  const industrialCorrectPercent = filterCategoryData(
    "industrial",
    filteredAttempts
  );

  const generalCorrectPercent = filterCategoryData("general", filteredAttempts);

  return (
    <>
      <div className="main-container-analytics">
        <div className="header-container-analytics flex flex-row">
          <h1 className="header-text-properties-analytics">
            Analytics for {branches.find(branch => branch.id === selectedBranch)?.name || "All"}
          </h1>

          
          
            <select
              value={selectedBranch}
              className="select-ghost text-black w-[170px] ml-5 mt-3 select"
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                setBranch(e.target.value === "all" ? null : e.target.value);
              }}
            >
              <option value="all">All NU Branches</option>
              {branches.map((branch) => (
                <option value={branch.id} key={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select> 
          
          

          {branch && (
            <button
              onClick={() => {
                setSelectedBranch("all");
                setBranch(null);
              }}
              className="btn btn-outline text-black border-black hover:bg-black hover:text-white ml-5 mt-3 h-[40px]"
            >
              Reset
            </button>
          )}

        </div>

        <div className="content-container-analytics">
          {/* OVERALL ANALYTICS */}
          <div className="analytics-container-properties flex flex-row">
            <div className="analytics-content-properties">
              <h1 className="analytics-title-text-properties">
                Overall Analytics
              </h1>

              <div className="progress-bar-container">
                <p className="text-black font-bold">Total Attempts</p>
                <div className="flex items-center gap-2 w-[100%]">
                  <div className="flex-1 bg-gray-300 rounded-full h-5 overflow-hidden">
                    <div
                      className="h-full bg-[#FFBF1A] transition-all duration-700 ease-in-out"
                      style={{
                        width: `${Math.min(filteredAttempts.length, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-black font-bold min-w-[40px] text-right">
                    {filteredAttempts.length}
                  </span>
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
            </div>

            <div className="analytics-content-properties">
              <h1 className="analytics-title-text-properties">Overall</h1>
              <p className="text-black font-[Poppins]">Takers vs Non-Takers</p>
              <div className="flex items-center justify-center">
                <div
                  className="flex justify-center items-center"
                  style={{ width: "250px", height: "250px" }}
                >
                  <PieChartAttempts
                    allStudents={filteredStudents}
                    attemptedStudents={filteredAttemptedStudents}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ABNORMAL PSYCH ANALYTICS */}
          <div className="analytics-container-properties flex flex-row">
            <div className="analytics-content-properties">
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
                          filteredAttempts.filter(
                            (attempt) => attempt.category === "abnormal"
                          ).length,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-black font-bold min-w-[40px] text-right">
                    {
                      filteredAttempts.filter(
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

            <div className="analytics-content-properties">
              <h1 className="analytics-title-text-properties">
                Abnormal Psychology
              </h1>
              <p className="text-black font-[Poppins]">Takers vs Non-Takers</p>
              <div className="flex items-center justify-center">
                <div
                  className="flex justify-center items-center"
                  style={{ width: "250px", height: "250px" }}
                >
                  <PieChartAttempts
                    allStudents={filteredStudents}
                    attemptedStudents={getCategoryAttemptedStudents("abnormal")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* DEVELOPMENTAL PSYCH ANALYTICS */}
          <div className="analytics-container-properties flex flex-row">
            <div className="analytics-content-properties">
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
                          filteredAttempts.filter(
                            (attempt) => attempt.category === "developmental"
                          ).length,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-black font-bold min-w-[40px] text-right">
                    {
                      filteredAttempts.filter(
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

            <div className="analytics-content-properties">
              <h1 className="analytics-title-text-properties">
                Developmental Psychology
              </h1>
              <p className="text-black font-[Poppins]">Takers vs Non-Takers</p>
              <div className="flex items-center justify-center">
                <div
                  className="flex justify-center items-center"
                  style={{ width: "250px", height: "250px" }}
                >
                  <PieChartAttempts
                    allStudents={filteredStudents}
                    attemptedStudents={getCategoryAttemptedStudents(
                      "developmental"
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PSYCHOLOGICAL PSYCH ANALYTICS */}
          <div className="analytics-container-properties flex flex-row">
            <div className="analytics-content-properties">
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
                          filteredAttempts.filter(
                            (attempt) => attempt.category === "psychological"
                          ).length,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-black font-bold min-w-[40px] text-right">
                    {
                      filteredAttempts.filter(
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

            <div className="analytics-content-properties">
              <h1 className="analytics-title-text-properties">
                Psychological Psychology
              </h1>
              <p className="text-black font-[Poppins]">Takers vs Non-Takers</p>
              <div className="flex items-center justify-center">
                <div
                  className="flex justify-center items-center"
                  style={{ width: "250px", height: "250px" }}
                >
                  <PieChartAttempts
                    allStudents={filteredStudents}
                    attemptedStudents={getCategoryAttemptedStudents(
                      "psychological"
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* INDUSTRIAL PSYCH ANALYTICS */}
          <div className="analytics-container-properties flex flex-row">
            <div className="analytics-content-properties">
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
                          filteredAttempts.filter(
                            (attempt) => attempt.category === "industrial"
                          ).length,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-black font-bold min-w-[40px] text-right">
                    {
                      filteredAttempts.filter(
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

            <div className="analytics-content-properties">
              <h1 className="analytics-title-text-properties">
                Industrial/Organizational Psychology
              </h1>
              <p className="text-black font-[Poppins]">Takers vs Non-Takers</p>
              <div className="flex items-center justify-center">
                <div
                  className="flex justify-center items-center"
                  style={{ width: "250px", height: "250px" }}
                >
                  <PieChartAttempts
                    allStudents={filteredStudents}
                    attemptedStudents={getCategoryAttemptedStudents(
                      "industrial"
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* GENERAL PSYCH ANALYTICS */}
          <div className="analytics-container-properties flex flex-row">
            <div className="analytics-content-properties">
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
                          filteredAttempts.filter(
                            (attempt) => attempt.category === "general"
                          ).length,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-black font-bold min-w-[40px] text-right">
                    {
                      filteredAttempts.filter(
                        (attempt) => attempt.category === "general"
                      ).length
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

            <div className="analytics-content-properties">
              <h1 className="analytics-title-text-properties">
                General Psychology
              </h1>
              <p className="text-black font-[Poppins]">Takers vs Non-Takers</p>
              <div className="flex items-center justify-center">
                <div
                  className="flex justify-center items-center"
                  style={{ width: "250px", height: "250px" }}
                >
                  <PieChartAttempts
                    allStudents={filteredStudents}
                    attemptedStudents={getCategoryAttemptedStudents("general")}
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
