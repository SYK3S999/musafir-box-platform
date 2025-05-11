"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Compass,
  MapPin,
  Plus,
  Minus,
  Globe,
  Calendar,
  Users,
  ScrollText,
  ArrowRight,
  Sparkles,
  Loader2,
  Hotel,
  Wallet,
  Plane,
  Car,
  Train,
  Utensils,
  Accessibility,
} from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { DateRange } from "react-day-picker"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

// Define interfaces with proper TypeScript types
interface AccommodationPreferences {
  type: string
  amenities: string[]
  maxPrice: number // Per night, in DA
}

interface BudgetPreferences {
  total: number // Total trip budget, in DA
  currency: "DA" // Fixed to DA
  flexibility: number // Percentage
}

interface AccessibilityNeeds {
  wheelchairAccess: boolean
  dietaryRestrictions: boolean
  mobilityAssistance: boolean
}

interface TravelPlan {
  id: string
  destinations: string[]
  dateRange: DateRange | undefined
  travelers: number
  notes: string
  status: "draft" | "submitted"
  travelStyle: string
  accommodation: AccommodationPreferences
  budget: BudgetPreferences
  activities: string[]
  transportationMode: string[]
  dietaryRestrictions: string[]
  accessibility: AccessibilityNeeds
  createdAt: string // Added for consistency with TravelRegistrationsPage
}

// Move constants outside component to prevent recreating on each render
const FEATURES = [
  {
    icon: Globe,
    title: "Flexible Destinations",
    description: "Choose multiple destinations and create your perfect route",
  },
  {
    icon: Calendar,
    title: "Custom Timeline",
    description: "Plan your dates with our interactive calendar",
  },
  {
    icon: Users,
    title: "Group Size",
    description: "Travel solo or with a small group of your choosing",
  },
  {
    icon: ScrollText,
    title: "Personal Notes",
    description: "Add specific requirements and preferences",
  },
  {
    icon: Hotel,
    title: "Accommodation",
    description: "Select your preferred stay options and amenities",
  },
  {
    icon: Wallet,
    title: "Budget Planning",
    description: "Set and manage your travel budget effectively",
  },
] as const

const TRAVEL_STYLES = [
  "Luxury",
  "Budget-friendly",
  "Adventure",
  "Cultural",
  "Relaxation",
  "Business",
  "Family-friendly",
] as const

const ACCOMMODATION_TYPES = [
  "Hotel",
  "Resort",
  "Vacation Rental",
  "Hostel",
  "Boutique Hotel",
  "Camping",
  "Homestay",
] as const

const TRANSPORTATION_MODES = [
  "Flight",
  "Train",
  "Rental Car",
  "Public Transport",
  "Private Transfer",
  "Walking Tours",
  "Bike Rental",
] as const

const ACTIVITIES = [
  "Sightseeing",
  "Adventure Sports",
  "Cultural Tours",
  "Food & Wine",
  "Shopping",
  "Relaxation",
  "Nature & Wildlife",
  "Historical Sites",
] as const

// Realistic accommodation price ranges per night (in DA)
const ACCOMMODATION_PRICE_RANGES = {
  Hotel: { min: 10800, max: 40500 }, // $80-$300 × 135
  Resort: { min: 20250, max: 67500 }, // $150-$500
  "Vacation Rental": { min: 8100, max: 27000 }, // $60-$200
  Hostel: { min: 2700, max: 6750 }, // $20-$50
  "Boutique Hotel": { min: 13500, max: 54000 }, // $100-$400
  Camping: { min: 1350, max: 4050 }, // $10-$30
  Homestay: { min: 4050, max: 13500 }, // $30-$100
} as const

// Base per-day costs by travel style (in DA)
const BASE_DAILY_COSTS = {
  Luxury: 40500, // $300 × 135
  "Budget-friendly": 6750, // $50
  Adventure: 13500, // $100
  Cultural: 10800, // $80
  Relaxation: 20250, // $150
  Business: 27000, // $200
  "Family-friendly": 16200, // $120
} as const

// Add type safety for travel styles
type TravelStyle = (typeof TRAVEL_STYLES)[number]

// Utility to format price in DA
const formatPrice = (price: number): string => {
  return `DA ${price.toLocaleString()}`
}

// TravelPlanResult Component
function TravelPlanResult({
  isOpen,
  onClose,
  travelPlan,
  estimatedCost,
  onProceed,
}: {
  isOpen: boolean
  onClose: () => void
  travelPlan: TravelPlan
  estimatedCost: number | null
  onProceed: () => void
}) {
  // Budget and estimated cost are in DA
  const budgetInDA = travelPlan.budget.total
  const estimatedCostInDA = estimatedCost

  // Suggest a hotel based on accommodation type and travel style
  const getSuggestedHotel = () => {
    const { type, maxPrice } = travelPlan.accommodation
    const { travelStyle } = travelPlan
    const baseName = travelPlan.destinations[0] ? `${travelPlan.destinations[0]} ` : ""

    // Get price range in DA, adjust based on travel style
    const priceRange = ACCOMMODATION_PRICE_RANGES[type as keyof typeof ACCOMMODATION_PRICE_RANGES] || { min: 10800, max: 40500 }
    let basePriceDA = travelStyle === "Luxury" ? priceRange.max : (priceRange.min + priceRange.max) / 2

    // Cap at maxPrice (in DA)
    basePriceDA = Math.min(basePriceDA, maxPrice)

    // Ensure minimum realistic price (5000 DA/night)
    if (basePriceDA < 5000) {
      basePriceDA = 5000
    }

    switch (type) {
      case "Hotel":
        return travelStyle === "Luxury"
          ? `${baseName}Grand Palace (5-star, ~${formatPrice(basePriceDA)}/night)`
          : `${baseName}Comfort Inn (3-star, ~${formatPrice(basePriceDA)}/night)`
      case "Resort":
        return `${baseName}Beachfront Resort (~${formatPrice(basePriceDA)}/night)`
      case "Vacation Rental":
        return `${baseName}Cozy Apartment (~${formatPrice(basePriceDA)}/night)`
      case "Hostel":
        return `${baseName}Traveler's Hostel (~${formatPrice(basePriceDA)}/night)`
      case "Boutique Hotel":
        return `${baseName}Chic Boutique (~${formatPrice(basePriceDA)}/night)`
      case "Camping":
        return `${baseName}Nature Campsite (~${formatPrice(basePriceDA)}/night)`
      case "Homestay":
        return `${baseName}Local Homestay (~${formatPrice(basePriceDA)}/night)`
      default:
        return `${baseName}Standard Hotel (~${formatPrice(basePriceDA)}/night)`
    }
  }

  // Suggest places to visit based on activities
  const getPlacesToVisit = () => {
    const places: { [key: string]: string[] } = {
      Sightseeing: ["City Landmarks", "Scenic Viewpoints"],
      "Adventure Sports": ["Mountain Trails", "Water Sports Centers"],
      "Cultural Tours": ["Museums", "Cultural Festivals"],
      "Food & Wine": ["Local Markets", "Gourmet Restaurants"],
      Shopping: ["Shopping Districts", "Artisan Markets"],
      Relaxation: ["Spas", "Beaches"],
      "Nature & Wildlife": ["National Parks", "Wildlife Reserves"],
      "Historical Sites": ["Ancient Ruins", "Historical Monuments"],
    }

    return travelPlan.activities
      .flatMap((activity) => places[activity] || [])
      .map((place) => (travelPlan.destinations[0] ? `${travelPlan.destinations[0]} ${place}` : place))
  }

  // Describe transportation arrangements
  const getTransportationDetails = () => {
    return travelPlan.transportationMode.map((mode) => {
      switch (mode) {
        case "Flight":
          return { icon: Plane, text: "Round-trip flights to your destination" }
        case "Train":
          return { icon: Train, text: "Scenic train journeys between locations" }
        case "Rental Car":
          return { icon: Car, text: "Rental car for flexible exploration" }
        case "Public Transport":
          return { icon: Car, text: "Local buses and metro for city travel" }
        case "Private Transfer":
          return { icon: Car, text: "Private transfers for comfort" }
        case "Walking Tours":
          return { icon: Users, text: "Guided walking tours for immersion" }
        case "Bike Rental":
          return { icon: Car, text: "Bikes for eco-friendly exploration" }
        default:
          return { icon: Car, text: mode }
      }
    })
  }

  // Format dates
  const formatDate = (date: Date | undefined) => (date ? date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Your Personalized Travel Plan
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Destination */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Destination
            </h3>
            <p className="text-muted-foreground">
              {travelPlan.destinations.length > 0 ? travelPlan.destinations.join(", ") : "Not specified"}
            </p>
          </div>

          {/* Travel Dates */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Travel Dates
            </h3>
            <p className="text-muted-foreground">
              {formatDate(travelPlan.dateRange?.from)} - {formatDate(travelPlan.dateRange?.to)}
            </p>
          </div>

          {/* Hotel */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Hotel className="w-5 h-5 text-primary" />
              Suggested Hotel
            </h3>
            <p className="text-muted-foreground">{getSuggestedHotel()}</p>
          </div>

          {/* Places to Visit */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" />
              Places to Visit
            </h3>
            <ul className="list-disc pl-5 text-muted-foreground">
              {getPlacesToVisit().length > 0 ? (
                getPlacesToVisit().map((place, index) => <li key={index}>{place}</li>)
              ) : (
                <li>No specific places selected</li>
              )}
            </ul>
          </div>

          {/* Budget */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Budget
            </h3>
            <p className="text-muted-foreground">
              Your budget: {formatPrice(budgetInDA)} (±{travelPlan.budget.flexibility}% flexibility)
            </p>
          </div>

          {/* Approximate Price */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Estimated Price
            </h3>
            <p className="text-muted-foreground">
              Approx. {estimatedCostInDA ? formatPrice(estimatedCostInDA) : "N/A"} for {travelPlan.travelers} traveler{travelPlan.travelers > 1 ? "s" : ""}
            </p>
          </div>

          {/* Transportation */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Plane className="w-5 h-5 text-primary" />
              Transportation
            </h3>
            <ul className="space-y-2">
              {getTransportationDetails().map((transport, index) => (
                <li key={index} className="flex items-center gap-2 text-muted-foreground">
                  <transport.icon className="w-4 h-4" />
                  {transport.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Accessibility Needs */}
          {Object.values(travelPlan.accessibility).some(Boolean) && (
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Accessibility className="w-5 h-5 text-primary" />
                Accessibility Needs
              </h3>
              <ul className="list-disc pl-5 text-muted-foreground">
                {travelPlan.accessibility.wheelchairAccess && <li>Wheelchair-accessible facilities</li>}
                {travelPlan.accessibility.mobilityAssistance && <li>Mobility assistance services</li>}
                {travelPlan.accessibility.dietaryRestrictions && <li>Dietary accommodations</li>}
              </ul>
            </div>
          )}

          {/* Notes */}
          {travelPlan.notes && (
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ScrollText className="w-5 h-5 text-primary" />
                Additional Notes
              </h3>
              <p className="text-muted-foreground">{travelPlan.notes}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onProceed} className="gap-2">
            View Bookings
            <ArrowRight className="w-4 h-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const DEFAULT_ACCOMMODATION: AccommodationPreferences = {
  type: "Hotel",
  amenities: [],
  maxPrice: 13500, // 100 USD × 135 = 13,500 DA/night
}

const DEFAULT_BUDGET: BudgetPreferences = {
  total: 135000, // 1000 USD × 135 = 135,000 DA
  currency: "DA",
  flexibility: 20,
}

const DEFAULT_ACCESSIBILITY: AccessibilityNeeds = {
  wheelchairAccess: false,
  dietaryRestrictions: false,
  mobilityAssistance: false,
}

export default function TravelAlonePage() {
  const router = useRouter()

  // Form states
  const [destinations, setDestinations] = useState<string[]>([])
  const [newDestination, setNewDestination] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [travelers, setTravelers] = useState(1)
  const [notes, setNotes] = useState("")
  const [travelStyle, setTravelStyle] = useState<TravelStyle>("Cultural")
  const [accommodation, setAccommodation] = useState<AccommodationPreferences>(DEFAULT_ACCOMMODATION)
  const [budget, setBudget] = useState<BudgetPreferences>(DEFAULT_BUDGET)
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [transportationMode, setTransportationMode] = useState<string[]>([])
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([])
  const [accessibility, setAccessibility] = useState<AccessibilityNeeds>(DEFAULT_ACCESSIBILITY)

  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isFormValid, setIsFormValid] = useState(false)
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null)
  const [showResultModal, setShowResultModal] = useState(false)
  const [currentTravelPlan, setCurrentTravelPlan] = useState<TravelPlan | null>(null)

  // Loading states
  const [isLoading, setIsLoading] = useState({
    destinations: false,
    submission: false,
    draft: false,
    cost: false,
  })

  // Memoize form validation function
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {}

    if (destinations.length === 0) {
      errors.destinations = "Please add at least one destination"
    }

    if (!dateRange?.from || !dateRange?.to) {
      errors.dateRange = "Please select your travel dates"
    } else {
      const today = new Date()
      if (dateRange.from < today) {
        errors.dateRange = "Start date cannot be in the past"
      }
      if (dateRange.to < dateRange.from) {
        errors.dateRange = "End date must be after start date"
      }
    }

    if (selectedActivities.length === 0) {
      errors.activities = "Please select at least one activity"
    }

    if (transportationMode.length === 0) {
      errors.transportation = "Please select at least one transportation mode"
    }

    // Validate budget and accommodation prices (in DA)
    const minBudgetDA = 67500 * travelers // $500 × 135 = 67,500 DA per traveler
    if (budget.total < minBudgetDA) {
      errors.budget = `Budget too low. Minimum ${formatPrice(minBudgetDA)} required for ${travelers} traveler${travelers > 1 ? "s" : ""}`
    }

    const minAccommodationDA = ACCOMMODATION_PRICE_RANGES[accommodation.type as keyof typeof ACCOMMODATION_PRICE_RANGES]?.min || 2700
    if (accommodation.maxPrice < minAccommodationDA) {
      errors.accommodation = `Accommodation price too low. Minimum ${formatPrice(minAccommodationDA)} per night required for ${accommodation.type}`
    }

    return errors
  }, [destinations, dateRange, selectedActivities, transportationMode, budget, accommodation, travelers])

  // Update form validation on relevant changes
  useEffect(() => {
    const errors = validateForm()
    setFormErrors(errors)
    setIsFormValid(Object.keys(errors).length === 0)
  }, [validateForm])

  // Handle unsaved changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setHasUnsavedChanges(true)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [destinations, dateRange, travelers, notes, travelStyle, accommodation, budget, selectedActivities, transportationMode, dietaryRestrictions, accessibility])

  // Auto-save functionality
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (hasUnsavedChanges && isFormValid) {
      timeoutId = setTimeout(() => {
        saveDraft()
      }, 3000)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [hasUnsavedChanges, isFormValid])

  // Calculate estimated cost (in DA)
  const calculateEstimatedCost = useCallback(() => {
    if (!dateRange?.from || !dateRange?.to) return null

    const daysOfTrip =
      dateRange?.to instanceof Date && dateRange?.from instanceof Date
        ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
        : 0

    // Base daily cost (in DA)
    const basePerDay = BASE_DAILY_COSTS[travelStyle as keyof typeof BASE_DAILY_COSTS] || 13500

    // Accommodation cost (use maxPrice, ensure within realistic range)
    const accommodationPrice = Math.min(
      accommodation.maxPrice,
      ACCOMMODATION_PRICE_RANGES[accommodation.type as keyof typeof ACCOMMODATION_PRICE_RANGES]?.max || 40500
    )
    const accommodationCost = accommodationPrice * daysOfTrip

    // Activities cost (6750 DA per activity per day, equivalent to $50)
    const activitiesCost = selectedActivities.length * 6750 * daysOfTrip

    // Transportation cost (in DA)
    const transportationCost = transportationMode.includes("Flight") ? 67500 : transportationMode.length * 13500 // $500 or $100

    // Accessibility cost (13500 DA per need per day, equivalent to $100)
    const accessibilityCost = Object.values(accessibility).filter(Boolean).length * 13500 * daysOfTrip

    // Total cost per traveler
    let totalCost = (basePerDay * daysOfTrip + accommodationCost + activitiesCost + transportationCost + accessibilityCost) * travelers

    // Cap at budget with flexibility
    const budgetWithFlexibility = budget.total * (1 + budget.flexibility / 100)
    totalCost = Math.min(totalCost, budgetWithFlexibility)

    return Math.round(totalCost)
  }, [dateRange, travelStyle, accommodation, budget, selectedActivities, transportationMode, accessibility, travelers])

  // Update estimated cost when relevant factors change
  useEffect(() => {
    const cost = calculateEstimatedCost()
    setEstimatedCost(cost)
  }, [calculateEstimatedCost])

  const addDestination = async () => {
    if (!newDestination.trim()) return

    setIsLoading((prev) => ({ ...prev, destinations: true }))
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setDestinations((prev) => [...prev, newDestination.trim()])
      setNewDestination("")
      toast({
        title: "Destination added",
        description: "Your destination has been added successfully.",
      })
    } catch {
      toast({
        description: "Failed to add destination. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, destinations: false }))
    }
  }

  const saveDraft = async () => {
    if (!isFormValid) return

    setIsSaving(true)
    try {
      const draft: TravelPlan = {
        id: Date.now().toString(),
        destinations,
        dateRange,
        travelers,
        notes,
        status: "draft",
        travelStyle,
        accommodation,
        budget,
        activities: selectedActivities,
        transportationMode,
        dietaryRestrictions,
        accessibility,
        createdAt: new Date().toISOString(),
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
      localStorage.setItem("travelPlanDraft", JSON.stringify(draft))
      setHasUnsavedChanges(false)
      toast({
        title: "Draft saved",
        description: "Your travel plan draft has been saved successfully.",
      })
    } catch {
      toast({
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = async () => {
    if (!isFormValid) {
      toast({
        title: "Form Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const travelPlan: TravelPlan = {
        id: Date.now().toString(),
        destinations,
        dateRange,
        travelers,
        notes,
        status: "submitted",
        travelStyle,
        accommodation,
        budget,
        activities: selectedActivities,
        transportationMode,
        dietaryRestrictions,
        accessibility,
        createdAt: new Date().toISOString(),
      }

      const existingRegistrations = localStorage.getItem("travelRegistrations")
      const registrations = existingRegistrations ? JSON.parse(existingRegistrations) : []
      registrations.push(travelPlan)
      localStorage.setItem("travelRegistrations", JSON.stringify(registrations))
      localStorage.removeItem("travelPlanDraft")

      toast({
        title: "Success",
        description: "Your travel plan has been submitted successfully!",
      })

      setCurrentTravelPlan(travelPlan)
      setShowResultModal(true)
      setHasUnsavedChanges(false)
    } catch (_error) {
      toast({
        description: "Failed to submit travel plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleProceedToBookings = () => {
    setShowResultModal(false)
    router.push("/client/travel-alone/bookings")
  }

  // Load saved draft
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem("travelPlanDraft")
      if (savedDraft) {
        const draft = JSON.parse(savedDraft) as TravelPlan
        setDestinations(draft.destinations || [])
        setDateRange(draft.dateRange || undefined)
        setTravelers(draft.travelers || 1)
        setNotes(draft.notes || "")
        setTravelStyle((draft.travelStyle as TravelStyle) || "Cultural")
        setAccommodation(draft.accommodation || DEFAULT_ACCOMMODATION)
        setBudget(draft.budget || DEFAULT_BUDGET)
        setSelectedActivities(draft.activities || [])
        setTransportationMode(draft.transportationMode || [])
        setDietaryRestrictions(draft.dietaryRestrictions || [])
        setAccessibility(draft.accessibility || DEFAULT_ACCESSIBILITY)
        draft.createdAt = draft.createdAt || new Date().toISOString()
      }
    } catch (error) {
      console.error("Error loading draft:", error)
      toast({
        title: "Error",
        description: "Failed to load saved draft. Starting with a new plan.",
        variant: "destructive",
      })
    }
  }, [])

  // Prompt before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges])

  const removeDestination = (index: number) => {
    setDestinations((prev) => prev.filter((_, i) => i !== index))
    toast({
      title: "Destination removed",
      description: "The selected destination has been removed from your plan.",
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addDestination()
    }
  }

  const toggleActivity = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity) ? prev.filter((a) => a !== activity) : [...prev, activity],
    )
  }

  const toggleTransportation = (mode: string) => {
    setTransportationMode((prev) => (prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]))
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16 text-center"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Design Your Perfect Journey
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Create a personalized travel experience that matches your exact preferences and dreams.
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
      >
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-secondary/20 rounded-2xl p-6 hover:bg-secondary/30 transition-all"
            >
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Main Planning Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="max-w-3xl mx-auto border border-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Compass className="w-6 h-6 text-primary" />
              Your Travel Plan
              {hasUnsavedChanges && (
                <span className="text-sm font-normal text-muted-foreground">(Unsaved changes)</span>
              )}
            </CardTitle>
            <CardDescription>Fill out all the details below to create your perfect travel plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Destinations */}
            <div className="space-y-3">
              <Label htmlFor="destinations" className="text-lg">
                Destinations
              </Label>
              <div className="flex gap-2">
                <Input
                  id="destinations"
                  placeholder="Add a destination"
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border-primary/20 focus:border-primary"
                />
                <Button
                  onClick={addDestination}
                  type="button"
                  className="gap-2"
                  disabled={!newDestination.trim() || isLoading.destinations}
                >
                  {isLoading.destinations ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Add
                </Button>
              </div>
              {formErrors.destinations && <p className="text-sm text-destructive">{formErrors.destinations}</p>}
              <AnimatePresence>
                <div className="flex flex-wrap gap-2 mt-2">
                  {destinations.map((dest, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="bg-secondary text-secondary-foreground px-4 py-2 rounded-xl text-sm flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      {dest}
                      <button
                        onClick={() => removeDestination(index)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </div>

            {/* Travel Style */}
            <div className="space-y-3">
              <Label htmlFor="travel-style" className="text-lg">
                Travel Style
              </Label>
              <Select value={travelStyle} onValueChange={(value) => setTravelStyle(value as TravelStyle)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select travel style" />
                </SelectTrigger>
                <SelectContent>
                  {TRAVEL_STYLES.map((style) => (
                    <SelectItem key={style} value={style}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Travel Dates */}
            <div className="space-y-3">
              <Label htmlFor="date-range" className="text-lg">Travel Dates</Label>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              {formErrors.dateRange && <p className="text-sm text-destructive">{formErrors.dateRange}</p>}
            </div>

            {/* Number of Travelers */}
            <div className="space-y-3">
              <Label htmlFor="travelers" className="text-lg">
                Number of Travelers
              </Label>
              <div className="flex items-center gap-4 bg-secondary/20 p-4 rounded-xl">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setTravelers(Math.max(1, travelers - 1))}
                  className="hover:bg-primary hover:text-primary-foreground"
                  disabled={travelers <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-2xl font-medium w-8 text-center">{travelers}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setTravelers(travelers + 1)}
                  className="hover:bg-primary hover:text-primary-foreground"
                  disabled={travelers >= 10}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Accommodation Preferences */}
            <div className="space-y-3">
              <Label className="text-lg">Accommodation Preferences</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accommodation-type">Type</Label>
                  <Select
                    value={accommodation.type}
                    onValueChange={(value) => setAccommodation({ ...accommodation, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select accommodation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACCOMMODATION_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="accommodation-price">Max Price per Night</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accommodation-price"
                      type="number"
                      value={accommodation.maxPrice}
                      onChange={(e) => setAccommodation({ ...accommodation, maxPrice: Number.parseInt(e.target.value) })}
                      min={1000}
                      step={100}
                    />
                    <span className="flex items-center">DA</span>
                  </div>
                </div>
              </div>
              {formErrors.accommodation && <p className="text-sm text-destructive">{formErrors.accommodation}</p>}
            </div>

            {/* Budget Settings */}
            <div className="space-y-3">
              <Label className="text-lg">Budget Settings</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total Budget</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={budget.total}
                      onChange={(e) => setBudget({ ...budget, total: Number.parseInt(e.target.value) })}
                      min={10000}
                      step={1000}
                    />
                    <span className="flex items-center">DA</span>
                  </div>
                </div>
                <div>
                  <Label>Budget Flexibility (%)</Label>
                  <Slider
                    value={[budget.flexibility]}
                    onValueChange={(value) => setBudget({ ...budget, flexibility: value[0] })}
                    min={0}
                    max={50}
                    step={5}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">{budget.flexibility}%</p>
                </div>
              </div>
              {formErrors.budget && <p className="text-sm text-destructive">{formErrors.budget}</p>}
            </div>

            {/* Transportation Modes */}
            <div className="space-y-3">
              <Label className="text-lg">Transportation Preferences</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TRANSPORTATION_MODES.map((mode) => (
                  <Button
                    key={mode}
                    variant={transportationMode.includes(mode) ? "default" : "outline"}
                    onClick={() => toggleTransportation(mode)}
                    className="justify-start"
                  >
                    <span className="truncate">{mode}</span>
                  </Button>
                ))}
              </div>
              {formErrors.transportation && <p className="text-sm text-destructive">{formErrors.transportation}</p>}
            </div>

            {/* Activities */}
            <div className="space-y-3">
              <Label className="text-lg">Preferred Activities</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ACTIVITIES.map((activity) => (
                  <Button
                    key={activity}
                    variant={selectedActivities.includes(activity) ? "default" : "outline"}
                    onClick={() => toggleActivity(activity)}
                    className="justify-start"
                  >
                    <span className="truncate">{activity}</span>
                  </Button>
                ))}
              </div>
              {formErrors.activities && <p className="text-sm text-destructive">{formErrors.activities}</p>}
            </div>

            {/* Accessibility Needs */}
            <div className="space-y-3">
              <Label className="text-lg">Accessibility Requirements</Label>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="wheelchair">Wheelchair Accessibility</Label>
                  <Switch
                    id="wheelchair"
                    checked={accessibility.wheelchairAccess}
                    onCheckedChange={(checked) => setAccessibility({ ...accessibility, wheelchairAccess: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="mobility">Mobility Assistance</Label>
                  <Switch
                    id="mobility"
                    checked={accessibility.mobilityAssistance}
                    onCheckedChange={(checked) => setAccessibility({ ...accessibility, mobilityAssistance: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="dietary">Dietary Requirements</Label>
                  <Switch
                    id="dietary"
                    checked={accessibility.dietaryRestrictions}
                    onCheckedChange={(checked) => setAccessibility({ ...accessibility, dietaryRestrictions: checked })}
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-3">
              <Label htmlFor="notes" className="text-lg">
                Additional Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Any specific requirements or preferences?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px] border-primary/20 focus:border-primary"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={saveDraft} disabled={isSaving || !hasUnsavedChanges}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Save Draft
              </Button>
              <Button className="gap-2" onClick={handleSubmit} disabled={isSubmitting || !isFormValid}>
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Create Itinerary
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Estimated Cost Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8 text-center"
      >
        <Card className="inline-block">
          <CardContent className="pt-6">
            <p className="text-lg font-medium">Estimated Trip Cost</p>
            <p className="text-3xl font-bold text-primary">
              {estimatedCost ? formatPrice(estimatedCost) : "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">
              Based on your selections and {travelers} traveler{travelers > 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Result Modal */}
      {currentTravelPlan && (
        <TravelPlanResult
          isOpen={showResultModal}
          onClose={() => setShowResultModal(false)}
          travelPlan={currentTravelPlan}
          estimatedCost={estimatedCost}
          onProceed={handleProceedToBookings}
        />
      )}

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-12 text-center"
      >
        <p className="text-muted-foreground mb-4">Looking for pre-planned adventures?</p>
        <Button asChild size="lg" className="gap-2">
          <Link href="/offers">
            Explore Curated Offers
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}