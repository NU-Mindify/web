import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import dropdown from "../../assets/glossary/dropdown.svg";
import edit from "../../assets/glossary/edit.svg";
import logo from "../../assets/logo/logo.png";
import searchIcon from "../../assets/students/search-01.svg";
import Buttons from "../../components/buttons/Buttons";
import ExportDropdown from "../../components/ExportDropdown/ExportDropdown";
import SearchBar from "../../components/searchbar/SearchBar";
import { API_URL } from "../../Constants";
import { UserLoggedInContext } from "../../contexts/Contexts";
import "../../css/glossary/glossary.css";
import EditGlossary from "./EditGlossary";

export default function ManageGlossary() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const navigate = useNavigate();
  const termRefs = useRef({});
  const glossaryBodyRef = useRef(null);

  const context = useContext(UserLoggedInContext);
  const currentWebUser = context?.currentWebUser || {
    firstName: "Admin",
    lastName: "",
  };
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
  const [showArchived, setShowArchived] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const pageSize = 20;

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
      const response = await axios.get(`${API_URL}/getTerms`, {
        headers: {
          Authorization: `Bearer ${currentWebUser.token}`,
        },
      });
      return response.data || [];
    } catch (error) {
      console.error(`Error: ${error}`);
      return [];
    } finally {
      setLoadingTerms(false);
    }
  };

  // Fetch terms in batches for infinite scroll

  const fetchMoreTerms = async (targetPage = page) => {
    if (isLoading || !hasMore) return;

    if (!currentWebUser?.token) {
      console.error("No authentication token found.");
      return;
    }

    setIsLoading(true);

    try {
      console.log(
        `Fetching page: ${targetPage} (offset: ${
          targetPage * pageSize
        }) with token:`,
        currentWebUser.token
      );

      const res = await axios.get(
        `${API_URL}/getLimitedTerms/${targetPage * pageSize}/${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${currentWebUser.token}`,
          },
        }
      );

      const newTerms = res.data;
      console.log(
        `Page ${targetPage} returned ${newTerms.length} terms`,
        newTerms
      );

      if (newTerms.length < pageSize) {
        setHasMore(false);
      }

      setScrollTerms((prev) => [...prev, ...newTerms]);
      setPage(targetPage + 1); // increment page for next call
    } catch (err) {
      if (err.response?.status === 401) {
        console.error(
          "Unauthorized: Token may have expired or is invalid.",
          err
        );
      } else {
        console.error("Error fetching terms:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // const fetchMoreTerms = async (targetPage = page) => {              -----------[OLD CODE]----------
  //   if (isLoading || !hasMore) return;

  //   setIsLoading(true);
  //   try {
  //     const res = await axios.get(`${API_URL}/getLimitedTerms/${page * pageSize}/${pageSize}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${currentWebUser.token}`,
  //         },
  //       }
  //     );
  //     const newTerms = res.data;
  //     console.log("20 TERMS ARE:", newTerms);

  //     if (newTerms.length < pageSize) setHasMore(false);

  //     setScrollTerms((prev) => [...prev, ...newTerms]);
  //     setPage(targetPage + 1);
  //   } catch (err) {
  //     console.error("Error fetching terms:", err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    if (!currentWebUser?.token) return;

    setPage(0);
    setScrollTerms([]);
    setHasMore(true);

    fetchMoreTerms(0);
    getAllTerms().then((terms) => {
      setAllTerms(terms);

      if (terms.length > 0) {
        setScrollTerms(terms.slice(0, 20)); 
      }
    });
  }, [currentWebUser?.token]);

  // useEffect(() => {                    -----------[OLD CODE]----------
  //   setPage(0);
  //   setScrollTerms([]);
  //   setHasMore(true);
  //   fetchMoreTerms(0);
  //   getAllTerms().then(setAllTerms);
  // }, [currentWebUser]);

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
    if (!term.word) return acc;
    const firstLetter = term.word[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(term);
    return acc;
  }, {});

  console.log("Grouped Terms:", groupedTerms);

  //EXPORT TO CSV
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

  const [uploadedTerms, setUploadedTerms] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split("\n").filter((line) => line.trim() !== "");
        const newTermsFromCSV = [];

        for (let i = 1; i < lines.length; i++) {
          const [word, meaning] = lines[i].split(",").map((s) => s.trim());
          if (word && meaning) {
            newTermsFromCSV.push({
              word: word,
              meaning: meaning,
              tags: [],
              is_deleted: false,
            });
          }
        }
        setUploadedTerms(newTermsFromCSV);
      };
      reader.readAsText(file);
    } else {
      setSelectedFile(null);
      setUploadedTerms([]);
    }
  };

  const handleConfirmCSVUpload = () => {
    if (uploadedTerms.length === 0) {
      alert(
        "No terms parsed from the CSV file. Please check the file content and format (e.g., 'Term,Definition')."
      );

      return;
    }

    for (const term of uploadedTerms) {
      if (!term.word.trim() || !term.meaning.trim()) {
        alert(
          "Please ensure all terms in the CSV have a word and a definition."
        );

        return;
      }
    }

    Promise.all(
      uploadedTerms.map((term) =>
        axios.post(`${API_URL}/addTerm`, term, {
          headers: {
            Authorization: `Bearer ${currentWebUser.token}`,
          },
        })
      )
    )
      .then(() => {
        alert("Terms from CSV added successfully!");

        setSelectedFile(null);
        setUploadedTerms([]);

        Promise.all(
          uploadedTerms.map((term) =>
            axios.post(`${API_URL}/addLogs`, {
              name: `${currentWebUser.firstName} ${currentWebUser.lastName}`,
              branch: currentWebUser.branch,
              action: "Add Term from CSV",
              description: `${currentWebUser.firstName} added a term "${term.word}" with meaning "${term.meaning}" from CSV upload.`,
              useravatar: currentWebUser.useravatar
            })
          )
        );

        setScrollTerms([]);
        setHasMore(true);
        setPage(0);
        setTimeout(() => {
          fetchMoreTerms(0);
        }, 0);
      })
      .catch((error) => {
        console.error("Error adding terms from CSV:", error);
        alert("Failed to add terms from CSV. Please try again.");
      });
  };

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
            placeholder="Search for a term"
            icon={searchIcon}
            // suggestions={searchSuggestions}
            // showSuggestions={showSuggestions}
            // onSuggestionSelect={(user) => {
            //   setSearchQuery(
            //     `${user.lastName.toUpperCase()}, ${user.firstName}`
            //   );
            //   setShowSuggestions(false);
            // }}
            addedClassName="w-[70%] h-[50px]"
          />

          <div className="flex justify-between w-full mt-3 lg:w-auto lg:mt-0">
            <div className="flex items-center gap-2">
              <label className="bg-black cursor-pointer !text-white px-4 py-2 rounded">
                Upload CSV
                <input
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </label>

              {selectedFile && uploadedTerms.length > 0 && (
                <Buttons
                  text={`Upload ${uploadedTerms.length} Terms`}
                  onClick={handleConfirmCSVUpload}
                  addedClassName="btn btn-primary"
                />
              )}

              {selectedFile && uploadedTerms.length === 0 && (
                <p className="text-sm text-gray-500">Parsing CSV...</p>
              )}
            </div>

            <Buttons
              text="Add Term"
              onClick={() => navigate("/addterm")}
              addedClassName="btn btn-warning"
            />

            <ExportDropdown
              onExport={(format) => {
                if (format === "csv") {
                  exportGlossaryToCSV(allTerms, "Glossary_Terms");
                } else if (format === "pdf") {
                  exportGlossaryToPDF(allTerms, "Glossary Terms");
                }
              }}
            />
          </div>
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
          <div className="w-full mb-3">
            <div className="flex bg-gray-100 p-1 rounded-xl w-[300px] ml-15 mt-5 sticky top-0">
              <button
                onClick={() => setShowArchived(false)}
                className={`all-archive-btn ${showArchived || "active"} w-1/2`}
              >
                All Terms
              </button>
              <button
                onClick={() => setShowArchived(true)}
                className={`all-archive-btn ${showArchived && "active"} w-1/2`}
              >
                Archive
              </button>
            </div>
          </div>

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
