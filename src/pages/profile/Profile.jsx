import axios from "axios";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NewPasswordModal from "../../components/NewPassModal/NewPasswordModal";
import OldPasswordModal from "../../components/OldPassModal/OldPasswordModal";
import ValidationModal from "../../components/ValidationModal/ValidationModal";
import { API_URL } from "../../Constants";
import "../../css/profile/profile.css";
import { firebaseAuth } from "../../Firebase";


import { UserLoggedInContext } from "../../contexts/Contexts";

export default function Profile() {
  const {
    currentWebUser,
    currentWebUserUID,
    setCurrentWebUserUID,
  } = useContext(UserLoggedInContext);

  const navigate = useNavigate();




  const [webUser, setWebUser] = useState({});

  const [validationMessage, setValidationMessage] = useState("");
  const [showValidationModal, setShowValidationModal] = useState(false);

  const [showOldPasswordModal, setShowOldPasswordModal] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [discardTarget, setDiscardTarget] = useState(null); 

  const user = firebaseAuth.currentUser;

  useEffect(() => {
    let uid = currentWebUserUID;


    if (!uid) {
      const storedUID = localStorage.getItem("userUID");
      if (storedUID) {
        uid = storedUID;
        setCurrentWebUserUID(storedUID); 
      }
    }

    if (uid) {
      axios
        .get(`${API_URL}/getwebuser/${uid}`)
        .then((response) => {
          setWebUser(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [currentWebUserUID]);

  const handleEditProfile = () => {
    navigate(`/profile/edit/${webUser._id}`, { state: { webUser } });
  };

  const handlePasswordChange = () => {
    setOldPassword("");
    setShowOldPasswordModal(true);
  };

  const handleOldPasswordSubmit = async () => {
    if (!oldPassword) {
      setValidationMessage("Please enter your current password.");
      setShowValidationModal(true);
      return;
    }

    if (oldPassword.length < 6) {
      setValidationMessage("Password must be at least 6 characters long.");
      setShowValidationModal(true);
      return;
    }

    const credential = EmailAuthProvider.credential(webUser.email, oldPassword);

    try {
      await reauthenticateWithCredential(user, credential);

      setShowOldPasswordModal(false);
      setNewPassword("");
      setConfirmPassword("");
      setShowNewPasswordModal(true);
    } catch (error) {
      console.error(error);

      setValidationMessage("Incorrect old password.");
      setShowValidationModal(true);
    }
  };

  const handleNewPasswordSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      setValidationMessage("Please fill out both fields.");
      setShowValidationModal(true);
      return;
    }

    if (newPassword === oldPassword) {
      setValidationMessage(
        "New password cannot be the same as your old password."
      );
      setShowValidationModal(true);
      return;
    }

    const complexityRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
    if (!complexityRegex.test(newPassword)) {
      setValidationMessage(
        "Password must be at least 6 characters long and include at least one uppercase letter, one number, and one special character."
      );
      setShowValidationModal(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationMessage("Passwords do not match.");
      setShowValidationModal(true);
      return;
    }

    try {
      await updatePassword(user, newPassword);
      setShowNewPasswordModal(false);
      setNewPassword("");
      setConfirmPassword("");
      setValidationMessage("Password successfully changed.");
      setShowValidationModal(true);
    } catch (error) {
      console.error(error);
      setValidationMessage("Failed to change password.");
      setNewPassword("");
      setConfirmPassword("");
      setShowValidationModal(true);
    }
  };

  return (
    <>
      <div className="main-cont-prof-settings">
        <div className="header-container-prof-settings">
          <h1 className="header-text-prof-settings">Profile Settings</h1>
        </div>

        <div className="content-container-prof-settings">
          <div className="avatar-edit-container-prof-settings">
            <div className="avatar-container-prof-settings">
              <img
                className="avatar-dimensions shadow-[-2px_-2px_0px_0px_rgba(0,0,0)]"
                src={webUser.useravatar}
                alt=""
              />

              <h1 className="username-properties">
                {webUser.firstName} {webUser.lastName}
              </h1>
            </div>
          </div>

          <div className="forms-container">
            <div className="forms-properties">
              <h2 className="forms-label-properties">First Name</h2>
              <input
                type="text"
                placeholder="First Name"
                className="input input-properties-disabled"
                value={webUser.firstName || ""}
                disabled
              />
            </div>

            <div className="forms-properties">
              <h2 className="forms-label-properties">Last Name</h2>
              <input
                type="text"
                placeholder="Last Name"
                className="input input-properties-disabled"
                value={webUser.lastName || ""}
                disabled
              />
            </div>

            <div className="forms-properties">
              <h2 className="forms-label-properties">NU Campus</h2>
              <select
                className="input input-bordered input-disabled input-properties-disabled"
                value={webUser.branch || ""}
                disabled
                aria-label="NU Branch"
              >
                <option value="manila">NU Manila</option>
                <option value="moa">NU MOA</option>
                <option value="laguna">NU Laguna</option>
                <option value="fairview">NU Fairview</option>
                <option value="baliwag">NU Baliwag</option>
                <option value="dasma">NU Dasmarinas</option>
                <option value="lipa">NU Lipa</option>
                <option value="clark">NU Clark</option>
                <option value="bacolod">NU Bacolod</option>
                <option value="eastortigas">NU East Ortigas</option>
              </select>
            </div>

            <div className="forms-properties">
              <h2 className="forms-label-properties">Email</h2>
              <input
                type="email"
                placeholder="Email"
                className="input input-properties-disabled"
                value={webUser.email || ""}
                disabled
              />
            </div>

            <div className="forms-properties">
              <h2 className="forms-label-properties">Employee No.</h2>
              <input
                type="text"
                placeholder="Employee No."
                className="input input-properties-disabled"
                value={webUser.employeenum || ""}
                disabled
              />
            </div>

            <div className="forms-properties">
              <h2 className="forms-label-properties">Position</h2>

              <input
                type="text"
                placeholder="Position"
                className="input input-properties-disabled"
                value={webUser.position || ""}
                disabled
              />
            </div>
          </div>

          <div className="edit-btn-prof-settings w-full">
            <button
              className="w-[330px] py-5 px-10 rounded-2xl text-2xl font-extrabold transition bg-[#FFBF1A] hover:brightness-105 text-black cursor-pointer"
              onClick={handleEditProfile}
            >
              EDIT PROFILE
            </button>
            <button
              className="w-[330px] py-5 px-10 rounded-2xl text-2xl font-extrabold transition bg-[#FFBF1A] hover:brightness-105 text-black cursor-pointer"
              onClick={handlePasswordChange}
            >
              CHANGE PASSWORD
            </button>
          </div>
        </div>
        {showValidationModal && (
          <ValidationModal
            message={validationMessage}
            onClose={() => setShowValidationModal(false)}
          />
        )}

        {showOldPasswordModal && (
          <OldPasswordModal
            password={oldPassword}
            setPassword={setOldPassword}
            onClose={() => {
              if (oldPassword) {
                setDiscardTarget("old");
                setShowDiscardModal(true);
              } else {
                setShowOldPasswordModal(false);
              }
            }}
            onSubmit={handleOldPasswordSubmit}
          />
        )}

        {showNewPasswordModal && (
          <NewPasswordModal
            password={newPassword}
            setPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            onClose={() => {
              if (newPassword || confirmPassword) {
                setDiscardTarget("new");
                setShowDiscardModal(true);
              } else {
                setShowNewPasswordModal(false);
              }
            }}
            onSubmit={handleNewPasswordSubmit}
          />
        )}


       {showDiscardModal && (
        <div className="modal-overlay confirm-delete-popup">
          <div className="confirm-dialog">
            <div className="flex justify-center">
              <h2>Unsaved Changes</h2>
            </div>
            <p>
              {discardTarget === "old"
                ? "You have unsaved input in your old password field. Are you sure you want to discard it?"
                : "You have unsaved input in your new password fields. Are you sure you want to discard them?"}
            </p>
            <div className="popup-buttons">
              <button
                className="btn-delete"
                onClick={() => {
                  if (discardTarget === "old") {
                    setOldPassword("");
                    setShowOldPasswordModal(false);
                  }
                  if (discardTarget === "new") {
                    setNewPassword("");
                    setConfirmPassword("");
                    setShowNewPasswordModal(false);
                  }
                  setShowDiscardModal(false);
                  setDiscardTarget(null);
                }}
              >
                Yes, Discard
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowDiscardModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      </div>
    </>
  );
}
