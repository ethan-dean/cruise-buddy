import React, { useEffect } from 'react'
import { useAuth } from "@clerk/clerk-react"
import { useNavigate } from 'react-router-dom'
import Loading from '../loading-module/loading';

export default function HomePage() {
  const { isLoaded, isSignedIn } = useAuth()
  const navigate = useNavigate();

  useEffect(() => {
      if (isSignedIn) {
        navigate('/dashboard')
      }
    }, [isSignedIn, navigate])

  return (!isLoaded) ? <Loading /> : (
    <div>
      <h1>This is the home page</h1>
    </div>
  )
}