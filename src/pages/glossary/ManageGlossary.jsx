import { useRef, } from "react";
import terms from '../../data/GlossaryTerms.json'
import edit from '../../assets/edit.svg'
import dropdown from '../../assets/dropdown.svg'
import search from '../../assets/search.svg'
import '../../css/glossary.css'

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

    return (
        <>
            <div className="glossary-header">
                <h1 className="glossary-title">Manage Glossary</h1>

                <div className="glossary-search-container">
                    <div className="glossary-search-holder">
                        <button className="search-btn">
                            <img src={search}></img>
                        </button>
                        <input type="text" placeholder="Search" className="search-input" />
                    </div>
                </div>

                <div className="glossary-letters-btn-container">
                    {letters.map((letter, index) => (
                        <button
                            key={index}
                            onClick={() => scrollToLetter(letter)}
                            className="w-[30px] h-[30px] ml-[6px] mr-[6px] cursor-pointer hover:underline text-black font-bold"
                        >
                            {letter}
                        </button>
                    ))}
                </div>
            </div>

            <div className="glossary-body">
                {letters.map((letter) => (
                    <div key={letter} ref={(el) => (termRefs.current[letter] = el)} className="word-main-container">
                        <h2 className="letter-title">{letter}</h2>
                        {groupedTerms[letter]?.length > 0 ? (
                            <div className="all-word-def-container">
                                {groupedTerms[letter].map((term, idx) => (
                                    <div key={idx} className="per-word-container">
                                        <h3 className="word-container">{term.word}</h3>
                                        <p className="meaning-container">{term.meaning}</p>
                                        
                                        <div className="gege">
                                            <img src={edit} className="mainIcon"></img>
                                            <div className="dropdown">
                                            <img src={dropdown} className="mainIcon"></img>
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
