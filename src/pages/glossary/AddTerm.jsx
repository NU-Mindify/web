import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { API_URL } from "../../Constants";




export default function AddTerm(){

    const [newTerm, setNewTerm] = useState({word: '', meaning: '', tags: [], is_deleted: false})

    const navigate = useNavigate();


    const handleCreateNewTerm = () =>{

        axios.post(`${API_URL}/addTerm`, newTerm)
        alert("added successfully")
        setNewTerm({word: '', meaning: ''})
    }

    function handleBack(){
        navigate('/glossary')
    }


    return(
        <>
            <button className="btn btn-error" onClick={handleBack}>Back</button>
            <h1>Word:</h1>
            <input 
                type="text"
                placeholder="word"
                className="w-[400px]"
                value={newTerm.word}
                onChange={(e) => setNewTerm({...newTerm, word: e.target.value})}
            />
            <h1>Meaning:</h1>
            <textarea 
                className="w-[400px]"
                value={newTerm.meaning}
                placeholder="meaning"
                onChange={(e) => setNewTerm({...newTerm, meaning: e.target.value})}
            >

            </textarea>

            <h1>Word:</h1>
            <input 
                type="text"
                placeholder="Tags"
                className="w-[400px]"
                value={newTerm.tags}
                onChange={(e) => setNewTerm({...newTerm, tags: e.target.value})}
            />

            {/* <input 
            type="text"
            placeholder="Tags (comma-separated)"
            className="w-[400px]"
            value={newTerm.tags.join(', ')} 
            onChange={(e) => 
                setNewTerm({ 
                ...newTerm, 
                tags: e.target.value.split(',').map(tag => tag.trim())
                })
            }
            /> */}
            <button className="btn btn-success" onClick={handleCreateNewTerm}>Create</button>
        </>
    )
}