/* eslint-disable jsx-a11y/label-has-associated-control */
import { useContext, useEffect, useState } from "react";
import "../../css/account/account.css";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { secondaryAuth } from "../../Firebase";
import axios from "axios";
import chevronIcon from "../../assets/forAll/chevron.svg";
import { API_URL, branches } from "../../Constants";
import { useNavigate } from "react-router-dom";
import { UserLoggedInContext } from "../../contexts/Contexts";
import No_Profile from "../../assets/profile/noProfile.jpg";
import Buttons from "../../components/buttons/Buttons";


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
        <button
          type="button"
          onClick={() => navigate("/account")}
          className="view-acc-btn"
          disabled={isLoading}
        >
          <img src={chevronIcon} alt="chevron" />
        </button>
        <h1 className="add-account-title">Add Account</h1>
        
      </div>

      {/* <form onSubmit={handleRegister}> */}
        <div className="add-account-content">
          <div className="profile-pic-container">
            <table className="profile-pic-table">
              <tr>
                <td className="profile-pic-cell">
                  <div className="img-container">
                    <img
                      src={newWebUser.useravatar || No_Profile}
                      alt="Profile"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = No_Profile;
                      }}
                    />
                  </div>
                </td>
                <td>
                  <div className="upload-photo-container">
                    <div className="upload-btn-holder">
                      <input
                        className="w-[400px] h-[50px] text-black"
                        type="text"
                        value={newWebUser.useravatar}
                        onChange={(e) =>
                          setNewWebUser({ ...newWebUser, useravatar: e.target.value })
                        }
                      />
                      {/* <button>
                        Upload Photo
                      </button> */}
                      <label>At least 256 x 256 px PNG or JPG file.</label>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </div>



          <div className="user-details-container">
            <div className="input-holder">
              <h1>First Name</h1>
              <input
                type="text"
                value={newWebUser.firstName}
                onChange={(e) =>
                  setNewWebUser({ ...newWebUser, firstName: e.target.value })
                }
              >
              </input>
            </div>

            <div className="input-holder">
              <h1>Last Name</h1>
              <input
                type="text"
                value={newWebUser.lastName}
                onChange={(e) =>
                  setNewWebUser({ ...newWebUser, lastName: e.target.value })
                }
              >
              </input>
            </div>


            <div className="input-holder">
              <h1>NU Campus</h1>
              {
                currentWebUser.position.toLowerCase() === "super admin" ? (
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


            <div className="input-holder">
              <h1>Email</h1>
              <input
                type="email"
                value={newWebUser.email}
                onChange={(e) =>
                  setNewWebUser({ ...newWebUser, email: e.target.value })
                }
              >
              </input>
            </div>


            <div className="input-holder">
              <h1>Employee Nubmer</h1>
              <input
                type="text"
                value={newWebUser.employeenum}
                onChange={(e) =>
                  setNewWebUser({ ...newWebUser, employeenum: e.target.value })
                }
              >
              </input>
            </div>

            <div className="input-holder">
              <h1>Position</h1>
              {
                currentWebUser.position.toLowerCase() === "super admin" ? (
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

            <div className="input-holder">
              <h1>Password</h1>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              >
              </input>
            </div>

            <div className="input-holder">
              <h1>Re-type Password</h1>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                >
              </input>
            </div>
          </div>

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
    </>
  );
}
