import { useContext, useEffect } from 'react';
import "../../css/dashboard/dashboard.css";
import logo from '../../assets/logo/logo.svg';
import Chart from 'chart.js/auto';
import { ActiveContext } from '../../contexts/Contexts';
import BarGraph from '../../components/barGraph/BarGraph';


export default function Dashboard() {

  const { currentUserBranch ,currentUserEmail } = useContext(ActiveContext)

  return (
    <div className="main-container-dashboard">
      <div className="dashboard-header">
        <div className="search-container">
          <div className="searchbar"></div>
          <div className="header-message">
            <h1 className="header-text-dashboard">Dashboard</h1>
            <h2 className="header-greeting-dashboard">
              Hi, {currentUserEmail} from {currentUserBranch}. Welcome back to NU Mindify!
            </h2>
          </div>
        </div>
        <div className="logo-container-dashboard">
          <img className="mindify-logo-dashboard" src={logo} alt="NU Mindify Logo" />
        </div>
      </div>

      <div className="analytics-container-dashboard">
        
        <div className="analytics-properties-dashboard">
          <h1 className='dashboard-title'>Abnormal Psychology</h1>
          <p className='dashboard-sub-title'>World 1</p>
          <progress value={50} max={100} className='dashboard-progress-bar rounded-full' />
          <div className='analytics-percent'>
            <p className='dashboard-sub-title'>Mastery</p>
            <p className='dashboard-sub-title'>90%</p>
          </div>
        </div>

        <div className="analytics-properties-dashboard"></div>
        <div className="analytics-properties-dashboard"></div>
        <div className="analytics-properties-dashboard"></div>
        <div className="analytics-properties-dashboard"></div>
      </div>

      <div className="reports-title-container-dashboard">
        <h1 className="reports-title-properties-dashboard">Reports</h1>
      </div>

      <div className="reports-content-container-dashboard">
        <div className="total-students-container-dashboard">
          <BarGraph />
        </div>
        <div className="badges-container-dashboard"></div>
        <div className="leaderboards-container-dashboard"></div>
      </div>
    </div>
  );
}
