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
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  isLoading: boolean
}

type RegisterData = {
  name: string
  email: string
  password: string
  phone?: string
  location?: string
  role: "client" | "agency"
  agency_name?: string
  license_number?: string
  agency_address?: string
  agency_description?: string
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
    // Check for stored auth token instead of user data
    const token = localStorage.getItem("authToken")
    if (token) {
      validateToken(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  const validateToken = async (token: string) => {
    try {
      const response = await fetch('/api/validate-token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        localStorage.setItem("authToken", token)
      } else {
        // If token is invalid, clear storage
        localStorage.removeItem("authToken")
        setUser(null)
      }
    } catch (error) {
      console.error("Token validation failed:", error)
      localStorage.removeItem("authToken")
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Registration failed')
      }

      const data = await response.json()
      
      // Automatically log in after successful registration
      await login(userData.email, userData.password)
      
      return data
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Login failed')
      }

      const data = await response.json()

      // Create user object from response
      const userData: User = {
        id: data.user_id.toString(),
        name: data.name || '',
        email: email,
        role: data.role as "client" | "agency" | "admin",
        // Add other user fields as needed
      }

      setUser(userData)
      
      // Store the auth token instead of user data
      if (data.token) {
        localStorage.setItem("authToken", data.token)
      }

      return data
    } finally {
      setIsLoading(false)
    }
  }
  
  const logout = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (token) {
        // Optional: Notify backend about logout
        await fetch('/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear local storage and state regardless of backend response
      localStorage.removeItem("authToken")
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}