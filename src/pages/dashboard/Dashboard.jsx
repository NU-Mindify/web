import "../../css/dashboard/dashboard.css"
import logo from '../../assets/logo/logo.svg'

export default function Dashboard(){
    return(
        <>
            <div className="main-container-dashboard">

                <div className="searchbar-mindifylogo-container-dashboard">
                    
                    <div className="searchbar-container-dashboard">
                        <h1 className="text-black">placeholder for search bar</h1>
                    </div>

                    <div className="mindify-logo-container-dashboard">
                        <img className="mindify-logo-dashboard" src={logo}></img>
                    </div>

                </div>

                <div className="header-container-dashboard">
                
                    <h1 className="header-text-dashboard">Dashboard</h1>
                    <h2 className="header-greeting-dashboard">Hi, Suosuo. Welcome back to NU Mindify!</h2>
                
                </div>

                <div className="analytics-container-dashboard">
                    
                    <div className="analytics-properties-dashboard">

                    </div>

                    <div className="analytics-properties-dashboard">

                    </div>

                    <div className="analytics-properties-dashboard">

                    </div>

                    <div className="analytics-properties-dashboard">

                    </div>

                    <div className="analytics-properties-dashboard">

                    </div>
                
                </div>

                <div className="reports-title-container-dashboard">
                   
                   <h1 className="reports-title-properties-dashboard">Reports</h1>
               
                </div>

                <div className="reports-content-container-dashboard">
                    
                    <div className="total-students-container-dashboard">
                        <h1>test</h1>
                    </div>

                    <div className="badges-container-dashboard">

                    </div>

                    <div className="leaderboards-container-dashboard">

                    </div>
                
                </div>
            </div>
        </>
    )
}