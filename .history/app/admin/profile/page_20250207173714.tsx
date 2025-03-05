"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AnimatedCard } from "@/components/AnimatedCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

// Mock data for the admin profile
const adminData = {
  name: "Admin User",
  email: "admin@example.com",
  role: "System Administrator",
  lastLogin: "2023-06-15 14:30",
  stats: {
    totalUsers: 1000,
    totalAgencies: 50,
    totalBookings: 5000,
  },
}

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(adminData)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
    // Here you would typically send the updated profile to your backend
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  return (
    <motion.div className="container mx-auto px-4 py-8" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Adminstrator Profile
        </h1>
        
      </motion.div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="stats">System Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <AnimatedCard index={0}>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Manage your admin details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" name="role" value={profile.role} disabled />
                  </div>
                  <div>
                    <Label htmlFor="lastLogin">Last Login</Label>
                    <Input id="lastLogin" name="lastLogin" value={profile.lastLogin} disabled />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              {isEditing ? (
                <Button type="submit" onClick={handleSubmit}>
                  Save Changes
                </Button>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </CardFooter>
          </AnimatedCard>
        </TabsContent>

        <TabsContent value="stats">
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" variants={containerVariants}>
            {Object.entries(profile.stats).map(([key, value], index) => (
              <AnimatedCard key={key} index={index}>
                <CardHeader>
                  <CardTitle>{key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{value}</p>
                </CardContent>
              </AnimatedCard>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

