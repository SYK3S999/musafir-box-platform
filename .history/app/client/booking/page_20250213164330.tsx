"use client"

import { useState, useEffect,Suspense} from "react"
import { motion } from "framer-motion"
import { Calendar, Users, CheckCircle2, Plane, MapPin } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/ProtectedRoute"

// Mock data for agency offers
const agencyOffers = [
  {
    id: 1,
    agency: "Wanderlust Adventures",
    location: "123 Traveler's Lane, New York, NY 10001",
    destination: "Paris, France",
    duration: "5 days",
    price: 1299,
    highlights: ["Eiffel Tower Tour", "Seine River Cruise", "Louvre Museum Visit", "Gourmet Dining Experience"],
    inclusions: ["Accommodation", "Breakfast", "Local Transportation", "English-Speaking Guide"],
  },
  {
    id: 2,
    agency: "Global Explorers",
    location: "456 Voyager Street, San Francisco, CA 94105",
    destination: "Tokyo, Japan",
    duration: "7 days",
    price: 1799,
    highlights: ["Mount Fuji Day Trip", "Tokyo City Tour", "Traditional Tea Ceremony", "Akihabara Tech Exploration"],
    inclusions: ["4-Star Hotel", "Most Meals", "Japan Rail Pass", "Guided Tours"],
  },
]

export default function BookingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const offerId = searchParams.get("offerId")

  const [selectedOffer, setSelectedOffer] = useState<number | null>(null)
  const [bookingStage, setBookingStage] = useState<"browse" | "details" | "confirmation">("browse")
  const [bookingDetails, setBookingDetails] = useState({
    travelers: 1,
    travelDate: null as Date | null,
    specialRequests: "",
  })
  const [bookingId, setBookingId] = useState<string | null>(null)

  useEffect(() => {
    if (offerId) {
      setSelectedOffer(Number(offerId))
      setBookingStage("details")
    }
  }, [offerId])

  const handleOfferSelect = (offerId: number) => {
    setSelectedOffer(offerId)
    setBookingStage("details")
  }

  const updateBookingDetails = (field: string, value: string | number | Date) => {
    setBookingDetails((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const generateBookingId = () => {
    const prefix = selectedOffer ? "AG" : "CUS"
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    return `${prefix}-${randomNum}`
  }

  const handleBookingConfirmation = () => {
    const newBookingId = generateBookingId()
    setBookingId(newBookingId)
    setBookingStage("confirmation")
    // Redirect to bookings page after confirmation
    router.push(`/bookings?bookingId=${newBookingId}`)
  }

  const renderBrowseStage = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
      {agencyOffers.map((offer) => (
        <motion.div
          key={offer.id}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`
            border-2 rounded-xl p-4 transition-all cursor-pointer shadow-sm hover:shadow-md
            ${selectedOffer === offer.id ? "border-primary bg-primary/5" : "border-transparent hover:border-primary/30"}
          `}
          onClick={() => handleOfferSelect(offer.id)}
        >
          <div className="flex justify-between items-center mb-2">
            <Plane className={`w-8 h-8 ${selectedOffer === offer.id ? "text-primary" : "text-muted-foreground"}`} />
            <span className="text-lg font-bold text-primary">${offer.price}</span>
          </div>
          <h2 className="text-lg font-semibold mb-1">{offer.destination}</h2>
          <p className="text-sm text-muted-foreground mb-2">
            {offer.agency} - {offer.duration}
          </p>
          <div className="space-y-1">
            <div className="flex flex-wrap gap-1">
              {offer.highlights.slice(0, 2).map((highlight) => (
                <span key={highlight} className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs">
                  {highlight}
                </span>
              ))}
              {offer.highlights.length > 2 && (
                <span className="text-xs text-muted-foreground">+{offer.highlights.length - 2} more</span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )

  const renderDetailsStage = () => {
    const selectedOfferData = agencyOffers.find((offer) => offer.id === selectedOffer)

    return (
      <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
        {selectedOfferData && (
          <div className="bg-secondary/10 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">{selectedOfferData.destination}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Inclusions</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  {selectedOfferData.inclusions.map((inclusion) => (
                    <li key={inclusion}>{inclusion}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Highlights</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  {selectedOfferData.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-muted-foreground">Number of Travelers</label>
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
                value={bookingDetails.travelDate ? bookingDetails.travelDate.toISOString().split("T")[0] : ""}
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
            placeholder="Any special requirements or preferences?"
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
    )
  }

  const renderConfirmationStage = () => {
    const selectedOfferData = agencyOffers.find((offer) => offer.id === selectedOffer)
  
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full"
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left section - Booking ID and Agency Info */}
            <div className="lg:col-span-1 bg-primary/5 p-6">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  <CheckCircle2 className="mx-auto text-primary w-12 h-12 mb-4" />
                </motion.div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-6">
                  Booking Confirmed!
                </h2>
                
                <div className="mb-6">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Your Booking ID</p>
                  <p className="text-3xl font-bold text-primary font-mono tracking-wider">{bookingId}</p>
                </div>
  
                {selectedOfferData && (
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">{selectedOfferData.agency}</p>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <p className="text-sm">{selectedOfferData.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
  
            {/* Right section - Next Steps */}
            <div className="lg:col-span-2 p-6">
              <div className="h-full flex flex-col">
                <h3 className="font-semibold text-lg mb-4">Next Steps</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Visit the agency location shown at the left side",
                    "Present your Booking ID to the staff",
                    "Complete your booking and make the payment",
                    "Receive your final travel documents"
                  ].map((step, index) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/10"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 font-medium text-sm">
                        {index + 1}
                      </div>
                      <p className="text-sm">{step}</p>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-auto pt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Please visit the agency within <span className="font-medium text-primary">48 hours</span> to secure your booking
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }
  
  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {bookingStage === "browse" && "Explore Travel Offers"}
            {bookingStage === "details" && "Booking Details"}
            {bookingStage === "confirmation" && "Booking Confirmation"}
          </h1>
          <p className="text-muted-foreground">
            {bookingStage === "browse" && "Browse curated travel experiences from top agencies"}
            {bookingStage === "details" && "Customize your travel details"}
            {bookingStage === "confirmation" && "Your adventure is all set!"}
          </p>
        </div>
  
        {bookingStage === "browse" && renderBrowseStage()}
        {bookingStage === "details" && renderDetailsStage()}
        {bookingStage === "confirmation" && renderConfirmationStage()}
      </div>
    </ProtectedRoute>
  )
}