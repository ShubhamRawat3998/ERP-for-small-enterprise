import {PieChart,Pie,Cell,Tooltip,Legend,ResponsiveContainer} from "recharts";
import "./Dashboard.css";
const data=[
    {name:'mobiles', value:4000},
    {name:'laptops',value:3000},
    {name:'accessories',value:2000},
    {name:'refrigerators',value:5000},
];
const colors=["#FF6B6B","#4ECDC4","#45B7D1","#FFA07A"];
function InventoryChart(){
    return(
        <div className="chart-card">
        <h2 className="chart-title">Inventory Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={data} dataKey="value" outerRadius={90} label>
                    {data.map((_,i)=>(
                        <Cell key={i} fill={colors[i]}/>
                    ))}
                </Pie>
                <Tooltip/>
                <Legend/>
            </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
export default InventoryChart;