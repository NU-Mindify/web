import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SessionTimeout.css";
import {
  getAuth,
  signOut,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

export default function SessionTimeout({ timeout = 5 * 60 * 1000 }) {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const [showModal, setShowModal] = useState(() => {
    return localStorage.getItem("sessionTimedOut") === "true";
  });

  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const logoutUser = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        localStorage.removeItem("webUser");
        localStorage.removeItem("userUID");
        localStorage.removeItem("sessionTimedOut");
        document.cookie =
          "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        // setSelected("login");
        // setActive(false);
        // setCurrentWebUser(null);
        // setCurrentWebUserUID(null);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const resetTimer = () => {
    clearTimeout(timerRef.current);
    localStorage.removeItem("sessionTimedOut");

    timerRef.current = setTimeout(() => {
      localStorage.setItem("sessionTimedOut", "true");
      setShowModal(true);
    }, timeout);
  };

  const handleStayLoggedIn = () => {
    setShowPasswordPrompt(true);
  };

  const handlePasswordSubmit = async () => {
    if (!password) {
      setError("Password is required.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !user.email) {
      setError("No user found.");
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, password);
    setLoading(true);

    try {
      await reauthenticateWithCredential(user, credential);
      // Success
      setShowModal(false);
      setShowPasswordPrompt(false);
      setPassword("");
      setError("");
      localStorage.removeItem("sessionTimedOut");
      resetTimer();
    } catch (err) {
      setError("Incorrect password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showModal) {
      resetTimer();
      const events = ["mousemove", "keydown", "click", "scroll"];
      events.forEach((event) => window.addEventListener(event, resetTimer));

      return () => {
        clearTimeout(timerRef.current);
        events.forEach((event) =>
          window.removeEventListener(event, resetTimer)
        );
      };
    }
  }, [showModal]);

  return (
    <>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content text-black">
            <h2>Session Expired</h2>
            <p>You've been inactive for 15 minutes.</p>
            {showPasswordPrompt ? (
              <>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(""); // clear error on typing
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handlePasswordSubmit();
                    }
                  }}
                  placeholder="Enter your password"
                  className="password-input"
                />
                {error && <p className="error-text">{error}</p>}
                <div className="modal-btn-group">
                  <button
                    className="modal-stay-btn"
                    onClick={handlePasswordSubmit}
                    disabled={loading}
                  >
                    {loading ? "Confirming..." : "Confirm"}
                  </button>

                  <button
                    className="modal-cancel-btn"
                    onClick={() => {
                      setShowPasswordPrompt(false);
                      setPassword("");
                      setError("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="modal-btn-group">
                <button className="modal-close-btn" onClick={logoutUser}>
                  Sign Out
                </button>
                <button className="modal-stay-btn" onClick={handleStayLoggedIn}>
                  Stay Logged In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
