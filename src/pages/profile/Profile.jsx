import "../../css/profile/profile.css";
import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DotLoader from "react-spinners/DotLoader";
import axios from "axios";
import { API_URL } from "../../Constants";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../../Firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import ValidationModal from "../../components/ValidationModal/ValidationModal";
import OldPasswordModal from "../../components/OldPassModal/OldPasswordModal";
import NewPasswordModal from "../../components/NewPassModal/NewPasswordModal";

import { UserLoggedInContext } from "../../contexts/Contexts";

export default function Profile() {
  const {
    currentWebUser,
    setCurrentWebUser,
    currentWebUserUID,
    setCurrentWebUserUID,
  } = useContext(UserLoggedInContext);

  const navigate = useNavigate();

  const inputRef = useRef(null);
  // console.log(currentWebUserUID);

  const { uid } = useParams();
  const [webUser, setWebUser] = useState({});

  const [validationMessage, setValidationMessage] = useState("");
  const [showValidationModal, setShowValidationModal] = useState(false);

  const [showOldPasswordModal, setShowOldPasswordModal] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const user = firebaseAuth.currentUser;

  useEffect(() => {
    let uid = currentWebUserUID;

    // Fallback to localStorage if context is empty
    if (!uid) {
      const storedUID = localStorage.getItem("userUID");
      if (storedUID) {
        uid = storedUID;
        setCurrentWebUserUID(storedUID); // sync it back into context
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
    setShowOldPasswordModal(true);
  };

  const handleOldPasswordSubmit = async () => {
    const credential = EmailAuthProvider.credential(webUser.email, oldPassword);
    try {
      await reauthenticateWithCredential(user, credential);
      setShowOldPasswordModal(false);
      setOldPassword("");
      setShowNewPasswordModal(true);
    } catch (error) {
      setShowOldPasswordModal(false);
      setValidationMessage("Incorrect old password.");
      setOldPassword("");
      setShowValidationModal(true);
    }
  };

  const handleNewPasswordSubmit = async () => {
    try {
      await updatePassword(user, newPassword);
      setShowNewPasswordModal(false);
      setNewPassword("");
      setValidationMessage("Password successfully changed.");
      setShowValidationModal(true);
    } catch (error) {
      setValidationMessage("Failed to change password.");
      setNewPassword("");
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
                className="avatar-dimensions"
                src={webUser.useravatar}
                alt=""
              />

              <h1 className="username-properties">
                {webUser.firstName} {webUser.lastName}
              </h1>
            </div>

            {/* <div className='edit-btn-container-prof-settings'>
                            <button class="edit-btn-properties" onClick={handleEditProfile}>Edit Profile</button>
                        </div> */}
          </div>

          <div className="forms-container">
            <div className="forms-properties">
              <label className="forms-label-properties">First Name</label>
              <input
                type="text"
                placeholder="First Name"
                className="input input-properties-disabled"
                value={webUser.firstName}
                disabled
              />
            </div>

            <div className="forms-properties">
              <label className="forms-label-properties">Last Name</label>
              <input
                type="text"
                placeholder="Last Name"
                className="input input-properties-disabled"
                value={webUser.lastName}
                disabled
              />
            </div>

            <div className="forms-properties">
              <label className="forms-label-properties">NU Branch</label>
              <select
                className="input input-bordered input-disabled input-properties-disabled"
                value={webUser.branch}
                disabled
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
              <label className="forms-label-properties">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="input input-properties-disabled"
                value={webUser.email}
                disabled
              />
            </div>

            <div className="forms-properties">
              <label className="forms-label-properties">Employee No.</label>
              <input
                type="text"
                placeholder="Employee No."
                className="input input-properties-disabled"
                value={webUser.employeenum}
                disabled
              />
            </div>

            <div className="forms-properties">
              <label className="forms-label-properties">Position</label>

              <input
                type="text"
                placeholder="Position"
                className="input input-properties-disabled"
                value={webUser.position}
                disabled
              />
            </div>
          </div>

          <div className="edit-btn-container-prof-settings w-full">
            <button class="edit-btn-properties" onClick={handleEditProfile}>
              Edit Profile
            </button>
            <button class="edit-btn-properties" onClick={handlePasswordChange}>
              Change Password
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
            onClose={() => setShowOldPasswordModal(false)}
            onSubmit={handleOldPasswordSubmit}
          />
        )}

        {showNewPasswordModal && (
          <NewPasswordModal
            password={newPassword}
            setPassword={setNewPassword}
            onClose={() => setShowNewPasswordModal(false)}
            onSubmit={handleNewPasswordSubmit}
          />
        )}
      </div>
    </>
  );
}
