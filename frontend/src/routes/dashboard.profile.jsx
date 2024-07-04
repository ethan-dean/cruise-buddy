import { Link } from "react-router-dom";
import { UserButton } from '@clerk/clerk-react'

export default function ProfilePage() {
  return (
    <>
      {/* TODO: Set UserButton opacity to 0.0, place gear icon above */}
      <UserButton className="user-button" afterSignOutUrl='/sign-in' />
      <img className="profile-settings-btn" src="/profile-settings.svg" alt="Settings Button" />
      <h1>Profile page</h1>
      <p>This is a protected page.</p>

      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
      </ul>
    </>
  );
}