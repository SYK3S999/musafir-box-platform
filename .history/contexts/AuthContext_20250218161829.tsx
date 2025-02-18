"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"

type User = {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  image?: string
  role: "client" | "agency" | "admin"
} | null

type AuthContextType = {
  user: User
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
    setTimeout(() => setIsLoading(false), 500) // Delays isLoading to avoid flicker
  }, [])
  

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
  
      await new Promise((resolve) => setTimeout(resolve, 1000))
  
      let userData: User
      if (email.includes("admin")) {
        userData = { id: "admin1", name: "Admin User", email, role: "admin" }
      } else {
        userData = { id: "1", name: "John Doe", email, role: email.includes("agency") ? "agency" : "client" }
      }
  
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

