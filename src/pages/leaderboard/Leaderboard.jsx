import axios from "axios";
import { useContext, useEffect, useState } from "react";
import search from "../../assets/search/search.svg";
import { API_URL, branches, categories } from "../../Constants";
import "../../css/leaderboard/leaderboards.css";


import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExportDropdown from "../../components/ExportDropdown/ExportDropdown";

import logo from "../../assets/logo/logo.png";
import SelectFilter from "../../components/selectFilter/SelectFilter";
import { ActiveContext, UserLoggedInContext } from "../../contexts/Contexts";

export default function Leaderboard() {
  const { currentWebUser } = useContext(UserLoggedInContext);
  const { theme } = useContext(ActiveContext)

  const [leaderboardClassic, setClassicLeaderboards] = useState([]);
  const [leaderboardsMastery, setLeaderboardsMastery] = useState([]);
  const [searchClassic, setSearchClassic] = useState("");
  const [searchMastery, setSearchMastery] = useState("");

  const [classicSuggestions, setClassicSuggestions] = useState([]);
  const [masterySuggestions, setMasterySuggestions] = useState([]);

  const [loadingDataClassic, setLoadingDataClassic] = useState(false);
  const [loadingDataMastery, setLoadingDataMastery] = useState(false);

  // const [classicSelectedBranch, setClassicSelectedBranch] = useState("");
  // const [masterySelectedBranch, setMasterySelectedBranch] = useState("");

  const [classicSelectedBranch, setClassicSelectedBranch] = useState(
    currentWebUser?.position.toLowerCase() === "super admin" ? "all" : ""
  );

  const [masterySelectedBranch, setMasterySelectedBranch] = useState(
    currentWebUser?.position.toLowerCase() === "super admin" ? "all" : ""
  );

  const [selectedCategoryClassic, setselectedCategoryClassic] = useState("");
  const [selectedCategoryMastery, setselectedCategoryMastery] = useState("");

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);

  const [showClassic, setShowClassic] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1025);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchTopClassicLeaderboard();
    fetchTopMasteryLeaderboard();
  }, [selectedCategoryClassic, selectedCategoryMastery]);

  //function to normalize names for search (remove commas, trim, lowercase)
  const normalizeName = (name) => {
    return name.replace(/,/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  };

  // FETCHING CLASSIC LEADERBOARD
  const fetchTopClassicLeaderboard = async () => {
    setLoadingDataClassic(true);
    try {
      const params = {
        mode: "classic",
      };
      if (selectedCategoryClassic && selectedCategoryClassic !== "all") {
        params.category = selectedCategoryClassic;
      }
      const response = await axios.get(`${API_URL}/getTopLeaderboards`, {
        params,
      });
      setClassicLeaderboards(response.data);
    } catch (error) {
      console.error("Error fetching top leaderboards:", error.message);
    } finally {
      setLoadingDataClassic(false);
    }
  };

  // FETCHING MASTERY LEADERBOARD
  const fetchTopMasteryLeaderboard = async () => {
    setLoadingDataMastery(true);
    try {
      const params = {
        mode: "mastery",
      };
      if (selectedCategoryMastery && selectedCategoryMastery !== "all") {
        params.category = selectedCategoryMastery;
      }
      const response = await axios.get(`${API_URL}/getTopLeaderboards`, {
        params,
      });

      setLeaderboardsMastery(response.data);
    } catch (error) {
      console.error("Error fetching top leaderboards:", error.message);
    } finally {
      setLoadingDataMastery(false);
    }
  };

  // Function to handle classic search input changes and generate suggestions
  const handleClassicSearchChange = (e) => {
    const value = e.target.value;
    setSearchClassic(value);

    if (value.length > 0) {
      const normalizedSearchValue = normalizeName(value);
      const uniqueSuggestionsMap = new Map();

      leaderboardClassic.forEach((leader) => {
        const firstName = leader.user_id?.first_name || "";
        const lastName = leader.user_id?.last_name || "";
        const fullNameNormalized = normalizeName(`${firstName} ${lastName}`);
        const reversedFullNameNormalized = normalizeName(
          `${lastName} ${firstName}`
        );

        if (
          fullNameNormalized.includes(normalizedSearchValue) ||
          reversedFullNameNormalized.includes(normalizedSearchValue)
        ) {
          const userId = leader.user_id?._id;
          if (userId && !uniqueSuggestionsMap.has(userId)) {
            uniqueSuggestionsMap.set(userId, {
              id: userId,
              name: `${lastName.toUpperCase()}, ${firstName}`.trim(),
            });
          }
        }
      });
      setClassicSuggestions(
        Array.from(uniqueSuggestionsMap.values()).slice(0, 10)
      );
    } else {
      setClassicSuggestions([]);
    }
  };

  // Function to handle mastery search input changes and generate suggestions
  const handleMasterySearchChange = (e) => {
    const value = e.target.value;
    setSearchMastery(value);

    if (value.length > 0) {
      const normalizedSearchValue = normalizeName(value);
      const uniqueSuggestionsMap = new Map();

      leaderboardsMastery.forEach((leader) => {
        const firstName = leader.user_id?.first_name || "";
        const lastName = leader.user_id?.last_name || "";
        const fullNameNormalized = normalizeName(`${firstName} ${lastName}`);
        const reversedFullNameNormalized = normalizeName(
          `${lastName} ${firstName}`
        );

        if (
          fullNameNormalized.includes(normalizedSearchValue) ||
          reversedFullNameNormalized.includes(normalizedSearchValue)
        ) {
          const userId = leader.user_id?._id;
          if (userId && !uniqueSuggestionsMap.has(userId)) {
            uniqueSuggestionsMap.set(userId, {
              id: userId,
              name: `${lastName.toUpperCase()}, ${firstName}`.trim(),
            });
          }
        }
      });
      setMasterySuggestions(
        Array.from(uniqueSuggestionsMap.values()).slice(0, 10)
      );
    } else {
      setMasterySuggestions([]);
    }
  };

  // FILTERING CLASSIC LEADERBOARD PER BRANCH OF THE PROFESSOR
  const filteredClassicLeaders = leaderboardClassic.filter((leader) => {
    const normalizedSearch = normalizeName(searchClassic);

    const firstName = leader.user_id?.first_name || "";
    const lastName = leader.user_id?.last_name || "";
    const fullNameNormalized = normalizeName(`${firstName} ${lastName}`);
    const reversedFullNameNormalized = normalizeName(
      `${lastName} ${firstName}`
    );

    const matchesSearch =
      fullNameNormalized.includes(normalizedSearch) ||
      reversedFullNameNormalized.includes(normalizedSearch);

    const matchesBranch =
      classicSelectedBranch === "all" ||
      !classicSelectedBranch ||
      leader.user_id?.branch === classicSelectedBranch;

    const matchesCategory =
      selectedCategoryClassic === "all" ||
      !selectedCategoryClassic ||
      leader.category === selectedCategoryClassic;

    return matchesSearch && matchesBranch && matchesCategory;
  });

  // FILTERING MASTERY LEADERBOARD PER BRANCH OF THE PROFESSOR
  const filteredMasteryLeaders = leaderboardsMastery.filter((leader) => {
    const normalizedSearch = normalizeName(searchMastery);

    const firstName = leader.user_id?.first_name || "";
    const lastName = leader.user_id?.last_name || "";
    const fullNameNormalized = normalizeName(`${firstName} ${lastName}`);
    const reversedFullNameNormalized = normalizeName(
      `${lastName} ${firstName}`
    );

    const matchesSearch =
      fullNameNormalized.includes(normalizedSearch) ||
      reversedFullNameNormalized.includes(normalizedSearch);

    const matchesBranch =
      masterySelectedBranch === "all" ||
      !masterySelectedBranch ||
      leader.user_id?.branch === masterySelectedBranch;

    const matchesCategoryMastery =
      selectedCategoryMastery === "all" ||
      !selectedCategoryMastery ||
      leader.category === selectedCategoryMastery;

    return matchesSearch && matchesBranch && matchesCategoryMastery;
  });

  //AFTER FILTERING THE CLASSIC, THEN SORTING
  const classicSortingLeaders = [...filteredClassicLeaders]
    .sort((a, b) => {
      const aScore = a.total_items > 0 ? a.correct / a.total_items : 0;
      const bScore = b.total_items > 0 ? b.correct / b.total_items : 0;

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

  //AFTER FILTERING THE MASTERY, THEN SORTING
  const masterySortingLeaders = [...filteredMasteryLeaders]
    .sort((a, b) => {
      const aScore = a.total_items > 0 ? a.correct / a.total_items : 0;
      const bScore = b.total_items > 0 ? b.correct / b.total_items : 0;

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

  const exportToCSV = (data, filename) => {
    const now = new Date().toLocaleString();
    const headers = ["Rank", "Name", "Campus", "World", "Score", "Time"];
    const rows = data.map((leader) => {
      const firstName = leader.user_id?.first_name || "";
      const lastName = leader.user_id?.last_name || "";
      const fullName = `${lastName.toUpperCase()} ${firstName}`.trim();

      return [
        leader.rank,
        fullName,
        branches.find((branch) => branch.id === leader.user_id?.branch)?.name ||
          "N/A",
        leader.category === "developmental"
          ? "Developmental Psychology"
          : leader.category === "abnormal"
          ? "Abnormal Psychology"
          : leader.category === "psychological"
          ? "Psychological Psychology"
          : leader.category === "industrial"
          ? "Industrial Psychology"
          : leader.category === "general"
          ? "General Psychology"
          : leader.category,
        leader.total_items > 0
          ? `${((leader.correct / leader.total_items) * 100).toFixed(0)}%`
          : "N/A",
        leader.time_completion > 60
          ? `${Math.floor(leader.time_completion / 60)}m ${Math.round(
              leader.time_completion % 60
            )}s`
          : `${Math.round(leader.time_completion)}s`,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        `Exported by: ${currentWebUser.firstName} ${currentWebUser.lastName}`,
        `Exported on: ${now}`,
        "",
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${filename}_by_${currentWebUser.firstName} ${currentWebUser.lastName}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //convert logo to base64 para lumabas sa pdf
  const getBase64FromUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // PDF Export
  const exportToPDF = async (data, title) => {
    const logoBase64 = await getBase64FromUrl(logo);
    const now = new Date().toLocaleString();
    const doc = new jsPDF();
    doc.text(`${title}`, 14, 10);
    doc.text(
      `Exported by: ${currentWebUser.firstName} ${currentWebUser.lastName}`,
      14,
      18
    );
    doc.text(`Exported on: ${now}`, 14, 26);

    const pageWidth = doc.internal.pageSize.getWidth();
    const logoWidth = 30;
    const logoHeight = 15;
    const xPos = pageWidth - logoWidth - 10;
    doc.addImage(logoBase64, "PNG", xPos, 10, logoWidth, logoHeight);

    const rows = data.map((leader) => {
      const firstName = leader.user_id?.first_name || "";
      const lastName = leader.user_id?.last_name || "";
      const reversedFullName = `${lastName.toUpperCase()} ${firstName}`.trim();

      return [
        leader.rank,
        reversedFullName,
        branches.find((branch) => branch.id === leader.user_id?.branch)?.name ||
          "N/A",
        leader.category === "developmental"
          ? "Developmental Psychology"
          : leader.category === "abnormal"
          ? "Abnormal Psychology"
          : leader.category === "psychological"
          ? "Psychological Psychology"
          : leader.category === "industrial"
          ? "Industrial Psychology"
          : leader.category === "general"
          ? "General Psychology"
          : leader.category,
        leader.total_items > 0
          ? `${((leader.correct / leader.total_items) * 100).toFixed(0)}%`
          : "N/A",
        leader.time_completion > 60
          ? `${Math.floor(leader.time_completion / 60)}m ${Math.round(
              leader.time_completion % 60
            )}s`
          : `${Math.round(leader.time_completion)}s`,
      ];
    });

    autoTable(doc, {
      head: [["Rank", "Name", "Campus", "World", "Score", "Time"]],
      body: rows,
      startY: 30,
    });

    doc.save(
      `${title.replace(" ", "_")}_by_${currentWebUser.firstName}_${
        currentWebUser.lastName
      }.pdf`
    );
  };

  return (
    <>
      {isMobile && (
        <div className="flex bg-gray-200 p-1 rounded-xl w-full mb-4">
          <button
            className={`text-black flex justify-center items-center w-1/2 px-4 py-2 rounded-lg transition-all duration-200
      ${
        showClassic
          ? "bg-white !text-[#FFA500] font-semibold shadow"
          : "opacity-60 hover:opacity-100"
      }`}
            onClick={() => setShowClassic(true)}
            disabled={showClassic}
          >
            Competitive Mode
          </button>

          <button
            className={`text-black flex justify-center items-center w-1/2 px-4 py-2 rounded-lg transition-all duration-200
      ${
        !showClassic
          ? "bg-white  !text-[#FFD700] font-semibold shadow"
          : "opacity-60 hover:opacity-100"
      }`}
            onClick={() => setShowClassic(false)}
            disabled={!showClassic}
          >
            Mastery Mode
          </button>
        </div>
      )}

      <div
        className={`leaderboard-body grid gap-2 ${
          isMobile ? `grid-cols-1` : `grid-cols-2`
        }`}
      >
        {/* Render Classic Leaderboard */}
        {(showClassic || !isMobile) && (
          <div 
            className={"classic-cont"}
            style={{ backgroundColor: theme }}
          >
            <div 
              className="leaderboard-titles-cont"
            >
              <h1 
                className={`leaderboard-title classic-title
                ${theme === "#202024" ? "!text-white" : '!text-black'}`}
              >
                Classic
              </h1>
            </div>

            <h2 
              className={`leaderboard-subtitle`}
            >
              <i className={`${theme === "#202024" ? "!text-white" : '!text-black'}`}>Top 30 performing students in Classic Mode</i>
            </h2>

            <div className="search-bar-cont-leaderboards">
              <div className="search-bar-leaderboards">
                <button className="search-btn-leaderboards">
                  <img src={search} alt="search"></img>
                </button>
                <input
                  type="text"
                  placeholder="Search for a student"
                  className="search-input-leaderboards"
                  value={searchClassic}
                  onChange={handleClassicSearchChange}
                />
              </div>
              {classicSuggestions.length > 0 && searchClassic.length > 0 && (
                <ul className="suggestions-dropdown text-black font-[Poppins]">
                  {classicSuggestions.map((suggestion) => (
                    <li
                      key={suggestion.id} // Use the unique ID from the suggestion
                      onClick={() => {
                        setSearchClassic(suggestion.name);
                        setClassicSuggestions([]); // Clear suggestions after selection
                      }}
                    >
                      {suggestion.name}
                    </li>
                  ))}
                </ul>
              )}

              <div className="ml-5">
                <ExportDropdown
                  onExport={(format) => {
                    if (format === "csv") {
                      exportToCSV(classicSortingLeaders, "Classic_Leaderboard");
                    } else if (format === "pdf") {
                      exportToPDF(classicSortingLeaders, "Classic Leaderboard");
                    }
                  }}
                />
              </div>
            </div>

            <div className="w-full flex flex-col md:flex-row gap-3 ml-4 mb-3">
              {currentWebUser.position.toLowerCase() === "super admin" && (
                <div className="flex-1 min-w-[150px]">
                  <SelectFilter
                    value={classicSelectedBranch}
                    onChange={(e) => setClassicSelectedBranch(e.target.value)}
                    disabledOption="Select Branch"
                    fixOption="All Branches"
                    mainOptions={branches}
                    getOptionValue={(branch) => branch.id}
                    getOptionLabel={(branch) => branch.name}
                    addedClassName="w-full"     
                  />
                </div>
              )}

              <div className="flex-1 min-w-[150px]">
                <SelectFilter
                  value={selectedCategoryClassic}
                  onChange={(e) => setselectedCategoryClassic(e.target.value)}
                  disabledOption="Select Category"
                  fixOption="All Categories"
                  mainOptions={categories}
                  getOptionValue={(c) => c.id}
                  getOptionLabel={(c) => c.name}
                  addedClassName="w-full"      
                />
              </div>
            </div>


            <div className="leaderboard-contents-container mb-25">
              <div className="content-header">
                <h1 className="title-header">Rank</h1>
                <h1 className="title-header">Name</h1>
                <h1 className="title-header">Campus</h1>
                <h1 className="title-header">World</h1>
                <h1 className="title-header">Score</h1>
                <h1 className="title-header">Time</h1>
              </div>
              {loadingDataClassic ? (
                <div className="loading-overlay-leaderboards">
                  <div className="spinner"></div>
                  <p>Fetching data...</p>
                </div>
              ) : classicSortingLeaders.length === 0 ? (
                <h1 className="text-black mt-5 w-full text-3xl text-center">
                  No data Found
                </h1>
              ) : (
                <div className="leaders-main-container">
                  {classicSortingLeaders
                    .filter((leader) =>
                      classicSelectedBranch === "all" || !classicSelectedBranch
                        ? true
                        : leader.user_id?.branch === classicSelectedBranch
                    )
                    .map((leader) => (
                      <div
                        key={leader._id}
                        className="leaders-container bg-gray-100 rounded-xl mt-2"
                      >
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
                          {leader.user_id?.last_name.toUpperCase()},{" "}
                          {leader.user_id?.first_name}
                        </div>

                        <div className="leader-info text-black leaders-content-font">
                          {branches.find(
                            (branch) => branch.id === leader.user_id?.branch
                          )?.name || "Unknown Branch"}
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
                              ).toFixed(0)}%`
                            : "N/A"}
                        </div>

                        <div className="leader-info text-black leaders-content-font">
                          {leader.time_completion > 60
                            ? `${Math.floor(
                                leader.time_completion / 60
                              )}m ${Math.round(leader.time_completion % 60)}s`
                            : `${Math.round(leader.time_completion)}s`}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Render Mastery Leaderboard */}
        {(!showClassic || !isMobile) && (
          <div 
            className="mastery-cont"
            style={{ backgroundColor: theme }}
          >
            <div className="leaderboard-titles-cont">
              <h1 
                className={`leaderboard-title mastery-title
                ${theme === "#202024" ? "!text-white" : '!text-black'}`}
              >Mastery</h1>
            </div>

            <h2 className="leaderboard-subtitle">
              <i className={`${theme === "#202024" ? "!text-white" : '!text-black'}`}>Top 30 performing students in Mastery Mode</i>
            </h2>

            <div className="search-bar-cont-leaderboards">
              <div className="search-bar-leaderboards">
                <button className="search-btn-leaderboards">
                  <img src={search} alt="search"></img>
                </button>
                <input
                  type="text"
                  placeholder="Search for a student"
                  className="search-input-leaderboards"
                  value={searchMastery}
                  onChange={handleMasterySearchChange}
                />
              </div>
              {masterySuggestions.length > 0 && searchMastery.length > 0 && (
                <ul className="suggestions-dropdown text-black font-[Poppins]">
                  {masterySuggestions.map((suggestion) => (
                    <li
                      key={suggestion.id} // Use the unique ID from the suggestion
                      onClick={() => {
                        setSearchMastery(suggestion.name);
                        setMasterySuggestions([]);
                      }}
                    >
                      {suggestion.name}
                    </li>
                  ))}
                </ul>
              )}

              <div className="ml-5">
                <ExportDropdown
                  onExport={(format) => {
                    if (format === "csv") {
                      exportToCSV(masterySortingLeaders, "Mastery_Leaderboard");
                    } else if (format === "pdf") {
                      exportToPDF(masterySortingLeaders, "Mastery Leaderboard");
                    }
                  }}
                />
              </div>
            </div>

            <div className="w-full flex flex-col md:flex-row md:flex-wrap gap-3 ml-4 mb-3">
              {currentWebUser.position.toLowerCase() === "super admin" && (
                <div className="flex-1 min-w-[150px]">
                  <SelectFilter
                    aria-label="Select Branch"
                    value={masterySelectedBranch}
                    onChange={(e) => setMasterySelectedBranch(e.target.value)}
                    disabledOption="Select Branch"
                    fixOption="All Branches"
                    mainOptions={branches}
                    getOptionValue={(branch) => branch.id}
                    getOptionLabel={(branch) => branch.name}
                    addedClassName="w-full" 
                  />
                </div>
              )}

              <div className="flex-1 min-w-[150px]">
                <SelectFilter
                  aria-label="Select Category"
                  value={selectedCategoryMastery}
                  onChange={(e) => setselectedCategoryMastery(e.target.value)}
                  disabledOption="Select Category"
                  fixOption="All Categories"
                  mainOptions={categories}
                  getOptionValue={(c) => c.id}
                  getOptionLabel={(c) => c.name}
                  addedClassName="w-full"  
                />
              </div>
            </div>


            <div className="leaderboard-contents-container mb-25">
              <div className="content-header">
                <h1 className="title-header">Rank</h1>
                <h1 className="title-header">Name</h1>
                <h1 className="title-header">Campus</h1>
                <h1 className="title-header">World</h1>
                <h1 className="title-header">Score</h1>
                <h1 className="title-header">Time</h1>
              </div>

              {loadingDataMastery ? (
                <div className="loading-overlay-leaderboards">
                  <div className="spinner"></div>
                  <p>Fetching data...</p>
                </div>
              ) : masterySortingLeaders.length === 0 ? (
                <h1 className="text-black mt-5 w-full text-3xl text-center">
                  No data Found
                </h1>
              ) : (
                <div className="leaders-main-container">
                  {masterySortingLeaders
                    .filter((leader) =>
                      masterySelectedBranch === "all" || !masterySelectedBranch
                        ? true
                        : leader.user_id?.branch === masterySelectedBranch
                    )
                    .map((leader) => (
                      <div
                        key={leader._id}
                        className="leaders-container bg-gray-100 rounded-xl mt-2"
                      >
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
                          {leader.user_id?.last_name.toUpperCase()},{" "}
                          {leader.user_id?.first_name}
                        </div>

                        <div className="leader-info text-black leaders-content-font">
                          {branches.find(
                            (branch) => branch.id === leader.user_id?.branch
                          )?.name || "Unknown Branch"}
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
                              ).toFixed(0)}%`
                            : "N/A"}
                        </div>

                        <div className="leader-info text-black leaders-content-font">
                          {leader.time_completion > 60
                            ? `${Math.floor(
                                leader.time_completion / 60
                              )}m ${Math.round(leader.time_completion % 60)}s`
                            : `${Math.round(leader.time_completion)}s`}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
