"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Compass, MapPin, Plus, Minus, Globe, Calendar, Users, ScrollText, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import type { DateRange } from "react-day-picker"

const features = [
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
  }
]

export default function TravelAlonePage() {
  const [destinations, setDestinations] = useState<string[]>([])
  const [newDestination, setNewDestination] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [travelers, setTravelers] = useState(1)
  const [notes, setNotes] = useState("")

  const addDestination = () => {
    if (newDestination.trim() !== "") {
      setDestinations([...destinations, newDestination.trim()])
      setNewDestination("")
    }
  }

  const removeDestination = (index: number) => {
    setDestinations(destinations.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addDestination()
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {features.map((feature, index) => {
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
            </CardTitle>
            <CardDescription>Customize every aspect of your journey</CardDescription>
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
                >
                  <Plus className="w-4 h-4" />
                </Button>
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
            <Button variant="outline" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Save Draft
            </Button>
            <Button className="gap-2">
              Create Itinerary
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
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