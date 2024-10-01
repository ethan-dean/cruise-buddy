import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

export default function PostsPage() {

  const [usersData, setUsersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken()
        const response = await fetch('https://localhost:8080/api/get-users', {
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
        setUsersData(result)
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

  const userCards = usersData.map((user, index) =>
    <div key={index} className="cruise-card">
      <img className="cruise-card-img" 
           src={"/" + user.id + ".png"} 
           alt={user.fistname + " " + user.lastname + " profile picture"}>
      </img>
      <p className="user-card-name">{user.fistname + " " + user.lastname}</p>
      <p className="user-card-id">{user.id}</p>
    </div>
  );
  console.log(userCards);

  return (
    <>
      <h1>Posts page</h1>
      
      <p>{ userCards }</p>

      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
      </ul>
    </>
  );
}