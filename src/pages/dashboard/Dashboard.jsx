import "../../css/dashboard/dashboard.css"
import logo from '../../assets/logo/logo.svg'

export default function Dashboard(){
    return(
        <>
            <div className="main-container-dashboard">

                <div className="dashboard-header">
                    
                    <div className="search-container">
                        <div className="searchbar"></div>

                        <div className="header-message">
                            <h1 className="header-text-dashboard">Dashboard</h1>
                            <h2 className="header-greeting-dashboard">Hi, Suosuo. Welcome back to NU Mindify!</h2>
                        </div> 
                    </div>
                    
                    <div className="logo-container-dashboard">
                        <img className="mindify-logo-dashboard" src={logo}></img>
                    </div>

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