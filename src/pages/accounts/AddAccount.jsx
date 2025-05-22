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
    <div className="add-account-container">
      <div className="add-account-header">
      <h1 className="add-account-title">Add Account</h1>
      <button
        type="button"
        onClick={() => navigate("/account")}
        className="view-acc-btn"
        disabled={isLoading}
      >
        View Accounts
      </button>
    </div>


    <form className="add-account-form" onSubmit={handleRegister}>
    <table className="form-table">
      <tr>
        <td className="user-headers">Full name</td>
        <td className="user-details">
          <div className="details-holder">
            <input
              className="add-input-properties"
              type="text"
              value={newWebUser.firstName}
              onChange={(e) =>
                setNewWebUser({ ...newWebUser, firstName: e.target.value })
              }
            />
            <label>First Name</label>
          </div>
          
        </td>
        <td  className="user-details">
          <div className="details-holder">
            <input
              className="add-input-properties"
              type="text"
              value={newWebUser.lastName}
              onChange={(e) =>
                setNewWebUser({ ...newWebUser, lastName: e.target.value })
              }
            />
            <label>Last Name</label>
          </div>
          
        </td>
      </tr>
      <tr>
        <td  className="user-headers">Branch</td>
        <td colSpan={2} className="user-details">
          <div className="details-holder">
            {currentWebUser.position.toLowerCase() === "super admin" ? (
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
            ) : (
              <input
                className="add-input-properties"
                type="text"
                disabled
                value={
                  branches.find((b) => b.id === currentUserBranch)?.name || ""
                }
              />
            )}
          </div>
          
        </td>
      </tr>
      <tr>
        <td  className="user-headers">
          Email
        </td>
        <td colSpan={2} className="user-details">
          <div className="details-holder">
            <input
              className="add-input-properties"
              type="email"
              value={newWebUser.email}
              onChange={(e) =>
                setNewWebUser({ ...newWebUser, email: e.target.value })
              }
            />
          </div>

        </td>
      </tr>

      <tr>
        <td  className="user-headers">
          Employee Number
        </td>
        <td colSpan={2} className="user-details">
          <div className="details-holder">
            <input
              className="add-input-properties"
              type="text"
              value={newWebUser.employeenum}
              onChange={(e) =>
                setNewWebUser({ ...newWebUser, employeenum: e.target.value })
              }
            />
          </div>
        </td>
      </tr>

      <tr>
        <td  className="user-headers">
          Position
        </td>
        <td colSpan={2} className="user-details">
          <div className="details-holder">
            {currentWebUser.position.toLowerCase() === "super admin" ? (
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
            ) : (
              <input type="text" disabled value="Professor" className="add-input-properties" />
            )}
          </div>
          
        </td>
      </tr>

      <tr>
        <td  className="user-headers">
          Upload Profile
        </td>
        <td colSpan={2} className="user-details">
          <div className="details-holder">
            <input
              className="add-input-properties"
              type="text"
              value={newWebUser.useravatar}
              onChange={(e) =>
                setNewWebUser({ ...newWebUser, useravatar: e.target.value })
              }
            />
          </div>
        </td>
      </tr>

      <tr>
        <td  className="user-headers">
          Password
        </td>
        <td className="user-details">
          <div className="details-holder">
            <input
              className="add-input-properties"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Create Password</label>
          </div>
            
        </td>
        <td className="user-details">
          <div className="details-holder">
            
            <input
              className="add-input-properties"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <label>Confirm Password:</label>
          </div>
          
        </td>
      </tr>

      <tr>
        <td colSpan={3}>
          <div className="btn-holder">
            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="reset-btn"
              disabled={isLoading}
            >
              Reset
            </button>
          </div>
        </td>
      </tr>
      
        

        

      
        

        


        


        

        

       

        

        </table>
      </form>
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
    </>
  );
}
