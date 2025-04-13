import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import terms from '../../data/GlossaryTerms.json'
import '../../css/glossary/editGlossary.css'

export default function EditGlossary() {
    const location = useLocation();
    const navigate = useNavigate();
    const { word, meaning } = location.state || {};

    const [editedWord, setEditedWord] = useState(word);
    const [editedMeaning, setEditedMeaning] = useState(meaning);

    function handleSave(){
    // const existingGlossary = terms || [];

    // const updatedGlossary = existingGlossary.map(term =>
    //   term.word === word ? { word: editedWord, meaning: editedMeaning } : term
    // );


        navigate('/glossary');
    };

    function handleBack(){
        navigate('/glossary');
    }



    return (
        <div className="edit-glossary-container">
            <div className='edit-header'>
                <button 
                    className='back-btn' 
                    onClick={handleBack}
                >
                    ?
                </button>
                <h1 className='edit-title'>Edit Term</h1>
            </div>

            <div className='edit-content'>
                <div className='edit-term-container'>
                    <h1 className='edit-title-container'>Word</h1>
                    <input
                        className='editable-container'
                        type="text"
                        value={editedWord}
                        onChange={(e) => setEditedWord(e.target.value)}
                    />
                </div>

                <div className='edit-term-container'>
                    <h1 className='edit-title-container'>Meaning</h1>
                    <textarea
                        className='editable-container'
                        type="text"
                        value={editedMeaning}
                        onChange={(e) => setEditedMeaning(e.target.value)}
                    />
                </div>

                
            </div>
                <button 
                onClick={handleSave}
                className='save-btn'
                >
                    Save
            </button>
        </div>
    );
}
