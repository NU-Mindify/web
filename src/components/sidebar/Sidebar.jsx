import { useContext } from "react"
import { ActiveContext } from "../../contexts/Contexts"
import MenuBtn from "./MenuBtn"
import hamburger from '../../assets/sidebar/hamburger.svg'
import dashboard from '../../assets/sidebar/dashboard.svg'
import analytics from '../../assets/sidebar/analytic.svg'
import leaderboard from '../../assets/sidebar/leaderboard.svg'
import question from '../../assets/sidebar/question.svg'
import glossary from '../../assets/sidebar/glossary.svg'
import student from '../../assets/sidebar/student.svg'
import profile from '../../assets/sidebar/profile.svg'
import account from '../../assets/sidebar/account.svg'
import logout from '../../assets/sidebar/logout.svg'
import '../../index.css'
import { useLocation, useNavigate } from "react-router"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../Constants';
import close from '../../assets/sidebar/close.svg'




import { UserLoggedInContext } from "../../contexts/Contexts"

import { getAuth, signOut } from "firebase/auth"


export default function Sidebar() {
  const { isActive, setActive, selected, setSelected, subSelected, setSubSelected } =
    useContext(ActiveContext);

  const {
    currentWebUser, setCurrentWebUser,
    currentWebUserUID, setCurrentWebUserUID,
    currentUserBranch, setCurrentUserBranch,
  } = useContext(UserLoggedInContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
  const [activeQuestion, setActiveQuestion] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1025);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update selected menu based on URL path
  useEffect(() => {
    const pathToKeyMap = {
      "/dashboard": "dashboard",
      "/analytics": "analytics",
      "/leaderboard": "leaderboard",
      "/question": "question",
      "/glossary": "glossary",
      "/students": "students",
      "/profile": "profile",
      "/account": "account",
      "/": "dashboard", // treat root as dashboard or login depending on your routing
    };

    const currentKey = pathToKeyMap[location.pathname];
    if (currentKey) {
      setSelected(currentKey);
    }
  }, [location.pathname, setSelected]);

  const currentPath = location.pathname;

  const handleSideMenu = () => {
    setActive((prev) => !prev);
  };

  const handleLogout = () => {
    document.getElementById("logout_modal")?.showModal();
  };

  const confirmLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setCurrentWebUser(null);
        setCurrentWebUserUID(null);
        localStorage.removeItem("webUser");
        localStorage.removeItem("userUID");
        document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        setSelected("login");
        setActive(false);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Fetch user info only when UID changes (avoid infinite loop)
  useEffect(() => {
    if (!currentWebUserUID) return;

    axios
      .get(`${API_URL}/getwebuser/${currentWebUserUID}`)
      .then((response) => {
        setCurrentWebUser(response.data);

        if (
          response.data.position?.toLowerCase() === "super admin" ||
          !response.data.position
        ) {
          setCurrentUserBranch("All");
        } else {
          setCurrentUserBranch(response.data.branch);
        }

        localStorage.setItem("webUser", JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log("Error fetching sidebar user:", error);
      });
  }, [currentWebUserUID, setCurrentWebUser, setCurrentUserBranch]);

  return (
    <div className={isActive ? "active-side-menu" : "side-menu"}>
      <button className="btn-icon" onClick={handleSideMenu}>
        <img src={isActive ? close : hamburger} className="mainIcon" alt="menu" />
      </button>

      {isActive && currentWebUser && (
        <>
          <div className="avatar">
            <div className="avatar-container">
              <div className="avatar-padding">
                <img
                  src={currentWebUser.useravatar || "/default-avatar.png"}
                  alt="avatar"
                  className="avatar-img"
                />
              </div>
            </div>
          </div>
          <div className="name-container">
            <h1 className="user-name">{currentWebUser.firstName || "User"}</h1>
          </div>
        </>
      )}

      <div className="menu-list-container">
        <ul className="menu-list">
          <li>
            <MenuBtn
              icons={dashboard}
              active={isActive}
              text="Dashboard"
              isSelected={selected === "dashboard" || currentPath === "/"}
              onPress={() => {
                setSelected("dashboard");
                setSubSelected("");
                setActiveQuestion(false);
                if (isMobile) setActive(false);
                navigate("/dashboard");
              }}
              goTo="/dashboard"
            />
          </li>

          <li>
            <MenuBtn
              icons={analytics}
              active={isActive}
              text="Analytics"
              isSelected={selected === "analytics"}
              onPress={() => {
                setSelected("analytics");
                setSubSelected("");
                setActiveQuestion(false);
                if (isMobile) setActive(false);
                navigate("/analytics");
              }}
              goTo="/analytics"
            />
          </li>

          <li>
            <MenuBtn
              icons={leaderboard}
              active={isActive}
              text="Leaderboard"
              isSelected={selected === "leaderboard"}
              onPress={() => {
                setSelected("leaderboard");
                setSubSelected("");
                setActiveQuestion(false);
                if (isMobile) setActive(false);
                navigate("/leaderboard");
              }}
              goTo="/leaderboard"
            />
          </li>

          <li>
            <MenuBtn
              icons={question}
              active={isActive}
              text="Manage Questions"
              isSelected={selected === "question"}
              onPress={() => {
                setSelected("question");
                setActiveQuestion(!activeQuestion);
                if (isMobile) setActive(false);
                navigate("/question");
              }}
              goTo="/question"
            />
            {selected === "question" && isActive && activeQuestion && (
              <ul className="question-category-container">
                {[
                  { id: "abnormal", label: "Abnormal Psychology" },
                  { id: "developmental", label: "Developmental Psychology" },
                  { id: "psychological", label: "Psychological Assessment" },
                  { id: "industrial", label: "Industrial Psychology" },
                  { id: "general", label: "General Psychology" },
                ].map(({ id, label }) => (
                  <li key={id}>
                    <div
                      className={
                        subSelected === id
                          ? "active-sub-selected"
                          : "active-sub-btn-container"
                      }
                    >
                      <button
                        className="active-btn-icon"
                        onClick={() => {
                          navigate("/question", {
                            state: {
                              category: id,
                              categoryName: label,
                              catSelected: true,
                            },
                          });
                          setSelected("question");
                          setSubSelected(id);
                        }}
                      >
                        <h1 className="active-btn-txt">{label}</h1>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li>
            <MenuBtn
              icons={glossary}
              active={isActive}
              text="Manage Glossary"
              isSelected={selected === "glossary"}
              onPress={() => {
                setSelected("glossary");
                setSubSelected("");
                setActiveQuestion(false);
                if (isMobile) setActive(false);
                navigate("/glossary");
              }}
              goTo="/glossary"
            />
          </li>

          <li>
            <MenuBtn
              icons={student}
              active={isActive}
              text="View Students"
              isSelected={selected === "students"}
              onPress={() => {
                setSelected("students");
                setSubSelected("");
                setActiveQuestion(false);
                if (isMobile) setActive(false);
                navigate("/students");
              }}
              goTo="/students"
            />
          </li>

          <li>
            <MenuBtn
              icons={profile}
              active={isActive}
              text="Profile Settings"
              isSelected={selected === "profile"}
              onPress={() => {
                setSelected("profile");
                setSubSelected("");
                setActiveQuestion(false);
                if (isMobile) setActive(false);
                navigate("/profile");
              }}
              goTo="/profile"
            />
          </li>

          {(currentWebUser?.position?.toLowerCase() === "super admin" ||
            currentWebUser?.position?.toLowerCase() === "sub admin") && (
            <li>
              <MenuBtn
                icons={account}
                active={isActive}
                text="Manage Accounts"
                isSelected={selected === "account"}
                onPress={() => {
                  setSelected("account");
                  setSubSelected("");
                  setActiveQuestion(false);
                  if (isMobile) setActive(false);
                  navigate("/account");
                }}
                goTo="/account"
              />
            </li>
          )}

          <li>
            <MenuBtn
              icons={logout}
              active={isActive}
              text="Logout"
              isSelected={false}
              onPress={handleLogout}
            />
          </li>
        </ul>
      </div>

      <dialog id="logout_modal" className="modal">
        <form method="dialog" className="modal-box text-center">
          <h3 className="font-bold text-lg mb-4">Are you sure you want to logout?</h3>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              className="btn btn-outline btn-error"
              onClick={() => document.getElementById("logout_modal")?.close()}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={confirmLogout}
            >
              Confirm
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}