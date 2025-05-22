import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { API_URL } from "../../Constants";
import '../../css/glossary/addGlossary.css';
import closebtn from '../../assets/glossary/close-btn.svg';
import addtermsbtn from '../../assets/glossary/add-terms-btn.svg';
import deletebtn from '../../assets/glossary/delete-icon.svg';

export default function AddTerm() {
    const [newTerm, setNewTerm] = useState([
        { word: '', meaning: '', tags: [], is_deleted: false }
    ]);
    const [tagInput, setTagInput] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (index, field, value) => {
        const updatedTerms = [...newTerm];
        updatedTerms[index][field] = value;
        setNewTerm(updatedTerms);
    };

    //for buttoons
    const handleAddMoreTerm = () => {
        setNewTerm([...newTerm, { word: '', meaning: '', tags: [], is_deleted: false }]);
    };

    const handleDeleteTerm = (index) => {
        const updatedTerms = newTerm.filter((_, i) => i !== index);
        setNewTerm(updatedTerms);
    };


    const handleCreateNewTerm = () => {
    for (const term of newTerm) {
        if (!term.word.trim() || !term.meaning.trim() || !term.tags) {
        alert("Please fill out all required fields.");
        return;
        }
    }

    Promise.all(
        newTerm.map(term =>
        axios.post(`${API_URL}/addTerm`, term)
        )
    )
    .then(() => {
        alert("Added successfully!");
        setNewTerm([{ word: '', meaning: '', tags: [], is_deleted: false }]);
    })
    .catch((error) => {
        console.error("Error adding term:", error);
        alert("Failed to add term. Please try again.");
    });
    };


    const handleBack = () => {
        // if (onClose) onClose();
        navigate('/glossary');
    };

return (
    <div className="add-term-page-wrapper">
      <div className="add-term-main-container">
        <div className="add-term-header">
          <h1 className="add-term-title">Add Terminology</h1>
          <button className="close-btn" onClick={handleBack}>
            <img src={closebtn} alt="close btn" />
          </button>
        </div>

        <div className="add-term-contents">
          {newTerm.map((term, index) => (
            <div className="term-section" key={index}>
              <div className="term-header">
                <select
                  value={term.tags}
                  onChange={(e) => handleInputChange(index, 'tags', e.target.value)}
                >
                  <option value="">Choose Category</option>
                  <option value="AbPsych">Abnormal Psychology</option>
                  <option value="DevPsych">Developmental Psychology</option>
                  <option value="PsychoPsych">Psychological Psychology</option>
                  <option value="IndPsych">Industrial Psychology</option>
                  <option value="GenPsych">General Psychology</option>
                </select>
              </div>

              <div className="term-input-row">
                <div className="term-input-column">
                  <input
                    type="text"
                    placeholder="Enter Term"
                    value={term.word}
                    onChange={(e) => handleInputChange(index, 'word', e.target.value)}
                  />
                  <div className="term-label">Term</div>
                </div>

                <div className="term-input-column">
                  <input
                    type="text"
                    placeholder="Enter Definition"
                    value={term.meaning}
                    onChange={(e) => handleInputChange(index, 'meaning', e.target.value)}
                  />
                  <div className="term-label">Definition</div>
                </div>
              </div>

              {newTerm.length > 1 && (
                <button type="button" className="delete-term-btn" onClick={() => handleDeleteTerm(index)}>
                  <img
                    src={deletebtn}
                    alt="delete-button"
                    className="delete-icon-btn"
                  />
                </button>
              )}
            </div>
          ))}

                    <button
                    type="button"
                    className="add-more-term-btn"
                    onClick={handleAddMoreTerm}
                    >
                    + Add more term
                    </button>

                </div>

                
                <div className="create-container">
                    <button className="create-btn" onClick={handleCreateNewTerm}>
                        <img
                        src={addtermsbtn}
                        alt="add-term button"
                        className="add-term-icon-btn"
                        />
                    </button>
                </div>

            </div>
        </div>
    );
};

  

