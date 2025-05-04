import { useContext } from "react";
import "../../css/dashboard/dashboard.css";
import logo from "../../assets/logo/logo.svg";
import Chart from "chart.js/auto";
import { ActiveContext, UserLoggedInContext } from "../../contexts/Contexts";
import BarGraph from "../../components/barGraph/BarGraph";

export default function Dashboard() {
  const { currentWebUser } = useContext(UserLoggedInContext);
  // TODO: Loading screen
  if (!currentWebUser) {
    return;
  }
  const branch = currentWebUser.branch.toUpperCase();
  return (
    <div className="main-container-dashboard">
      <div className="dashboard-header">
        <h1 className="header-text-dashboard">Dashboard</h1>
        <h2 className="header-greeting-dashboard">
          Hi, {currentWebUser.firstName} {currentWebUser.lastName} from {branch}
          . Welcome back to NU Mindify!
        </h2>
      </div>

      <div className="analytics-container-dashboard">
        <div className="analytics-properties-dashboard">
          <h1 className="dashboard-title">Total Downloads Placeholder</h1>
        </div>

        <div className="analytics-properties-dashboard">
          <h1 className="dashboard-title">Total Students</h1>
        </div>
        <div className="analytics-properties-dashboard">
          <h1 className="dashboard-title">New Users Today Placeholder</h1>
        </div>
        <div className="analytics-properties-dashboard">
          <h1 className="dashboard-title">undecided</h1>
        </div>
        <div className="analytics-properties-dashboard">
          <h1 className="dashboard-title">undecided</h1>
        </div>
      </div>

      <div className="reports-title-container-dashboard">
        <h1 className="reports-title-properties-dashboard">Reports</h1>
      </div>

      <div className="reports-content-container-dashboard">
        <div className="total-students-container-dashboard">
          <BarGraph />
        </div>
        <div className="badges-container-dashboard">
          <h1 className="text-black">Badges Placeholder</h1>
        </div>
        <div className="leaderboards-container-dashboard">
          <h1 className="text-black">Leaderboards per Branch (only top 10) placeholder</h1>
        </div>
      </div>
    </div>
  );
}
