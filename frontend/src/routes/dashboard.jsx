import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

export default function DashboardPage() {

  const [cruiseData, setCruiseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken()
        const response = await fetch('https://localhost:8080/api/get-cruises', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${token}`,
            // mode: 'cors',
          },
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const result = await response.json()
        setCruiseData(result)
        setLoading(false)
      } catch (err) {
        setError(err)
        setLoading(false)
      }
    }

    fetchData()
  }, [getToken]);

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

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
      <h1>Data from API:</h1>
      <p>{JSON.stringify(cruiseData, null, 2)}</p>
      <br/>
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
