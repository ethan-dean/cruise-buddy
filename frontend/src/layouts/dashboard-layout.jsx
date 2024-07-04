import { useEffect } from 'react'
import { useAuth } from "@clerk/clerk-react"
import { Outlet, useNavigate } from "react-router-dom"

import Loading from '/src/loading-module/loading'

export default function DashboardLayout() {
    const { userId, isLoaded } = useAuth()
    const navigate = useNavigate()

    // Send not signed-in users to sign-in page
    // Authorize user to see data that account requires
    useEffect(() => {
        if (isLoaded && !userId) {
            navigate("/sign-in")
        }
    }, [isLoaded])

    // Layouts returns outlet for children elements to fill in
    return (!isLoaded) ? (<Loading />) : (
        <Outlet />
    )
}