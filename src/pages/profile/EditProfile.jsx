import "../../css/profile/profile.css";
import { useRef, useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Constants";
import { UserLoggedInContext } from "../../contexts/Contexts";

export default function EditProfile() {
  const { setCurrentWebUser, setCurrentWebUserUID } =
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

  useEffect(() => {
    if (location.state?.webUser) {
      setEditWebUser(location.state.webUser);
      setInitialWebUser(location.state.webUser);
    }
  }, []);

  const validateFirstName = (value) => {
    if (!value.trim()) return "First name is required.";
    if (value.trim().length < 2) return "First name must be at least 2 characters.";
    return "";
  };

  const validateLastName = (value) => {
    if (!value.trim()) return "Last name is required.";
    if (value.trim().length < 2) return "Last name must be at least 2 characters.";
    return "";
  };

  const hasChanges = () => {
    return (
      initialWebUser.firstName !== editWebUser.firstName ||
      initialWebUser.lastName !== editWebUser.lastName ||
      initialWebUser.branch !== editWebUser.branch ||
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

      setShowModal(true);
    } catch (error) {
      console.error(error);
      alert("Update Unsuccessful!");
    }
  };

  const handleCancelEdit = () => {
    navigate("/profile");
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
              <img
                className="avatar-dimensions"
                src={editWebUser.useravatar}
                alt=""
              />
              <h1
                className="username-properties"
                style={{ visibility: "hidden" }}
              >
                dontremove
              </h1>
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
            </div>
          </div>

          <div className="forms-container">
            <div className="forms-properties">
              <label className="forms-label-properties">First Name*</label>
              <input
                type="text"
                placeholder="First Name"
                className="input input-properties"
                value={editWebUser.firstName}
                onChange={(e) => {
                  const value = e.target.value;
                  setEditWebUser({ ...editWebUser, firstName: value });
                  setFirstNameError(validateFirstName(value));
                }}
              />
              {firstNameError && (
                <span className="error-text text-red-700">{firstNameError}</span>
              )}
            </div>

            <div className="forms-properties">
              <label className="forms-label-properties">Last Name*</label>
              <input
                type="text"
                placeholder="Last Name"
                className="input input-properties"
                value={editWebUser.lastName}
                onChange={(e) => {
                  const value = e.target.value;
                  setEditWebUser({ ...editWebUser, lastName: value });
                  setLastNameError(validateLastName(value));
                }}
              />
              {lastNameError && (
                <span className="error-text text-red-700">{lastNameError}</span>
              )}
            </div>

            <div className="forms-properties">
              <label className="forms-label-properties">NU Branch</label>
              <select
                className="input input-bordered cursor-pointer input-properties"
                value={editWebUser.branch}
                onChange={(e) =>
                  setEditWebUser({ ...editWebUser, branch: e.target.value })
                }
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
                !!firstNameError ||
                !!lastNameError ||
                !editWebUser.firstName ||
                !editWebUser.lastName
                  ? "edit-btn-properties-disabled"
                  : "edit-btn-properties"
              }
              onClick={handleUpdateProfile}
              disabled={
                !hasChanges() ||
                !!firstNameError ||
                !!lastNameError ||
                !editWebUser.firstName ||
                !editWebUser.lastName
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

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Profile Updated Successfully!</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  navigate("/profile");
                }}
                className="modal-close-btn"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}