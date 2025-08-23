import "../../css/profile/profile.css";
import { useRef, useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Constants";
import { UserLoggedInContext } from "../../contexts/Contexts";

import { supabase } from "../../supabase";
import ValidationModal from "../../components/ValidationModal/ValidationModal.jsx";
import OkCancelModal from "../../components/OkCancelModal/OkCancelModal.jsx";
import Buttons from "../../components/buttons/Buttons.jsx";
import saveprofile from "../../assets/profile/saveprofileButton.svg";
import cancel from "../../assets/profile/cancelButton.svg";
import { set } from "date-fns";

export default function EditProfile() {
  const { currentWebUser, setCurrentWebUser, setCurrentWebUserUID } =
    useContext(UserLoggedInContext);

  const navigate = useNavigate();
  const location = useLocation();
  const [editWebUser, setEditWebUser] = useState(
    location.state?.webUser || null
  );
  const [initialWebUser, setInitialWebUser] = useState(
    location.state?.webUser || null
  );
  const [showModal, setShowModal] = useState(false);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [profilePicChanged, setProfilePicChanged] = useState(false);

  const [validationMessage, setValidationMessage] = useState("");
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [OkCancelModalMessage, setOkCancelModalMessage] = useState("");
  const [showOkCancelModal, setShowOkCancelModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [discardModalMessage, setDiscardModalMessage] = useState("");

  useEffect(() => {
    if (location.state?.webUser) {
      setEditWebUser(location.state.webUser);
      setInitialWebUser(location.state.webUser);
    }
  }, []);

  const validateFirstName = (value) => {
    if (!value.trim()) return "First name is required.";
    if (value.trim().length < 2)
      return "First name must be at least 2 characters.";
    return "";
  };

  const validateLastName = (value) => {
    if (!value.trim()) return "Last name is required.";
    if (value.trim().length < 2)
      return "Last name must be at least 2 characters.";
    return "";
  };

  const hasChanges = () => {
    return initialWebUser.useravatar !== editWebUser.useravatar;
  };

  const handleUpdateProfile = async () => {
    try {
      await axios.put(
        `${API_URL}/updateWebUsers/${editWebUser._id}`,
        editWebUser
      );

      const updatedUser = await axios.get(
        `${API_URL}/getwebuser/${editWebUser.uid}`
      );
      setCurrentWebUser(updatedUser.data);
      setCurrentWebUserUID(updatedUser.data.uid);
      localStorage.setItem("userUID", updatedUser.data.uid);

      await axios.post(`${API_URL}/addLogs`, {
        name: `${editWebUser.firstName} ${editWebUser.lastName}`,
        branch: editWebUser.branch,
        action: "Edit Profile",
        description: "Updated profile information.",
      });

      setInitialWebUser(updatedUser.data);
      setEditWebUser(updatedUser.data);

    } catch (error) {
      console.error(error);
      setValidationMessage("Update Unsuccessful!");
      setShowValidationModal(true);
    }
  };

  const handleCancelEdit = () => {
    if (hasChanges) {
      setDiscardModalMessage("Changes made will not be saved. Continue?");
      setShowDiscardModal(true);
    } else {
      navigate("/profile");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !editWebUser?.uid) return;

    setIsUploading(true);

    const fileExt = file.name.split(".").pop().toLowerCase();
    const fileName = `${editWebUser.uid}.${fileExt}`;
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

    setEditWebUser({
      ...editWebUser,
      useravatar: `${data.publicUrl}?t=${timestamp}`,
    });

    setValidationMessage("Image uploaded successfully");
    setShowValidationModal(true);

    setIsUploading(false);
  };

  const handleSaveClick = () => {
    setOkCancelModalMessage("Would you like to save changes?");
    setShowOkCancelModal(true);
  };

  return (
    <>
      <div className="main-cont-prof-settings">
        <div className="header-container-prof-settings">
          <h1 className="header-text-prof-settings">Edit Profile</h1>
        </div>

        <div className="content-container-prof-settings">
          <div className="avatar-edit-container-prof-settings">
            <div className="avatar-container-prof-settings">
              {isUploading ? (
                <div className="avatar-dimensions bg-white flex align-center justify-center p-23">
                  <div className="spinner" />
                </div>
              ) : (
                <img
                  className="avatar-dimensions"
                  src={editWebUser.useravatar}
                  alt="User Avatar"
                />
              )}
            </div>

            <div className="relative inline-block">
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
          </div>

          <div className="forms-container">
            <div className="forms-properties">
              <label className="forms-label-properties">First Name*</label>
              <input
                type="text"
                placeholder="First Name"
                className="input input-properties-disabled"
                value={editWebUser.firstName}
                onChange={(e) => {
                  const value = e.target.value;
                  setEditWebUser({ ...editWebUser, firstName: value });
                  setFirstNameError(validateFirstName(value));
                }}
                disabled
              />
              {firstNameError && (
                <span className="error-text text-red-700">
                  {firstNameError}
                </span>
              )}
            </div>

            <div className="forms-properties">
              <label className="forms-label-properties">Last Name*</label>
              <input
                type="text"
                placeholder="Last Name"
                className="input input-properties-disabled"
                value={editWebUser.lastName}
                onChange={(e) => {
                  const value = e.target.value;
                  setEditWebUser({ ...editWebUser, lastName: value });
                  setLastNameError(validateLastName(value));
                }}
                disabled
              />
              {lastNameError && (
                <span className="error-text text-red-700">{lastNameError}</span>
              )}
            </div>

            <div className="forms-properties">
              <label className="forms-label-properties">NU Branch</label>
              <select
                className="input input-properties-disabled"
                value={editWebUser.branch}
                onChange={(e) =>
                  setEditWebUser({ ...editWebUser, branch: e.target.value })
                }
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
                value={editWebUser.email}
                disabled
              />
            </div>

            <div className="forms-properties">
              <label className="forms-label-properties">Employee No.</label>
              <input
                type="text"
                placeholder="Employee No."
                className="input input-properties-disabled"
                value={editWebUser.employeenum}
                disabled
              />
            </div>

            <div className="forms-properties">
              <label className="forms-label-properties">Position</label>
              <input
                type="text"
                placeholder="Position"
                className="input input-properties-disabled"
                value={editWebUser.position}
                disabled
              />
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-6">
            <button
              className={`py-5 px-10 rounded-2xl text-2xl font-extrabold transition ${
                !hasChanges() || !editWebUser.useravatar
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-[#FFC300] text-black hover:bg-[#e6b200] cursor-pointer"
              }`}
              style={{ width: "330px" }}
              onClick={handleSaveClick}
              disabled={!hasChanges() || !editWebUser.useravatar}
            >
              SAVE PROFILE
            </button>

            <button
              className="bg-red-500 text-white hover:bg-red-600 py-5 px-10 rounded-2xl text-2xl font-extrabold transition cursor-pointer"
              style={{ width: "330px" }}
              onClick={handleCancelEdit}
            >
              CANCEL
            </button>
          </div>
        </div>

        {showValidationModal && (
          <ValidationModal
            message={validationMessage}
            onClose={() => setShowValidationModal(false)}
          />
        )}

        {showOkCancelModal && (
          <OkCancelModal
            message={OkCancelModalMessage}
            onConfirm={async () => {
              setShowOkCancelModal(false);
              await handleUpdateProfile(); // <-- Update only if confirmed
              navigate("/profile");
            }}
            onCancel={() => setShowOkCancelModal(false)}
          />
        )}

        {showDiscardModal && (
          <OkCancelModal
            message={discardModalMessage}
            onConfirm={() => {
              setShowDiscardModal(false);
              navigate("/profile");
            }}
            onCancel={() => setShowDiscardModal(false)}
          />
        )}
      </div>
    </>
  );
}
