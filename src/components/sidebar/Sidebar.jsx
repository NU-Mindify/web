import { useContext } from "react"
import { ActiveContext } from "../../contexts/Contexts"
import MenuBtn from "./MenuBtn"
import hamburger from '../../assets/sidebar/hamburger.svg'
import halfburger from '../../assets/sidebar/halfburger.svg'
import dashboard from '../../assets/sidebar/dashboard.svg'
import analytics from '../../assets/sidebar/analytic.svg'
import reports from '../../assets/sidebar/report.svg'
import leaderboard from '../../assets/sidebar/leaderboard.svg'
import question from '../../assets/sidebar/question.svg'
import glossary from '../../assets/sidebar/glossary.svg'
import student from '../../assets/sidebar/student.svg'
import profile from '../../assets/sidebar/profile.svg'
import account from '../../assets/sidebar/account.svg'
import logout from '../../assets/sidebar/logout.svg'
import '../../index.css'
import { useLocation, useNavigate, useParams } from "react-router"
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../Constants';
import Cookies from 'js-cookie';


import { UserLoggedInContext } from "../../contexts/Contexts"

import { getAuth, signOut } from "firebase/auth"


export default function Sidebar() {
    const { isActive, setActive, selected, setSelected } = useContext(ActiveContext)
    const {currentWebUser, setCurrentWebUser, currentWebUserUID, setCurrentWebUserUID} = useContext(UserLoggedInContext)

    const navigate = useNavigate()
    const location = useLocation();


    const paths = {
        login: '/',
        dashboard: '/dashboard',
        analytics: '/analytics',
        reports: '/reports',
        leaderboard: '/leaderboard',
        question: '/question',
        glossary: '/glossary',
        students: '/students',
        profile: '/profile',
        account: '/account',
    }


    const handleSideMenu = () => {
        setActive((prev) => !prev)
    }

    const handleLogout = () => {
        localStorage.removeItem('webUser');
        localStorage.removeItem('userUID');
        document.getElementById('logout_modal')?.showModal();
    }

    const confirmLogout = () => {

        const auth = getAuth();
        signOut(auth).then(()=>{
            setCurrentWebUser(null);
            setCurrentWebUserUID(null);
            // Cookies.remove('userUID');  // Remove cookie
            localStorage.removeItem('webUser'); // If you still use localStorage
            localStorage.removeItem('userUID');
            setSelected('login');
            setActive(false);
            navigate('/');
        }).catch((error)=> {
            console.log(error);
            
        })
      };
      

    const { uid } = useParams();
    const [webUser, setWebUser] = useState({});

    useEffect(() => {
        const uid = currentWebUserUID;
    
        if (!uid) return;
    
        axios
            .get(`${API_URL}/getwebuser/${uid}`)
            .then((response) => {
                setCurrentWebUser(response.data);
                setWebUser(response.data);
                localStorage.setItem('webUser', JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log("Error fetching sidebar user:", error);
            });
    }, [currentWebUserUID]);
    

    return (
        <div className={isActive ? 'active-side-menu' : 'side-menu'}>
            <button className='btn-icon' onClick={handleSideMenu}>
                <img src={isActive ? halfburger : hamburger} className="mainIcon" alt="menu" />
            </button>

            {isActive && (
                <>
                    <div className="avatar">
                    <div className="avatar-container">
                        <img src={currentWebUser.useravatar} alt="avatar" />
                    </div>
                    </div>
                    <div className="name-container">
                    <h1 className="user-name">{currentWebUser.firstName} {currentWebUser.lastName}</h1>
                    </div>
                </>
            )}

            <MenuBtn 
                icons={dashboard}
                active={isActive}
                text='Dashboard'
                isSelected={selected === 'dashboard'}
                onPress={() => {
                    setSelected('dashboard');
                }}
                goTo={paths.dashboard}
            />

            
            <MenuBtn
                icons={analytics}
                active={isActive}
                text='Analytics'
                isSelected={selected === 'analytics'}
                onPress={() => {
                    setSelected('analytics');
                }}
                goTo={paths.analytics}
            />

            <MenuBtn
                icons={reports}
                active={isActive}
                text='Reports'
                isSelected={selected === 'reports'}
                onPress={() => {
                    setSelected('reports');
                }}
                goTo={paths.reports}
            />

            <MenuBtn
                icons={leaderboard}
                active={isActive}
                text='Leaderboard'
                isSelected={selected === 'leaderboard'}
                onPress={() => {
                    setSelected('leaderboard');
                }}
                goTo={paths.leaderboard}
            />

            <MenuBtn
                icons={question}
                active={isActive}
                text='Manage Questions'
                isSelected={selected === 'question'}
                onPress={() => {
                    setSelected('question');
                }}
                goTo={paths.question}
            />

            <MenuBtn
                icons={glossary}
                active={isActive}
                text='Manage Glossary'
                isSelected={selected === 'glossary'}
                onPress={() => {
                    setSelected('glossary');
                }}
                goTo={paths.glossary}
            />
            
            <MenuBtn
                icons={student}
                active={isActive}
                text='Manage Students'
                isSelected={selected === 'students'}
                onPress={() => {
                    setSelected('students');
                }}
                goTo={paths.students}
            />

            <MenuBtn
                icons={profile}
                active={isActive}
                text='Profile Settings'
                isSelected={selected === 'profile'}
                onPress={() => {
                    setSelected('profile');
                }}
                goTo={paths.profile}
            />

            
            <MenuBtn
                icons={account}
                active={isActive}
                text='Account Management'
                isSelected={selected === 'account'}
                onPress={() => {
                    setSelected('account');
                }}
                goTo={paths.account}
            />
            

            {!isActive ? (
                <MenuBtn
                    icons={logout}
                    active={isActive}
                    text='Logout'
                    onPress={confirmLogout}
                    goTo={paths.login}
                />
            ) : (
                <button className="btn btn-active btn-warning" onClick={handleLogout}>Sign out</button>
            )}

            <dialog id="logout_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Are you sure you want to sign out?</h3>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Cancel</button>
                        </form>
                        <button className="btn btn-warning" onClick={confirmLogout}>Sign out</button>
                    </div>
                </div>
            </dialog>
        </div>
    )
}
