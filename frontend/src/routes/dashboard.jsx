import { Link } from "react-router-dom";

export default function DashboardPage() {

  const items =  [{ ID: 4253, name: "Icon of the Seas", date: "8/2/2024", company: "royal-caribbean"}, 
                  { ID: 8902, name: "Star of the Seas", date: "12/3/2024", company: "royal-caribbean"}, 
                  { ID: 6492, name: "Oasis of the Seas", date: "2/4/2025", company: "royal-caribbean"}, 
                  { ID: 1325, name: "Allure of the Seas", date: "5/7/2025", company: "royal-caribbean"}, 
                  { ID: 8907, name: "Harmony of the Seas", date: "6/3/2025", company: "royal-caribbean"}];

  const cruiseCards = items.map((item) =>
    <div key={item.ID} className="cruise-card">
      <img className="cruise-card-img" 
           src={"/" + item.company + ".png"} 
           alt={item.company + " logo"}>
      </img>
      <p className="cruise-card-name">{item.name}</p>
      <p className="cruise-card-date">{item.date}</p>
    </div>
  );

  return (
    <div>
      <div className="cruise-card-container">
        { cruiseCards }
      </div>
      
      <br></br>
      <hr></hr>
      <h1 className="dashboard-title">Dashboard page</h1>
      <p>This is a protected page.</p>
      <ul>
        <li><Link to="/dashboard/posts">Posts</Link></li>
      </ul>
    </div>
  );
}