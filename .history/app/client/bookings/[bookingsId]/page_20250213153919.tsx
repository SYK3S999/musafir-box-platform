"use client"

import { useParams, useRouter } from "next/navigation"
import { CheckCircle2, MapPin, Calendar, Users, Plane, Tag, Clock } from "lucide-react"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SingleBookingPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.bookingsId ? String(params.bookingsId) : null
  interface Booking {
    id: string;
    status: string;
    offer?: {
      title: string;
    };
    details?: {
      travelDate?: string;
      travelers?: number;
      specialRequests?: string;
    };
  }

  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const selectedBooking = sessionStorage.getItem("selectedBooking")
    if (selectedBooking) {
      const parsedBooking = JSON.parse(selectedBooking)
      if (String(parsedBooking.id) === bookingId) {
        setBooking(parsedBooking)
        setLoading(false)
        return
      }
    }

    const storedBookings = localStorage.getItem("bookings")
    const bookings = JSON.parse(storedBookings || "[]")
    const foundBooking = bookings.find((b: Booking) => String(b.id) === bookingId)
    setBooking(foundBooking)
    setLoading(false)
  }, [bookingId])

  const handleBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["client"]}>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
          <div className="animate-pulse text-center">
            <Clock className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
            <p className="text-lg">Loading your booking details...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!booking) {
    return (
      <ProtectedRoute allowedRoles={["client"]}>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
          <div className="text-center">
            <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Booking Not Found</h2>
            <p className="text-muted-foreground mb-6">We couldn&rsquo;t find the booking you&rsquo;re looking for.</p>
            <Button onClick={handleBack}>Return to Bookings</Button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          
          
          <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-4">
                <span className={`mb-4 inline-block px-3 py-1 rounded-full text-sm font-semibold ${booking.status === "Pending" ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"}`}>
                {booking.status}
                </span>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {booking.offer?.title || "Unknown Offer"}
              </h1>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Tag className="w-4 h-4" />
                <p>Booking ID: {booking.id}</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Trip Details Card */}
              <Card className="bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Plane className="w-5 h-5 text-primary" />
                    Trip Details
                  </h2>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4 bg-white/80 p-4 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-medium">Destination</p>
                      <p className="text-muted-foreground">{booking.offer?.title || "Unknown"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/80 p-4 rounded-lg">
                    <Calendar className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-medium">Travel Date</p>
                      <p className="text-muted-foreground">
                        {booking.details?.travelDate 
                          ? new Date(booking.details.travelDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Info Card */}
              <Card className="bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Booking Info
                  </h2>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4 bg-white/80 p-4 rounded-lg">
                    <Users className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-medium">Travelers</p>
                      <p className="text-muted-foreground">
                        {booking.details?.travelers || "Unknown"} {booking.details?.travelers === 1 ? 'person' : 'people'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/80 p-4 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-medium">Status</p>
                      <p className="text-muted-foreground">{booking.status || "Unknown"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Special Requests Card */}
            <Card className="bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Special Requests
                </h2>
              </CardHeader>
              <CardContent>
                <div className="bg-white/80 p-4 rounded-lg">
                  <p className="text-muted-foreground">
                    {booking.details?.specialRequests || "No special requests"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}