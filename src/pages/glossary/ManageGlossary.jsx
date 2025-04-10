import { useRef, useState, } from "react";
import terms from '../../data/GlossaryTerms.json'
import edit from '../../assets/glossary/edit.svg'
import dropdown from '../../assets/glossary/dropdown.svg'
import '../../css/glossary/glossary.css'

export default function ManageGlossary() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    const termRefs = useRef({});
    
    const groupedTerms = terms.reduce((acc, term) => {
      const firstLetter = term.word[0].toUpperCase();
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(term);
      return acc;
    }, {});
    
    const scrollToLetter = (letter) => {
      if (termRefs.current[letter]) {
        termRefs.current[letter].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    
    const [activeTermWord, setActiveTermWord] = useState(null);
    
    function handleDropdown(word) {
      setActiveTermWord(activeTermWord === word ? null : word);
    }
    
    return (
      <>
        <div className="header">
          <div className="glossary-title-container">
            <h1 className="glossary-title">Manage Glossary</h1>
          </div>
  
          <div className="glossary-search-container"></div>
  
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
  
          {letters.map((letter) => (
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
                        <img src={edit} className="editIcon" alt="edit icon" />
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
          ))}
        </div>
      </>
    );
  }