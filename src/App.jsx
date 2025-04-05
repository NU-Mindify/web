import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Sidebar from './components/sidebar/Sidebar'
import { ActiveContext } from './contexts/Contexts'
import Dashboard from './pages/dashboard/Dashboard'
import Analytics from './pages/analytics/Analytics'
import Reports from './pages/reports/Reports'
import Leaderboard from './pages/leaderboard/Leaderboard'
import ManageQuestion from './pages/questions/ManageQuestion'
import ManageStudents from './pages/students/ManageStudents'
import ManageGlossary from './pages/glossary/ManageGlossary'
import Profile from './pages/profile/Profile'
import AccountManagement from './pages/accounts/AccountManagement'
import './index.css'
import Login from './pages/login/Login'


function App() {
  const [isActive, setActive] = useState(false)
  const [selected, setSelected] = useState('login')

  return (
    <ActiveContext.Provider value={{ isActive, setActive, selected, setSelected }}>
     
        
    {selected === 'login' 
      ? 
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
        </Routes>
      </BrowserRouter>
      : 
      <div className='main-container'>
        <BrowserRouter>
          <Sidebar />
      
          <div className={isActive ? 'active-content-container' : 'content-container'}>
            <Routes>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/analytics' element={<Analytics />} />
              <Route path='/reports' element={<Reports />} />
              <Route path='/leaderboard' element={<Leaderboard />} />
              <Route path='/question' element={<ManageQuestion />} />
              <Route path='/glossary' element={<ManageGlossary />} />
              <Route path='/students' element={<ManageStudents />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/account' element={<AccountManagement />} />
              <Route path='*' element={<Dashboard />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    }
        


            
    </ActiveContext.Provider>
    
  )
}

export default App
