import { useContext, useState } from "react";
import "../../css/glossary/editGlossary.css";
import axios from "axios";
import { API_URL } from "../../Constants";
// import close from '../../assets/glossary/close btn.svg'
import closebtn from "../../assets/glossary/close-btn.svg";
import Buttons from "../../components/buttons/Buttons";
import { UserLoggedInContext } from "../../contexts/Contexts";

export default function EditGlossary({ onClose, term, onTermUpdated }) {
  const { _id, word, meaning, tags } = term;
  const { currentWebUser } = useContext(UserLoggedInContext);

  const [editedWord, setEditedWord] = useState(word);
  const [editedMeaning, setEditedMeaning] = useState(meaning);
  const [editTags, setEditTags] = useState(tags);

  const hasChanges = () => {
    const originalTags = tags.map((tag) => tag.trim()).sort();
    const currentTags = editTags.map((tag) => tag.trim()).sort();

    return (
      editedWord.trim() !== word.trim() ||
      editedMeaning.trim() !== meaning.trim() ||
      originalTags.join(",") !== currentTags.join(",")
    );
  };

  const generateLogDescription = () => {
    const changes = [];
    const trimmedOriginalWord = word.trim();
    const trimmedEditedWord = editedWord.trim();
    const trimmedOriginalMeaning = meaning.trim();
    const trimmedEditedMeaning = editedMeaning.trim();

    const originalTags = tags.map((tag) => tag.trim()).sort();
    const currentTags = editTags.map((tag) => tag.trim()).sort();

    if (trimmedOriginalWord !== trimmedEditedWord) {
      changes.push(`word: "${trimmedOriginalWord}" → "${trimmedEditedWord}"`);
    }

    if (trimmedOriginalMeaning !== trimmedEditedMeaning) {
      changes.push(
        `meaning: "${trimmedOriginalMeaning}" → "${trimmedEditedMeaning}"`
      );
    }

    if (originalTags.join(",") !== currentTags.join(",")) {
      changes.push(
        `tags: [${originalTags.join(", ")}] → [${currentTags.join(", ")}]`
      );
    }

    if (changes.length === 0) return null;

    return `${
      currentWebUser.firstName
    } updated the term "${trimmedOriginalWord}", ${changes.join("; ")}`;
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/updateTerm/${_id}`, {
        term_id: _id,
        word: editedWord,
        meaning: editedMeaning,
        tags: editTags,
      });

      const description = generateLogDescription();

      if (description) {
        await axios.post(`${API_URL}/addLogs`, {
          uid: currentWebUser.uid,
          action: "Updated a term",
          description,
        });
      }

      onTermUpdated?.();
      onClose();
    } catch (error) {
      console.error("Error updating term:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.put(`${API_URL}/deleteTerm/${_id}`, {
        term_id: _id,
        is_deleted: true,
      });

      onTermUpdated?.();
      onClose();

      await axios.post(`${API_URL}/addLogs`, {
        uid: currentWebUser.uid,
        action: "Deleted a term",
        description: `${currentWebUser.firstName} deleted the term "${word}"`,
      });
    } catch (error) {
      console.error("Error updating term:", error);
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="edit-glossary-container">
          <div className="edit-header">
            <h1 className="edit-title">Edit Terminology</h1>
            <button className="back-btn" onClick={onClose}>
              <img src={closebtn} alt="close btn" />
            </button>
          </div>

          <div className="edit-content">
            <div>
              <h1 className="edit-title-container">Word</h1>
              <input
                className="edit-input"
                type="text"
                value={editedWord}
                onChange={(e) => setEditedWord(e.target.value)}
              />
              <h1 className="edit-title-container">Tags</h1>
              <input
                className="edit-input"
                type="text"
                placeholder="Enter tags separated by commas"
                value={editTags.join(", ")}
                onChange={(e) =>
                  setEditTags(
                    e.target.value.split(",").map((tag) => tag.trim())
                  )
                }
              />
            </div>

            <div>
              <h1 className="edit-title-container">Meaning</h1>
              <textarea
                rows={10}
                className="edit-textarea"
                type="text"
                value={editedMeaning}
                onChange={(e) => setEditedMeaning(e.target.value)}
              />
            </div>
          </div>

          <div className="buttons">
            {hasChanges() ? (
              <Buttons
                text="Save"
                onClick={handleSave}
                addedClassName="btn btn-success"
              />
            ) : 
              <Buttons
                text="Save"
                onClick={handleSave}
                addedClassName="btn bg-red-400"
                disabled={true}
              />
            }

            <Buttons
              text="Delete"
              onClick={() => handleDelete()}
              addedClassName="btn btn-error"
            />
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
