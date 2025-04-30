import './index.css'
import { useState, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from './components/sidebar/Sidebar'
import { ActiveContext } from './contexts/Contexts'
import { UserLoggedInContext } from './contexts/Contexts'
import Dashboard from './pages/dashboard/Dashboard'
import Analytics from './pages/analytics/Analytics'
import Reports from './pages/reports/Reports'
import Leaderboard from './pages/leaderboard/Leaderboard'
import ManageQuestion from './pages/questions/ManageQuestion'
import ManageStudents from './pages/students/ManageStudents'
import ManageGlossary from './pages/glossary/ManageGlossary'
import Profile from './pages/profile/Profile'
import AccountManagement from './pages/accounts/AccountManagement'
import Login from './pages/login/Login'
import EditProfile from './pages/profile/EditProfile'
import EditGlossary from './pages/glossary/EditGlossary'
import { onAuthStateChanged } from 'firebase/auth'
import { firebaseAuth } from './Firebase'
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import AddQuestion from './pages/questions/AddQuestion'
import TermsAndConditions from './pages/login/TermsAndConditions'
import AddTerm from './pages/glossary/AddTerm'
import ProtectedRoute from '../ProtectedRoute'


const queryClient = new QueryClient();

function App() {
  const [isActive, setActive] = useState(false)
  const [selected, setSelected] = useState('')
  const [currentUserEmail, setCurrentUserEmail] = useState('')
  const [currentUserBranch, setCurrentUserBranch] = useState('')

  const [currentWebUser, setCurrentWebUser] = useState({firstName: '', lastName: '', branch: '', email: '', employeenum: '', position: '', uid: '', useravatar: ''})
  const [currentWebUserUID, setCurrentWebUserUID] = useState('')
  

  useEffect(()=>{
    onAuthStateChanged(firebaseAuth, user => {
      if (user) {
        // console.log(user);
        localStorage.setItem('userUID', user.uid);
        setCurrentWebUserUID(user.uid);
        console.log("current web user uid: "+currentWebUserUID);
        
      } else {
        localStorage.removeItem('userUID');
        setCurrentWebUserUID(null);
      }
    });
  }, [])

  


  useEffect(() => {
    const currentPath = window.location.pathname


    if (currentPath === '/' || currentPath === '') {
      setSelected('login')
    } else {
      const paths = {
        '/dashboard': 'dashboard',
        '/analytics': 'analytics',
        '/reports': 'reports',
        '/leaderboard': 'leaderboard',
        '/question': 'question',
        '/glossary': 'glossary',
        '/students': 'students',
        '/profile' : 'profile',
        '/account': 'account'
      }

      const newSelected = paths[currentPath] || 'login'
      setSelected(newSelected)
    }
  }, [])
  

  return (
    <ActiveContext.Provider
      value={{ isActive, setActive, selected, setSelected, currentUserEmail, setCurrentUserEmail, currentUserBranch, setCurrentUserBranch }}
    >
    <UserLoggedInContext.Provider
      value={{currentWebUser, setCurrentWebUser, currentWebUserUID, setCurrentWebUserUID}}
    >
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
          
            {!currentWebUserUID ? (
              <Routes>
                <Route 
                  path="/" 
                  element={<Login />} 
                />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="*" element={<Login />} />
              </Routes>
            ) : (
              <div className="main-container">
                {selected !== 'login' && <Sidebar />}
                <div
                  className={
                    isActive ? "active-content-container" : "content-container"
                  }
                >
                  <Routes>
                    {/* <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/question" element={<ManageQuestion />} />
                    <Route path="/question/add" element={<AddQuestion />} />
                    <Route path="/glossary" element={<ManageGlossary />} />
                    <Route path="/students" element={<ManageStudents />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/account" element={<AccountManagement />} />
                    <Route path="/profile/edit/:id" element={<EditProfile />} />
                    <Route path="/glossary/edit" element={<EditGlossary />} />
                    <Route path="/addterm" element={<AddTerm />} />
                    <Route path="*" element={<Login />} /> */}

                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/analytics" 
                      element={
                        <ProtectedRoute>
                          <Analytics />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/reports" 
                      element={
                        <ProtectedRoute>
                          <Reports />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/leaderboard" 
                      element={
                        <ProtectedRoute>
                          <Leaderboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/question" 
                      element={
                        <ProtectedRoute>
                          <ManageQuestion key={location.key} />
                        </ProtectedRoute>
                      } 
                    />
                    <Route
                      path="/question/add" 
                      element={
                        <ProtectedRoute>
                          <AddQuestion />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/glossary" 
                      element={
                        <ProtectedRoute>
                          <ManageGlossary />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/students" 
                    element={
                        <ProtectedRoute>
                          <ManageStudents />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/account" 
                      element={
                        <ProtectedRoute>
                          <AccountManagement />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/profile/edit/:id" 
                      element={
                        <ProtectedRoute>
                          <EditProfile />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/glossary/edit" 
                      element={
                        <ProtectedRoute>
                          <EditGlossary />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/addterm" 
                      element={
                        <ProtectedRoute>
                          <AddTerm />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="*" 
                      element={
                        <Login />
                      } 
                    />
                  </Routes>

                </div>
              </div>
            )}
          </BrowserRouter>
        </QueryClientProvider>
      </UserLoggedInContext.Provider>
    </ActiveContext.Provider>
  );
}

export default App
