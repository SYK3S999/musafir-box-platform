"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Users, CheckCircle2, Plane, MapPin, Phone, Mail, Building } from "lucide-react"
import { ProtectedRoute } from "@/components/ProtectedRoute"

// Mock data for agency offers
const agencyOffers = [
  {
    id: 1,
    agency: "Wanderlust Adventures",
    agencyDetails: {
      address: "123 Traveler's Lane, New York, NY 10001",
      phone: "+1 (212) 555-0123",
      email: "bookings@wanderlustadventures.com",
      license: "TA-2024-NY-1234",
      officeHours: "Mon-Fri: 9:00 AM - 6:00 PM EST",
      emergencyContact: "+1 (212) 555-9999"
    },
    destination: "Paris, France",
    duration: "5 days",
    price: 1299,
    highlights: ["Eiffel Tower Tour", "Seine River Cruise", "Louvre Museum Visit", "Gourmet Dining Experience"],
    inclusions: ["Accommodation", "Breakfast", "Local Transportation", "English-Speaking Guide"],
  },
  {
    id: 2,
    agency: "Global Explorers",
    agencyDetails: {
      address: "456 Voyager Street, San Francisco, CA 94105",
      phone: "+1 (415) 555-0456",
      email: "info@globalexplorers.com",
      license: "TA-2024-CA-5678",
      officeHours: "Mon-Sat: 8:00 AM - 7:00 PM PST",
      emergencyContact: "+1 (415) 555-8888"
    },
    destination: "Tokyo, Japan",
    duration: "7 days",
    price: 1799,
    highlights: ["Mount Fuji Day Trip", "Tokyo City Tour", "Traditional Tea Ceremony", "Akihabara Tech Exploration"],
    inclusions: ["4-Star Hotel", "Most Meals", "Japan Rail Pass", "Guided Tours"],
  },
]

export default function AgencyOfferBooking() {
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null)
  const [bookingStage, setBookingStage] = useState<"browse" | "details" | "confirmation">("browse")
  const [bookingDetails, setBookingDetails] = useState({
    travelers: 1,
    travelDate: null as Date | null,
    specialRequests: "",
  })
  const [bookingId, setBookingId] = useState<string | null>(null)

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
    // Simple booking ID generation
    const prefix = selectedOffer ? "AG" : "CUS"
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    return `${prefix}-${randomNum}`
  }

  const handleBookingConfirmation = () => {
    const newBookingId = generateBookingId()
    setBookingId(newBookingId)
    setBookingStage("confirmation")
  }

  const renderBrowseStage = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-6">
      {agencyOffers.map((offer) => (
        <motion.div
          key={offer.id}
          whileHover={{ scale: 1.05 }}
          className={`
            border-2 rounded-2xl p-6 transition-all cursor-pointer
            ${
              selectedOffer === offer.id ? "border-primary bg-primary/10" : "border-transparent hover:border-primary/30"
            }
          `}
          onClick={() => handleOfferSelect(offer.id)}
        >
          <div className="flex justify-between items-center mb-4">
            <Plane className={`w-10 h-10 ${selectedOffer === offer.id ? "text-primary" : "text-muted-foreground"}`} />
            <span className="text-xl font-bold text-primary">${offer.price}</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">{offer.destination}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {offer.agency} - {offer.duration}
          </p>
          <div className="space-y-2">
            <h3 className="font-medium">Highlights:</h3>
            <div className="flex flex-wrap gap-2">
              {offer.highlights.slice(0, 2).map((highlight) => (
                <span key={highlight} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs">
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
        className="space-y-6"
      >
        <div className="bg-secondary/10 p-8 rounded-xl text-center space-y-6">
          <CheckCircle2 className="mx-auto text-green-500 w-16 h-16" />
          <h2 className="text-3xl font-bold text-primary">Booking Confirmed!</h2>
  
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Booking Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Booking ID:</p>
                <p className="text-primary font-bold text-2xl">{bookingId}</p>
              </div>
              <div>
                <p className="font-medium">Destination:</p>
                <p>{selectedOfferData?.destination}</p>
              </div>
              <div>
                <p className="font-medium">Travel Date:</p>
                <p>{bookingDetails.travelDate?.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-medium">Duration:</p>
                <p>{selectedOfferData?.duration}</p>
              </div>
              <div>
                <p className="font-medium">Travelers:</p>
                <p>{bookingDetails.travelers}</p>
              </div>
              <div>
                <p className="font-medium">Total Price:</p>
                <p className="text-primary font-bold">
                  ${(selectedOfferData?.price || 0) * bookingDetails.travelers}
                </p>
              </div>
            </div>
          </div>
  
          {selectedOfferData && (
            <div className="bg-white p-6 rounded-xl shadow-sm text-left">
              <h3 className="text-xl font-semibold mb-4">Agency Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">{selectedOfferData.agency}</p>
                    <p className="text-sm text-muted-foreground">License: {selectedOfferData.agencyDetails.license}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <p>{selectedOfferData.agencyDetails.address}</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p>Office: {selectedOfferData.agencyDetails.phone}</p>
                    <p className="text-sm text-muted-foreground">
                      Emergency: {selectedOfferData.agencyDetails.emergencyContact}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-1" />
                  <p>{selectedOfferData.agencyDetails.email}</p>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <p className="font-medium">Office Hours:</p>
                  <p className="text-sm text-muted-foreground">{selectedOfferData.agencyDetails.officeHours}</p>
                </div>
              </div>
            </div>
          )}
  
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Important Information</h3>
            <ul className="text-sm text-muted-foreground space-y-2 text-left">
              <li>• Please save your booking ID for future reference</li>
              <li>• Check your email for detailed itinerary and travel documents</li>
              <li>• Contact the agency at least 48 hours before departure for final confirmation</li>
              <li>• Keep the emergency contact number handy during your trip</li>
            </ul>
          </div>
        </div>
      </motion.div>
    )
  }
  
  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {bookingStage === "browse" && "Explore Travel Offers"}
            {bookingStage === "details" && "Booking Details"}
            {bookingStage === "confirmation" && "Booking Confirmation"}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
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

