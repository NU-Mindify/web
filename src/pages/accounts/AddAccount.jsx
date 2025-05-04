import { useEffect, useState } from "react";
import "../../css/account/account.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../../Firebase";
import axios from "axios";
import { API_URL } from "../../Constants";
import { useNavigate } from "react-router-dom";

export default function AddAccount() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
//   const [webusers, setWebUsers] = useState([]);
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

  const navigate = useNavigate();

//   useEffect(() => {
//     fetchWebUsers();
//   }, []);

//   const fetchWebUsers = () => {
//     axios
//       .get(`${API_URL}/getWebUsers`)
//       .then((response) => {
//         setWebUsers(response.data);
//       })
//       .catch((error) => {
//         console.error("Fetch Web Users Error:", error);
//       });
//   };

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

    // ✅ Confirm passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      // ✅ Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        newWebUser.email,
        password
      );
      const user = userCredential.user;
      const uidWebUser = { ...newWebUser, uid: user.uid };

      // ✅ Save to MongoDB
      axios
        .post(`${API_URL}/createWebUser`, uidWebUser)
        .then(() => {
        //   fetchWebUsers();
          alert(
            `Account ${newWebUser.firstName} ${newWebUser.lastName} added successfully.`
          );
          handleReset();
        })
        .catch((error) => {
          console.error("MongoDB Save Error:", error.response?.data || error);
          alert("Failed to save user to database.");
        });
    } catch (error) {
      console.error("Firebase Auth Error:", error.message);
      alert("Failed to create user: " + error.message);
    }
  };

  return (
    <>
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
      <input
        type="text"
        placeholder="Position"
        value={newWebUser.position}
        onChange={(e) =>
          setNewWebUser({ ...newWebUser, position: e.target.value })
        }
      />

      <label>Profile Pic URL:</label>
      <input
        type="text"
        placeholder="Profile Pic URL LINK"
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

      <button onClick={handleRegister} className="btn btn-success">
        Submit
      </button>
      <button onClick={handleReset} className="btn btn-warning">
        Reset
      </button>
      <button onClick={() => navigate("/account")} className="btn btn-secondary">
        View Accounts
      </button>
    </>
  );
}
