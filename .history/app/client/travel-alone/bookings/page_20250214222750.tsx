'use client'

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { 
  Pencil, 
  Trash2, 
  Eye, 
  Plane, 
  Calendar, 
  Users, 
  Map, 
  Clock, 
  Activity, 
  MapPin,
  AlertTriangle,
  Hotel,
  Car
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [planToDelete, setPlanToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'destination'>('date')
  const [filter, setFilter] = useState<'all' | 'draft' | 'submitted'>('all')

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
    } catch (error) {
      toast({
        title: "Error loading plans",
        description: "Failed to load travel registrations",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSort = (registrations: TravelPlan[]) => {
    switch (sortBy) {
      case 'date':
        return [...registrations].sort((a, b) => 
          new Date(b.dateRange.from).getTime() - new Date(a.dateRange.from).getTime()
        )
      case 'status':
        return [...registrations].sort((a, b) => 
          a.status.localeCompare(b.status)
        )
      case 'destination':
        return [...registrations].sort((a, b) => 
          a.destinations[0].localeCompare(b.destinations[0])
        )
      default:
        return registrations
    }
  }

  const filterRegistrations = (registrations: TravelPlan[]) => {
    if (filter === 'all') return registrations
    return registrations.filter(reg => reg.status === filter)
  }

  const handleViewDetails = (plan: TravelPlan) => {
    setSelectedPlan(plan)
    setIsDialogOpen(true)
  }

  const handleEdit = (id: string) => {
    router.push(`/travel-alone?edit=${id}`)
  }

  const initiateDelete = (id: string) => {
    setPlanToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!planToDelete) return

    try {
      const updatedRegistrations = registrations.filter((reg) => reg.id !== planToDelete)
      localStorage.setItem("travelRegistrations", JSON.stringify(updatedRegistrations))
      setRegistrations(updatedRegistrations)
      toast({
        title: "Plan deleted",
        description: "Travel plan has been removed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete travel plan",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setPlanToDelete(null)
    }
  }

  const getStatusColor = (status: string) => {
    return status === "submitted" 
      ? "bg-green-500/90 hover:bg-green-500" 
      : "bg-blue-500/90 hover:bg-blue-500"
  }

  const handleStatusChange = async (planId: string, newStatus: "draft" | "submitted") => {
    try {
      const updatedRegistrations = registrations.map(reg => 
        reg.id === planId ? { ...reg, status: newStatus } : reg
      )
      await localStorage.setItem("travelRegistrations", JSON.stringify(updatedRegistrations))
      setRegistrations(updatedRegistrations)
      toast({
        title: "Status updated",
        description: `Plan status changed to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update plan status",
        variant: "destructive",
      })
    }
  }

  const filteredAndSortedRegistrations = filterRegistrations(handleSort(registrations))

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            Travel Plans
          </h1>
          <p className="text-muted-foreground text-xl">
            Your journey begins here
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className="transition-all"
              >
                All
              </Button>
              <Button
                variant={filter === 'draft' ? 'default' : 'outline'}
                onClick={() => setFilter('draft')}
                className="transition-all"
              >
                Drafts
              </Button>
              <Button
                variant={filter === 'submitted' ? 'default' : 'outline'}
                onClick={() => setFilter('submitted')}
                className="transition-all"
              >
                Submitted
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'date' ? 'default' : 'outline'}
                onClick={() => setSortBy('date')}
                className="transition-all"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Date
              </Button>
              <Button
                variant={sortBy === 'status' ? 'default' : 'outline'}
                onClick={() => setSortBy('status')}
                className="transition-all"
              >
                <Activity className="mr-2 h-4 w-4" />
                Status
              </Button>
              <Button
                variant={sortBy === 'destination' ? 'default' : 'outline'}
                onClick={() => setSortBy('destination')}
                className="transition-all"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Destination
              </Button>
            </div>
          </div>
          
          <Button 
            onClick={() => router.push("/travel-alone")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all w-full md:w-auto"
          >
            <Plane className="mr-2 h-4 w-4" />
            New Journey
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin">
              <Plane className="h-8 w-8 text-primary" />
            </div>
          </div>
        ) : filteredAndSortedRegistrations.length === 0 ? (
          <Card className="border-none shadow-xl bg-background/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center py-16">
              <Map className="h-20 w-20 text-primary/40 mb-6" />
              <h3 className="text-2xl font-semibold mb-3">No Plans Found</h3>
              <p className="text-muted-foreground mb-8 text-lg">
                {filter === 'all' 
                  ? "Start your journey by creating a new travel plan"
                  : `No ${filter} plans found. Create a new plan or change filters.`}
              </p>
              <Button 
                onClick={() => router.push("/travel-alone")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                size="lg"
              >
                <Plane className="mr-2 h-5 w-5" />
                Plan Your Trip
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredAndSortedRegistrations.map((plan) => (
              <Card 
                key={plan.id}
                className="border-none shadow-lg bg-background/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold text-primary">
                        {plan.destinations.join(", ")}
                      </h3>
                      <div className="flex flex-wrap gap-6 text-muted-foreground">
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
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(
                          plan.id, 
                          plan.status === "draft" ? "submitted" : "draft"
                        )}
                        className={`transition-colors ${getStatusColor(plan.status)}`}
                      >
                        {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-end gap-3 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(plan)}
                      className="hover:bg-primary/10 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(plan.id)}
                      className="hover:bg-primary/10 transition-colors"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Plan
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => initiateDelete(plan.id)}
                      className="hover:bg-destructive/10 transition-colors text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {selectedPlan && (
            <DialogContent className="max-w-3xl bg-background/95 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  {selectedPlan.destinations.join(", ")}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-base">
                  Created on {format(new Date(selectedPlan.createdAt), "PPP")}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <Card className="border-none shadow-lg bg-background/50 backdrop-blur-sm">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-semibold text-lg">Trip Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-5 w-5 mr-3 text-primary" />
                        <span>{format(new Date(selectedPlan.dateRange.from), "PPP")} - {format(new Date(selectedPlan.dateRange.to), "PPP")}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Users className="h-5 w-5 mr-3 text-primary" />
                        <span>{selectedPlan.travelers} Travelers</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-5 w-5 mr-3 text-primary" />
                        <span>{selectedPlan.travelStyle}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-background/50 backdrop-blur-sm">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-semibold text-lg">Accommodation</h3>
                    <div className="space-y-4">
                      <div className="flex items-center text-muted-foreground">
                        <Hotel className="h-5 w-5 mr-3 text-primary" />
                        <span>{selectedPlan.accommodation.type}</span>
                      </div>
                      <div className="text-xl font-semibold text-primary">
                        Up to {selectedPlan.budget.currency} {selectedPlan.accommodation.maxPrice.toLocaleString()}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedPlan.accommodation.amenities.map((amenity, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-background/50 backdrop-blur-sm">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-semibold text-lg">Transportation</h3>
                    <div className="space-y-4">
                      <div className="flex items-center text-muted-foreground">
                        <Car className="h-5 w-5 mr-3 text-primary" />
                        <span>Preferred modes:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedPlan.transportationMode.map((mode, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {mode}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-background/50 backdrop-blur-sm">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-semibold text-lg">Budget Details</h3>
                    <div className="space-y-4">
                      <div className="text-3xl font-bold text-primary">
                        {selectedPlan.budget.currency} {selectedPlan.budget.total.toLocaleString()}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-5 w-5 mr-3 text-primary" />
                        <span>Flexibility: {selectedPlan.budget.flexibility}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-background/50 backdrop-blur-sm col-span-2">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-semibold text-lg">Activities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlan.activities.map((activity, index) => (
                        <span 
                          key={index}
                          className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {selectedPlan.notes && (
                  <Card className="border-none shadow-lg bg-background/50 backdrop-blur-sm col-span-2">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold text-lg">Additional Notes</h3>
                      <p className="text-muted-foreground">{selectedPlan.notes}</p>
                    </CardContent>
                  </Card>
                )}

                {selectedPlan.accessibility && (
                  <Card className="border-none shadow-lg bg-background/50 backdrop-blur-sm col-span-2">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold text-lg">Accessibility Requirements</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {selectedPlan.accessibility.wheelchairAccess && (
                          <div className="flex items-center text-muted-foreground">
                            <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2"></span>
                            Wheelchair Access Required
                          </div>
                        )}
                        {selectedPlan.accessibility.dietaryRestrictions && (
                          <div className="flex items-center text-muted-foreground">
                            <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2"></span>
                            Dietary Accommodations Needed
                          </div>
                        )}
                        {selectedPlan.accessibility.mobilityAssistance && (
                          <div className="flex items-center text-muted-foreground">
                            <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2"></span>
                            Mobility Assistance Required
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <DialogFooter className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsDialogOpen(false)
                    selectedPlan && handleEdit(selectedPlan.id)
                  }}
                >
                  Edit Plan
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your travel plan
                and remove all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Plan
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}