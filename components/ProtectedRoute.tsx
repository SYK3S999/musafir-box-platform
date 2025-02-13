"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type React from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ("client" | "agency" | "admin")[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login")
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.push("/")
      }
    }
  }, [user, isLoading, router, allowedRoles])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null
  }

  return <>{children}</>
}

