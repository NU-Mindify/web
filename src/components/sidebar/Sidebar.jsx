import { useContext } from "react"
import { ActiveContext } from "../../contexts/Contexts"
import MenuBtn from "./MenuBtn"
import hamburger from '../../assets/hamburger.png'
import halfburger from '../../assets/halfburger.png'



import home from '../../assets/home.png'
import analytics from '../../assets/analytic.png'
import reports from '../../assets/report.png'
import leaderboard from '../../assets/leaderboard.png'
import question from '../../assets/question.png'
import glossary from '../../assets/glossary.png'
import student from '../../assets/student.png'
import profile from '../../assets/profile.png'
import account from '../../assets/account.png'



export default function Sidebar() {
    const { isActive, setActive, selected, setSelected } = useContext(ActiveContext)

    const paths = {
        dashboard: '/',
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

    return (
        <div className={isActive ? 'active-side-menu' : 'side-menu'}>
            <button className={'btn-icon'} onClick={handleSideMenu}>
                <img src={isActive ? halfburger : hamburger} className="mainIcon" alt="menu" />
            </button>

            {isActive && 
            <>
                <div className="avatar">
                    <div className="avatar-container">
                        <img src="https://avatarfiles.alphacoders.com/375/375159.jpeg" />
                    </div>
                </div>
                
                <div className="name-container">
                    <h1 className="user-name">Suosuo Frieren</h1>
                    <h5 className="user-email">virgojl@students.nu-moa.edu.ph</h5>
                </div>
            </>
                

                
            }
            

            <MenuBtn 
                icons={home}
                active={isActive}
                text='Dashboard'
                isSelected={selected === 'dashboard'}
                onPress={() => setSelected('dashboard')}
                goTo={paths.dashboard}
            />
            
            <MenuBtn
                icons={analytics}
                active={isActive}
                text='Analytics'
                isSelected={selected === 'analytics'}
                onPress={() => setSelected('analytics')}
                goTo={paths.analytics}
            />

            <MenuBtn
                icons={reports}
                active={isActive}
                text='Reports'
                isSelected={selected === 'reports'}
                onPress={() => setSelected('reports')}
                goTo={paths.reports}
            />

            <MenuBtn
                icons={leaderboard}
                active={isActive}
                text='Leaderboard'
                isSelected={selected === 'leaderboard'}
                onPress={() => setSelected('leaderboard')}
                goTo={paths.leaderboard}
            />

            <MenuBtn
                icons={question}
                active={isActive}
                text='Manage Questions'
                isSelected={selected === 'question'}
                onPress={() => setSelected('question')}
                goTo={paths.question}
            />

            <MenuBtn
                icons={glossary}
                active={isActive}
                text='Manage Glossary'
                isSelected={selected === 'glossary'}
                onPress={() => setSelected('glossary')}
                goTo={paths.glossary}
            />
            
            <MenuBtn
                icons={student}
                active={isActive}
                text='Manage Students'
                isSelected={selected === 'students'}
                onPress={() => setSelected('students')}
                goTo={paths.students}
            />

            <MenuBtn
                icons={profile}
                active={isActive}
                text='Profile Settings'
                isSelected={selected === 'profile'}
                onPress={() => setSelected('profile')}
                goTo={paths.profile}
            />

            
            <MenuBtn
                icons={account}
                active={isActive}
                text='Account Management'
                isSelected={selected === 'account'}
                onPress={() => setSelected('account')}
                goTo={paths.account}
            />
        </div>
    )
}
