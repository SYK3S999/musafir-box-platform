"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, MapPin, Calendar, Users, Package } from "lucide-react"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

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

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const router = useRouter()

  const loadBookings = () => {
    const savedBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    console.log("Bookings loaded from localStorage:", savedBookings)
    setBookings(savedBookings)
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const handleViewBooking = (bookingId: string) => {
    const selectedBooking = bookings.find(b => b.id === bookingId)
    if (selectedBooking) {
      sessionStorage.setItem("selectedBooking", JSON.stringify(selectedBooking))
      router.push(`/client/bookings/${bookingId}`)
    }
  }

  const handleRefresh = () => {
    loadBookings()
  }

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Your Bookings
            </h1>
            <div className="flex items-center justify-center gap-3">
              <Package className="w-5 h-5 text-primary" />
              <p className="text-lg text-muted-foreground">
                {bookings.length} {bookings.length === 1 ? 'trip' : 'trips'} planned
              </p>
            </div>
            <Button onClick={handleRefresh} variant="outline">Refresh Bookings</Button>
          </div>

          <div className="grid gap-8 animate-fade-in">
            {bookings.map((booking) => (
              <Card 
                key={booking.id} 
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">{booking.offer.title}</h2>
                    <p className="text-sm text-muted-foreground">Booking ID: #{booking.id}</p>
                  </div>
                  <div className="px-2 py-1 border border-gray-300 rounded text-sm">
                    {booking.status}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
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
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between items-center pt-4 border-t">
                  <Button
                    variant="ghost"
                    className="text-primary hover:text-primary/80 hover:bg-primary/5 transition-colors group"
                    onClick={() => handleViewBooking(booking.id)}
                  >
                    View booking details
                    <span className="ml-2 transform transition-transform group-hover:translate-x-1">→</span>
                  </Button>
                  
                  {booking.status === "Confirmed" && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Trip Confirmed</span>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {bookings.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
              <p className="text-muted-foreground">
                Start planning your next adventure today!
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}