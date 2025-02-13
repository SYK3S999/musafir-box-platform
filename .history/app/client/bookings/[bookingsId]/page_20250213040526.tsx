"use client"

import { useParams } from "next/navigation"
import { CheckCircle2, MapPin, Calendar, Users } from "lucide-react"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useState, useEffect } from "react"

export default function SingleBookingPage() {
  const params = useParams()
  const bookingId = params.bookingId

  const [booking, setBooking] = useState<any>(null)

  useEffect(() => {
    const bookings = JSON.parse(localStorage.getItem("client/bookings") || "[]")
    const foundBooking = bookings.find((b: any) => String(b.id) === bookingId)
    setBooking(foundBooking)
  }, [bookingId])

  if (!booking) {
    return (
      <ProtectedRoute allowedRoles={["client"]}>
        <div className="container mx-auto px-4 py-8 max-w-6xl text-center">
          <p>Loading booking details...</p>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {booking.offer.title}
          </h1>
          <p className="text-muted-foreground">
            Booking ID: {booking.id}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Trip Details</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium">Destination</p>
                    <p className="text-muted-foreground">{booking.offer.destination}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium">Travel Date</p>
                    <p className="text-muted-foreground">
                      {booking.details.travelDate?.toLocaleDateString() || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Booking Info</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium">Travelers</p>
                    <p className="text-muted-foreground">{booking.details.travelers}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium">Status</p>
                    <p className="text-muted-foreground">{booking.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-bold mb-4">Special Requests</h3>
            <p className="text-muted-foreground">
              {booking.details.specialRequests || "No special requests"}
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}