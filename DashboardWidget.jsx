function DashboardWidget(){
    const card=[
        {title:"Total Product",value:1500,icon:"📦",color:"#e3f2fd"},
        {title:"Total Sales",value:7500,icon:"💰",color:"#f3e5f5"},
        {title:"Total Customers",value:1200,icon:"🧑‍🤝‍🧑",color:"#e8f5e9"},
        {title:"Total Orders",value:3200,icon:"🛒",color:"#fff3e0"}
    ];
    return(
        <div className="widgets-container">
        {card.map((c)=>(
            <div key={c.title} className="widget-card"
            style={{backgroundColor:c.color}}>
                <div className="widget-icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <h2>{c.value}</h2>
            </div>
        ))}
        </div>
    );
}
export default DashboardWidget;