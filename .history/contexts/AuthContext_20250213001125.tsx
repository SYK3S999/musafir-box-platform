"use client"

import React, { createContext, useState, useContext, useEffect } from "react"
import Cookies from "js-cookie"

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
    const storedUser = Cookies.get("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    let userData: User
    if (email.includes("admin")) {
      userData = { id: "admin1", name: "Admin User", email, role: "admin" }
    } else {
      userData = { id: "1", name: "John Doe", email, role: email.includes("agency") ? "agency" : "client" }
    }

    setUser(userData)
    Cookies.set("user", JSON.stringify(userData), { expires: 7 }) // Expires in 7 days
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    Cookies.remove("user")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
