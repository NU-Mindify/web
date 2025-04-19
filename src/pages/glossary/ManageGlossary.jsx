import { useRef, useState, } from "react";
import terms from '../../data/GlossaryTerms.json'
import edit from '../../assets/glossary/edit.svg'
import dropdown from '../../assets/glossary/dropdown.svg'
import '../../css/glossary/glossary.css'
import SearchBar from "../../components/searchbar/SearchBar";
import { useNavigate } from "react-router";
// import abnormal from '../../data/GlossaryTerms.json'

export default function ManageGlossary() {

    // useEffect(() => {
    //   let newAbnormal = []
    //   abnormal.map((term) => {
    //     newAbnormal.push({
    //       "word": term.word,
    //       "meaning": term.meaning,
    //       tags: ["Abnormal Psychology"],
    //       is_deleted: false
    //     })
    //   })
    //   console.log(JSON.stringify(newAbnormal));
    // }, [])

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    const navigate = useNavigate();
    
    const termRefs = useRef({});

    const [activeTermWord, setActiveTermWord] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const groupedTerms = terms.reduce((acc, term) => {
      const firstLetter = term.word[0].toUpperCase();
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(term);
      return acc;
    }, {});

    const filteredTerms = terms.filter(term =>
      term.word.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    
    
    const scrollToLetter = (letter) => {
      if (termRefs.current[letter]) {
        termRefs.current[letter].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    
    function handleDropdown(word) {
      setActiveTermWord(activeTermWord === word ? null : word);
    }

    function handlesEdit(word, meaning){
      navigate('/glossary/edit', {
        state: { word, meaning }
      });
      
    }
    
    return (
      <>
        <div className="header">
          <div className="glossary-title-container">
            <h1 className="glossary-title">Manage Glossary</h1>
          </div>
  
          <div className="glossary-search-container">
            <SearchBar 
              placeholder="Search here..." 
              handleChange={(e) => setSearchTerm(e.target.value)}
              className='search-input'
            />
          </div>
  
          <div className="glossary-letters-btn-container">
            {letters.map((letter, index) => (
              <button
                key={index}
                onClick={() => scrollToLetter(letter)}
                className="navigator-buttons"
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
  
        <div className="glossary-body">
          <div className="header-details">
            <div className="header-title">Terminology</div>
            <div className="header-title">Definition</div>
            <div className="header-title">Action</div>
          </div>
  
          {searchTerm === '' ? (
            letters.map((letter) => (
              <div key={letter} ref={(el) => (termRefs.current[letter] = el)} className="per-letter-main-container">
                <h2 className="letter-title">{letter}</h2>
                {groupedTerms[letter]?.length > 0 ? (
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
                        <div className="gege">
                          <img src={edit} className="editIcon" alt="edit icon" onClickCapture={() => handlesEdit(term.word, term.meaning)} />
                          <div className="dropdown" onClick={() => handleDropdown(term.word)}>
                            <img src={dropdown} className="mainIcon" alt="dropdown icon" />
                          </div>
                        </div>  
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No terms available</p>
                )}
              </div>
            ))
            ) : (
              <div className="search-results-container">
                <h4 className="letter-title">Search Results</h4>
                {filteredTerms.length > 0 ? (
                  filteredTerms.map((term, idx) => (
                    <div
                      key={idx}
                      className={activeTermWord === term.word ? "active-per-word-container" : "per-word-container"}
                    >
                      <div className="word-container">{term.word}</div>
                      <div className={activeTermWord === term.word ? "active-meaning-container" : "meaning-container"}>
                        {term.meaning}
                      </div>
                      <div className="gege">
                        <img src={edit} className="editIcon" alt="edit icon" onClick={handlesEdit} />
                        <div className="dropdown" onClick={() => handleDropdown(term.word)}>
                          <img src={dropdown} className="mainIcon" alt="dropdown icon" />
                        </div>
                      </div>  
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">No matching terms found.</p>
                )}
              </div>
            )}

        </div>
      </>
    );
  }