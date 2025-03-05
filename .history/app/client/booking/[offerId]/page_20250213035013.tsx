"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, Users, CheckCircle2, Plane, MapPin } from "lucide-react"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Offers } from "@/lib/offers"

export default function BookingPage() {
  const router = useRouter()
  const params = useParams()
  const offerId = Number(params.offerId)

  const [bookingDetails, setBookingDetails] = useState({
    travelers: 1,
    travelDate: null as Date | null,
    specialRequests: "",
  })
  const [bookingId, setBookingId] = useState<string | null>(null)

  // Find the selected offer
  const selectedOffer = Offers.find(offer => offer.id === offerId)

  useEffect(() => {
    if (!selectedOffer) {
      router.push("/offers")
    }
  }, [selectedOffer, router])

  if (!selectedOffer) {
    return null // or loading spinner
  }

  const updateBookingDetails = (field: string, value: string | number | Date) => {
    setBookingDetails(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const generateBookingId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    return `BOOK-${randomNum}`
  }

  const handleBookingConfirmation = () => {
    const newBookingId = generateBookingId()
    setBookingId(newBookingId)
    
    // Store booking in localStorage
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    const newBooking = {
      id: newBookingId,
      offer: selectedOffer,
      details: bookingDetails,
      status: "Pending"
    }
    localStorage.setItem("bookings", JSON.stringify([...bookings, newBooking]))
    
    router.push(`client/bookings/${newBookingId}`)
  }

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Book {selectedOffer.title}
          </h1>
          <p className="text-muted-foreground">
            Complete your booking details
          </p>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-secondary/10 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">{selectedOffer.title}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Inclusions</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  {selectedOffer.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Offer Details</h3>
                <div className="space-y-2">
                  <p>Price: ${selectedOffer.price}</p>
                  <p>Duration: {selectedOffer.duration}</p>
                  <p>Difficulty: {selectedOffer.difficulty}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-muted-foreground">Travelers</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="number"
                  min={1}
                  value={bookingDetails.travelers}
                  onChange={(e) => updateBookingDetails("travelers", Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/20"
                />
              </div>
            </div>
            
            <div>
              <label className="block mb-2 text-muted-foreground">Travel Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="date"
                  value={bookingDetails.travelDate?.toISOString().split("T")[0] || ""}
                  onChange={(e) => updateBookingDetails("travelDate", new Date(e.target.value))}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/20"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-muted-foreground">Special Requests</label>
            <textarea
              value={bookingDetails.specialRequests}
              onChange={(e) => updateBookingDetails("specialRequests", e.target.value)}
              className="w-full p-4 rounded-xl border border-primary/20 min-h-[100px]"
            />
          </div>

          <button
            onClick={handleBookingConfirmation}
            disabled={!bookingDetails.travelDate}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            Confirm Booking
          </button>
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}