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
import { Pencil, Trash2, Eye } from "lucide-react"
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

  const getBadgeVariant = (status: string) => {
    return status === "submitted" ? "default" : "secondary"
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Travel Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading registrations...</div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No travel plans found</p>
              <Button onClick={() => router.push("/client/travel-alone")} className="mt-4">
                Create New Plan
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Destinations</TableHead>
                  <TableHead>Travel Dates</TableHead>
                  <TableHead>Style</TableHead>
                  <TableHead>Travelers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>{plan.destinations.join(", ")}</TableCell>
                    <TableCell>
                      {format(new Date(plan.dateRange.from), "MMM d, yyyy")} -{" "}
                      {format(new Date(plan.dateRange.to), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{plan.travelStyle}</TableCell>
                    <TableCell>{plan.travelers}</TableCell>
                    <TableCell>
                    <span className={`px-2 py-1 rounded-full text-white ${getBadgeVariant(plan.status)}`}>
                        {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                    </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(plan)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(plan.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(plan.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedPlan && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Travel Plan Details</DialogTitle>
              <DialogDescription>
                Created on {format(new Date(selectedPlan.createdAt), "PPP")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Destinations</h3>
                <p>{selectedPlan.destinations.join(", ")}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Travel Style</h3>
                <p>{selectedPlan.travelStyle}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Date Range</h3>
                <p>
                  {format(new Date(selectedPlan.dateRange.from), "PPP")} -{" "}
                  {format(new Date(selectedPlan.dateRange.to), "PPP")}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Budget</h3>
                <p>
                  {selectedPlan.budget.currency} {selectedPlan.budget.total.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Activities</h3>
                <p>{selectedPlan.activities.join(", ")}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Transportation</h3>
                <p>{selectedPlan.transportationMode.join(", ")}</p>
              </div>
              <div className="col-span-2">
                <h3 className="font-semibold mb-2">Notes</h3>
                <p>{selectedPlan.notes || "No additional notes"}</p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}