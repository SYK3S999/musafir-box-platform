"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Package, DollarSign, Calendar } from "lucide-react"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useAdmin } from "@/contexts/AdminContext"

const stats = [
  { title: "Total Users", value: 0, icon: Users, color: "bg-blue-500" },
  { title: "Total Offers", value: 0, icon: Package, color: "bg-green-500" },
  { title: "Total Bookings", value: 0, icon: Calendar, color: "bg-purple-500" },
  { title: "Revenue", value: 0, icon: DollarSign, color: "bg-yellow-500" },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [animatedStats, setAnimatedStats] = useState(stats)
  const { bookings, offers, users } = useAdmin()

  const [revenueData, setRevenueData] = useState<{ name: string; value: number; }[]>([])
  const [bookingsData, setBookingsData] = useState([])

  useEffect(() => {
    const totalRevenue = bookings.reduce((sum, booking) => sum + Number.parseInt(booking.amount.replace("$", "")), 0)
    const newStats = [
      { ...stats[0], value: users.length },
      { ...stats[1], value: offers.length },
      { ...stats[2], value: bookings.length },
      { ...stats[3], value: totalRevenue },
    ]

    const interval = setInterval(() => {
      setAnimatedStats((prevStats) =>
        prevStats.map((stat, index) => {
          const targetValue = newStats[index].value
          const currentValue = stat.value
          if (currentValue < targetValue) {
            return { ...stat, value: Math.min(currentValue + Math.ceil(targetValue / 100), targetValue) }
          }
          return stat
        }),
      )
    }, 20)

    return () => clearInterval(interval)
  }, [bookings, offers, users])

  useEffect(() => {
    // Generate mock data for charts
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    const newRevenueData = months.map((month) => ({
      name: month,
      value: Math.floor(Math.random() * 5000) + 1000,
    }))
    const newBookingsData = months.map((month) => ({
      name: month,
      value: Math.floor(Math.random() * 50) + 10,
    }))

    setRevenueData(newRevenueData)
    setBookingsData(newBookingsData)
  }, [])

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
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Manage and monitor your travel platform</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:max-w-[400px] mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {animatedStats.map((stat, index) => (
                <Card key={stat.title} className="overflow-hidden">
                  <CardHeader
                    className={`flex flex-row items-center justify-between space-y-0 ${stat.color} bg-opacity-10 p-4`}
                  >
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color} text-white`} />
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">
                      {stat.title === "Revenue" ? `$${stat.value.toLocaleString()}` : stat.value.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Bookings Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={bookingsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{booking.user}</p>
                        <p className="text-sm text-muted-foreground">{booking.destination}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{booking.amount}</p>
                        <p className="text-sm text-muted-foreground">{booking.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="text-center">
              <Button asChild>
                <Link href="/admin/bookings">View All Bookings</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}

