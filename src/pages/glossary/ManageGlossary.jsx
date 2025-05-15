import { useRef, useState, useEffect } from "react";
import search from '../../assets/search/search.svg';  
import edit from '../../assets/glossary/edit.svg';
import add from '../../assets/glossary/add.png';
import dropdown from '../../assets/glossary/dropdown.svg';
import '../../css/glossary/glossary.css';
import SearchBar from "../../components/searchbar/SearchBar";
import { useNavigate } from "react-router";
import axios from "axios";
import { API_URL } from "../../Constants";
import AddTerm from "./AddTerm";
import addtermbtn from '../../assets/glossary/add-term btn.svg';
import EditGlossary from "./EditGlossary";


import ExportDropdown from "../../components/ExportDropdown/ExportDropdown";
import { Plus } from "lucide-react";


export default function ManageGlossary() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const navigate = useNavigate();
  const termRefs = useRef({});
  const glossaryBodyRef = useRef(null);

  const [activeTermWord, setActiveTermWord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [allTerms, setAllTerms] = useState([]);
  const [scrollTerms, setScrollTerms] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 20;

<<<<<<< HEAD
  
  // const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(null);
=======
  const [loadingTerms, setLoadingTerms] = useState(false);

>>>>>>> ed2ff6398ecba8507d81bc1a2dbf59952e442950


  //dropdown function
  const handleDropdown = (word) => {
    setActiveTermWord(activeTermWord === word ? null : word);
  };


  //edit term function
  const handlesEdit = (_id, word, meaning, tags) => {
  setSelectedTerm({ _id, word, meaning, tags });
  setShowEditModal(true);
  };

  // const handlesEdit = (_id, word, meaning, tags) => {
  //   navigate('/glossary/edit', {
  //     state: { _id, word, meaning, tags }
  //   });
  // };


 
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

  //fetching first 20 and more when scroll down
  const fetchMoreTerms = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/getLimitedTerms/${page * pageSize}/${(page + 1) * pageSize}`);
      const newTerms = res.data;
      if (newTerms.length < pageSize) setHasMore(false);
      setScrollTerms(prev => [...prev, ...newTerms]);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error('Error fetching terms:', err);
    } finally {
      setIsLoading(false);
    }
  };

  //rendering new 20 terms
  useEffect(() => {
    fetchMoreTerms();
  }, []);


  //rendering all terms for search
  useEffect(() => {
    getAllTerms().then(setAllTerms);
  }, []);


  //scrolldown function to load more 20 terms
  useEffect(() => {
    const container = glossaryBodyRef.current;
    const handleScroll = () => {
      if (!container) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore) {
        fetchMoreTerms();
      }
    };
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading]);


  //displayed terms when searched
  const displayedTerms = searchTerm === '' ? scrollTerms : allTerms.filter(term =>
    !term.is_deleted &&
    term.word.toLowerCase().startsWith(searchTerm.toLowerCase())
  );


  const groupedTerms = displayedTerms.reduce((acc, term) => {
    const firstLetter = term.word[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(term);
    return acc;
  }, {});


  const handleAddTerm = () => {
    navigate('/addterm');
    // setShowAddModal(true)
  };

  return (
    <>
      <div className="header">
        <div className="glossary-title-container">
          <h1 className="glossary-title">Manage Glossary</h1>
        </div>

        <div className="glossary-search-container flex-1 min-w-[200px] flex justify-between items-center flex-wrap gap-2">
          <div className="search-bar-glossary">
            <button className="search-btn-glossary">
              <img src={search} alt="search icon" />
            </button>
            <input 
              type="text"
              placeholder="Search terms..." 
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              className="search-input-glossary"
            />
          </div>
<<<<<<< HEAD
            <button onClick={handleAddTerm} style={{ background: 'transparent', border: 'none', paddingRight: 4, paddingLeft:2 }}>
              <img 
                src={addtermbtn} 
                className="add-term-btn"
                alt="add-term button"
                style={{ width: 'auto', height: '50px', boxShadow: '1px 1px 5px rgb(99, 97, 97)', borderRadius: '9999px' }}
              />
            </button>
=======

          <div className="add-ques-container flex gap-2">
            <button
              className="btn flex items-center gap-2 px-4 py-2 text-sm font-medium"
              onClick={handleAddTerm}
            >
              <Plus className="w-5 h-5  text-white" />
              Add Term
            </button>

            <div className="pt-1 pr-8">
              <ExportDropdown />
            </div>
          </div>
>>>>>>> ed2ff6398ecba8507d81bc1a2dbf59952e442950
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
        <div className="header-details">
          <div className="header-title">Terminology</div>
          <div className="header-title">Definition</div>
          <div className="header-title">Action</div>
        </div>

        {loadingTerms ? 
          <div className="loading-overlay-students">
            <div className="spinner"></div>
            <p>Fetching data...</p>
          </div>
        : searchTerm === '' && displayedTerms.length === 0 ? (
          <p className="text-gray-400 italic">No terms to show.</p>
        ) : 
        (
          letters.map((letter) =>
            groupedTerms[letter] ? (
              <div key={letter} ref={el => (termRefs.current[letter] = el)} className="per-letter-main-container">
                <h2 className="letter-title">{letter}</h2>
                <div className="all-word-def-container">
                  {groupedTerms[letter].map((term, idx) => (
                    <div
                      key={idx}
                      className={activeTermWord === term.word ? "active-per-word-container" : "per-word-container"}
                    >
                      <div className="word-container">{term.word}</div>
                      <div className={activeTermWord === term.word ? "active-meaning-container" : "meaning-container"}>
                        {term.meaning}
                      </div>

                      <div className="action-container">
                        <div className="icon-group">
                          <img 
                            src={edit} 
                            className="editIcon"
                            alt="edit icon" 
                            onClick={() => handlesEdit(term._id, term.word, term.meaning, term.tags)}
                          />
                        </div>
                        <div
                          className={activeTermWord === term.word ? "active-dropdown" : "dropdown"}
                          onClick={() => handleDropdown(term.word)}
                        >

                          <img src={dropdown} className="dropdown-icon" alt="dropdown icon" />
                        </div>
                      </div>
                      
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          )
        )}

        {/* {showAddModal && (
          <AddTerm
            onClose={() => setShowAddModal(false)}
            onTermAdded={() => {
              setPage(0);
              setScrollTerms([]);
              fetchMoreTerms();
            }}
          />
        )} */}

        {showEditModal && selectedTerm && (
          <EditGlossary
            term={selectedTerm}
            onClose={() => setShowEditModal(false)}
            onTermUpdated={() => {
              setPage(0);
              setScrollTerms([]);
              fetchMoreTerms();
            }}
          />
        )}


      </div>

<<<<<<< HEAD
      <div className="glossary-footer">
        {/* <button className="add-term-btn" onClick={handleAddTerm}>
          <img 
            src={addtermbtn} 
            alt="add-term button"
            className="add-term-icon-btn"
          />
        </button> */}
      </div>

      
=======
     
>>>>>>> ed2ff6398ecba8507d81bc1a2dbf59952e442950
    </>
  );
}
