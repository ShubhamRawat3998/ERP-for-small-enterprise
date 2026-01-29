import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer} from "recharts";
const data=[
    {month:'Jan',sales:50000},
    {month:'Feb',sales:60000},
    {month:'Mar',sales:55000},
    {month:'Apr',sales:70000},
    {month:'May',sales:80000},
    {month:'Jun',sales:75000},
    {month:'Jul',sales:90000},
    {month:'Aug',sales:85000},
    {month:'Sep',sales:95000},
    {month:'Oct',sales:100000},
    {month:'Nov',sales:75000},
    {month:'Dec',sales:80000},
];
function SalesChart(){
    return(
        <div className="chart-card">
            <h2 className="chart-title">Monthly Sales</h2>
            <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="month"/>
                <YAxis/>
                <Tooltip/>
                <Line type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={3} />
            </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
export default SalesChart;