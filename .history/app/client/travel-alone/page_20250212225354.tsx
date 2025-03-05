"use client"

import { useState, useEffect } from "react"
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
import { Compass, MapPin, Plus, Minus, Globe, Calendar, Users, ScrollText, ArrowRight, Sparkles, Loader2, Hotel, Wallet } from "lucide-react"
import Link from "next/link"
import type { DateRange } from "react-day-picker"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Define interfaces with proper TypeScript types
interface AccommodationPreferences {
  type: string;
  amenities: string[];
  maxPrice: number;
}

interface BudgetPreferences {
  total: number;
  currency: string;
  flexibility: number;
}

interface AccessibilityNeeds {
  wheelchairAccess: boolean;
  dietaryRestrictions: boolean;
  mobilityAssistance: boolean;
}

interface TravelPlan {
  id: string;
  destinations: string[];
  dateRange: DateRange | undefined;
  travelers: number;
  notes: string;
  status: 'draft' | 'submitted';
  travelStyle: string;
  accommodation: AccommodationPreferences;
  budget: BudgetPreferences;
  activities: string[];
  transportationMode: string[];
  dietaryRestrictions: string[];
  accessibility: AccessibilityNeeds;
}

// Move constants outside component to prevent recreating on each render
const FEATURES = [
  {
    icon: Globe,
    title: "Flexible Destinations",
    description: "Choose multiple destinations and create your perfect route"
  },
  {
    icon: Calendar,
    title: "Custom Timeline",
    description: "Plan your dates with our interactive calendar"
  },
  {
    icon: Users,
    title: "Group Size",
    description: "Travel solo or with a small group of your choosing"
  },
  {
    icon: ScrollText,
    title: "Personal Notes",
    description: "Add specific requirements and preferences"
  },
  {
    icon: Hotel,
    title: "Accommodation",
    description: "Select your preferred stay options and amenities"
  },
  {
    icon: Wallet,
    title: "Budget Planning",
    description: "Set and manage your travel budget effectively"
  }
] as const;

const TRAVEL_STYLES = [
  "Luxury",
  "Budget-friendly",
  "Adventure",
  "Cultural",
  "Relaxation",
  "Business",
  "Family-friendly"
] as const;

const ACCOMMODATION_TYPES = [
  "Hotel",
  "Resort",
  "Vacation Rental",
  "Hostel",
  "Boutique Hotel",
  "Camping",
  "Homestay"
] as const;

const TRANSPORTATION_MODES = [
  "Flight",
  "Train",
  "Rental Car",
  "Public Transport",
  "Private Transfer",
  "Walking Tours",
  "Bike Rental"
] as const;

const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "AUD",
  "CAD"
] as const;

const ACTIVITIES = [
  "Sightseeing",
  "Adventure Sports",
  "Cultural Tours",
  "Food & Wine",
  "Shopping",
  "Relaxation",
  "Nature & Wildlife",
  "Historical Sites"
] as const;

// Add type safety for travel styles
type TravelStyle = typeof TRAVEL_STYLES[number];
type AccommodationType = typeof ACCOMMODATION_TYPES[number];
type Currency = typeof CURRENCIES[number];

const DEFAULT_ACCOMMODATION: AccommodationPreferences = {
  type: "Hotel",
  amenities: [],
  maxPrice: 200,
};

const DEFAULT_BUDGET: BudgetPreferences = {
  total: 5000,
  currency: "USD" as Currency,
  flexibility: 20
};

const DEFAULT_ACCESSIBILITY: AccessibilityNeeds = {
  wheelchairAccess: false,
  dietaryRestrictions: false,
  mobilityAssistance: false
};

export default function TravelAlonePage() {
  const router = useRouter()
  
  // Form states with proper typing
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

  // Load saved draft with proper error handling
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('travelPlanDraft')
      if (savedDraft) {
        const draft = JSON.parse(savedDraft) as TravelPlan
        setDestinations(draft.destinations || [])
        setDateRange(draft.dateRange || undefined)
        setTravelers(draft.travelers || 1)
        setNotes(draft.notes || "")
        setTravelStyle(draft.travelStyle as TravelStyle || "Cultural")
        setAccommodation(draft.accommodation || DEFAULT_ACCOMMODATION)
        setBudget(draft.budget || DEFAULT_BUDGET)
        setSelectedActivities(draft.activities || [])
        setTransportationMode(draft.transportationMode || [])
        setDietaryRestrictions(draft.dietaryRestrictions || [])
        setAccessibility(draft.accessibility || DEFAULT_ACCESSIBILITY)
      }
    } catch (error) {
      console.error('Error loading draft:', error)
      toast.error("Failed to load saved draft")
    }
  }, [])

  // Track unsaved changes with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setHasUnsavedChanges(true)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [
    destinations,
    dateRange,
    travelers,
    notes,
    travelStyle,
    accommodation,
    budget,
    selectedActivities,
    transportationMode,
    dietaryRestrictions,
    accessibility
  ])

  // Prompt before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const addDestination = () => {
    if (newDestination.trim()) {
      setDestinations(prev => [...prev, newDestination.trim()])
      setNewDestination("")
      toast.success("Destination added!")
    }
  }

  const removeDestination = (index: number) => {
    setDestinations(prev => prev.filter((_, i) => i !== index))
    toast.success("Destination removed")
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addDestination()
    }
  }

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    )
  }

  const toggleTransportation = (mode: string) => {
    setTransportationMode(prev =>
      prev.includes(mode)
        ? prev.filter(m => m !== mode)
        : [...prev, mode]
    )
  }

  const validateForm = () => {
    if (destinations.length === 0) {
      toast.error("Please add at least one destination")
      return false
    }
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Please select your travel dates")
      return false
    }
    if (selectedActivities.length === 0) {
      toast.error("Please select at least one activity")
      return false
    }
    if (transportationMode.length === 0) {
      toast.error("Please select at least one transportation mode")
      return false
    }
    return true
  }

  const calculateEstimatedCost = () => {
    // Basic estimation logic
    const daysOfTrip = dateRange?.from && dateRange?.to
      ? Math.ceil((new Date(dateRange.to).getTime() - new Date(dateRange.from).getTime()) / (1000 * 60 * 60 * 24))
      : 0

    const basePerDay = {
      Luxury: 500,
      "Budget-friendly": 100,
      Adventure: 200,
      Cultural: 150,
      Relaxation: 300,
      Business: 400,
      "Family-friendly": 250
    }[travelStyle] || 200

    const accommodationCost = accommodation.maxPrice * daysOfTrip
    const activitiesCost = selectedActivities.length * 50 * daysOfTrip
    const transportationCost = transportationMode.includes("Flight") ? 500 : 200

    return (basePerDay * daysOfTrip + accommodationCost + activitiesCost + transportationCost) * travelers
  }

  const saveDraft = async () => {
    try {
      setIsSaving(true)
      const draft: TravelPlan = {
        id: Date.now().toString(),
        destinations,
        dateRange,
        travelers,
        notes,
        status: 'draft',
        travelStyle,
        accommodation,
        budget,
        activities: selectedActivities,
        transportationMode,
        dietaryRestrictions,
        accessibility
      }
      localStorage.setItem('travelPlanDraft', JSON.stringify(draft))
      setHasUnsavedChanges(false)
      toast.success("Draft saved successfully!")
    } catch (error) {
      toast.error("Failed to save draft")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const travelPlan: TravelPlan = {
        id: Date.now().toString(),
        destinations,
        dateRange,
        travelers,
        notes,
        status: 'submitted',
        travelStyle,
        accommodation,
        budget,
        activities: selectedActivities,
        transportationMode,
        dietaryRestrictions,
        accessibility
      }
      
      localStorage.setItem('submittedTravelPlan', JSON.stringify(travelPlan))
      localStorage.removeItem('travelPlanDraft')
      
      toast.success("Travel plan submitted successfully!")
      setHasUnsavedChanges(false)
      
      setTimeout(() => {
        router.push('/offers')
      }, 1500)
    } catch (error) {
      toast.error("Failed to submit travel plan")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
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
                <span className="text-sm font-normal text-muted-foreground">
                  (Unsaved changes)
                </span>
              )}
            </CardTitle>
            <CardDescription>
              Fill out all the details below to create your perfect travel plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Destinations */}
            <div className="space-y-3">
              <Label htmlFor="destinations" className="text-lg">Destinations</Label>
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
                  disabled={!newDestination.trim()}
                >
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>
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
              <Label htmlFor="travel-style" className="text-lg">Travel Style</Label>
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
            </div>

            {/* Number of Travelers */}
            <div className="space-y-3">
              <Label htmlFor="travelers" className="text-lg">Number of Travelers</Label>
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
              <Label htmlFor="accommodation-type" className="text-lg">Accommodation Type</Label>
              <Select 
                value={accommodation.type} 
                onValueChange={(value) => setAccommodation({...accommodation, type: value})}
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
                      onChange={(e) => setBudget({...budget, total: parseInt(e.target.value)})}
                      min={0}
                      step={100}
                    />
                    <Select 
                      value={budget.currency}
                      onValueChange={(value) => setBudget({...budget, currency: value})}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Budget Flexibility (%)</Label>
                  <Slider
                    value={[budget.flexibility]}
                    onValueChange={(value) => setBudget({...budget, flexibility: value[0]})}
                    min={0}
                    max={50}
                    step={5}
                    className="mt-2"
                  />
                </div>
              </div>
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
                    onCheckedChange={(checked) => 
                      setAccessibility({...accessibility, wheelchairAccess: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="mobility">Mobility Assistance</Label>
                  <Switch
                    id="mobility"
                    checked={accessibility.mobilityAssistance}
                    onCheckedChange={(checked) => 
                      setAccessibility({...accessibility, mobilityAssistance: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="dietary">Dietary Requirements</Label>
                  <Switch
                    id="dietary"
                    checked={accessibility.dietaryRestrictions}
                    onCheckedChange={(checked) => 
                      setAccessibility({...accessibility, dietaryRestrictions: checked})
                    }
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-3">
              <Label htmlFor="notes" className="text-lg">Additional Notes</Label>
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
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={saveDraft}
                disabled={isSaving || !hasUnsavedChanges}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Save Draft
              </Button>
              <Button 
                className="gap-2"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
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
              {budget.currency} {calculateEstimatedCost().toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Based on your selections and {travelers} traveler{travelers > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      </motion.div>

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