import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { API_URL } from "../../Constants";
import '../../css/glossary/addGlossary.css';
import { XCircle } from "lucide-react";
import addtermsbtn from '../../assets/glossary/add-terms-btn.svg';
import savetermsbtn from '../../assets/glossary/save-terms-btn.svg';
import closebtn from '../../assets/glossary/close-btn.svg';
import chevron from "../../assets/glossary/dropdown.svg";

export default function AddTerm(){

    const [newTerm, setNewTerm] = useState({word: '', meaning: '', tags: [], is_deleted: false})
    const [tagInput, setTagInput] = useState('');


    const navigate = useNavigate();


    const handleCreateNewTerm = () => {
    const { word, meaning, tags } = newTerm;

    if (!word.trim() || !meaning.trim() || tags.length === 0) {
        alert("Please fill out all required fields.");
        return;
    }

    axios.post(`${API_URL}/addTerm`, newTerm)
        .then(() => {
            alert("Added successfully!");
            setNewTerm({ word: '', meaning: '', tags: [], is_deleted: false });
        })
        .catch((error) => {
            console.error("Error adding term:", error);
            alert("Failed to add term. Please try again.");
        });
};

    const handleBack = () => {
        // if (onClose) onClose();
        navigate('/glossary')
      };
      

    return(
        <>
        <div className="add-term-page-wrapper">
            <div className="add-term-main-container">
                <div className="add-term-header">
                    <h1 className="add-term-title">Add Terminology</h1>

                    <button className="close-btn" onClick={handleBack}>
                        <img src={closebtn} alt="close btn" />
                    </button>
                </div>

                <div className="add-term-contents">
                    <div>
                        <h1>Terminology <span>*</span></h1>
                        <input 
                            type="text"
                            placeholder="Type Here."
                            className="add-term-input"
                            value={newTerm.word}
                            onChange={(e) => setNewTerm({...newTerm, word: e.target.value})}
                        />

                        <h1>Tags <span>*</span></h1>
                        <div className="flex justify-start gap-4">
                        {newTerm.tags.map(tag=> (
                            <button 
                                className="text-black border bg-black/5 p-2 py-1 rounded flex gap-2 hover:cursor-pointer hover:bg-black/15" 
                                onClick={() => {
                                    setNewTerm(prev => ({...prev, tags: prev.tags.filter(tagName => tagName != tag)}))
                                }}
                            >
                                {tag} <XCircle />
                            </button>
                        ))}
                        </div>
                        <input 
                            type="text"
                            placeholder="Add a tag."
                            className="add-term-input"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                        />

                        <button 
                            className="btn btn-success" 
                            type="button"
                            onClick={() => {
                                if (tagInput.trim() !== '') {
                                    setNewTerm(prev => ({
                                        ...prev,
                                        tags: [...prev.tags, tagInput.trim()]
                                    }));
                                    setTagInput('');
                                }
                                else{
                                    alert('Please have an input')
                                }
                            }}
                        >
                            Add Tag
                        </button>

                    </div>


                    <div>
                        <h1>Definition <span>*</span></h1>
                        <textarea 
                            className="add-term-textarea"
                            rows={10}
                            value={newTerm.meaning}
                            placeholder="Type Here."
                            onChange={(e) => setNewTerm({...newTerm, meaning: e.target.value})}
                        >
                        </textarea>
                    </div>
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

            <div className="terminologies-container"> 
                <h1 className="terminologies-title">Terminolgies</h1>
                <div className="terminologies-list">
                    <div className="term-item">
                        <h3 className="term-name">New Term#1</h3>
                        <p className="term-definition">Defintion</p>
                            <img
                            src={chevron}
                            alt="chevron"
                            className="chevron-icon"
                            />
                    </div>

                    <div className="term-item">
                        <h3 className="term-name">New Term #2</h3>
                        <p className="term-definition">Defintion</p>
                            <img
                            src={chevron}
                            alt="chevron"
                            className="chevron-icon"
                            />
                    </div>

                    <div className="term-item">
                        <h3 className="term-name">New Term #3</h3>
                        <p className="term-definition">Defintion</p>
                            <img
                            src={chevron}
                            alt="chevron"
                            className="chevron-icon"
                            />
                    </div>

                    <div className="term-item">
                        <h3 className="term-name">New Term #4</h3>
                        <p className="term-definition">Defintion</p>
                            <img
                            src={chevron}
                            alt="chevron"
                            className="chevron-icon"
                            />
                    </div>
                </div>

                <div className="save-container">
                    <button className="save-button">
                        <img
                            src={savetermsbtn}
                            alt="save-term"
                            className="save-term-icon-btn"
                        />
                    </button>
                </div>
            </div>

        </div>
             
        </>
    )
}
