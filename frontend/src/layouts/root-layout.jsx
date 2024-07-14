import { Link, Outlet, useNavigate } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

export default function RootLayout() {
  const navigate = useNavigate()

  // Create the header and return outlet for children
  return (
    <ClerkProvider
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      publishableKey={PUBLISHABLE_KEY}
    >

      <header className="header">
        <SignedOut>
          <div>
            <Link className="logo" to="/" >Cruise Connect</Link>
          </div>
          <div className="header-options-container">
            <Link className="sign-in-btn" to="/sign-in">Sign In</Link>
            <Link className="sign-up-btn" to="/sign-up">Sign Up</Link>
          </div>
        </SignedOut>

        <SignedIn>
          <div>
              <Link className="logo" to="/dashboard" >Cruise Connect</Link>
          </div>
          <div className="header-options-container">
              <Link className="dashboard-btn" to="/dashboard">Dashboard</Link>
              <Link to="/dashboard/profile">Profile</Link>
          </div>
        </SignedIn>
      </header>

      <main className="main">
        <Outlet />
      </main>

    </ClerkProvider>
  )
}