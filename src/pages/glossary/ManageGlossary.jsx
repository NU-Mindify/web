import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { API_URL } from "../../Constants";
import dropdown from "../../assets/glossary/dropdown.svg";
import edit from "../../assets/glossary/edit.svg";
import logo from "../../assets/logo/logo.png";
import searchIcon from "../../assets/students/search-01.svg";
import ExportDropdown from "../../components/ExportDropdown/ExportDropdown";
import Buttons from "../../components/buttons/Buttons";
import SearchBar from "../../components/searchbar/SearchBar";
import { UserLoggedInContext } from "../../contexts/Contexts";
import "../../css/glossary/glossary.css";
import EditGlossary from "./EditGlossary";
import Header from "../../components/header/Header";
import PaginationControl from "../../components/paginationControls/PaginationControl";
import ToggleButton from "../../components/toggleButton/ToggleButton";

export default function ManageGlossary() {
  const letters = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const navigate = useNavigate();

  const { currentWebUser = { firstName: "Admin", lastName: "", token: "" } } =
    useContext(UserLoggedInContext) || {};

  const [searchTerm, setSearchTerm] = useState("");
  const [loadingTerms, setLoadingTerms] = useState(false);
  const [allTerms, setAllTerms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [activeTermWord, setActiveTermWord] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  const getAllTerms = async () => {
    try {
      setLoadingTerms(true);

      const endpoint = showArchived ? "getDeletedTerms" : "getTerms";

      const response = await axios.get(`${API_URL}/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${currentWebUser?.token || ""}`,
        },
      });

      if (response.data) {
        setAllTerms(response.data);
      } else {
        setAllTerms([]);
      }
    } catch (error) {
      console.error("Error fetching terms:", error);
      setAllTerms([]);
    } finally {
      setLoadingTerms(false);
    }
  };

  useEffect(() => {
    if (currentWebUser?.token) {
      getAllTerms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWebUser, showArchived]);

  // --- FILTER TERMS ---
  const filteredTerms = !searchTerm
    ? allTerms
    : allTerms.filter((term) => {
        if (!term.word) return false;

        if (searchTerm.length === 1 && /^[A-Z]$/.test(searchTerm)) {
          return term.word[0].toUpperCase() === searchTerm;
        }

        if (searchTerm === "#") {
          return /^[0-9]/.test(term.word);
        }

        return term.word.toLowerCase().includes(searchTerm.toLowerCase());
      });

  // --- PAGINATION (ALWAYS 10 per page) ---
  const termsPerPage = 10;
  const totalPages = Math.ceil(filteredTerms.length / termsPerPage) || 1;

  const indexOfLastTerm = currentPage * termsPerPage;
  const indexOfFirstTerm = indexOfLastTerm - termsPerPage;

  // Flatten first (with letter info)
  const flatTerms = filteredTerms.map((term) => {
    const firstChar = term.word ? term.word[0].toUpperCase() : "";
    let letter = /^[0-9]/.test(firstChar) ? "#" : firstChar;
    if (!/[A-Z]/.test(letter) && letter !== "#") letter = "#";
    return { ...term, letter };
  });

  // Slice exactly 10 per page
  const currentTerms = flatTerms.slice(indexOfFirstTerm, indexOfLastTerm);

  // Re-group the 10 terms for display
  const groupedTerms = letters.map((letter) => ({
    letter,
    terms: currentTerms.filter((term) => term.letter === letter),
  }));

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlesEdit = (_id, word, meaning, tags) => {
    setSelectedTerm({ _id, word, meaning, tags });
    setShowEditModal(true);
  };

  const exportGlossaryToCSV = (data, filename) => {
    const now = new Date().toLocaleString();
    const headers = ["Term", "Definition"];
    const rows = data.map((term) => [term.word, term.meaning]);

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

  //convert logo to base64 for pdf
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

  //EXPORT TO PDF
  const exportGlossaryToPDF = async (data, title) => {
    let logoBase64 = "";
    try {
      logoBase64 = await getBase64FromUrl(logo);
    } catch (error) {
      console.error("Error converting logo:", error);
    }

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
    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", xPos, 10, logoWidth, logoHeight);
    }

    const rows = data.map((term) => [term.word, term.meaning]);

    autoTable(doc, {
      head: [["Term", "Definition"]],
      body: rows,
      startY: 30,
    });

    doc.save(
      `${title.replace(" ", "_")}_by_${currentWebUser.firstName}_${
        currentWebUser.lastName
      }.pdf`
    );
  };

  const onToggleDropdown = (word) => {
    if (activeTermWord === word) {
      setActiveTermWord(null);
    } else {
      setActiveTermWord(word);
    }
  };

  return (
    <>
      <div className="header">
        <div className="w-full h-[100px] bg-white rounded-xl">
          <Header
            id={"account"}
            title={"Account Management"}
            exportToCSV={() => exportGlossaryToCSV(allTerms, "Glossary_Terms")}
            exportToPDF={() => exportGlossaryToPDF(allTerms, "Glossary_Terms")}
          />
        </div>

        <div className="w-full h-[calc(100svh-140px)] bg-white/50 flex flex-col mt-5 rounded-xl">
          <div className="w-full h-[100px] flex justify-between items-center px-5">
            <SearchBar
              value={searchTerm}
              handleChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search for a term"
              icon={searchIcon}
              addedClassName="w-[70%] h-[50px]"
            />

            <ToggleButton
              id={"glossary"}
              showLeftChoice={() => setShowArchived(false)}
              showRightChoice={() => setShowArchived(true)}
              useStateToShow={showArchived}
              textLeftChoice={"All Terms"}
              textRightChoice={"Archive"}
            />

            <Buttons
              text="Add Term"
              onClick={() => navigate("/addterm")}
              addedClassName="btn btn-warning bg-[#FFBF1A] hover:brightness-105 !text-black font-[Poppins] !w-[200px]
"
            />
          </div>

          <div className="w-full h-[80px] flex justify-evenly">
            {letters.map((letter) => (
              <button
                key={letter}
                onClick={() => {
                  setSearchTerm(letter);
                  setCurrentPage(1);
                }}
                className="navigator-buttons"
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="w-full h-[calc(100svh-400px)] overflow-y-auto">
            <div className="header-details-container">
            
              <div className="w-full bg-white flex justify-center border-b-2 border-black sticky top-0 z-50">
                <div className="header-details">
                  <div className="header-title">Terminology</div>
                  <div className="header-title">Definition</div>
                  <div className="header-title">Action</div>
                </div>
              </div>

              <div className="w-full md:w-11/12 flex-grow overflow-y-auto overflow-x-auto justify-center">
                {loadingTerms ? (
                  <p>Loading terms...</p>
                ) : groupedTerms.some((g) => g.terms.length > 0) ? (
                  groupedTerms.map(({ letter, terms }) =>
                    terms.length > 0 ? (
                      <div
                        key={letter}
                        className="flex flex-col justify-center items-center"
                      >
                        <h3 className="letter-heading w-11/12 text-6xl my-2">
                          {letter}
                        </h3>
                        {terms.map((term) => (
                          <div
                            key={term._id}
                            className={
                              activeTermWord === term.word
                                ? "active-per-word-container"
                                : "per-word-container bg-white"
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
                                  handlesEdit(
                                    term._id,
                                    term.word,
                                    term.meaning,
                                    term.tags
                                  )
                                }
                              >
                                <img src={edit} alt="edit icon" />
                              </button>

                              <button
                                type="button"
                                className={
                                  activeTermWord === term.word
                                    ? "active-dropdown"
                                    : "dropdown"
                                }
                                onClick={() => onToggleDropdown(term.word)}
                              >
                                <img src={dropdown} alt="dropdown icon" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null
                  )
                ) : (
                  <p>No terms found.</p>
                )}

                {showEditModal && selectedTerm && (
                  <EditGlossary
                    term={selectedTerm}
                    onClose={() => setShowEditModal(false)}
                    onTermUpdated={() => {
                      getAllTerms().then(allTerms);
                    }}
                    showArchive={showArchived}
                  />
                )}
              </div>
            </div>
          </div>

          <PaginationControl
            currentPage={currentPage}
            totalItems={filteredTerms.length}
            goToPrevPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            goToNextPage={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(filteredTerms.length / 5))
              )
            }
          />
        </div>
      </div>


    </>
  );
}
