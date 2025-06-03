import { useContext } from "react";
import { ActiveContext } from "../../contexts/Contexts";
import MenuBtn from "./MenuBtn";
import hamburger from "../../assets/sidebar/hamburger.svg";
import dashboard from "../../assets/sidebar/dashboard.svg";
import analytics from "../../assets/sidebar/analytic.svg";
import leaderboard from "../../assets/sidebar/leaderboard.svg";
import question from "../../assets/sidebar/question.svg";
import glossary from "../../assets/sidebar/glossary.svg";
import student from "../../assets/sidebar/student.svg";
import profile from "../../assets/sidebar/profile.svg";
import account from "../../assets/sidebar/account.svg";
import logout from "../../assets/sidebar/logout.svg";
import "../../index.css";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../Constants";
import close from "../../assets/sidebar/close.svg";
import logs from "../../assets/sidebar/logs.svg";

import { UserLoggedInContext } from "../../contexts/Contexts";

import { getAuth, signOut } from "firebase/auth";

export default function Sidebar() {
  const {
    isActive,
    setActive,
    selected,
    setSelected,
    subSelected,
    setSubSelected,
  } = useContext(ActiveContext);

  const {
    currentWebUser,
    setCurrentWebUser,
    currentWebUserUID,
    setCurrentWebUserUID,
    currentUserBranch,
    setCurrentUserBranch,
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
      "/logs": "logs",
      "/": "dashboard",
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

  const menuItems = [
    {
      id: "dashboard",
      text: "Dashboard",
      icon: dashboard,
      path: "/dashboard",
    },
    {
      id: "analytics",
      text: "Analytics",
      icon: analytics,
      path: "/analytics",
    },
    {
      id: "leaderboard",
      text: "Leaderboard",
      icon: leaderboard,
      path: "/leaderboard",
    },
    {
      id: "question",
      text: "Manage Questions",
      icon: question,
      path: "/question",
      hasSub: true,
    },
    {
      id: "glossary",
      text: "Manage Glossary",
      icon: glossary,
      path: "/glossary",
    },
    {
      id: "students",
      text: "View Students",
      icon: student,
      path: "/students",
    },
    {
      id: "profile",
      text: "Profile Settings",
      icon: profile,
      path: "/profile",
    },
    {
      id: "account",
      text: "Manage Accounts",
      icon: account,
      path: "/account",
      bothAdmin: true,
    },
    {
      id: "logs",
      text: "Activity Logs",
      icon: logs,
      path: "/logs",
      superAdmin: true,
    },
    {
      id: "logout",
      text: "Logout",
      icon: logout,
      isLogout: true,
    },
  ];

  return (
    <div className={isActive ? "active-side-menu" : "side-menu"}>
      <button className="btn-icon" onClick={handleSideMenu}>
        <img
          src={isActive ? close : hamburger}
          className="mainIcon"
          alt="menu"
        />
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
          {menuItems.map((item) => {
            if (
              (item.superAdmin &&
                !["super admin"].includes(
                  currentWebUser?.position?.toLowerCase()
                )) ||
              (item.bothAdmin &&
                !["sub admin", "super admin"].includes(
                  currentWebUser?.position?.toLowerCase()
                ))
            ) {
              return null;
            }

            return (
              <li key={item.id}>
                <MenuBtn
                  icons={item.icon}
                  active={isActive}
                  text={item.text}
                  isSelected={
                    item.id === selected ||
                    (item.id === "dashboard" && currentPath === "/")
                  }
                  onPress={() => {
                    if (item.isLogout) return handleLogout();

                    setSelected(item.id);
                    setSubSelected("");
                    setActiveQuestion(false);
                    if (isMobile) setActive(false);

                    if (item.id === "question") {
                      setActiveQuestion(!activeQuestion);
                    }

                    if (!item.isLogout) {
                      navigate(item.path);
                    }
                  }}
                  goTo={item.path}
                />

                {item.id === "question" && isActive && activeQuestion && (
                  <ul className="question-category-container">
                    {[
                      { id: "abnormal", label: "Abnormal Psychology" },
                      {
                        id: "developmental",
                        label: "Developmental Psychology",
                      },
                      {
                        id: "psychological",
                        label: "Psychological Assessment",
                      },
                      { id: "industrial", label: "Industrial Psychology" },
                      { id: "general", label: "General Psychology" },
                    ].map(({ id, label }) => (
                      <li key={id}>
                        <div
                          className={`font-[Poppins] ${
                            subSelected === id
                              ? "active-sub-selected"
                              : "active-sub-btn-container"
                          }`}
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
            );
          })}
        </ul>
      </div>

      <dialog id="logout_modal" className="modal">
        <form method="dialog" className="modal-box text-center font-[Poppins]">
          <h3 className="font-bold text-lg mb-4">
            Are you sure you want to logout?
          </h3>
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
              className="btn btn-primary text-black"
              onClick={async () => {
                await axios.post(`${API_URL}/addLogs`, {
                  name: `${currentWebUser.firstName} ${currentWebUser.lastName}`,
                  branch: currentWebUser.branch,
                  action: "Logged Out",
                  description: "-",
                });
                
                confirmLogout(); 
              }}
            >
              Confirm
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
