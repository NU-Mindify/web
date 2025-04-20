import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import terms from '../../data/GlossaryTerms.json'
import '../../css/glossary/editGlossary.css'
import axios from 'axios';
import { API_URL } from '../../Constants';


export default function EditGlossary() {
    const location = useLocation();
    const navigate = useNavigate();
    const { _id, word, meaning } = location.state || {};

    const [editedWord, setEditedWord] = useState(word);
    const [editedMeaning, setEditedMeaning] = useState(meaning);

    const editedTerm = { editedWord, editedMeaning };


    const handleSave = async () => {
        try {
          await axios.put(`${API_URL}/updateTerm/${_id}`, {
            term_id: _id,
            word: editedWord,
            meaning: editedMeaning
          });
      
          navigate('/glossary'); 
        } catch (error) {
            console.error("Error updating term:", error);
          }
    };

    function handleBack(){
        navigate('/glossary');
    }
      



    return (
        <div className="edit-glossary-container">
            <div className='edit-header'>
                <h1 className='edit-title'>Edit Term</h1>
                <button 
                    className='back-btn' 
                    onClick={handleBack}
                >
                    ?
                </button>
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
                        rows={10}
                        className='editable-container'
                        type="text"
                        value={editedMeaning}
                        onChange={(e) => setEditedMeaning(e.target.value)}
                    />
                </div>

                
            </div>
                <button 
                onClick={() => handleSave()}
                className='save-btn'
                >
                    Save
            </button>
        </div>
    );
}
