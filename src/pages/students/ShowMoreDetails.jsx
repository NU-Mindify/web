import { useLocation, useNavigate } from "react-router";
import chevronIcon from "../../assets/forAll/chevron.svg";
import samplepic from "../../assets/students/sample-minji.svg";
import { avatarBodies } from "../../AvatarBody";
import { avatarandclothes, branches, categories } from "../../Constants";
import "../../css/students/showMoreDetails.css";

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
  const studentAvatar = location.state?.studentAvatar;
  const studentCloth = location.state?.studentCloth;
  const recentAct = location.state?.recentAct;
  const studentItems = location.state?.studentItems;
  const studentSessions = location.state?.studentSessions;

  

  console.log("Recnt acct", recentAct);

  const avatars = studentItems?.filter(
    (item) => avatarandclothes[item]?.type === "avatar"
  );
  const clothes = studentItems?.filter(
    (item) => avatarandclothes[item]?.type === "clothes"
  );

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

  function formatDateTime(isoString) {
    if (!isoString) return { date: "", time: "" };

    const date = new Date(isoString);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const mmm = months[date.getMonth()];
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();

    let hh = date.getHours();
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");

    const ampm = hh >= 12 ? "PM" : "AM";
    hh = hh % 12 || 12; // convert to 12hr format

    return {
      date: `${mmm} ${dd}, ${yyyy}`,
      time: `${hh}:${mm}:${ss} ${ampm}`,
    };
  }

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
                <div className="relative w-[130px] h-[130px]">
                  {/* Avatar Body */}
                  <img
                    src={avatarBodies[studentAvatar] || samplepic}
                    alt={studentFirstName}
                    className="absolute inset-0 w-full h-full object-contain z-0"
                  />

                  {/* Clothing */}
                  <img
                    src={avatarandclothes[studentCloth]?.src || samplepic}
                    alt={`${studentFirstName} clothing`}
                    className="absolute z-10 object-contain"
                    style={{
                      width: "55%",
                      height: "55%",
                      top: "45%",
                      left: "23%",
                      position: "absolute",
                    }}
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

        {recentAct?.length > 0 || studentSessions?.length > 0 ? (
          <div className="w-full h-auto flex justify-evenly items-start gap-4">
            {/* Recent Activity */}
            {recentAct?.length > 0 ? (
              <div className="w-[48%] h-auto py-3">
                <h1 className="text-2xl font-bold">Recent Activity</h1>
                <div className="stud-recent-act-container space-y-3">
                  {recentAct.map((act) => (
                    <div
                      key={act._id}
                      className="border-4 border-gray-500 rounded-md p-2 bg-white shadow-sm"
                    >
                      <h1 className="text-black">
                        <strong>Mode:</strong> {act.mode}
                      </h1>
                      <h1 className="text-black">
                        <strong>Level:</strong> {act.level}
                      </h1>
                      <h1 className="text-black">
                        <strong>Category:</strong>{" "}
                        {categories.find((cat) => cat.id === act.category)
                          ?.name || act.category}
                      </h1>
                      <h1 className="text-black">
                        <strong>Score:</strong> {act.correct}/{act.total_items}
                      </h1>
                      <h1 className="text-black">
                        <strong>Time:</strong> {act.time_completion}
                      </h1>
                      <h1 className="text-black">
                        <strong>Date:</strong>{" "}
                        {new Date(act.createdAt)
                          .toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })
                          .replace(/ /g, "-")}
                      </h1>
                      <h1 className="text-black">
                        <strong>Time:</strong>{" "}
                        {new Date(act.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </h1>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-[48%] h-[250px] flex items-center justify-center">
                <h1 className="text-gray-600">No Activity Yet</h1>
              </div>
            )}

            {/* Recent Sessions */}
            {studentSessions?.length > 0 ? (
              <div className="w-[48%] h-auto py-3">
                <h1 className="text-2xl font-bold">Recent Sessions</h1>
                <div className="stud-session-container space-y-3">
                  {studentSessions.map((session) => {
                    const start = formatDateTime(session.start_time);
                    const end = formatDateTime(session.end_time);

                    return (
                      <div
                        key={session._id}
                        className="border-4 border-gray-500 rounded-md p-2 bg-white shadow-sm"
                      >
                        <h1>
                          <strong>Duration:</strong> {session.duration}
                        </h1>
                        <br />
                        <h1>
                          <strong>Date Started:</strong> {start.date}
                        </h1>
                        <h1>
                          <strong>Time Started:</strong> {start.time}
                        </h1>
                        <br />
                        <h1>
                          <strong>Date Ended:</strong> {end.date}
                        </h1>
                        <h1>
                          <strong>Time Ended:</strong> {end.time}
                        </h1>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="w-[48%] h-[250px] flex items-center justify-center">
                <h1 className="text-gray-600">No Session Found</h1>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-[150px] flex items-center justify-center">
            <h1 className="text-gray-600 text-[100px]">NO ATTEMPTS YET</h1>
          </div>
        )}

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
            <h1 className="text-2xl font-bold text-black mt-5">
              Badges Acquired
            </h1>
            <div className="w-full flex flex-row flex-wrap justify-center gap-5">
              {studentBadges?.length > 0 ? (
                studentBadges.map((badge, index) => (
                  <div key={index} className="w-[100px] h-[100px]">
                    <img src={badge.badge_id.filepath} alt="badge" />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-lg mt-4">No badges acquired</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Avatars */}
            <div className="bg-white shadow-md rounded-2xl p-4">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Avatars</h2>
                <span>Total Avatars Owned: {avatars?.length || 0}</span>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                {avatars?.length > 0 ? (
                  avatars.map((avatar, idx) => (
                    <img
                      key={idx}
                      src={avatarandclothes[avatar]?.src}
                      alt={avatar}
                      className="w-20 h-20 object-contain"
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-lg mt-4">
                    No avatars acquired
                  </p>
                )}
              </div>
            </div>

            {/* Clothes */}
            <div className="bg-white shadow-md rounded-2xl p-4">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Clothes</h2>
                <span>Total Clothes Owned: {clothes?.length || 0}</span>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                {clothes?.length > 0 ? (
                  clothes.map((cloth, idx) => (
                    <img
                      key={idx}
                      src={avatarandclothes[cloth]?.src}
                      alt={cloth}
                      className="w-20 h-20 object-contain"
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-lg mt-4">
                    No clothes acquired
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
