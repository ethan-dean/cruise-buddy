import { Link } from "react-router-dom";

export default function PostsPage() {
  return (
    <>
      <h1>Posts page</h1>
      <p>This is a protected page.</p>

      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
      </ul>
    </>
  );
}