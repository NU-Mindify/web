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
import "../../css/signUp/signUp.css";
import { useNavigate } from "react-router";
import chevronIcon from "../../assets/forAll/chevron.svg";
import logo from "../../assets/logo/logo.svg";
import pattern from "../../assets/forAll/pattern.svg";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

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
  const [acceptTermsAndCond, setAcceptTermsAndCond] = useState(false);

  const [validationMessage, setValidationMessage] = useState("");
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [termscondError, setTermsCondError] = useState("");

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

    setErrors({
      firstName: "",
      lastName: "",
      branch: "",
      email: "",
      employeenum: "",
      position: "",
      password: "",
      confirmPassword: "",
    });
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

    if (!acceptTermsAndCond) {
      // setTermsCondError("You must accept the Terms & Conditions.");
      setValidationMessage("You must accept the Terms & Conditions.");
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
      const uidWebUser = { ...finalWebUser, uid: user.uid, password: password };

      // 2. Send reset email
      await sendEmailVerification(user);
      console.log(uidWebUser);
      
      // 3. Store user data in database
      const {data:added} = await axios.post(`${API_URL}/createWebUser`, uidWebUser);
      console.log(added);
      
      // 4. Sign out the new user's account
      await signOut(firebaseAuth);

      // 5. Reset and show modal
      // setShowModal(true);
      alert("Sign up successful! A verification email has been sent to your email")
      handleReset();
    } catch (error) {
      console.error("Registration Error:", error.message);
      setValidationMessage("Error: " + error.message);
      setShowValidationModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const validateField = (fieldName, value) => {
    let message = "";

    switch (fieldName) {
      case "firstName":
        if (!value.trim()) {
          message = "First name is required.";
        } else if (value.trim().length < 2) {
          message = "First name must be at least 2 characters.";
        }
        break;
      case "lastName":
        if (!value.trim()) {
          message = "Last name is required.";
        } else if (value.trim().length < 2) {
          message = "Last name must be at least 2 characters.";
        }
        break;
      case "branch":
        if (!value) message = "Campus is required.";
        break;
      case "email":
        if (!value.trim()) {
          message = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          message = "Invalid email format.";
        }
        break;
      case "employeenum":
        if (!value.trim()) message = "Employee number is required.";
        break;
      case "position":
        if (!value) message = "Position is required.";
        break;
      case "password":
        if (!value.trim()) {
          message = "Password is required.";
        } else if (value.length < 6) {
          message = "Password must be at least 6 characters.";
        }
        break;
      case "confirmPassword":
        if (value !== password) {
          message = "Passwords do not match.";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [fieldName]: message }));
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
              {/* FIRSTNAME */}
              <p className="label">First Name</p>
              <input
                type="text"
                placeholder="Enter your first name"
                value={newWebUser.firstName}
                onChange={(e) => {
                  setNewWebUser({ ...newWebUser, firstName: e.target.value });
                  validateField("firstName", e.target.value);
                }}
                onBlur={(e) => validateField("firstName", e.target.value)}
                className={errors.firstName ? "error-border" : ""}
              />
              {errors.firstName && (
                <p className="error-message">{errors.firstName || "\u00A0"}</p>
              )}
            </div>

            <div className="form-group">
              {/* EMAIL */}
              <p className="label">Email</p>
              <input
                type="email"
                placeholder="Enter your email"
                value={newWebUser.email}
                onChange={(e) => {
                  setNewWebUser({ ...newWebUser, email: e.target.value });
                  validateField("email", e.target.value);
                }}
                onBlur={(e) => validateField("email", e.target.value)}
                className={errors.email ? "error-border" : ""}
              />
              {errors.email && (
                <p className="error-message">{errors.email || "\u00A0"}</p>
              )}
            </div>

            <div className="form-group">
              {/* POSITION */}
              <p className="label">Position</p>
              <select
                value={newWebUser.position}
                onChange={(e) => {
                  setNewWebUser({ ...newWebUser, position: e.target.value });
                  validateField("position", e.target.value);
                }}
                onBlur={(e) => validateField("position", e.target.value)}
                className={`select-field ${
                  errors.position ? "error-border" : ""
                }`}
              >
                <option value="">Select Position</option>
                <option value="Professor">Professor</option>
                <option value="Sub Admin">Admin</option>
              </select>
              {errors.position && (
                <p className="error-message">{errors.position || "\u00A0"}</p>
              )}
            </div>

            <div className="form-group">
              {/* PASSW */}
              <p className="label">Password</p>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validateField("password", e.target.value);
                  }}
                  onBlur={(e) => validateField("password", e.target.value)}
                  className={errors.password ? "error-border" : ""}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="error-message">{errors.password || "\u00A0"}</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="form-column">
            <div className="form-group">
              {/* LASTNAME */}
              <p className="label">Last Name</p>
              <input
                type="text"
                placeholder="Enter your last name"
                value={newWebUser.lastName}
                onChange={(e) => {
                  setNewWebUser({ ...newWebUser, lastName: e.target.value });
                  validateField("lastName", e.target.value);
                }}
                onBlur={(e) => validateField("lastName", e.target.value)}
                className={errors.lastName ? "error-border" : ""}
              />
              {errors.lastName && (
                <p className="error-message">{errors.lastName || "\u00A0"}</p>
              )}
            </div>

            <div className="form-group">
              {/* EMPLOYEE# */}
              <p className="label">Employee Number</p>
              <input
                type="number"
                placeholder="Enter employee number"
                value={newWebUser.employeenum}
                onChange={(e) => {
                  setNewWebUser({ ...newWebUser, employeenum: e.target.value });
                  validateField("employeenum", e.target.value);
                }}
                onBlur={(e) => validateField("employeenum", e.target.value)}
                className={errors.employeenum ? "error-border" : ""}
                min={1}
                max={999999}
              />
              {errors.employeenum && (
                <p className="error-message">
                  {errors.employeenum || "\u00A0"}
                </p>
              )}
            </div>

            <div className="form-group">
              {/* CAMPUS */}
              <p className="label">Campus</p>
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
                  validateField("branch", branchId);
                }}
                onBlur={(e) => validateField("branch", e.target.value)}
                className={`select-field ${
                  errors.branch ? "error-border" : ""
                }`}
              >
                <option value="">Select Campus</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              {errors.branch && (
                <p className="error-message">{errors.branch || "\u00A0"}</p>
              )}
            </div>

            <div className="form-group">
              {/* CONFIRMPASS */}
              <p className="label">Confirm Password</p>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-type your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    validateField("confirmPassword", e.target.value);
                  }}
                  onBlur={(e) =>
                    validateField("confirmPassword", e.target.value)
                  }
                  className={errors.confirmPassword ? "error-border" : ""}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="error-message">
                  {errors.confirmPassword || "\u00A0"}
                </p>
              )}
            </div>
          </div>

          <div className="form-footer">
            <label className="form-checkbox">
              <input
                type="checkbox"
                checked={acceptTermsAndCond}
                onChange={(e) => {
                  setAcceptTermsAndCond(e.target.checked);
                  if (e.target.checked) {
                    setTermsCondError("");
                  }
                }}
              />
              <span>
                I accept and acknowledge the
                <Link to="/terms-and-conditions" className="terms-and-cond">
                  {" "}
                  Terms and Conditions.{" "}
                </Link>
              </span>
            </label>

            {/* {termscondError && (
                <p className="error-message">{termscondError}</p>
              )} */}

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

              <div className="mt-5 text-center">
                <span className="text-black text-sm">
                  Already have an account?{" "}
                  <button
                    className="text-[#35408E] underline font-bold hover:text-[#FFA500] transition"
                    onClick={() => navigate("/")}
                  >
                    Sign In here.
                  </button>
                </span>
              </div>
          </div>
        </div>
      </div>

      {/* Right: Logo section */}
      <div className="sign-up-branding-side">
        {<img src={logo} alt="NU Logo" className="nu-logo" />}
      </div>

      {/* Modals */}
      {showModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-[999]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-90 h-50 flex items-center justify-center flex-col animate-popup">
            <h2>Sign Up Successful! A verification email has been sent to your email. Once verified, your account will be awaiting Admin approval</h2>
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
