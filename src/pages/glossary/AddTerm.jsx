import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { API_URL } from "../../Constants";
import close from '../../assets/glossary/close btn.svg';
import '../../css/glossary/addGlossary.css';
import addtermbtn from '../../assets/glossary/add-term btn.svg';
import { XCircle } from "lucide-react";



export default function AddTerm({onClose}){

    const [newTerm, setNewTerm] = useState({word: '', meaning: '', tags: [], is_deleted: false})
    const [tagInput, setTagInput] = useState('');


    const navigate = useNavigate();


    const handleCreateNewTerm = () =>{

        axios.post(`${API_URL}/addTerm`, newTerm)
        alert("added successfully")
        setNewTerm({word: '', meaning: '', tags: [], is_deleted: false})
    }

    const handleBack = () => {
        if (onClose) onClose();
      };
      

    return(
        <>
        <div className="modal-overlay">
            <div className="add-term-main-container">
                <div className="add-term-header">
                    <h1 className="add-term-title">Add Terminology</h1>

                    <button className="close-btn" onClick={handleBack}>
                        <img src={close} alt="close btn" />
                    </button>
                </div>

                <div className="add-term-contents">
                    <div>
                        <h1>Terminology:</h1>
                        <input 
                            type="text"
                            placeholder="Type Here."
                            className="add-term-input"
                            value={newTerm.word}
                            onChange={(e) => setNewTerm({...newTerm, word: e.target.value})}
                        />

                        <h1>Tags:</h1>
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
                        <h1>Definition:</h1>
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
                            src={addtermbtn} 
                            alt="add-term button"
                            className="add-term-icon-btn"
                        />
                    </button>
                </div>
                
            </div>
        </div>
             
        </>
    )
}