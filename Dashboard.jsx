import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer} from "recharts"
import DashboardWidget from "../components/DashboardWidget.jsx";
import SalesChart from "../components/saleschart.jsx";
import InventoryChart from "../components/InventoryChart.jsx";
import LowStocktable from "../components/LowStocktable.jsx";
import '../components/Dashboard.css';
function Dashboard(){
    return(
    <div className="dashboard-container">
        <h1>AI Powerd ERP</h1>
    <DashboardWidget/>
    <div className="charts-row">
    <SalesChart/>
    <InventoryChart/>
    </div>
    <LowStocktable/>
    </div>
    );
}
export default Dashboard;
