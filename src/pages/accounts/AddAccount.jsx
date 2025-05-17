import { useState } from "react";
import "../../css/account/account.css";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { secondaryAuth } from "../../Firebase";
import axios from "axios";
import { API_URL } from "../../Constants";
import { useNavigate } from "react-router-dom";

export default function AddAccount() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newWebUser, setNewWebUser] = useState({
    firstName: "",
    lastName: "",
    branch: "",
    email: "",
    employeenum: "",
    position: "",
    uid: "",
    useravatar: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
      useravatar: "",
    });
    setPassword("");
    setConfirmPassword("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { firstName, lastName, branch, email, employeenum, position } =
      newWebUser;

    if (
      !firstName ||
      !lastName ||
      !branch ||
      !email ||
      !employeenum ||
      !position ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        newWebUser.email,
        password
      );
      const user = userCredential.user;
      const uidWebUser = { ...newWebUser, uid: user.uid };

      await axios.post(`${API_URL}/createWebUser`, uidWebUser);

      await signOut(secondaryAuth);

      setShowModal(true);
      handleReset();

    } catch (error) {
      console.error("Registration Error:", error.message);
      alert("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className="add-account-form" onSubmit={handleRegister}>
        <label>First Name:</label>
        <input
          type="text"
          placeholder="First Name"
          value={newWebUser.firstName}
          onChange={(e) =>
            setNewWebUser({ ...newWebUser, firstName: e.target.value })
          }
        />

        <label>Last Name:</label>
        <input
          type="text"
          placeholder="Last Name"
          value={newWebUser.lastName}
          onChange={(e) =>
            setNewWebUser({ ...newWebUser, lastName: e.target.value })
          }
        />

        <label>Branch:</label>
        <select
          value={newWebUser.branch}
          onChange={(e) =>
            setNewWebUser({ ...newWebUser, branch: e.target.value })
          }
        >
          <option value="">-- Select Branch --</option>
          {[
            "manila",
            "moa",
            "laguna",
            "fairview",
            "baliwag",
            "dasmarinas",
            "lipa",
            "clark",
            "bacolod",
            "eastortigas",
          ].map((branch) => (
            <option key={branch} value={branch}>
              NU {branch.charAt(0).toUpperCase() + branch.slice(1)}
            </option>
          ))}
        </select>

        <label>Email:</label>
        <input
          type="email"
          placeholder="Email"
          value={newWebUser.email}
          onChange={(e) =>
            setNewWebUser({ ...newWebUser, email: e.target.value })
          }
        />

        <label>Employee No:</label>
        <input
          type="text"
          placeholder="Employee No."
          value={newWebUser.employeenum}
          onChange={(e) =>
            setNewWebUser({ ...newWebUser, employeenum: e.target.value })
          }
        />

        <label>Position:</label>
        <select
          value={newWebUser.position}
          onChange={(e) =>
            setNewWebUser({ ...newWebUser, position: e.target.value })
          }
        >
          <option value="">Select Position</option>
          <option value="Professor">Professor</option>
          <option value="Sub Admin">Sub Admin</option>
          <option value="Super Admin">Super Admin</option>
        </select>

        <label>Profile Pic URL:</label>
        <input
          type="text"
          placeholder="Profile Pic URL"
          value={newWebUser.useravatar}
          onChange={(e) =>
            setNewWebUser({ ...newWebUser, useravatar: e.target.value })
          }
        />

        <label>Password:</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Confirm Password:</label>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="btn btn-warning"
            disabled={isLoading}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => navigate("/account")}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            View Accounts
          </button>
        </div>
      </form>

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
    </>
  );
}
