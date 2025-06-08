import "./index.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import { ActiveContext } from "./contexts/Contexts";
import { UserLoggedInContext } from "./contexts/Contexts";
import Dashboard from "./pages/dashboard/Dashboard";
import Analytics from "./pages/analytics/Analytics";
import Leaderboard from "./pages/leaderboard/Leaderboard";
import ManageQuestion from "./pages/questions/ManageQuestion";
import ManageStudents from "./pages/students/ManageStudents";
import ManageGlossary from "./pages/glossary/ManageGlossary";
import Profile from "./pages/profile/Profile";
import AccountManagement from "./pages/accounts/AccountManagement";
import Login from "./pages/login/Login";
import EditProfile from "./pages/profile/EditProfile";
import EditGlossary from "./pages/glossary/EditGlossary";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "./Firebase";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AddQuestion from "./pages/questions/AddQuestion";
import TermsAndConditions from "./pages/login/TermsAndConditions";
import AddTerm from "./pages/glossary/AddTerm";
import AddAccount from "./pages/accounts/AddAccount";
import SessionTimeout from "./components/SessionTimeout/SessionTimeout";
import ShowMoreDetails from "./pages/students/ShowMoreDetails";
import ActivityLogs from "./pages/activityLogs/ActivityLogs";
import SignUp from "./pages/signUp/SignUp";
import ApproveAccount from "./pages/accounts/ApproveAccount";
import Branches from "./pages/branches/Branches";
import TermsAndConditions from "./pages/login/TermsAndConditions";

const queryClient = new QueryClient();

function App() {
  const [isActive, setActive] = useState(false);
  const [subSelected, setSubSelected] = useState("");
  const [selected, setSelected] = useState("");

  const [currentWebUser, setCurrentWebUser] = useState({
    firstName: "",
    lastName: "",
    branch: "",
    email: "",
    employeenum: "",
    position: "",
    uid: "",
    useravatar: "",
  });
  const [currentWebUserUID, setCurrentWebUserUID] = useState("");
  const [currentUserBranch, setCurrentUserBranch] = useState(null);

  const [isSplash, setIsSplash] = useState(true);

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      setIsSplash(true);
      if (user) {
        // console.log(user);
        localStorage.setItem("userUID", user.uid);
        setCurrentWebUserUID(user.uid);
        console.log("current web user uid: " + currentWebUserUID);
        setIsSplash(false);
      } else {
        localStorage.removeItem("userUID");
        setCurrentWebUserUID(null);
        setIsSplash(false);
      }
    });
  }, []);

  // useEffect(() => {
  //   const currentPath = window.location.pathname

  //   if (currentPath === '/' || currentPath === '') {
  //     setSelected('login')
  //   } else {
  //     const paths = {
  //       '/dashboard': 'dashboard',
  //       '/analytics': 'analytics',
  //       '/leaderboard': 'leaderboard',
  //       '/question': 'question',
  //       '/glossary': 'glossary',
  //       '/students': 'students',
  //       '/profile' : 'profile',
  //       '/account': 'account'
  //     }

  //     const newSelected = paths[currentPath] || 'login'
  //     setSelected(newSelected)
  //   }
  // }, [])

  return (
    <ActiveContext.Provider
      value={{
        isActive,
        setActive,
        selected,
        setSelected,
        subSelected,
        setSubSelected,
      }}
    >
      <UserLoggedInContext.Provider
        value={{
          currentWebUser,
          setCurrentWebUser,
          currentWebUserUID,
          setCurrentWebUserUID,
          currentUserBranch,
          setCurrentUserBranch,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            {!currentWebUserUID && !isSplash ? (
              <Routes>
                <Route path="/" element={<Login />} />
                <Route
                  path="/terms-and-conditions"
                  element={<TermsAndConditions />}
                />
                <Route path="/signup" element={<SignUp />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            ) : !isSplash ? (
              <div className="main-container">
                <SessionTimeout timeout={15 * 60 * 1000} /> {/* 15 minutes */}
                <Sidebar />
                <div
                  className={
                    isActive ? "active-content-container" : "content-container"
                  }
                >
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/question" element={<ManageQuestion />} />
                    <Route path="/question/add" element={<AddQuestion />} />
                    <Route path="/glossary" element={<ManageGlossary />} />
                    <Route path="/students" element={<ManageStudents />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/account" element={<AccountManagement />} />
                    <Route path="/account/approval" element={<ApproveAccount />} />
                    <Route path="/profile/edit/:id" element={<EditProfile />} />
                    <Route path="/glossary/edit" element={<EditGlossary />} />
                    <Route path="/addterm" element={<AddTerm />} />
                    <Route path="/logs" element={<ActivityLogs />} />
                    <Route path="/addaccount" element={<AddAccount />} />
                    <Route path="/students/overall" element={<ShowMoreDetails />} />
                    <Route path="/branches" element={<Branches />} />
                    <Route path="/termsAndCondition" element={<TermsAndConditions />} />

                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </div>
              </div>
            ) : (
              <Routes>
                <Route path="*" element={<Login />} />
              </Routes>
            )}
          </BrowserRouter>
        </QueryClientProvider>
      </UserLoggedInContext.Provider>
    </ActiveContext.Provider>
  );
}

export default App;
