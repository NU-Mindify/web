import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../../css/glossary/editGlossary.css'
import axios from 'axios';
import { API_URL } from '../../Constants';
// import close from '../../assets/glossary/close btn.svg'
import savebtn from '../../assets/glossary/save-term-btn.svg'
import deletebtn from '../../assets/glossary/delete-term-btn.svg'
import closebtn from '../../assets/glossary/close-btn.svg';


export default function EditGlossary({ onClose, term, onTermUpdated }) {
    const location = useLocation();
    const navigate = useNavigate();

    const { _id, word, meaning, tags } = term;

    const [editedWord, setEditedWord] = useState(word);
    const [editedMeaning, setEditedMeaning] = useState(meaning);
    const [editTags, setEditTags] = useState(tags);


    const handleSave = async () => {
        try {
          await axios.put(`${API_URL}/updateTerm/${_id}`, {
            term_id: _id,
            word: editedWord,
            meaning: editedMeaning,
            tags: editTags
          });
      
          onTermUpdated?.();
          onClose();
        } catch (error) {
            console.error("Error updating term:", error);
          }
    };

    // function handleBack(){
    //     navigate('/glossary');
    // }


    const handleDelete = async () => {
        try {
            await axios.put(`${API_URL}/deleteTerm/${_id}`, {
                term_id: _id,
                is_deleted: true
              });

          onTermUpdated?.();
          onclose();
          } catch (error) {
              console.error("Error updating term:", error);
            }
    }
      



    return (
        <>
        <div className="modal-overlay">
            <div className="edit-glossary-container">
                <div className='edit-header'>
                    <h1 className='edit-title'>Edit Terminology</h1>
                    <button 
                        className='back-btn' 
                        onClick={onClose}
                    >
                        <img src={closebtn} alt='close btn' />
                    </button>
                </div>

                <div className='edit-content'>
                    <div>
                        <h1 className='edit-title-container'>Word</h1>
                        <input
                            className='edit-input'
                            type="text"
                            value={editedWord}
                            onChange={(e) => setEditedWord(e.target.value)}
                        />
                        <h1 className='edit-title-container'>Tags</h1>
                        <input
                            className='edit-input'
                            type="text"
                            placeholder="Enter tags separated by commas"
                            value={editTags.join(', ')}
                            onChange={(e) =>
                            setEditTags(e.target.value.split(',').map(tag => tag.trim()))}
                        />
                    </div>

                    <div>
                        <h1 className='edit-title-container'>Meaning</h1>
                        <textarea
                            rows={10}
                            className='edit-textarea'
                            type="text"
                            value={editedMeaning}
                            onChange={(e) => setEditedMeaning(e.target.value)}
                        />
                    </div>
                </div>
            
                <div className="buttons">
                    <button 
                        onClick={() => handleSave()}
                        className='save-btn'
                        >
                            <img src={savebtn} alt='save btn' className="save-icon"/>
                    </button>
                    <button 
                        onClick={() => handleDelete()}
                        className='delete-btn'
                        >
                            <img src={deletebtn} alt='delete btn' className="delete-icon"/>
                    </button>
                </div>

                {/* <div className="create-container">
                    <button className="create-btn" onClick={handleCreateNewTerm}>
                        <img 
                            src={addtermbtn} 
                            alt="add-term button"
                            className="add-term-icon-btn"
                        />
                    </button>
                </div> */}
            </div>
        </div>
        </>
    );
}
