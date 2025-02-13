"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle2, MapPin, Calendar, Users } from "lucide-react"
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    setBookings(savedBookings)
  }, [])

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Your Bookings
          </h1>
          <p className="text-muted-foreground">
            {bookings.length} upcoming trips
          </p>
        </div>

        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{booking.offer.title}</h2>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  booking.status === "Pending" 
                    ? "bg-yellow-100 text-yellow-800" 
                    : "bg-green-100 text-green-800"
                }`}>
                  {booking.status}
                </span>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{booking.offer.category} trip</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>{booking.details.travelers} travelers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>
                    {booking.details.travelDate ? new Date(booking.details.travelDate).toLocaleDateString() : "Date not set"}
                  </span>
                </div>
              </div>

              <div className="mt-4 border-t pt-4">
                <Link 
                  href={`/client/bookings/${booking.id}`} // Use absolute path
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  View booking details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  )
}