"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type React from "react" // Added import for React

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ("client" | "agency")[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      router.push("/")
    }
  }, [user, isLoading, router, allowedRoles])

  if (isLoading || !user) {
    return <div>Loading...</div>
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}

