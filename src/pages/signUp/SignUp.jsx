import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { firebaseAuth } from "../../Firebase";
import axios from "axios";
import { API_URL, branches, defaultAvatar } from "../../Constants";
import ValidationModal from "../../components/ValidationModal/ValidationModal.jsx";
import Buttons from "../../components/buttons/Buttons";
import '../../css/signUp/signUp.css'
import { useNavigate } from "react-router";
import chevronIcon from "../../assets/forAll/chevron.svg";




export default function SignUp() {
  const [newWebUser, setNewWebUser] = useState({
    firstName: "",
    lastName: "",
    branch: "",
    email: "",
    employeenum: "",
    position: "",
    uid: "",
    useravatar: defaultAvatar,
    approved: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [validationMessage, setValidationMessage] = useState("");
  const [showValidationModal, setShowValidationModal] = useState(false);

  const navigate = useNavigate();

  const handleReset = () => {
    setNewWebUser({
      firstName: "",
      lastName: "",
      branch: "",
      email: "",
      employeenum: "",
      position: "",
      uid: "",
    });
    setPassword("");
    setConfirmPassword("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const {
      firstName,
      lastName,
      email,
      employeenum,
      useravatar,
      branch,
      position,
    } = newWebUser;

    if (
      !firstName ||
      !lastName ||
      !branch ||
      !email ||
      !employeenum ||
      !position
    ) {
      setValidationMessage("Please fill in all required fields.");
      setShowValidationModal(true);
      return;
    }

    if (password !== confirmPassword) {
      setValidationMessage("Passwords do not match.");
      setShowValidationModal(true);
      return;
    }

    if (password.length < 6) {
      setValidationMessage("Password must be at least 6 characters long.");
      setShowValidationModal(true);
      return;
    }

    const finalWebUser = {
      firstName,
      lastName,
      branch,
      email,
      employeenum,
      position,
      useravatar,
      uid: "",
      isApproved: false,
    };

    try {
      setIsLoading(true);

      // 1. Create user
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        finalWebUser.email,
        password
      );
      const user = userCredential.user;
      const uidWebUser = { ...finalWebUser, uid: user.uid };

      // 2. Send reset email
      // await sendEmailVerification(user);

      // 3. Store user data in database
      await axios.post(`${API_URL}/createWebUser`, uidWebUser);
      setValidationMessage("Your account has successfully created. You'll receive an email once the admin has verified your account.");
      setShowValidationModal(true);
      handleReset();

      // 4. Sign out the new user's account
      await signOut(firebaseAuth);
      navigate("/")

      // 5. Reset and show modal
      
    } catch (error) {
      console.error("Registration Error:", error.message);
      setValidationMessage("Error: " + error.message);
      setShowValidationModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sign-up-container bg-white w-full h-full">
      <div className="sign-up-header">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="view-acc-btn"
          disabled={isLoading}
        >
          <img src={chevronIcon} alt="chevron" />
        </button>
        <h1 className="add-account-title">Sign Up</h1>
      </div>

      <div className="user-details-container">
        <div className="input-holder">
          <h1>First Name</h1>
          <input
            type="text"
            placeholder="First Name"
            value={newWebUser.firstName}
            onChange={(e) =>
              setNewWebUser({ ...newWebUser, firstName: e.target.value })
            }
          />
        </div>

        <div className="input-holder">
          <h1>Last Name</h1>
          <input
            type="text"
            placeholder="Last Name"
            value={newWebUser.lastName}
            onChange={(e) =>
              setNewWebUser({ ...newWebUser, lastName: e.target.value })
            }
          />
        </div>

        <div className="input-holder">
          <h1>NU Campus*</h1>
          <select
            className="add-input-properties"
            value={newWebUser.branch}
            onChange={(e) => {
              const branchId = e.target.value;
              const branch = branches.find((b) => b.id === branchId);
              const extension = branch?.extension || "";
              setNewWebUser((prev) => ({
                ...prev,
                branch: branchId,
                email: extension,
              }));
            }}
          >
            <option value="">-- Select Branch --</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        <div className="input-holder">
          <h1>Email*</h1>
          <input
            type="email"
            value={newWebUser.email}
            onChange={(e) =>
              setNewWebUser({ ...newWebUser, email: e.target.value })
            }
          ></input>
        </div>

        <div className="input-holder">
          <h1>Employee Number*</h1>
          <input
            type="number"
            value={newWebUser.employeenum}
            onChange={(e) =>
              setNewWebUser({ ...newWebUser, employeenum: e.target.value })
            }
          ></input>
        </div>

        <div className="input-holder">
          <h1>Position*</h1>

          <select
            className="add-input-properties"
            value={newWebUser.position}
            onChange={(e) =>
              setNewWebUser({ ...newWebUser, position: e.target.value })
            }
          >
            <option value="">Select Position</option>
            <option value="Professor">Professor</option>
            <option value="Sub Admin">Sub Admin</option>
          </select>
        </div>

        <div className="input-holder">
          <h1>Password</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>

        <div className="input-holder">
          <h1>Re-type Password</h1>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></input>
        </div>

        <div className="buttons-container">
          <Buttons
            onClick={handleRegister}
            text={isLoading ? "Submitting..." : "Submit"}
            disabled={isLoading}
            addedClassName="btn btn-success"
          />

          <Buttons
            onClick={handleReset}
            text={"Reset"}
            disabled={isLoading}
            addedClassName="btn btn-warning ml-5"
          />
        </div>
      </div>
      {/* Success Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Account Added Successfully</h2>
            <button
              onClick={() => setShowModal(false)}
              className="btn btn-primary"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {showValidationModal && (
        <ValidationModal
          message={validationMessage}
          onClose={() => setShowValidationModal(false)}
        />
      )}
    </div>
  );
}
