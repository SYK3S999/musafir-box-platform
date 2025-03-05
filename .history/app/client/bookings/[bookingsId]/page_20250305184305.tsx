"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, MapPin, Calendar, Users, Package } from "lucide-react"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter, useParams } from "next/navigation"

type Booking = {
  id: string
  status: string
  offer: {
    title: string
    category: string
    destination: string
  }
  details: {
    travelers: number
    travelDate: string
    specialRequests?: string
  }
}

export default function BookingDetailPage() {
  const [booking, setBooking] = useState<Booking | null>(null)
  const router = useRouter()
  const { bookingId } = useParams() // Get the bookingId from the URL

  useEffect(() => {
    const loadBooking = () => {
      // Try to get the booking from sessionStorage first (from Bookings list page)
      const sessionBooking = sessionStorage.getItem("selectedBooking")
      if (sessionBooking) {
        const parsedBooking = JSON.parse(sessionBooking)
        if (parsedBooking.id === bookingId) {
          setBooking(parsedBooking)
          return
        }
      }

      // Fallback to localStorage if not found in sessionStorage
      const savedBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
      const foundBooking = savedBookings.find((b: Booking) => b.id === bookingId)
      setBooking(foundBooking || null)
    }

    if (bookingId) {
      loadBooking()
    }
  }, [bookingId])

  const handleBackToBookings = () => {
    router.push("/client/bookings")
  }

  if (!booking) {
    return (
      <ProtectedRoute allowedRoles={["client"]}>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 py-12 max-w-6xl text-center">
            <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
            <p className="text-muted-foreground mb-6">The booking with ID #{bookingId} could not be found.</p>
            <Button onClick={handleBackToBookings}>Back to Bookings</Button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <Card>
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold tracking-tight">{booking.offer.title}</h1>
                  <p className="text-sm text-muted-foreground">Booking ID: #{booking.id}</p>
                </div>
                <div className="px-2 py-1 border border-gray-300 rounded text-sm">
                  {booking.status}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3 bg-primary/5 p-3 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Destination</p>
                    <p className="text-sm text-muted-foreground">{booking.offer.destination}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-primary/5 p-3 rounded-lg">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Group Size</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.details.travelers} {booking.details.travelers === 1 ? 'traveler' : 'travelers'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-primary/5 p-3 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Travel Date</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.details.travelDate 
                        ? new Date(booking.details.travelDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : "Date not set"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-primary/5 p-3 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-sm text-muted-foreground">{booking.status}</p>
                  </div>
                </div>
              </div>

              {booking.details.specialRequests && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Special Requests</h3>
                  <p className="text-sm text-muted-foreground bg-primary/5 p-3 rounded-lg">
                    {booking.details.specialRequests}
                  </p>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between items-center pt-4 border-t">
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 hover:bg-primary/5"
                onClick={handleBackToBookings}
              >
                Back to Bookings
              </Button>
              {booking.status === "Confirmed" && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Trip Confirmed</span>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}