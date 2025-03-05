"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { Pencil, Trash2, Eye, Plane, Calendar, Users, Map } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

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
    } catch (error) {
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
    } catch (error) {
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Travel Plans</h1>
            <p className="text-gray-600 mt-2">Manage your upcoming adventures</p>
          </div>
          <Button 
            onClick={() => router.push("/client/travel-alone")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plane className="mr-2 h-4 w-4" />
            New Journey
          </Button>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <Card className="p-8">
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            </Card>
          ) : registrations.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Map className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No travel plans yet</h3>
                <p className="mt-2 text-gray-500">Start planning your next adventure!</p>
                <Button 
                  onClick={() => router.push("/client/travel-alone")} 
                  className="mt-6 bg-blue-600 hover:bg-blue-700"
                >
                  Create Your First Plan
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {registrations.map((plan) => (
                <Card key={plan.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {plan.destinations.join(", ")}
                        </h3>
                        <div className="mt-2 flex items-center gap-4 text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {format(new Date(plan.dateRange.from), "MMM d")} - {format(new Date(plan.dateRange.to), "MMM d, yyyy")}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            {plan.travelers} {plan.travelers === 1 ? 'Traveler' : 'Travelers'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(plan.status)}`}>
                          {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Style:</span> {plan.travelStyle}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(plan)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(plan.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(plan.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {selectedPlan && (
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {selectedPlan.destinations.join(", ")}
                </DialogTitle>
                <DialogDescription>
                  Created on {format(new Date(selectedPlan.createdAt), "PPP")}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6 grid grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Trip Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{format(new Date(selectedPlan.dateRange.from), "PPP")} - {format(new Date(selectedPlan.dateRange.to), "PPP")}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{selectedPlan.travelers} Travelers</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Budget:</p>
                      <p className="text-2xl font-bold text-green-600">
                        {selectedPlan.budget.currency} {selectedPlan.budget.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Travel Style & Transport</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-700">Style:</p>
                      <p>{selectedPlan.travelStyle}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Transportation:</p>
                      <p>{selectedPlan.transportationMode.join(", ")}</p>
                    </div>
                  </div>
                </Card>

                <Card className="col-span-2 p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Activities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlan.activities.map((activity, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {activity}
                      </span>
                    ))}
                  </div>
                </Card>

                {selectedPlan.notes && (
                  <Card className="col-span-2 p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Additional Notes</h3>
                    <p className="text-gray-600">{selectedPlan.notes}</p>
                  </Card>
                )}
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </div>
  )
}