import axios from "axios";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import NewPasswordModal from "../../components/NewPassModal/NewPasswordModal";
import OldPasswordModal from "../../components/OldPassModal/OldPasswordModal";
import ValidationModal from "../../components/ValidationModal/ValidationModal";
import { API_URL, branches } from "../../Constants";
import "../../css/profile/profile.css";
import { firebaseAuth } from "../../Firebase";

import { ActiveContext, UserLoggedInContext } from "../../contexts/Contexts";
import Header from "../../components/header/Header";
import Buttons from "../../components/buttons/Buttons";
import { supabase } from "../../supabase";



export default function Profile() {
  const { currentWebUser, currentWebUserUID, setCurrentWebUserUID } =
    useContext(UserLoggedInContext);

  const { themeWithOpacity, theme, setTheme, divColor, textColor } = useContext(ActiveContext);

  const navigate = useNavigate();

  const [webUser, setWebUser] = useState(currentWebUser || {});

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

  const handleEditProfile = useCallback(() => {
    navigate(`/profile/edit/${webUser._id}`, { state: { webUser } });
  }, [navigate, webUser]);

  const handlePasswordChange = useCallback(() => {
    setOldPassword("");
    setShowOldPasswordModal(true);
  }, []);

  const handleOldPasswordSubmit = useCallback(async () => {
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
  }, [oldPassword, webUser.email, user]);

  const handleNewPasswordSubmit = useCallback(async () => {
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
  }, [newPassword, confirmPassword, oldPassword, user]);

  const [activeTheme, setActiveTheme] = useState(false)
  const colors = [{
      color: "#202024",
      className: "border-white border-2",
      name: "Dark Theme"
    },
    {
      color: "#ffffff",
      className: "border-black border-2",
      name: "Light Theme"
    },
    {
      color: "#1D1F79",
      className: "border-white border-2",
      name: "Blue Theme"
    },
    {
      color: "#FFD418",
      className: "border-black border-2",
      name: "Gold Theme"
    }
  ];

  const profileFields = useMemo(() => [
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
      value: branches.find((campus) => campus.id === webUser.branch)?.name || "",
      type: "text",
    },
    { 
      label: "Email", 
      value: webUser.email || "", 
      type: "email" 
    },
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
  ], [webUser, branches]);

  const [isUploading, setIsUploading] = useState(false);

   const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !webUser?.uid) return;

    setIsUploading(true);

    const fileExt = file.name.split(".").pop().toLowerCase();
    const fileName = `${webUser.uid}.${fileExt}`;
    const filePath = `pics/${fileName}`;

    const { error } = await supabase.storage
      .from("profile")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error.message, error);
      setValidationMessage("Image upload failed");
      setShowValidationModal(true);
      setIsUploading(false);
      return;
    }

    const { data } = supabase.storage.from("profile").getPublicUrl(filePath);
    const timestamp = new Date().getTime();
    console.log("data", data);
    

    setWebUser({
      ...webUser,
      useravatar: `${data.publicUrl}?t=${timestamp}`,
    });

    setValidationMessage("Image uploaded successfully");
    setShowValidationModal(true);

    setIsUploading(false);
  };



  return (
    <>
      <div className="main-cont-prof-settings">
        <div className=" w-full h-auto rounded-xl mb-5">
          <Header id={"profile"} title="Profile Settings" />
        </div>

        <div
          className="content-container-prof-settings"
          style={{ backgroundColor: themeWithOpacity }}
        >
          <div className="avatar-edit-container-prof-settings justify-between">
            <div className="avatar-container-prof-settings">
              

              {isUploading ? (
                <div className="avatar-dimensions bg-white flex align-center justify-center p-23">
                  <div className="spinner" />
                </div>
              ) : (
                <img
                className={`avatar-dimensions shadow-[-2px_-2px_0px_0px_rgba(0,0,0)]`}
                style={{
                  border: "12px solid",
                  borderColor: theme, 
                  boxShadow: `0 0 0 4px ${textColor}`
                }}
                src={webUser.useravatar}
                alt=""
              />
              )}

              <h1
                className={`username-properties`}
                style={{color: textColor}}
              >
                {webUser.firstName} {webUser.lastName}
              </h1>
            </div>
            <div className="flex-1 flex items-center px-10">
              <input
                id="upload-btn"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="upload-btn"
                className="btn btn-warning w-[200px] rounded-xl !text-white text-xl bg-[#FFC916] border-[#FFC916] font-[Poppins] h-[50px] px-4 flex items-center justify-center text-center cursor-pointer"
              >
                UPLOAD IMAGE
              </label>
            </div>

            <div className="p-4 flex flex-col items-center justify-center pr-10">
            

            <Buttons 
              text="Change Theme"
              addedClassName="btn !w-[250px]"
              onClick={() => setActiveTheme(!activeTheme)}
            />

            {activeTheme &&
            <>
              <div className="flex gap-5">
                {colors.map((color) => (
                  <button
                    key={color}
                    style={{ backgroundColor: color.color }}
                    className={`w-15 h-15 rounded-md mt-4 text-xs ${color.color === "#202024" || color.color === "#1D1F79" ? "!text-white" : "!text-black"} ${color.className}`}
                    onClick={() => setTheme(color.color)}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </>
            }
            </div>
          </div>

          <div className="forms-container">
            {profileFields.map(({ label, value, type }, idx) => (
              <div key={idx} className="forms-properties">
                <h2
                  className={`forms-label-properties`}
                  style={{color: textColor}}
                >
                  {label}
                </h2>


                  <input
                    type={type}
                    placeholder={label}
                    className="input input-properties-disabled"
                    value={value}
                    style={{backgroundColor: divColor, color: textColor}}
                    disabled
                  />
                
              </div>
            ))}
          </div>

          <div className="edit-btn-prof-settings w-full !gap-30">

            {/* <Buttons 
              text="Edit Profile"
              addedClassName="btn !w-[250px]"
              onClick={handleEditProfile}
            /> */}

            <Buttons 
              text="Change Password"
              addedClassName="btn !w-[250px]"
              onClick={handlePasswordChange}
            />
            


            
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
