import { useRef, useState, useEffect } from "react";
import edit from "../../assets/glossary/edit.svg";
import dropdown from "../../assets/glossary/dropdown.svg";
import "../../css/glossary/glossary.css";
import { useNavigate } from "react-router";
import axios from "axios";
import { API_URL } from "../../Constants";
import EditGlossary from "./EditGlossary";
import SearchBar from "../../components/searchbar/SearchBar";
import searchIcon from "../../assets/students/search-01.svg";
import download from "../../assets/leaderboard/file-export.svg";
import Buttons from "../../components/buttons/Buttons";

export default function ManageGlossary() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const navigate = useNavigate();
  const termRefs = useRef({});
  const glossaryBodyRef = useRef(null);

  const [activeTermWord, setActiveTermWord] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [allTerms, setAllTerms] = useState([]);
  const [scrollTerms, setScrollTerms] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTerms, setLoadingTerms] = useState(false);
  const [page, setPage] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(null);

  const pageSize = 20;

  // Toggle dropdown
  const handleDropdown = (word) => {
    setActiveTermWord(activeTermWord === word ? null : word);
  };

  // Edit term
  const handlesEdit = (_id, word, meaning, tags) => {
    setSelectedTerm({ _id, word, meaning, tags });
    setShowEditModal(true);
  };

  // Fetch all terms for search
  const getAllTerms = async () => {
    try {
      setLoadingTerms(true);
      const response = await axios.get(`${API_URL}/getTerms`);
      return response.data || [];
    } catch (error) {
      console.error(`Error: ${error}`);
      return [];
    } finally {
      setLoadingTerms(false);
    }
  };

  // Fetch terms in batches for infinite scroll
  const fetchMoreTerms = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/getLimitedTerms/${page * pageSize}/${(page + 1) * pageSize}`
      );
      const newTerms = res.data;
      if (newTerms.length < pageSize) setHasMore(false);
      setScrollTerms((prev) => [...prev, ...newTerms]);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Error fetching terms:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMoreTerms();
    getAllTerms().then(setAllTerms);
  }, []);

  useEffect(() => {
    const container = glossaryBodyRef.current;
    const handleScroll = () => {
      if (!container) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore) {
        fetchMoreTerms();
      }
    };
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading]);

  const displayedTerms =
    searchTerm === ""
      ? scrollTerms
      : allTerms.filter(
          (term) =>
            !term.is_deleted &&
            term.word.toLowerCase().startsWith(searchTerm.toLowerCase())
        );

  const groupedTerms = displayedTerms.reduce((acc, term) => {
    const firstLetter = term.word[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(term);
    return acc;
  }, {});




  return (
    <>
      <div className="header">
        <div className="glossary-title-container">
          <h1>Manage Glossary</h1>
        </div>

        <div className="glossary-sub-header-container">
          <SearchBar
            value={searchTerm}
            handleChange={(e) => {
              setSearchTerm(e.target.value);
              // setShowSuggestions(true);
            }}
            placeholder="Search for a user"
            icon={searchIcon}
            // suggestions={searchSuggestions}
            // showSuggestions={showSuggestions}
            // onSuggestionSelect={(user) => {
            //   setSearchQuery(
            //     `${user.lastName.toUpperCase()}, ${user.firstName}`
            //   );
            //   setShowSuggestions(false);
            // }}
            addedClassName="w-[80%] h-[50px]"
          />

          <Buttons
            text="Add Term"
            onClick={() => navigate("/addterm")}
            addedClassName="btn btn-warning"
          />

          <img src={download} alt="export" className="acc-export-icon" />
        </div>

        <div className="glossary-letters-btn-container">
          {letters.map((letter) => (
            <button
              key={letter}
              onClick={() => setSearchTerm(letter)}
              className="navigator-buttons"
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      <div className="glossary-body" ref={glossaryBodyRef}>
        <div className="header-details-container">
          <div className="header-details">
            <div className="header-title">Terminology</div>
            <div className="header-title">Definition</div>
            <div className="header-title">Action</div>
          </div>
        </div>

        {loadingTerms ? (
          <div className="loading-overlay-accounts !mt-10">
            <div className="spinner"></div>
            <p>Fetching data...</p>
          </div>
        ) : searchTerm === "" && displayedTerms.length === 0 ? (
          <p className="text-gray-400 italic">No terms to show.</p>
        ) : (
          letters.map((letter) =>
            groupedTerms[letter] ? (
              <GlossaryLetterSection
                key={letter}
                letter={letter}
                terms={groupedTerms[letter]}
                activeTermWord={activeTermWord}
                onEdit={handlesEdit}
                onToggleDropdown={handleDropdown}
                termRefs={termRefs}
              />
            ) : null
          )
        )}

        {showEditModal && selectedTerm && (
          <EditGlossary
            term={selectedTerm}
            onClose={() => setShowEditModal(false)}
            onTermUpdated={() => {
              setPage(0);
              setScrollTerms([]);
              fetchMoreTerms();
              getAllTerms().then(setAllTerms);
            }}
          />
        )}
      </div>
    </>
  );
}

export function GlossaryLetterSection({
  letter,
  terms,
  activeTermWord,
  onEdit,
  onToggleDropdown,
  termRefs,
}) {
  return (
    <div
      key={letter}
      ref={(el) => (termRefs.current[letter] = el)}
      className="per-letter-main-container"
    >
      <div className="all-word-def-container">
        <div className="w-11/12">
          <h2 className="letter-title">{letter}</h2>
        </div>

        {terms.map((term, idx) => (
          <div
            key={idx}
            className={
              activeTermWord === term.word
                ? "active-per-word-container"
                : "per-word-container"
            }
          >
            <div className="word-container">{term.word}</div>
            <div
              className={
                activeTermWord === term.word
                  ? "active-meaning-container"
                  : "meaning-container"
              }
            >
              {term.meaning}
            </div>

            <div className="action-container">
              <button
                type="button"
                className="editIcon"
                onClick={() =>
                  onEdit(term._id, term.word, term.meaning, term.tags)
                }
              >
                <img src={edit} alt="edit icon" />
              </button>

              <button
                type="button"
                className={
                  activeTermWord === term.word ? "active-dropdown" : "dropdown"
                }
                onClick={() => onToggleDropdown(term.word)}
              >
                <img src={dropdown} alt="dropdown icon" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
