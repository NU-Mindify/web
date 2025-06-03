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
import logo from "../../assets/logo/logo.svg";
import pattern from "../../assets/forAll/pattern.svg";
import { Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


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

      {
        !showValidationModal && 
         handleReset();

        // 4. Sign out the new user's account
        await signOut(firebaseAuth);
        navigate("/")

        // 5. Reset and show modal
      }
     
      
    } catch (error) {
      console.error("Registration Error:", error.message);
      setValidationMessage("Error: " + error.message);
      setShowValidationModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sign-up-container">
      <img
      src={pattern}
      alt="pattern"
      className="absolute top-0 left-0 w-full h-full object-cover opacity-50 pointer-events-none z-0"
      />

      {/* Left: Form section */}
      <div className="form-container">
        
        <div className="form-fields-wrapper">
          <div className="form-welcome-text">
            <h1>WELCOME!</h1>
            <p>Create your account.</p>
          </div>
    
          {/* Left Column */}
          <div className="form-column">
            <div className="form-group">
              <p className="label">First Name<span>*</span></p>
              <input
                type="text"
                placeholder="Enter your first name"
                value={newWebUser.firstName}
                onChange={(e) =>
                  setNewWebUser({ ...newWebUser, firstName: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <p className="label">Email<span>*</span></p>
              <input
                type="email"
                placeholder="Enter your email"
                value={newWebUser.email}
                onChange={(e) =>
                  setNewWebUser({ ...newWebUser, email: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <p className="label">Position<span>*</span></p>
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
            </div>

            <div className="form-group">
              <p className="label">Password<span>*</span></p>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="form-column">
            <div className="form-group">
              <p className="label">Last Name<span>*</span></p>
              <input
                type="text"
                placeholder="Enter your last name"
                value={newWebUser.lastName}
                onChange={(e) =>
                  setNewWebUser({ ...newWebUser, lastName: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <p className="label">Employee Number<span>*</span></p>
              <input
                type="number"
                placeholder="Enter employee number"
                value={newWebUser.employeenum}
                onChange={(e) =>
                  setNewWebUser({ ...newWebUser, employeenum: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <p className="label">Campus<span>*</span></p>
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
                <option value="">Select Campus</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <p className="label">Confirm Password<span>*</span></p>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-type your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

          </div>
          
            <div className="form-footer">
              {/* NOT SURE KASI IF TUTUTLOY NIYO PRIVACY POLICY, GINAYA KO LANG NASA FIGMA */}
              {/* <label className="form-checkbox">   
                <input type="checkbox" />
                <span>
                  {/* I accept and acknowledge the <a href="#">Privacy Policy</a>. }
                </span>
              </label> */}

              <button
                className="register-button"
                onClick={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "REGISTER"}
              </button>

              <button
                className="reset-button"
                onClick={handleReset}
                disabled={isLoading}
              >
              RESET
              </button>
              
              <p className="sign-in-footer">
                Already have an account?{" "}
                <a href="/" className="font-bold hover:underline">
                Sign in here
                </a>
              </p>
          </div>
        </div>
      </div>



      {/* Right: Logo section */}
      <div className="sign-up-branding-side">
        {<img src={logo} alt="NU Logo" className="nu-logo"/>}
      </div>

    {/* Modals */}
    {showValidationModal && (
      <ValidationModal
        message={validationMessage}
        onClose={() => setShowValidationModal(false)}
      />
    )}
  </div>
  );
}
