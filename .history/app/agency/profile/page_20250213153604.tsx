"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AnimatedCard } from "@/components/AnimatedCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Building2, Mail, Phone, FileText, BadgeCheck } from "lucide-react"

const agencyData = {
  name: "Wanderlust Adventures",
  email: "info@wanderlustadventures.com",
  phone: "+1 234 567 8900",
  description: "Specializing in exotic and off-the-beaten-path destinations",
  license: "TA-12345-XYZ",
}

export default function AgencyProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(agencyData)
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Here you would typically send the updated profile to your backend
      setIsSaving(false)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
      setIsSaving(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setProfile(agencyData) // Reset to original data
    setIsEditing(false)
  }

  const inputFields = [
    { id: "name", label: "Agency Name", icon: Building2, type: "text" },
    { id: "email", label: "Email Address", icon: Mail, type: "email" },
    { id: "phone", label: "Phone Number", icon: Phone, type: "tel" },
    { id: "license", label: "License Number", icon: BadgeCheck, type: "text" },
  ]

  return (
    <motion.div 
      className="container mx-auto px-4 py-8 max-w-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Agency Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your agency details and information
        </p>
      </motion.div>

      <AnimatedCard index={0}>
        <CardHeader>
          <CardTitle>Agency Information</CardTitle>
          <CardDescription>Update your agency&#39;s public profile</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {inputFields.map(({ id, label, icon: Icon, type }) => (
            <div key={id} className="relative">
              <Label htmlFor={id} className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" />
                {label}
              </Label>
              <Input
                id={id}
                name={id}
                type={type}
                value={profile[id as keyof typeof profile]}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="transition-all duration-200 hover:border-primary/50"
              />
            </div>
          ))}

          <div className="relative">
            <Label htmlFor="description" className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4" />
              Agency Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={profile.description}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="min-h-[120px] transition-all duration-200 hover:border-primary/50"
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-4">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                type="button"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button 
              onClick={handleEdit}
              className="bg-primary/90 hover:bg-primary"
            >
              Edit Profile
            </Button>
          )}
        </CardFooter>
      </AnimatedCard>
    </motion.div>
  )
}