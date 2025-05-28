import "../../css/profile/profile.css";
import { useRef, useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Constants";
import { UserLoggedInContext } from "../../contexts/Contexts";

import { supabase } from "../../supabase";
import ValidationModal from "../../components/ValidationModal/ValidationModal.jsx";

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

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  const [isUploading, setIsUploading] = useState(false);

  const [validationMessage, setValidationMessage] = useState("");
  const [showValidationModal, setShowValidationModal] = useState(false);

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
    return (
      initialWebUser.useravatar !== editWebUser.useravatar
    );
  };

  const handleUpdateProfile = async () => {
  try {
    const response = await axios.put(
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
      uid: editWebUser.uid,
      action: "Edit Profile",
      description: "Updated profile information.",
    });

    setInitialWebUser(updatedUser.data);
    setEditWebUser(updatedUser.data);

    setShowModal(true);
    navigate("/profile");
  } catch (error) {
    console.error(error);
    setValidationMessage("Update Unsuccessful!");
    setShowValidationModal(true);
  }
};



  const handleCancelEdit = () => {
    navigate("/profile");
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

    setIsUploading(false);
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

            <div className="edit-btn-container-prof-settings">
              <label className="forms-label-properties">Enter Image URL</label>
              <input
                type="text"
                placeholder="Image URL"
                className="input input-properties"
                value={editWebUser.useravatar}
                onChange={(e) =>
                  setEditWebUser({ ...editWebUser, useravatar: e.target.value })
                }
              />

              <label className="forms-label-properties mt-2">
                Upload Image File
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="btn btn-warning text-black"
              />
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

          <div className="edit-btn-container-prof-settings">
            <button
              className={
                !hasChanges() ||
                !editWebUser.useravatar
                  ? "edit-btn-properties-disabled"
                  : "edit-btn-properties"
              }
              onClick={handleUpdateProfile}
              disabled={
                !hasChanges() ||
                !editWebUser.useravatar
              }
            >
              Save Profile
            </button>
            <button
              className="edit-btn-properties mt-1"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </div>
        </div>
        {showValidationModal && (
          <ValidationModal
            message={validationMessage}
            onClose={() => setShowValidationModal(false)}
          />
        )}
      </div>
    </>
  );
}
