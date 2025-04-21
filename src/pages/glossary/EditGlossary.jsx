import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../../css/glossary/editGlossary.css'
import axios from 'axios';
import { API_URL } from '../../Constants';


export default function EditGlossary() {
    const location = useLocation();
    const navigate = useNavigate();
    const { _id, word, meaning, tags } = location.state || {};

    const [editedWord, setEditedWord] = useState(word || '');
    const [editedMeaning, setEditedMeaning] = useState(meaning || '');
    const [editTags, setEditTags] = useState(tags || []);


    const handleSave = async () => {
        try {
          await axios.put(`${API_URL}/updateTerm/${_id}`, {
            term_id: _id,
            word: editedWord,
            meaning: editedMeaning,
            tags: editTags
          });
      
          navigate('/glossary'); 
        } catch (error) {
            console.error("Error updating term:", error);
          }
    };

    function handleBack(){
        navigate('/glossary');
    }

    const handleDelete = async () => {
        try {
            await axios.put(`${API_URL}/deleteTerm/${_id}`, {
                term_id: _id,
                is_deleted: true
              });
            navigate('/glossary'); 
          } catch (error) {
              console.error("Error updating term:", error);
            }
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

                <div className='edit-term-container'>
                    <h1 className='edit-title-container'>Tags</h1>
                    <input
                        className='editable-container'
                        type="text"
                        placeholder="Enter tags separated by commas"
                        value={editTags.join(', ')}
                        onChange={(e) =>
                        setEditTags(e.target.value.split(',').map(tag => tag.trim()))
                        }
                    />

                </div>

                
            </div>
            <button 
                onClick={() => handleSave()}
                className='save-btn'
                >
                    Save
            </button>
            <button 
                onClick={() => handleDelete()}
                className='btn btn-error'
                >
                    Delete
            </button>
        </div>
    );
}
