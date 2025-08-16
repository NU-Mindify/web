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
import { useContext } from "react";
import { UserLoggedInContext } from "../../contexts/Contexts";
import ExportDropdown from "../../components/ExportDropdown/ExportDropdown";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/logo/logo.png";

export default function ManageGlossary() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const navigate = useNavigate();

  const { currentWebUser = { firstName: "Admin", lastName: "" } } =
    useContext(UserLoggedInContext) || {};

  const [searchTerm, setSearchTerm] = useState("");
  const [loadingTerms, setLoadingTerms] = useState(false);
  const [allTerms, setAllTerms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const termsPerPage = 20;


  const getAllTerms = async () => {
    try {
      setLoadingTerms(true);
      const response = await axios.get(`${API_URL}/getTerms`, {
        headers: {
          Authorization: `Bearer ${currentWebUser.token}`,
        },
      });

      setAllTerms(response.data);
      

    } catch (error) {
      console.error("Error fetching terms:", error);
    } finally {
      setLoadingTerms(false);
    }
  };

  useEffect(() => {
    if (currentWebUser?.token) {
      getAllTerms();
    }
  }, [currentWebUser]);


const filteredTerms = !searchTerm
  ? allTerms
  : allTerms.filter((term) => {
      if (!term.word) return false;
      if (searchTerm.length === 1 && /^[A-Z]$/.test(searchTerm)) {
        return term.word[0].toUpperCase() === searchTerm;
      }
      return term.word.toLowerCase().includes(searchTerm.toLowerCase());
    });




  const totalPages = Math.ceil(filteredTerms.length / termsPerPage) || 1;
  const indexOfLastTerm = currentPage * termsPerPage;
  const indexOfFirstTerm = indexOfLastTerm - termsPerPage;
  const currentTerms = filteredTerms.slice(indexOfFirstTerm, indexOfLastTerm);


  const groupedTerms = letters.map((letter) => ({
    letter,
    terms: currentTerms.filter(
      (term) =>
        term.word && term.word[0].toUpperCase() === letter
    ),
  }));

  
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
              setCurrentPage(1); // reset to first page
            }}
            placeholder="Search for a term"
            icon={searchIcon}
            addedClassName="w-[70%] h-[50px]"
          />

          <div className="flex justify-between w-full mt-3 lg:w-auto lg:mt-0">
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

        {/* Letter filter buttons */}
        <div className="glossary-letters-btn-container">
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
      </div>

      <div className="glossary-body">
        <div className="header-details-container">
          <div className="w-full mb-3">
            <div className="flex bg-gray-100 p-1 rounded-xl w-[300px] mt-5 sticky top-0">
              <button onClick={() => setSearchTerm("")}>All Terms</button>
              <button>Archive</button>
            </div>
          </div>

          {/* Table headers */}
          <div className="header-details !bg-red-400">
            <div className="header-title">Terminology</div>
            <div className="header-title">Definition</div>
            <div className="header-title">Action</div>
          </div>

          {/* Terms list */}
          <div className="!bg-blue-400 w-11/12 flex-grow overflow-auto">
            {groupedTerms.some((g) => g.terms.length > 0) ? (
              groupedTerms.map(
                ({ letter, terms }) =>
                  terms.length > 0 && (
                    <div className="letter-card" key={letter}>
                      <div className="flex justify-between border-y p-1">
                        <h1 className="font-bold text-4xl">{letter}</h1>
                      </div>
                      {terms.map((t) => (
                        <div
                          key={t._id}
                          className="grid grid-cols-[2fr_3fr_1fr] mb-5"
                        >
                          <div>{t.word}</div>
                          <div>{t.meaning}</div>
                          <button>Edit</button>
                        </div>
                      ))}
                    </div>
                  )
              )
            ) : (
              <p className="p-4 text-gray-200">No terms found.</p>
            )}
          </div>

          {/* Pagination controls */}
          <div className="join mt-5">
            <button
              className="join-item btn"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              «
            </button>
            <button className="join-item btn !text-white">
              Page {currentPage} of {totalPages}
            </button>
            <button
              className="join-item btn"
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              »
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
