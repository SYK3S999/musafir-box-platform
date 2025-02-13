"use client"

interface Booking {
  id: number;
  user: string;
  destination: string;
  date: string;
  amount: string;
  status: "pending" | "confirmed" | "cancelled";
}

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Search, Edit, Trash2 } from "lucide-react"
import { useAdmin } from "@/contexts/AdminContext"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminBookings() {
  const [searchTerm, setSearchTerm] = useState("")
  const { bookings, updateBooking, deleteBooking } = useAdmin()
  const [editingBooking, setEditingBooking] = useState<null | Booking>(null)

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.destination.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleStatusChange = (bookingId: number, newStatus: "pending" | "confirmed" | "cancelled") => {
    updateBooking(bookingId, { status: newStatus })
  }

  const handleDelete = (bookingId: number) => {
    deleteBooking(bookingId)
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Booking Management
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Manage and monitor bookings on your travel platform</p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.user}</TableCell>
                    <TableCell>{booking.destination}</TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell>{booking.amount}</TableCell>
                    <TableCell>
                      <Select value={booking.status} onValueChange={(value: "pending" | "confirmed" | "cancelled") => handleStatusChange(booking.id, value)}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setEditingBooking(booking)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Booking</DialogTitle>
                              <DialogDescription>Make changes to the booking here.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="user" className="text-right">
                                  User
                                </Label>
                                <Input
                                  id="user"
                                  value={editingBooking?.user || ""}
                                  onChange={(e) => setEditingBooking(prev => prev ? { ...prev, user: e.target.value } : null)}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="destination" className="text-right">
                                  Destination
                                </Label>
                                <Input
                                  id="destination"
                                  value={editingBooking?.destination || ""}
                                  onChange={(e) =>
                                    setEditingBooking(prev => prev ? { ...prev, destination: e.target.value } : null)
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="date" className="text-right">
                                  Date
                                </Label>
                                <Input
                                  id="date"
                                  type="date"
                                  value={editingBooking?.date || ""}
                                  onChange={(e) => setEditingBooking(prev => prev ? { ...prev, date: e.target.value } : null)}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="amount" className="text-right">
                                  Amount
                                </Label>
                                <Input
                                  id="amount"
                                  value={editingBooking?.amount || ""}
                                  onChange={(e) => setEditingBooking(prev => prev ? { ...prev, amount: e.target.value } : null)}
                                  className="col-span-3"
                                />
                              </div>
                              
                            </div>
                            <DialogFooter>
                              <Button
                                onClick={() => {
                                  if (editingBooking) {
                                    updateBooking(editingBooking.id, editingBooking)
                                    setEditingBooking(null)
                                  }
                                }}
                              >
                                Save changes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(booking.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}

