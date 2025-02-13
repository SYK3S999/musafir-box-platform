"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Mail, Phone, MapPin, Edit2, Save, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"
import type React from "react"

const InputWithIcon = ({
  icon,
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
}: {
  icon: React.ReactNode
  label: string
  id: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  disabled?: boolean
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }} 
    animate={{ opacity: 1, y: 0 }} 
    className="space-y-2"
  >
    <Label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
      {icon}
      {label}
    </Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="bg-background/50 backdrop-blur-sm border-muted transition-colors focus:border-primary"
    />
  </motion.div>
)

export default function ClientProfile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
  }

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="w-full max-w-2xl"
        >
          <Card className="relative overflow-hidden border-none shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />

            <CardHeader className="text-center relative z-10 pb-8">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative w-24 h-24 mx-auto mb-6"
              >
                <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  {user?.image ? (
                    <img src={user.image} alt={user?.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-primary" />
                  )}
                </div>
                <Button 
                  size="icon" 
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full shadow-lg"
                  onClick={() => {}}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </motion.div>

              <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 mb-2">
                {user?.name || "Your Profile"}
              </CardTitle>
              <CardDescription className="text-base">
                Manage your personal information
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <InputWithIcon
                  icon={<User className="w-4 h-4" />}
                  label="Full Name"
                  id="name"
                  value={user?.name || ""}
                  onChange={() => {}}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                />
                <InputWithIcon
                  icon={<Mail className="w-4 h-4" />}
                  label="Email Address"
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  onChange={() => {}}
                  disabled={true}
                  placeholder="Enter your email"
                />
                <InputWithIcon
                  icon={<Phone className="w-4 h-4" />}
                  label="Phone Number"
                  id="phone"
                  type="tel"
                  value={user?.phone || ""}
                  onChange={() => {}}
                  disabled={!isEditing}
                  placeholder="Enter your phone number"
                />
                <InputWithIcon
                  icon={<MapPin className="w-4 h-4" />}
                  label="Location"
                  id="location"
                  value={user?.location || ""}
                  onChange={() => {}}
                  disabled={!isEditing}
                  placeholder="Enter your location"
                />
              </form>
            </CardContent>

            <CardFooter className="relative z-10 pt-6">
              <Button
                type="submit"
                className="w-full"
                onClick={handleSubmit}
                disabled={isSaving}
              >
                {isEditing ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </>
                ) : (
                  <>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit Profile
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}