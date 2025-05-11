import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SessionTimeout.css";
import { getAuth, signOut } from "firebase/auth"

export default function SessionTimeout({ timeout = 15 * 60 * 1000 }) {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const logoutUser = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setCurrentWebUser(null);
        setCurrentWebUserUID(null);
        localStorage.removeItem("webUser");
        localStorage.removeItem("userUID");
        document.cookie =
          "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        setSelected("login");
        setActive(false);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const resetTimer = () => {
    // Clear any existing timer and interval before resetting
    clearTimeout(timerRef.current);
    clearInterval(countdownRef.current);

    // Start the inactivity timer and show the modal after the specified timeout
    timerRef.current = setTimeout(() => {
      setShowModal(true);
    }, timeout);
  };

  const stayLoggedIn = () => {
    clearInterval(countdownRef.current);
    setShowModal(false);
    resetTimer(); // Reset the inactivity timer
  };

  useEffect(() => {
    resetTimer();

    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      clearTimeout(timerRef.current);
      clearInterval(countdownRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, []);

  return (
    <>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content text-black">
            <h2>Session Expiring</h2>
            <p>You've been inactive for 15 minutes.</p>
            <div className="modal-btn-group">
              <button className="modal-close-btn" onClick={logoutUser}>
                Logout Now
              </button>
              <button className="modal-stay-btn" onClick={stayLoggedIn}>
                Stay Logged In
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
