"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Compass, MapPin, Plus, Minus } from "lucide-react"
import Link from "next/link"

export default function TravelAlonePage() {
  const [destinations, setDestinations] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined })
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

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Plan Your Solo Adventure
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create your own unique travel experience without the constraints of pre-packaged tours.
        </p>
      </motion.div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Compass className="w-6 h-6" />
            Your Travel Plan
          </CardTitle>
          <CardDescription>Customize every aspect of your journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="destinations">Destinations</Label>
            <div className="flex gap-2">
              <Input
                id="destinations"
                placeholder="Add a destination"
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
              />
              <Button onClick={addDestination} type="button">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {destinations.map((dest, index) => (
                <div
                  key={index}
                  className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  {dest}
                  <button onClick={() => removeDestination(index)} className="text-muted-foreground hover:text-primary">
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-range">Travel Dates</Label>
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="travelers">Number of Travelers</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setTravelers(Math.max(1, travelers - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-lg font-medium w-8 text-center">{travelers}</span>
              <Button type="button" variant="outline" size="icon" onClick={() => setTravelers(travelers + 1)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any specific requirements or preferences?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Save Draft</Button>
          <Button>Create Itinerary</Button>
        </CardFooter>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground mb-4">Need inspiration or assistance?</p>
        <Button asChild>
          <Link href="/offers">Explore Curated Offers</Link>
        </Button>
      </div>
    </div>
  )
}

