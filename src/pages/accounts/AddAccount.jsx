/* eslint-disable jsx-a11y/label-has-associated-control */
import { useContext, useEffect, useState } from "react";
import "../../css/account/account.css";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { secondaryAuth } from "../../Firebase";
import axios from "axios";
import { API_URL, branches } from "../../Constants";
import { useNavigate } from "react-router-dom";
import { UserLoggedInContext } from "../../contexts/Contexts";

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

  const { currentUserBranch, currentWebUser } = useContext(UserLoggedInContext);
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

    const { firstName, lastName, email, employeenum, useravatar } = newWebUser;

    const branch =
      currentWebUser.position.toLowerCase() === "super admin"
        ? newWebUser.branch
        : currentUserBranch;

    const position =
      currentWebUser.position.toLowerCase() === "super admin"
        ? newWebUser.position
        : "Professor";

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

    const finalWebUser = {
      firstName,
      lastName,
      branch,
      email,
      employeenum,
      position,
      useravatar,
      uid: "",
    };

    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        finalWebUser.email,
        password
      );
      const user = userCredential.user;
      const uidWebUser = { ...finalWebUser, uid: user.uid };

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
  

  useEffect(() => {
    if (currentWebUser.position.toLowerCase() !== "super admin") {
      const currentBranch = branches.find((b) => b.id === currentUserBranch);
      if (currentBranch && currentBranch.extension) {
        setNewWebUser((prev) => ({
          ...prev,
          branch: currentUserBranch,
          email: currentBranch.extension,
        }));
      }
    }
  }, [currentUserBranch, currentWebUser.position]);


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
        {currentWebUser.position.toLowerCase() === "super admin" ? (
          <select
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
        ) : (
          <input
            type="text"
            disabled
            value={
              branches.find((b) => b.id === currentUserBranch)?.name || ""
            }
          />
        )}

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

        {/* Position */}
        <label>Position:</label>
        {currentWebUser.position.toLowerCase() === "super admin" ? (
          <select
            value={newWebUser.position}
            onChange={(e) =>
              setNewWebUser({ ...newWebUser, position: e.target.value })
            }
          >
            <option value="">Select Position</option>
            <option value="Professor">Professor</option>
            <option value="Sub Admin">Sub Admin</option>
          </select>
        ) : (
          <input type="text" disabled value="Professor" />
        )}

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
