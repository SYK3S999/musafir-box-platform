"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { Pencil, Trash2, Eye, Plane, Calendar, Users, Map, Clock, Activity, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

interface TravelPlan {
  id: string
  destinations: string[]
  dateRange: {
    from: string
    to: string
  }
  travelers: number
  notes: string
  status: "draft" | "submitted"
  travelStyle: string
  accommodation: {
    type: string
    amenities: string[]
    maxPrice: number
  }
  budget: {
    total: number
    currency: string
    flexibility: number
  }
  activities: string[]
  transportationMode: string[]
  dietaryRestrictions: string[]
  accessibility: {
    wheelchairAccess: boolean
    dietaryRestrictions: boolean
    mobilityAssistance: boolean
  }
  createdAt: string
}

export default function TravelRegistrationsPage() {
  const router = useRouter()
  const [registrations, setRegistrations] = useState<TravelPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<TravelPlan | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRegistrations()
  }, [])

  const loadRegistrations = () => {
    setIsLoading(true)
    try {
      const savedRegistrations = localStorage.getItem("travelRegistrations")
      if (savedRegistrations) {
        setRegistrations(JSON.parse(savedRegistrations))
      }
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to load travel registrations",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (plan: TravelPlan) => {
    setSelectedPlan(plan)
    setIsDialogOpen(true)
  }

  const handleEdit = (id: string) => {
    router.push(`/travel-alone?edit=${id}`)
  }

  const handleDelete = (id: string) => {
    try {
      const updatedRegistrations = registrations.filter((reg) => reg.id !== id)
      localStorage.setItem("travelRegistrations", JSON.stringify(updatedRegistrations))
      setRegistrations(updatedRegistrations)
      toast({
        title: "Success",
        description: "Travel plan deleted successfully",
      })
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to delete travel plan",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    return status === "submitted" ? "bg-green-500" : "bg-blue-500"
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-background to-secondary/5 py-12"
    >
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            Travel Plans
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your upcoming adventures
          </p>
        </motion.div>

        <div className="flex justify-end mb-8">
          <Button 
            onClick={() => router.push("/client/travel-alone")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all transform hover:scale-[1.02]"
          >
            <Plane className="mr-2 h-4 w-4" />
            New Journey
          </Button>
        </div>

        {isLoading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Plane className="h-8 w-8 text-primary" />
            </motion.div>
          </motion.div>
        ) : registrations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-none shadow-lg bg-background/50 backdrop-blur">
              <CardContent className="flex flex-col items-center py-12">
                <Map className="h-16 w-16 text-primary/40 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No travel plans yet</h3>
                <p className="text-muted-foreground mb-6">Start planning your next adventure!</p>
                <Button 
                  onClick={() => router.push("/client/travel-alone")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all transform hover:scale-[1.02]"
                >
                  Create Your First Plan
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {registrations.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-none shadow-lg bg-background/50 backdrop-blur hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">
                          {plan.destinations.join(", ")}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-primary" />
                            {format(new Date(plan.dateRange.from), "MMM d")} - {format(new Date(plan.dateRange.to), "MMM d, yyyy")}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-primary" />
                            {plan.travelers} {plan.travelers === 1 ? 'Traveler' : 'Travelers'}
                          </div>
                          <div className="flex items-center">
                            <Activity className="h-4 w-4 mr-2 text-primary" />
                            {plan.travelStyle}
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(plan.status)}`}>
                        {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(plan)}
                        className="hover:bg-primary/10"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(plan.id)}
                        className="hover:bg-primary/10"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(plan.id)}
                        className="hover:bg-primary/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {selectedPlan && (
            <DialogContent className="max-w-3xl bg-background/95 backdrop-blur">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  {selectedPlan.destinations.join(", ")}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Created on {format(new Date(selectedPlan.createdAt), "PPP")}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <Card className="border-none shadow-lg bg-background/50 backdrop-blur">
                  <CardContent className="p-4 space-y-4">
                    <h3 className="font-semibold">Trip Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <span>{format(new Date(selectedPlan.dateRange.from), "PPP")} - {format(new Date(selectedPlan.dateRange.to), "PPP")}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        <span>{selectedPlan.travelers} Travelers</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        <span>{selectedPlan.travelStyle}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-background/50 backdrop-blur">
                  <CardContent className="p-4 space-y-4">
                    <h3 className="font-semibold">Budget Details</h3>
                    <div className="space-y-3">
                      <div className="text-2xl font-bold text-primary">
                        {selectedPlan.budget.currency} {selectedPlan.budget.total.toLocaleString()}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        <span>Flexibility: {selectedPlan.budget.flexibility}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-background/50 backdrop-blur col-span-2">
                  <CardContent className="p-4 space-y-4">
                    <h3 className="font-semibold">Activities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlan.activities.map((activity, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {selectedPlan.notes && (
                  <Card className="border-none shadow-lg bg-background/50 backdrop-blur col-span-2">
                    <CardContent className="p-4 space-y-4">
                      <h3 className="font-semibold">Additional Notes</h3>
                      <p className="text-muted-foreground">{selectedPlan.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </motion.div>
  )
}