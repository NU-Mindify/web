import "../../css/login/login.css";
import logo from "../../assets/logo/logo.svg";
import { ActiveContext, UserLoggedInContext } from "../../contexts/Contexts";
import { useContext, useState, useEffect } from "react";
import { firebaseAuth } from "../../Firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { API_URL, branches } from "../../Constants";
import pattern from "../../assets/forAll/pattern.svg";
import { Eye, EyeOff } from "lucide-react";
import ValidationModal from "../../components/ValidationModal/ValidationModal.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SelectFilter from "../../components/selectFilter/SelectFilter.jsx";

export default function Login() {
  const { setCurrentWebUserUID } = useContext(UserLoggedInContext);
  const { setSelected } = useContext(ActiveContext);
  const [logoTransitioned, setLogoTransitioned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("default");

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const [validationMessage, setValidationMessage] = useState("");
  const [showValidationModal, setShowValidationModal] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [isEmailValid, setIsEmailValid] = useState(email);
  const [isPasswordValid, setIsPasswordValid] = useState(password);

  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoTransitioned(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginFirebase = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const matchedBranch = branches.find((item) => item.id === branch);
    const allowedExceptionDomain = "@students.nu-moa.edu.ph";

    try {
      if (!matchedBranch) {
        setValidationMessage("Please select a campus");
        setShowValidationModal(true);
        return;
      }
      if (!email) {
        setValidationMessage("Please enter a valid email");
        setShowValidationModal(true);
        return;
      }
      if (!password) {
        setValidationMessage("Please enter your password");
        setShowValidationModal(true);
        return;
      }
      if (password.length < 5) {
        setValidationMessage("Password too short!");
        setShowValidationModal(true);
        return;
      }

      if (
        !email.endsWith(matchedBranch.extension) &&
        !email.endsWith(allowedExceptionDomain)
      ) {
        setValidationMessage(`Account not found at NU ${branch.toUpperCase()}`);
        setShowValidationModal(true);
        setEmail("");
        setPassword("");
        setBranch("default");
        return;
      }

      const response = await axios.get(`${API_URL}/login/${email}`);
      const verifyData = response.data;

      if (!verifyData) {
        setValidationMessage(`Account not found at NU ${branch.toUpperCase()}`);
        setShowValidationModal(true);
        return;
      }

      if (verifyData.is_deleted == true) {
        setValidationMessage("Your Account has been Archived.");
        setShowValidationModal(true);
        return;
      }

      if (verifyData.isApproved !== true) {
        setValidationMessage("Your Account is awaiting Admin approval.");
        setShowValidationModal(true);
        return;
      }

      await signInWithEmailAndPassword(firebaseAuth, email, password);
      const user = firebaseAuth.currentUser;
      await user.reload();

      if (!user.emailVerified) {
        // alert(
        //   "Your Account email is not verified! Please check your email for the verification link. (verification link re-sent)"
        // );
        //       signOut(firebaseAuth);             [[comment for now para maka login si super admin kasi di pa valid email nya]]
        //       signOut(firebaseAuth)
        //       sendEmailVerification(user)
        return;
      }

      if (user) {
        const token = await user.getIdToken();
        const fifteenMinutes = 15 * 60;
        document.cookie = `token=${token}; path=/; Max-Age=${fifteenMinutes}; Secure; SameSite=Strict`;

        setCurrentWebUserUID(user.uid);
        navigate("/dashboard");

        await axios.post(`${API_URL}/addLogs`, {
          name: `${verifyData.firstName} ${verifyData.lastName}`,
          branch: verifyData.branch,
          action: "Logged In",
          description: "-",
        });
      }
    } catch (error) {
      let message;

      if (error.response) {
        // Axios API error
        message = error.response.data?.message || "Account not found.";
      } else if (error.code) {
        // Firebase Auth error
        switch (error.code) {
          case "auth/invalid-email":
            message = "Invalid email address format.";
            break;
          case "auth/user-disabled":
            message = "This account has been disabled.";
            break;
          case "auth/user-not-found":
            message = "No account found with this email.";
            break;
          case "auth/invalid-credential":
            message = "Invalid email or password.";
            break;
          case "auth/email-already-in-use":
            message = "Email is already associated with another account.";
            break;
          case "auth/weak-password":
            message = "Password should be at least 6 characters.";
            break;
          default:
            message = "An unexpected authentication error occurred.";
        }
      } else {
        message = "An unexpected error occurred. Please try again.";
      }

      setValidationMessage(message);
      setShowValidationModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      setValidationMessage("Please enter your email address.");
      setShowValidationModal(true);
      return;
    }

    setResetLoading(true);
    try {
      await sendPasswordResetEmail(firebaseAuth, resetEmail);
      setValidationMessage("Password reset email sent! Check your inbox.");
      setShowValidationModal(true);
      setShowResetModal(false);
      setResetEmail("");
    } catch (error) {
      setValidationMessage(
        "Error sending password reset email. Please try again."
      );
      setShowValidationModal(true);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="login-main-container">
      <img
        src={pattern}
        alt="pattern"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-60 pointer-events-none z-50"
      />

      {/* Transitioning Logo */}
      <div className={`transition-logo ${logoTransitioned ? "moved" : ""}`}>
        <img src={logo} alt="Mindify Logo" className="logo-img" />
      </div>

      {/* Login form container */}
      <div
        className={`relative z-50 w-full h-full flex flex-row justify-center items-stretch transition-opacity duration-1000 ${
          logoTransitioned ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="logo-container"></div>

        <div className="w-1/2 h-full flex justify-center items-center">
          <div className="login-form">
            <div className="input-container">
              <h1 className="welcome-txt">WELCOME!</h1>
              <h3 className="mini-txt">Sign in to access your account.</h3>

              <label className="floating-label">
                <span className="spanner">Campus</span>
                <select
                  className="select select-ghost inputs"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  defaultValue="Select a Campus"
                >
                  <option disabled value="default" hidden>
                    Select a Campus
                  </option>
                  {branches.map((branch) => (
                    <option value={branch.id} key={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="floating-label">
                <span className="spanner">Email</span>
                <input
                  className={`input validator inputs ${
                    isEmailValid || email === "" ? "" : "!border-red-500"
                  }`}
                  type="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEmail(value);

                    // validate: must contain "@" and ".edu.ph"
                    const isValid =
                      value.includes("@") && value.includes(".edu.ph");
                    setIsEmailValid(isValid);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLoginFirebase(e);
                    }
                  }}
                />
              </label>

              <label className="floating-label relative">
                <span className="spanner">Password</span>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input validator inputs !pr-12 ${
                    password && password.length < 6 ? "!border-red-500" : ""
                  }`}
                  required
                  placeholder="Password"
                  minLength="6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLoginFirebase(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-5 top-[22px] text-gray-600 text-sm"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </label>

              <div className="remember-container">
                <label className="form-checkbox">
                  <input type="checkbox" />
                  <span className="whitespace-nowrap">Remember me</span>
                </label>
                <button
                  className="forget-pass"
                  onClick={() => setShowResetModal(true)}
                >
                  Forgot password?
                </button>
              </div>

              <button
                className="login-btn"
                onClick={handleLoginFirebase}
                disabled={isLoading}
              >
                {isLoading ? "Signing you in..." : "Sign In"}
              </button>

              <div className="mt-5 text-center">
                <span className="text-black text-sm">
                  Don’t have an account yet?{" "}
                  <button
                    className="text-[#35408E] underline font-bold hover:text-[#FFA500] transition cursor-pointer"
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up here.
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showResetModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4 text-black font-[Poppins">
              Reset Password
            </h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4 text-black font-[Poppins]"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 btn btn-error"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordReset}
                className="px-4 py-2 btn bg-[#35408E] hover:bg-blue-700"
                disabled={resetLoading}
              >
                {resetLoading ? "Sending..." : "Send Email"}
              </button>
            </div>
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
