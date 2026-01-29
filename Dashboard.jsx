import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer} from "recharts"
import DashboardWidget from "./DashboardWidget.jsx";
import SalesChart from "./saleschart.jsx";
import InventoryChart from "./InventoryChart.jsx";
import LowStocktable from "./LowStocktable.jsx";
import '../components/Dashboard.css';
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
function Dashboard(){
    const navigate=useNavigate();
    useEffect(()=>{
    const token=sessionStorage.getItem("token");
    if(!token){
        navigate("/");
    }
    },[navigate]);
    // logout handler
    const handleLogout=()=>{
        sessionStorage.removeItem("token");
        navigate("/");
    };
    return(
    <div className="dashboard-container">
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
