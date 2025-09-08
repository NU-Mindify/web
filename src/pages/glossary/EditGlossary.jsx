import axios from "axios";
import { useContext, useState } from "react";
import { API_URL } from "../../Constants";
import "../../css/glossary/editGlossary.css"
import closebtn from "../../assets/glossary/close-btn.svg";
import Buttons from "../../components/buttons/Buttons";
import { UserLoggedInContext } from "../../contexts/Contexts";

export default function EditGlossary({ onClose, term, onTermUpdated }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { _id, word, meaning, tags } = term;
  const { currentWebUser } = useContext(UserLoggedInContext);

  const [editedWord, setEditedWord] = useState(word);
  const [editedMeaning, setEditedMeaning] = useState(meaning);
  const [editTags, setEditTags] = useState(tags);
  const [showBackConfirmModal, setShowBackConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showRequiredPopup, setShowRequiredPopup] = useState(false);


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
    if (!editedWord.trim() || !editedMeaning.trim()) {
      setShowRequiredPopup(true);
      return;
    }

    try {
      await axios.put(`${API_URL}/updateTerm/${_id}`, {
        term_id: _id,
        word: editedWord,
        meaning: editedMeaning,
        tags: editTags,
      }, {
        headers: {
          Authorization: `Bearer ${currentWebUser.token}`,
        },
      });

      const description = generateLogDescription();

      if (description) {
        await axios.post(`${API_URL}/addLogs`, {
          name: `${currentWebUser.firstName} ${currentWebUser.lastName}`,
          branch: currentWebUser.branch,
          action: "Updated a Term",
          description,
          position: currentWebUser.position,
          useravatar: currentWebUser.useravatar
        });
      }

      onTermUpdated?.();
      onClose();
    } catch (error) {
      console.error("Error updating term:", error);
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.put(`${API_URL}/deleteTerm/${_id}`, {
        term_id: _id,
        is_deleted: true,
      }, {
        headers: {
          Authorization: `Bearer ${currentWebUser.token}`,
        },
      });

      onTermUpdated?.();
      onClose();

      await axios.post(`${API_URL}/addLogs`, {
        name: `${currentWebUser.firstName} ${currentWebUser.lastName}`,
        branch: currentWebUser.branch,
        action: "Archived a Term",
        description: `${currentWebUser.firstName} deleted the term "${word}"`,
        position: currentWebUser.position,
        useravatar: currentWebUser.useravatar
      });
    } catch (error) {
      console.error("Error deleting term:", error);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleBackClick = () => {
    if (hasChanges()) {
      setShowBackConfirmModal(true);
    } else {
      onClose();
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="edit-glossary-container">
          <div className="edit-header">
            <h1 className="edit-title">Edit Terminology</h1>
              <button className="back-btn" onClick={handleBackClick}>
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
            ) : (
              <Buttons
                text="Save"
                onClick={handleSave}
                addedClassName="btn bg-red-400"
                disabled={true}
              />
            )}
            <Buttons
              text="Archive"
              onClick={confirmDelete}
              addedClassName="btn btn-error"
            />

            {showRequiredPopup && (
            <div className="modal-overlay confirm-delete-popup">
              <div className="confirm-dialog">
                <div className="flex justify-center">
                  <h2>Missing Fields</h2>
                </div>
                <p>Please fill in required fields.</p>
                <div className="popup-buttons">
                  <button
                    className="btn btn-success"
                    onClick={() => setShowRequiredPopup(false)}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}


            {showDeleteConfirm && (
              <div className="modal-overlay confirm-delete-popup">
                <div className="confirm-dialog">
                  <h2>Confirm Archive</h2>
                  <p>
                    Are you sure you want to archive the term "
                    <strong>{word}</strong>"?
                  </p>
                  <div className="popup-buttons">
                    <button
                      className="btn-delete"
                      onClick={handleConfirmDelete}
                    >
                      Yes, Archive
                    </button>
                    <button className="btn-cancel" onClick={handleCancelDelete}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
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

                {showBackConfirmModal && (
                  <div className="modal-overlay confirm-delete-popup">
                    <div className="confirm-dialog">
                      <div className="flex justify-center">
                        <h2>Unsaved Changes</h2>
                      </div>
                      <p>You have unsaved input. Are you sure you want to go back?</p>
                      <div className="popup-buttons">
                        <button
                          className="btn-delete"
                          onClick={() => {
                            setShowBackConfirmModal(false);
                            onClose(); 
                          }}
                        >
                          Yes, Go Back
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={() => setShowBackConfirmModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}


        </div>
      </div>
    </>
  );
}
