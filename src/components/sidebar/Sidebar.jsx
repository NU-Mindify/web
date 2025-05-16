import { useContext } from "react"
import { ActiveContext } from "../../contexts/Contexts"
import MenuBtn from "./MenuBtn"
import hamburger from '../../assets/sidebar/hamburger.svg'
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
import { useLocation, useNavigate } from "react-router"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../Constants';
import close from '../../assets/sidebar/close.svg'




import { UserLoggedInContext } from "../../contexts/Contexts"

import { getAuth, signOut } from "firebase/auth"


export default function Sidebar() {
     const {
        isActive, setActive,
        selected, setSelected,
        subSelected, setSubSelected
    } = useContext(ActiveContext);

    const {
        currentWebUser, setCurrentWebUser,
        currentWebUserUID, setCurrentWebUserUID,
        isAdmin, setIsAdmin,
    } = useContext(UserLoggedInContext);

    const navigate = useNavigate();
    const location = useLocation();

    const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
    const [activeQuestion, setActiveQuestion] = useState(false);
    

    
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1025);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    useEffect(() => {
        if (currentWebUser?.position?.toLowerCase() === 'accounts admin') {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, [currentWebUser, setIsAdmin]);
    
    
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

    useEffect(() => {
        const pathToKeyMap = {
          '/dashboard': 'dashboard',
          '/analytics': 'analytics',
          '/reports': 'reports',
          '/leaderboard': 'leaderboard',
          '/question': 'question',
          '/glossary': 'glossary',
          '/students': 'students',
          '/profile': 'profile',
          '/account': 'account',
        };
      
        const currentKey = pathToKeyMap[location.pathname];
        if (currentKey) {
          setSelected(currentKey);
        }
      }, [location.pathname, setSelected]);

      const currentPath = window.location.pathname

      console.log('The current path is' + currentPath);
      
        
    //   useEffect(() => {
    //     if (location.pathname === '/' && currentWebUserUID) {
    //       navigate('/dashboard');
    //     }
    //   }, [location.pathname, currentWebUserUID, navigate]);
      
      
    


    const handleSideMenu = () => {
        setActive((prev) => !prev)
    }

    const handleLogout = () => {
        document.getElementById('logout_modal')?.showModal();
    }

    const confirmLogout = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            setCurrentWebUser(null);
            setCurrentWebUserUID(null);
            localStorage.removeItem('webUser');
            localStorage.removeItem('userUID');
            document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            setSelected('login');
            setActive(false);
            navigate('/');
        }).catch((error) => {
            console.log(error);
        });
    };

    useEffect(() => {
        if (currentWebUser?.position?.toLowerCase() === 'accounts admin') {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, [currentWebUser, setIsAdmin]);
    
      


    useEffect(() => {
        const uid = currentWebUserUID;
    
        if (!uid) return;
    
        axios
            .get(`${API_URL}/getwebuser/${uid}`)
            .then((response) => {
                setCurrentWebUser(response.data);
                
                localStorage.setItem('webUser', JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log("Error fetching sidebar user:", error);
            });
    }, [currentWebUserUID]);
    

    return (
        <div className={isActive ? 'active-side-menu' : 'side-menu'}>
            <button className='btn-icon' onClick={handleSideMenu}>
                <img src={isActive ? close : hamburger} className="mainIcon" alt="menu" />
            </button>
    
            {isActive && (
                <>
                    <div className="avatar">
                        <div className="avatar-container">
                            <div className="avatar-padding">
                                <img src={currentWebUser.useravatar} alt="avatar" className="avatar-img" />
                            </div>
                        </div>
                    </div>
                    <div className="name-container">
                        <h1 className="user-name">{currentWebUser.firstName} {currentWebUser.lastName}</h1>
                    </div>
                </>
            )}
            <div className="menu-list-container">
                <ul className="menu-list">
                    <li>
                        <MenuBtn
                            icons={dashboard}
                            active={isActive}
                            text='Dashboard'
                            isSelected={['/dashboard', "/"].includes(currentPath)}
                            onPress={() => {
                                setSelected('dashboard');
                                setSubSelected('');
                                setActiveQuestion(false);
                                {isMobile ? setActive(false) : ''}
                            }}
                            goTo={paths.dashboard}
                        />
                    </li>
                    <li>
                        <MenuBtn
                            icons={analytics}
                            active={isActive}
                            text='Analytics'
                            isSelected={['/analytics'].includes(currentPath)}
                            onPress={() => {
                                setSelected('analytics');
                                setSubSelected('');
                                setActiveQuestion(false);
                                {isMobile ? setActive(false) : ''}
                            }}
                            goTo={paths.analytics}
                        />
                    </li>
                    <li>
                        <MenuBtn
                            icons={reports}
                            active={isActive}
                            text='Reports'
                            isSelected={selected === 'reports'}
                            onPress={() => {
                                setSelected('reports');
                                setSubSelected('');
                                setActiveQuestion(false);
                                {isMobile ? setActive(false) : ''}
                            }}
                            goTo={paths.reports}
                        />
                    </li>
                    <li>
                        <MenuBtn
                            icons={leaderboard}
                            active={isActive}
                            text='Leaderboard'
                            isSelected={selected === 'leaderboard'}
                            onPress={() => {
                                setSelected('leaderboard');
                                setSubSelected('');
                                setActiveQuestion(false);
                                {isMobile ? setActive(false) : ''}
                            }}
                            goTo={paths.leaderboard}
                        />
                    </li>
                    <li>
                        <MenuBtn
                            icons={question}
                            active={isActive}
                            text='Manage Questions'
                            isSelected={selected === 'question'}
                            onPress={() => {
                                setSelected('question');
                                setActiveQuestion(!activeQuestion);
                                {isMobile ? setActive(false) : ''}
                            }}
                            
                            goTo={paths.question}
                        />
                        {selected === 'question' && isActive && activeQuestion ? 
                            <ul className="question-category-container">
                                <li>
                                    <div className={`${subSelected === 'abnormal' ? 'active-sub-selected' : 'active-sub-btn-container'}`}>
                                    <button 
                                        className={'active-btn-icon'}
                                        onClick={() => {
                                            navigate("/question", {
                                            state: {
                                                category: 'abnormal',
                                                categoryName: 'Abnormal Psychology',
                                                catSelected: true
                                            }
                                            });
                                            setSelected('question');
                                            setSubSelected('abnormal');;
                                        }}
                                        >
                                        <h1 className='active-btn-txt'>Abnormal Psychology</h1>
                                        </button>
                                    </div>
                                </li>

                                <li>
                                    <div 
                                        className={`${subSelected === 'developmental' ? 'active-sub-selected' : 'active-sub-btn-container'}`}
                                        
                                    >
                                        <button 
                                            className={'active-btn-icon'}
                                            onClick={() => {
                                                navigate("/question", {
                                                state: {
                                                    category: 'developmental',
                                                    categoryName: 'Developmental Psychology',
                                                    catSelected: true
                                                }
                                                });
                                                setSelected('question');
                                                setSubSelected('developmental');
                                            }}
                                        >
                                            <h1 className='active-btn-txt'>Developmental Psychology</h1>
                                        </button>
                                    </div>
                                </li>

                                <li>
                                    <div className={`${subSelected === 'psychological' ? 'active-sub-selected' : 'active-sub-btn-container'}`}>
                                        <button 
                                            className="active-btn-icon"
                                            onClick={() => {
                                                navigate("/question", {
                                                state: {
                                                    category: 'psychological',
                                                    categoryName: 'Psychological Assessment',
                                                    catSelected: true
                                                }
                                                });
                                                setSelected('question');
                                                setSubSelected('psychological');
                                            }}
                                        >
                                            <h1 className='active-btn-txt'>Psychological Assessment</h1>
                                        </button>
                                    </div>
                                </li>

                                <li>
                                    <div className={`${subSelected === 'industrial' ? 'active-sub-selected' : 'active-sub-btn-container'}`}>
                                        <button 
                                            className={'active-btn-icon'}
                                            onClick={() => {
                                                navigate("/question", {
                                                state: {
                                                    category: 'industrial',
                                                    categoryName: 'Industrial Psychology',
                                                    catSelected: true
                                                }
                                                });
                                                setSelected('question');
                                                setSubSelected('industrial');
                                            }}
                                        >
                                            <h1 className='active-btn-txt'>Industrial Psychology</h1>
                                        </button>
                                    </div>
                                </li>

                                <li>
                                    <div className={`${subSelected === 'general' ? 'active-sub-selected' : 'active-sub-btn-container'}`}>
                                        <button 
                                            className={'active-btn-icon'}
                                            onClick={() => {
                                                navigate("/question", {
                                                state: {
                                                    category: 'general',
                                                    categoryName: 'General Psychology',
                                                    catSelected: true
                                                }
                                                });
                                                setSelected('question');
                                                setSubSelected('general');
                                            }}
                                        >
                                            <h1 className='active-btn-txt'>General Psychology</h1>
                                        </button>
                                    </div>
                                </li>
                                
                            </ul>
                            : ""
                        }
                        
                    </li>
                    <li>
                        <MenuBtn
                            icons={glossary}
                            active={isActive}
                            text='Manage Glossary'
                            isSelected={selected === 'glossary'}
                            onPress={() => {
                                setSelected('glossary');
                                setSubSelected('');
                                setActiveQuestion(false);
                                {isMobile ? setActive(false) : ''}
                            }}
                            goTo={paths.glossary}
                        />
                    </li>
                    <li>
                        <MenuBtn
                            icons={student}
                            active={isActive}
                            text='View Students'
                            isSelected={selected === 'students'}
                            onPress={() => {
                                setSelected('students');
                                setSubSelected('');
                                setActiveQuestion(false);
                                {isMobile ? setActive(false) : ''}
                            }}
                            goTo={paths.students}
                        />
                    </li>
                    <li>
                        <MenuBtn
                            icons={profile}
                            active={isActive}
                            text='Profile Settings'
                            isSelected={selected === 'profile'}
                            onPress={() => {
                                setSelected('profile');
                                setSubSelected('');
                                setActiveQuestion(false);
                                {isMobile ? setActive(false) : ''}
                            }}
                            goTo={paths.profile}
                        />
                    </li>
                    {isAdmin ? 
                        <li>
                            <MenuBtn
                                icons={account}
                                active={isActive}
                                text='Account Management'
                                isSelected={selected === 'account'}
                                onPress={() => {
                                    setSelected('account');
                                    setSubSelected('');
                                    setActiveQuestion(false);
                                    {isMobile ? setActive(false) : ''}
                                }}
                                goTo={paths.account}
                            />
                        </li>
                        :
                        ""
                    }
                    
                    <li>
                        {!isActive ? (
                            <MenuBtn
                                icons={logout}
                                active={isActive}
                                text='Logout'
                                onPress={handleLogout}
                            />
                        ) : (
                            <button className="btn btn-active btn-warning w-full flex items-center justify-center py-2 rounded-lg" 
                            onClick={handleLogout}>Sign out</button>
                        )}
                    </li>
                </ul>
            </div>
    
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
    );
    
}
