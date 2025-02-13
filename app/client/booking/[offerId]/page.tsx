"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Users, CheckCircle2, Plane, MapPin, Clock, DollarSign, Activity, AlertCircle } from "lucide-react"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Offers } from "@/lib/offers"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedOffer = Offers.find(offer => offer.id === offerId)

  useEffect(() => {
    if (!selectedOffer) {
      router.push("/offers")
    }
  }, [selectedOffer, router])

  if (!selectedOffer) {
    return null
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

  const handleBookingConfirmation = async () => {
    setIsSubmitting(true)
    const newBookingId = generateBookingId()
    setBookingId(newBookingId)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    const newBooking = {
      id: newBookingId,
      offer: selectedOffer,
      details: bookingDetails,
      status: "Pending"
    }
    localStorage.setItem("bookings", JSON.stringify([...bookings, newBooking]))
    
    router.push(`/client/bookings`)
  }

  const totalPrice = bookingDetails.travelers * (selectedOffer.price || 0)

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-b from-background to-secondary/5 py-12"
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              {selectedOffer.title}
            </h1>
            <p className="text-muted-foreground text-lg">
              Complete your journey details below
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Booking Form Section */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:col-span-2 space-y-6"
            >
              <Card className="border-none shadow-lg bg-background/50 backdrop-blur">
                <CardHeader className="pb-4">
                  <h2 className="text-xl font-semibold">Booking Details</h2>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-muted-foreground">
                        Number of Travelers
                      </label>
                      <div className="relative group">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors" />
                        <input
                          type="number"
                          min={1}
                          value={bookingDetails.travelers}
                          onChange={(e) => updateBookingDetails("travelers", Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-primary/20 bg-background/50 backdrop-blur transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-muted-foreground">
                        Travel Date
                      </label>
                      <div className="relative group">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors" />
                        <input
                          type="date"
                          value={bookingDetails.travelDate?.toISOString().split("T")[0] || ""}
                          onChange={(e) => updateBookingDetails("travelDate", new Date(e.target.value))}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-primary/20 bg-background/50 backdrop-blur transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">
                      Special Requests or Notes
                    </label>
                    <textarea
                      value={bookingDetails.specialRequests}
                      onChange={(e) => updateBookingDetails("specialRequests", e.target.value)}
                      placeholder="Tell us about any special requirements..."
                      className="w-full p-4 rounded-xl border border-primary/20 bg-background/50 backdrop-blur min-h-[120px] transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    />
                  </div>

                  {!bookingDetails.travelDate && (
                    <div className="flex items-center space-x-2 p-4 rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm">Please select a travel date to continue</p>
                  </div>
                  )}

                  <button
                    onClick={handleBookingConfirmation}
                    disabled={!bookingDetails.travelDate || isSubmitting}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-xl hover:bg-primary/90 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Plane className="h-5 w-5" />
                        </motion.div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        <span>Confirm Booking</span>
                      </>
                    )}
                  </button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Offer Summary Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:col-span-1"
            >
              <Card className="border-none shadow-lg bg-background/50 backdrop-blur sticky top-24">
                <CardHeader className="pb-4">
                  <h2 className="text-xl font-semibold">Trip Summary</h2>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-muted-foreground">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>{selectedOffer.title}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-muted-foreground">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>{selectedOffer.duration}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-muted-foreground">
                      <Activity className="h-5 w-5 text-primary" />
                      <span>{selectedOffer.difficulty}</span>
                    </div>
                  </div>

                  <div className="border-t border-primary/10 pt-4">
                    <h3 className="font-semibold mb-2">Included:</h3>
                    <ul className="space-y-2">
                      {selectedOffer.tags.map((tag) => (
                        <li key={tag} className="flex items-center space-x-2 text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>{tag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-primary/10 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground">Price per person</span>
                      <span className="font-semibold">${selectedOffer.price}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground">Travelers</span>
                      <span className="font-semibold">× {bookingDetails.travelers}</span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-bold mt-4 pt-4 border-t border-primary/10">
                      <span>Total</span>
                      <span className="text-primary">${totalPrice}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </ProtectedRoute>
  )
}