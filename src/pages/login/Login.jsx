import "../../css/login/login.css";
import logo from "../../assets/logo/logo.svg";
import nuLogo from "../../assets/logo/nuLogo.svg";
import { useNavigate } from "react-router-dom";
import { ActiveContext, UserLoggedInContext } from "../../contexts/Contexts";
import { useContext, useState, useEffect } from "react";

import { firebaseAuth } from "../../Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import { branches } from "../../Constants";
import pattern from "../../assets/forAll/pattern.svg";

export default function Login() {
  const { setSelected } = useContext(ActiveContext);
  const { setCurrentWebUserUID } = useContext(UserLoggedInContext);
  const navigate = useNavigate();

  const [logoTransitioned, setLogoTransitioned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoTransitioned(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handelLoginFirebase = async (e) => {
    e.preventDefault();

    const matchedBranch = branches.find((item) => item.id === branch);

    try {
      if (!matchedBranch) {
        alert("Please select a campus");
        return;
      }
      if (!email) {
        alert("Please enter a valid email");
        return;
      }
      if (!password) {
        alert("Please enter your password");
        return;
      }
      
      const allowedExceptionDomain = "@students.nu-moa.edu.ph";

      if (
        !email.endsWith(matchedBranch.extension) &&
        !email.endsWith(allowedExceptionDomain)
      ) {
        alert(`Account: ${email} not found at NU ${branch.toUpperCase()}`);
        return;
      }

      if (password.length < 5) {
        alert("Password too short!");
        return;
      }

      await signInWithEmailAndPassword(firebaseAuth, email, password);
      const user = firebaseAuth.currentUser;
      setIsLoading(true);

      if (user) {
        const token = await user.getIdToken();
        const fifteenMinutes = 15 * 60;
        document.cookie = `token=${token}; path=/; Max-Age=${fifteenMinutes}; Secure; SameSite=Strict`;

        setCurrentWebUserUID(user.uid);
        localStorage.setItem("userUID", user.uid);

        setIsLoading(false);
        // setSelected('dashboard');
        // navigate('/');
      }
    } catch (error) {
      let message;
      console.log(error.code);

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
          message = "An unexpected error occurred. Please try again.";
          console.error("Unhandled auth error:", error);
      }
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <img
          src={logo}
          alt="Mindify Logo"
          style={{ width: "80px", marginBottom: "20px" }}
        />
        <div className="spinner"></div>
        <p>Signing you in...</p>
      </div>
    );
  }

  return (
    <div className="login-main-container relative">
      <img
        src={pattern}
        alt="pattern"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
      />

      {/* Transitioning Logo */}
      <div className={`transition-logo ${logoTransitioned ? "moved" : ""}`}>
        <img src={logo} alt="Mindify Logo" className="logo-img" />
      </div>

      {/* Login form container */}
      <div
        className={`relative z-10 w-full h-full flex flex-row justify-center items-stretch transition-opacity duration-1000 ${
          logoTransitioned ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="logo-container"></div>

        <div className="login-form">
          <div className="input-container">
            <h1 className="welcome-txt">WELCOME!</h1>
            <h3 className="mini-txt">Sign in to access your account</h3>

            <label className="floating-label">
              <span className="spanner">Campus</span>
              <select
                defaultValue="default"
                className="select select-ghost inputs"
                onChange={(e) => setBranch(e.target.value)}
              >
                <option disabled={true} value="default">
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
                className="input validator inputs"
                type="email"
                required
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="floating-label">
              <span className="spanner">Password</span>
              <input
                type="password"
                className="input validator inputs"
                required
                placeholder="Password"
                minLength="8"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <div className="remember-container">
              <input type="checkbox" className="checkbox" />
              <p className="remember-txt">Remember me</p>
            </div>

            <button className="login-btn" onClick={handelLoginFirebase}>
              Sign In
            </button>

            <div className="flex items-center w-full mt-5">
              <div className="flex-grow h-px bg-black"></div>
              <span className="px-4 text-black text-xs">or sign in with</span>
              <div className="flex-grow h-px bg-black"></div>
            </div>

            <button className="login-btn">
              <svg
                aria-label="Microsoft logo"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M96 96H247V247H96" fill="#f24f23"></path>
                <path d="M265 96V247H416V96" fill="#7eba03"></path>
                <path d="M96 265H247V416H96" fill="#3ca4ef"></path>
                <path d="M265 265H416V416H265" fill="#f9ba00"></path>
              </svg>
              Sign In with Microsoft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
