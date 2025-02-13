"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Booking = {
  id: number
  user: string
  destination: string
  date: string
  amount: string
  status: "pending" | "confirmed" | "cancelled"
}

type Offer = {
  id: number
  title: string
  destination: string
  price: number
  duration: string
  status: "active" | "inactive"
}

type User = {
  id: number
  name: string
  email: string
  role: "client" | "agency" | "admin"
  status: "active" | "inactive"
}

type Agency = {
  id: number
  name: string
  email: string
  status: "Pending" | "Approved" | "Rejected"
  documents: string[]
}

type AdminContextType = {
  bookings: Booking[]
  offers: Offer[]
  users: User[]
  agencies: Agency[]
  addBooking: (booking: Omit<Booking, "id">) => void
  updateBooking: (id: number, updates: Partial<Booking>) => void
  deleteBooking: (id: number) => void
  addOffer: (offer: Omit<Offer, "id">) => void
  updateOffer: (id: number, updates: Partial<Offer>) => void
  deleteOffer: (id: number) => void
  addUser: (user: Omit<User, "id">) => void
  updateUser: (id: number, updates: Partial<User>) => void
  deleteUser: (id: number) => void
  addAgency: (agency: Omit<Agency, "id">) => void
  updateAgency: (id: number, updates: Partial<Agency>) => void
  deleteAgency: (id: number) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [agencies, setAgencies] = useState<Agency[]>([])

  useEffect(() => {
    // Simulate fetching initial data
    setBookings([
      { id: 1, user: "Alice Johnson", destination: "Paris", date: "2023-07-15", amount: "$1,200", status: "confirmed" },
      { id: 2, user: "Charlie Brown", destination: "Tokyo", date: "2023-08-01", amount: "$2,500", status: "pending" },
      { id: 3, user: "David Lee", destination: "New York", date: "2023-07-22", amount: "$1,800", status: "cancelled" },
    ])
    setOffers([
      { id: 1, title: "Paris Getaway", destination: "Paris", price: 1200, duration: "5 days", status: "active" },
      { id: 2, title: "Tokyo Adventure", destination: "Tokyo", price: 2500, duration: "7 days", status: "active" },
      {
        id: 3,
        title: "New York City Tour",
        destination: "New York",
        price: 1800,
        duration: "4 days",
        status: "inactive",
      },
    ])
    setUsers([
      { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "client", status: "active" },
      { id: 2, name: "Bob Smith", email: "bob@example.com", role: "agency", status: "active" },
      { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "client", status: "inactive" },
    ])
    setAgencies([
      {
        id: 1,
        name: "Global Explorers",
        email: "info@globalexplorers.com",
        status: "Pending",
        documents: ["business_license.pdf", "insurance_certificate.pdf"],
      },
      {
        id: 2,
        name: "Adventure Time",
        email: "hello@adventuretime.com",
        status: "Pending",
        documents: ["company_profile.pdf", "travel_license.pdf"],
      },
      {
        id: 3,
        name: "Wanderlust Travels",
        email: "info@wanderlusttravels.com",
        status: "Approved",
        documents: ["agency_certificate.pdf"],
      },
    ])
  }, [])

  const addBooking = (booking: Omit<Booking, "id">) => {
    setBookings((prev) => [...prev, { ...booking, id: prev.length + 1 }])
  }

  const updateBooking = (id: number, updates: Partial<Booking>) => {
    setBookings((prev) => prev.map((booking) => (booking.id === id ? { ...booking, ...updates } : booking)))
  }

  const deleteBooking = (id: number) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== id))
  }

  const addOffer = (offer: Omit<Offer, "id">) => {
    setOffers((prev) => [...prev, { ...offer, id: prev.length + 1 }])
  }

  const updateOffer = (id: number, updates: Partial<Offer>) => {
    setOffers((prev) => prev.map((offer) => (offer.id === id ? { ...offer, ...updates } : offer)))
  }

  const deleteOffer = (id: number) => {
    setOffers((prev) => prev.filter((offer) => offer.id !== id))
  }

  const addUser = (user: Omit<User, "id">) => {
    setUsers((prev) => [...prev, { ...user, id: prev.length + 1 }])
  }

  const updateUser = (id: number, updates: Partial<User>) => {
    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, ...updates } : user)))
  }

  const deleteUser = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id))
  }

  const addAgency = (agency: Omit<Agency, "id">) => {
    setAgencies((prev) => [...prev, { ...agency, id: prev.length + 1 }])
  }

  const updateAgency = (id: number, updates: Partial<Agency>) => {
    setAgencies((prev) => prev.map((agency) => (agency.id === id ? { ...agency, ...updates } : agency)))
  }

  const deleteAgency = (id: number) => {
    setAgencies((prev) => prev.filter((agency) => agency.id !== id))
  }

  return (
    <AdminContext.Provider
      value={{
        bookings,
        offers,
        users,
        agencies,
        addBooking,
        updateBooking,
        deleteBooking,
        addOffer,
        updateOffer,
        deleteOffer,
        addUser,
        updateUser,
        deleteUser,
        addAgency,
        updateAgency,
        deleteAgency,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

