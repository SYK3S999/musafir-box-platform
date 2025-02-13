"use client";

import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, MapPin, Calendar, Users } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function SingleBookingPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.bookingId ? String(params.bookingId) : null
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Try to get booking from sessionStorage first
    const selectedBooking = sessionStorage.getItem("selectedBooking")
    
    if (selectedBooking) {
      const parsedBooking = JSON.parse(selectedBooking)
      console.log("Parsed booking id :", parsedBooking.id)
      if (String(parsedBooking.id) === bookingId) {
        setBooking(parsedBooking)
        setLoading(false)
        return
      }
    }

    // Fetch bookings from localStorage
    const storedBookings = localStorage.getItem("bookings");
    console.log("Stored bookings:", storedBookings);

    const bookings = JSON.parse(storedBookings || "[]");
    console.log("Parsed bookings:", bookings);

    // Find the booking by ID
    const foundBooking = bookings.find((b: any) => String(b.id) === bookingId);
    console.log("Found booking:", foundBooking);

    setBooking(foundBooking);
    setLoading(false);
  }, [bookingId]);
  const handleBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["client"]}>
        <div className="container mx-auto px-4 py-8 max-w-6xl text-center">
          <p>Loading booking details...</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (!booking) {
    return (
      <ProtectedRoute allowedRoles={["client"]}>
        <div className="container mx-auto px-4 py-8 max-w-6xl text-center">
          <p>Booking not found. Please check your bookings.</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6"
        >
          ← Back to Bookings
        </Button>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {booking.offer?.title || "Unknown Offer"}
          </h1>
          <p className="text-muted-foreground">Booking ID: {booking.id}</p>
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
                    <p className="text-muted-foreground">{booking.offer?.destination || "Unknown"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium">Travel Date</p>
                    <p className="text-muted-foreground">
                      {booking.details?.travelDate ? new Date(booking.details.travelDate).toLocaleDateString() : "Not specified"}
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
                    <p className="text-muted-foreground">{booking.details?.travelers || "Unknown"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium">Status</p>
                    <p className="text-muted-foreground">{booking.status || "Unknown"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-bold mb-4">Special Requests</h3>
            <p className="text-muted-foreground">
              {booking.details?.specialRequests || "No special requests"}
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
