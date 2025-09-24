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

import { ActiveContext, UserLoggedInContext } from "../../contexts/Contexts";
import Header from "../../components/header/Header";

export default function Profile() {
  const { currentWebUser, currentWebUserUID, setCurrentWebUserUID } =
    useContext(UserLoggedInContext);

  const { themeWithOpacity, theme } = useContext(ActiveContext);

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
        <div className=" w-full h-auto bg-white rounded-xl mb-5">
          <Header id={"profile"} title="Profile Settings" />
        </div>

        <div
          className="content-container-prof-settings"
          style={{ backgroundColor: themeWithOpacity }}
        >
          <div className="avatar-edit-container-prof-settings ">
            <div className="avatar-container-prof-settings">
              <img
                className={`avatar-dimensions shadow-[-2px_-2px_0px_0px_rgba(0,0,0)]
                ${theme === "#202024" ? "!border-black" : '!border-white'}`}
                src={webUser.useravatar}
                alt=""
              />

              <h1
                className={`username-properties
                ${theme === "#202024" ? "!text-white" : "!text-black"}`}
              >
                {webUser.firstName} {webUser.lastName}
              </h1>
            </div>
          </div>

          <div className="forms-container">
            {[
              {
                label: "First Name",
                value: webUser.firstName || "",
                type: "text",
              },
              {
                label: "Last Name",
                value: webUser.lastName || "",
                type: "text",
              },
              {
                label: "NU Campus",
                value: webUser.branch || "",
                type: "select",
              },
              { label: "Email", value: webUser.email || "", type: "email" },
              {
                label: "Employee No.",
                value: webUser.employeenum || "",
                type: "text",
              },
              {
                label: "Position",
                value: webUser.position || "",
                type: "text",
              },
            ].map(({ label, value, type }, idx) => (
              <div key={idx} className="forms-properties">
                <h2
                  className={`forms-label-properties ${
                    theme === "#202024" ? "!text-white" : "!text-black"
                  }`}
                >
                  {label}
                </h2>

                {type === "select" ? (
                  <select
                    className="input input-bordered input-disabled input-properties-disabled"
                    value={value}
                    disabled
                    aria-label={label}
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
                ) : (
                  <input
                    type={type}
                    placeholder={label}
                    className="input input-properties-disabled"
                    value={value}
                    disabled
                  />
                )}
              </div>
            ))}
          </div>

          <div className="edit-btn-prof-settings w-full">
            <button
              className="w-[350px] py-2 px-10 rounded-2xl text-xl font-extrabold transition bg-[#FFBF1A] hover:brightness-105 text-black cursor-pointer"
              onClick={handleEditProfile}
            >
              EDIT PROFILE
            </button>
            <button
              className="w-[350px] py-2 px-10 rounded-2xl text-xl font-extrabold transition bg-[#FFBF1A] hover:brightness-105 text-black cursor-pointer"
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
