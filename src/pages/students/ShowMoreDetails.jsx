import { useLocation, useNavigate } from "react-router";
import "../../css/students/showMoreDetails.css";
import chevronIcon from "../../assets/forAll/chevron.svg";
import samplepic from "../../assets/students/sample-minji.svg";
import { branches, categories } from "../../Constants";

export default function ShowMoreDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract state values
  const competitionData = location.state?.competitionData;
  const masteryData = location.state?.masteryData;
  const reviewData = location.state?.reviewData;
  const studentFirstName = location.state?.studentFirstName;
  const studentLastName = location.state?.studentLastName;
  const studentId = location.state?.studentId;
  const studentBadges = location.state?.studentBadges;
  const recentAct = location.state?.recentAct;

  

  const studentBranch =
    branches.find((b) => b.id === location.state?.studentBranch)?.name ||
    "Unknown Branch";

  const getCompetitionHighScores = () => {
    const grouped = {};
    competitionData.forEach((attempt) => {
      const key = `${attempt.category}-${attempt.level}`;
      const score = attempt.correct / attempt.total_items;
      if (!grouped[key] || score > grouped[key].score) {
        grouped[key] = { ...attempt, score };
      }
    });
    return grouped;
  };

  const getReviewHighScores = () => {
    const grouped = {};
    reviewData.forEach((attempt) => {
      const key = `${attempt.category}-${attempt.level}`;
      const score = attempt.correct / attempt.total_items;
      if (!grouped[key] || score > grouped[key].score) {
        grouped[key] = { ...attempt, score };
      }
    });
    return grouped;
  };

  const getScoreColor = (score) => {
    if (score === 1) return "bg-green-500";
    if (score >= 0.8) return "bg-orange-300";
    if (score > 0) return "bg-gray-300";
    return "bg-white";
  };

  const getHighestMasteryScores = () => {
    const grouped = {};
    masteryData.forEach((attempt) => {
      const categoryId = attempt.category;
      const score = attempt.correct / attempt.total_items;
      if (!grouped[categoryId] || score > grouped[categoryId].score) {
        grouped[categoryId] = {
          ...attempt,
          score,
          percentage: Math.round(score * 100),
        };
      }
    });
    return grouped;
  };

  const getTotalAttemptsPerLevel = (data) => {
    const attempts = {}; // key: `${categoryId}-${level}`

    data.forEach((attempt) => {
      const key = `${attempt.category}-${attempt.level}`;
      if (!attempts[key]) {
        attempts[key] = 1;
      } else {
        attempts[key] += 1;
      }
    });

    return attempts;
  };

  const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const competitionHighestScores = getCompetitionHighScores();
  const highestMasteryScores = getHighestMasteryScores();
  const reviewHighestScores = getReviewHighScores();

  const competitionAttemptsCount = getTotalAttemptsPerLevel(competitionData);
  const reviewAttemptsCount = getTotalAttemptsPerLevel(reviewData);

  return (
    <>
      <div className="more-details-container">
        <div className="add-account-header">
          <button
            type="button"
            onClick={() => navigate("/students")}
            className="view-acc-btn"
          >
            <img src={chevronIcon} alt="chevron" />
          </button>
          <h1 className="add-account-title">
            {studentLastName}'s Overall Data
          </h1>
        </div>
        <div className="profile-pic-details-container">
          <table className="profile-pic-details-table">
            <tr>
              <td>
                <div className="w-full h-full flex justify-center items-center">
                  <img
                    src={samplepic}
                    alt={studentFirstName}
                    className="!h-[130px] !w-[130px] aspect-square"
                  />
                </div>
              </td>
              <td>
                <div className="student-name-container">
                  <h1 className="font-bold text-black text-2xl">
                    {studentFirstName} {studentLastName}
                  </h1>
                  <p className="text-black text-sm font-bold">{studentId}</p>
                  <p className="text-black text-sm font-bold">
                    {studentBranch}
                  </p>
                </div>
              </td>
            </tr>
          </table>
        </div>

        <div className="w-full h-auto py-3">
          <h1 className="text-2xl font-bold">Recent Activity</h1>
          <h1>Level: {recentAct.level}</h1>
          <h1>Category: {categories.find((cat) => cat.id === recentAct.category)?.name}</h1>
          <h1>Score: {recentAct.correct}/{recentAct.total_items}</h1>
          <h1>Time: {recentAct.time_completion}</h1>





        </div>
        <div className="competition-mode-container">
          <table className="competition-mode-table text-black mt-3">
            <tr>
              <td className="text-2xl font-bold">Competition Mode</td>
            </tr>
            <tr>
              {categories.map((category) => (
                <td key={category.id}>
                  <div className="w-full flex justify-center items-center">
                    <div className="w-[95%] border-1 border-black p-3 rounded-2xl">
                      <h1 className="font-bold">{category.name}</h1>
                      <div className="flex justify-center items-center">
                        {levels.map((level) => {
                          const attemptKey = `${category.id}-${level}`;
                          const attempt = competitionHighestScores[attemptKey];
                          const score = attempt ? attempt.correct : 0;
                          const total = attempt ? attempt.total_items : 0;
                          const color = getScoreColor(score / total);
                          return (
                            <div
                              key={level}
                              className={`w-[23px] h-[23px] mr-1 rounded-md ${color} text-xs text-center text-black flex items-center justify-center mt-2 border-1 border-black`}
                              title={`Stage ${level} - Score: ${score}/${total}`}
                            >
                              {score > 0 ? score : ""}
                            </div>
                          );
                        })}
                      </div>
                      <div className="w-full h-auto flex justify-center items-center mt-2">
                        <div className="per-level-stats-container border-1 border-black p-2 rounded-xl">
                          <table className="w-full text-center text-black">
                            <tr>
                              <td></td>
                              <td>Score</td>
                              <td>Attempts</td>
                            </tr>

                            {levels.map((level) => (
                              <tr>
                                <td>Level {level}</td>
                                <td>
                                  {competitionHighestScores[
                                    `${category.id}-${level}`
                                  ]?.correct || 0}
                                </td>
                                <td>
                                  {competitionAttemptsCount[
                                    `${category.id}-${level}`
                                  ] || 0}
                                </td>
                              </tr>
                            ))}
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          </table>
        </div>

        <div className="competition-mode-container mt-5">
          <table className="competition-mode-table text-black">
            <tr>
              <td className="text-2xl font-bold">Review Mode</td>
            </tr>
            <tr>
              {categories.map((category) => (
                <td key={category.id}>
                  <div className="w-full flex justify-center items-center">
                    <div className="w-[95%] border-1 border-black p-3 rounded-2xl">
                      <h1 className="font-bold">{category.name}</h1>
                      <div className="flex justify-center items-center">
                        {levels.map((level) => {
                          const attemptKey = `${category.id}-${level}`;
                          const attempt = reviewHighestScores[attemptKey];
                          const score = attempt ? attempt.correct : 0;
                          const total = attempt ? attempt.total_items : 0;
                          const color = getScoreColor(score / total);
                          return (
                            <div
                              key={level}
                              className={`w-[23px] h-[23px] mr-1 rounded-md ${color} text-xs text-center text-black flex items-center justify-center mt-2 border-1 border-black`}
                              title={`Stage ${level} - Score: ${score}/${total}`}
                            >
                              {score > 0 ? score : ""}
                            </div>
                          );
                        })}
                      </div>
                      <div className="w-full h-auto flex justify-center items-center mt-2">
                        <div className="per-level-stats-container border-1 border-black p-2 rounded-xl">
                          <table className="w-full text-center text-black">
                            <tr>
                              <td></td>
                              <td>Score</td>
                              <td>Attempts</td>
                            </tr>

                            {levels.map((level) => (
                              <tr>
                                <td>Level {level}</td>
                                <td>
                                  {reviewHighestScores[
                                    `${category.id}-${level}`
                                  ]?.correct || 0}
                                </td>
                                <td>
                                  {reviewAttemptsCount[
                                    `${category.id}-${level}`
                                  ] || 0}
                                </td>
                              </tr>
                            ))}
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          </table>

          <div className="w-full my-5">
            <h1 className="text-2xl font-bold text-black mt-5">Mastery Mode</h1>
            <table className="w-full mt-2">
              <tr className="">
                {categories.map((category) => {
                  const masteryAttempt = highestMasteryScores[category.id];
                  const percentage = masteryAttempt?.percentage ?? 0;
                  const total = masteryAttempt?.total_items ?? 0;
                  const correct = masteryAttempt?.correct ?? 0;

                  let color = "bg-white";
                  if (percentage === 100) {
                    color = "bg-green-500";
                  } else if (percentage >= 80) {
                    color = "bg-orange-300";
                  } else if (percentage > 0) {
                    color = "bg-gray-500 text-white";
                  }

                  return (
                    <td key={category.id}>
                      <h1 className="text-black font-bold">{category.name}</h1>
                      <div className="w-full flex items-center justify-center">
                        <div className="w-11/12 h-5 bg-gray-200 rounded-md overflow-hidden border border-black">
                          <div
                            className={`h-full ${color} text-sm text-black text-center`}
                            style={{ width: `${percentage}%` }}
                            title={`Score: ${correct}/${total} (${percentage}%)`}
                          >
                            {percentage > 0 ? `${percentage}%` : ""}
                          </div>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            </table>
          </div>


          <div className="w-full">
            <h1 className="text-2xl font-bold text-black mt-5">Badges Acquired</h1>
            <div className="w-full flex flex-row flex-wrap justify-center gap-5">
                  {
                    studentBadges.map((badges) => (
                      <div className="w-[100px] h-[100px]">
                      <img src={badges.badge_id.filepath} alt="badge" />
                      </div>
                    ))
                  }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
