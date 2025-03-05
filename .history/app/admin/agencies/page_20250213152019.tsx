"use client"

interface Agency {
  id: number
  name: string
  email: string
  status: "Pending" | "Approved" | "Rejected"
  documents: string[]
}

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Search, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react"
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
import { useAdmin } from "@/contexts/AdminContext"

export default function AdminAgencies() {
  const [searchTerm, setSearchTerm] = useState("")
  const { agencies, addAgency, updateAgency, deleteAgency } = useAdmin()
  const [newAgency, setNewAgency] = useState<Omit<Agency, "id">>({ name: "", email: "", status: "Pending" as const, documents: [] })

  const filteredAgencies = agencies.filter(
    (agency) =>
      agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleStatusChange = (agencyId: number, newStatus: "Pending" | "Approved" | "Rejected") => {
    updateAgency(agencyId, { status: newStatus })
  }

  const handleDelete = (agencyId: number) => {
    deleteAgency(agencyId)
  }

  const handleAddAgency = () => {
    addAgency(newAgency)
    setNewAgency({ name: "", email: "", status: "Pending", documents: [] })
  }

  function setEditingAgency(agency: { id: number; name: string; email: string; status: "Pending" | "Approved" | "Rejected"; documents: string[] }): void {
    throw new Error("Function not implemented.")
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
            Agency Management
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Review and approve travel agency applications</p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Agencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search agencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add Agency</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Agency</DialogTitle>
                    <DialogDescription>Enter the details for the new agency.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newAgency.name}
                        onChange={(e) => setNewAgency({ ...newAgency, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newAgency.email}
                        onChange={(e) => setNewAgency({ ...newAgency, email: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddAgency}>Add Agency</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgencies.map((agency) => (
                  <TableRow key={agency.id}>
                    <TableCell>{agency.name}</TableCell>
                    <TableCell>{agency.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          agency.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : agency.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {agency.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            View Documents
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Agency Documents</DialogTitle>
                            <DialogDescription>
                              Review the following documents submitted by {agency.name}
                            </DialogDescription>
                          </DialogHeader>
                          <ul className="list-disc pl-4">
                            {agency.documents.map((doc, index) => (
                              <li key={index}>{doc}</li>
                            ))}
                          </ul>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {agency.status === "Pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(agency.id, "Approved")}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" /> Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(agency.id, "Rejected")}
                            >
                              <XCircle className="h-4 w-4 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => setEditingAgency(agency)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(agency.id)}>
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

