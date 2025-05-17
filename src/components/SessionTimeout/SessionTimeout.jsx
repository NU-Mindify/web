import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SessionTimeout.css";
import { getAuth, signOut } from "firebase/auth";

export default function SessionTimeout({ timeout = 5 * 60 * 1000 }) {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const [showModal, setShowModal] = useState(() => {
    return localStorage.getItem("sessionTimedOut") === "true";
  });

  const logoutUser = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        localStorage.removeItem("webUser");
        localStorage.removeItem("userUID");
        localStorage.removeItem("sessionTimedOut");
        document.cookie =
          "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        setSelected("login");
        setActive(false);
        setCurrentWebUser(null);
        setCurrentWebUserUID(null);
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
            <p>You've been inactive for 5 minutes.</p>
            <div className="modal-btn-group">
              <button className="modal-close-btn" onClick={logoutUser}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}