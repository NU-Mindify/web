import "../../css/leaderboard/leaderboards.css";
import search from "../../assets/search/search.svg";
import download from "../../assets/leaderboard/file-export.svg";
import dropdown from "../../assets/glossary/dropdown.svg";
import axios from "axios";
import { API_URL } from "../../Constants";
import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [leaderboards, setLeaderboards] = useState([]);
  const [leaderboardsMastery, setLeaderboardsMastery] = useState([]);
  const [searchClassic, setSearchClassic] = useState("");
  const [searchMastery, setSearchMastery] = useState("");

  const [loadingDataClassic, setLoadingDataClassic] = useState(false);
  const [loadingDataMastery, setLoadingDataMastery] = useState(false);

  useEffect(() => {
    fetchTopLeaderboards();
    fetchTopLeaderboardsMastery();
  }, []);

  const fetchTopLeaderboards = async () => {
    setLoadingDataClassic(true);
    try {
      const response = await axios.get(`${API_URL}/getTopLeaderboards`, {
        params: {
          mode: "classic",
        },
      });

      //   console.log(response.data);
      setLeaderboards(response.data);
    } catch (error) {
      console.error("Error fetching top leaderboards:", error.message);
    } finally {
      setLoadingDataClassic(false);
    }
  };

  const fetchTopLeaderboardsMastery = async () => {
    setLoadingDataMastery(true);
    try {
      const response = await axios.get(`${API_URL}/getTopLeaderboards`, {
        params: {
          mode: "mastery",
        },
      });

      //console.log(response.data);
      setLeaderboardsMastery(response.data);
    } catch (error) {
      console.error("Error fetching top leaderboards:", error.message);
    } finally {
      setLoadingDataMastery(false);
    }
  };

  //classic sorting
  const rankedLeaders = [...leaderboards]
    .sort((a, b) => {
      const aScore = a.correct / a.total_items;
      const bScore = b.correct / b.total_items;

      if (bScore !== aScore) {
        return bScore - aScore; // Higher score ranks higher
      } else {
        return a.time_completion - b.time_completion; // Tie-breaker: faster time ranks higher
      }
    })
    .map((leader, index) => ({
      ...leader,
      rank: index + 1,
    }));

  //mastery sorting
  const rankedLeadersMastery = [...leaderboardsMastery]
    .sort((a, b) => {
      const aScore = a.correct / a.total_items;
      const bScore = b.correct / b.total_items;

      if (bScore !== aScore) {
        return bScore - aScore;
      } else {
        return a.time_completion - b.time_completion;
      }
    })
    .map((leader, index) => ({
      ...leader,
      rank: index + 1,
    }));

  const filteredLeaders = rankedLeaders.filter((leader) =>
    leader.user_id?.username?.toLowerCase().includes(searchClassic)
  );

  const filteredLeadersMastery = rankedLeadersMastery.filter((leader) =>
    leader.user_id?.username?.toLowerCase().includes(searchMastery)
  );

  return (
    <>
      <div className="leaderboard-body">
        <div className="classic-cont">
          <div className="leaderboard-titles-cont">
            <h1 className="leaderboard-title classic-title">Classic</h1>
            <button className="export-btn">
              <img src={download} alt="Export" />
            </button>
          </div>

          <h2 className="leaderboard-subtitle">
            top 30 performing students in Classic Mode
          </h2>

          <div className="search-bar-cont-leaderboards">
            <div className="search-bar-leaderboards">
              <button className="search-btn-leaderboards">
                <img src={search}></img>
              </button>
              <input
                type="text"
                placeholder="Search for a student"
                className="search-input-leaderboards"
                value={searchClassic}
                onChange={(e) => setSearchClassic(e.target.value.toLowerCase())}
              />
            </div>
          </div>

          <div className="leaderboard-contents-container">
            <div className="content-header">
              <h1 className="title-header">Rank</h1>
              <h1 className="title-header">Name</h1>
              <h1 className="title-header flex items-center gap-1 cursor-pointer">
                {" "}
                Campus
                <img src={dropdown} className="w-20 h-7" alt="dropdown icon" />
              </h1>
              <h1 className="title-header flex items-center gap-1 cursor-pointer">
                {" "}
                World
                <img src={dropdown} className="w-20 h-7" alt="dropdown icon" />
              </h1>
              <h1 className="title-header">Score</h1>
              <h1 className="title-header">Time</h1>
            </div>
            {loadingDataClassic ? (
              <div className="loading-overlay-leaderboards">
                <div className="spinner"></div>
                <p>Fetching data...</p>
              </div>
            ) : (
              <div className="leaders-main-container">
                {filteredLeaders.map((leader) => (
                  <div key={leader._id} className="leaders-container bg-gray-100 rounded-xl mt-2">
                    <div className="leader-info text-black leaders-content-font">
                      {leader.rank === 1
                        ? "🥇"
                        : leader.rank === 2
                        ? "🥈"
                        : leader.rank === 3
                        ? "🥉"
                        : leader.rank}
                    </div>
                    <div
                      className="leader-info font-bold"
                      style={{ color: "#0068DD" }}
                    >
                      {leader.user_id?.username || "Unknown User"}
                    </div>

                    <div className="leader-info text-black leaders-content-font flex items-center gap-1">
                      {leader.user_id?.branch === "moa"
                        ? "NU MOA"
                        : "NU MANILA"}
                    </div>

                    <div className="leader-info text-black leaders-content-font">
                      {leader.category === "developmental"
                        ? "Developmental Psychology"
                        : leader.category === "abnormal"
                        ? "Abnormal Psychology"
                        : leader.category === "psychological"
                        ? "Psychological Psychology"
                        : leader.category === "industrial"
                        ? "Industrial Psychology"
                        : leader.category === "general"
                        ? "General Psychology"
                        : leader.category}
                    </div>

                    <div className="leader-info text-black font-bold leaders-content-font">
                      {leader.total_items > 0
                        ? `${(
                            (leader.correct / leader.total_items) *
                            100
                          ).toFixed(0)}%` //rounds up para whole num
                        : "N/A"}
                    </div>

                    <div className="leader-info text-black leaders-content-font">
                      {/* {new Date(leader.date).toLocaleDateString() || "N/A"} */}
                      {(leader.time_completion).toFixed(0)+"s"}
                    </div>
                  </div>
                ))}
                ;
              </div>
            )}
          </div>
        </div>

        <div className="mastery-cont">
          <div className="leaderboard-titles-cont">
            <h1 className="leaderboard-title mastery-title">Mastery</h1>

            <button className="export-btn">
              <img src={download} alt="Export" />
            </button>
          </div>

          <h2 className="leaderboard-subtitle">
            top 30 performing students in Mastery Mode
          </h2>

          <div className="search-bar-cont-leaderboards">
            <div className="search-bar-leaderboards">
              <button className="search-btn-leaderboards">
                <img src={search}></img>
              </button>
              <input
                type="text"
                placeholder="Search for a student"
                className="search-input-leaderboards"
                value={searchMastery}
                onChange={(e) => setSearchMastery(e.target.value.toLowerCase())}
              />
            </div>
          </div>

          <div className="leaderboard-contents-container">
            <div className="content-header">
              <h1 className="title-header">Rank</h1>
              <h1 className="title-header">Name</h1>
              <h1 className="title-header flex items-center gap-1 cursor-pointer">
                {" "}
                Campus
                <img src={dropdown} className="w-20 h-7" alt="dropdown icon" />
              </h1>
              <h1 className="title-header flex items-center gap-1 cursor-pointer">
                {" "}
                World
                <img src={dropdown} className="w-20 h-7" alt="dropdown icon" />
              </h1>
              <h1 className="title-header">Score</h1>
              <h1 className="title-header">Time</h1>
            </div>

            {loadingDataMastery ? (
              <div className="loading-overlay-leaderboards">
                <div className="spinner"></div>
                <p>Fetching data...</p>
              </div>
            ) : (
              <div className="leaders-main-container">
                {filteredLeadersMastery.map((leader) => (
                  <div key={leader._id} className="leaders-container bg-gray-100 rounded-xl mt-2">
                    <div className="leader-info text-black leaders-content-font">
                      {leader.rank === 1
                        ? "🥇"
                        : leader.rank === 2
                        ? "🥈"
                        : leader.rank === 3
                        ? "🥉"
                        : leader.rank}
                    </div>
                    <div
                      className="leader-info font-bold"
                      style={{ color: "#0068DD" }}
                    >
                      {leader.user_id?.username || "Unknown User"}
                    </div>

                    <div className="leader-info text-black leaders-content-font">
                      {leader.user_id?.branch === "moa"
                        ? "NU MOA"
                        : "NU MANILA"}
                    </div>

                    <div className="leader-info text-black leaders-content-font">
                      {leader.category === "developmental"
                        ? "Developmental Psychology"
                        : leader.category === "abnormal"
                        ? "Abnormal Psychology"
                        : leader.category === "psychological"
                        ? "Psychological Psychology"
                        : leader.category === "industrial"
                        ? "Industrial Psychology"
                        : leader.category === "general"
                        ? "General Psychology"
                        : leader.category}
                    </div>
                    <div className="leader-info text-black font-bold leaders-content-font">
                      {leader.total_items > 0
                        ? `${(
                            (leader.correct / leader.total_items) *
                            100
                          ).toFixed(0)}%` //rounds up para whole num
                        : "N/A"}
                    </div>

                    <div className="leader-info text-black leaders-content-font">
                      {/* {new Date(leader.date).toLocaleDateString() || "N/A"} */}
                      {(leader.time_completion).toFixed(0)+"s"}
                    </div>
                  </div>
                ))}
                ;
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
