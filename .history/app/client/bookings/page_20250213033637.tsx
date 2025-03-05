// 'use client'

// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { MapPin, Calendar, Plane, ArrowRight, Clock } from "lucide-react";

// const initialBookings = [
//   {
//     id: 1,
//     destination: "Paris",
//     date: "2023-08-15",
//     status: "Confirmed",
//     price: 1299,
//     duration: "7 days",
//     image: "/api/placeholder/400/300"
//   },
//   {
//     id: 2,
//     destination: "Tokyo",
//     date: "2023-10-01",
//     status: "Pending",
//     price: 1799,
//     duration: "10 days",
//     image: "/api/placeholder/400/300"
//   },
//   {
//     id: 3,
//     destination: "Bali",
//     date: "2023-12-20",
//     status: "Confirmed",
//     price: 1499,
//     duration: "5 days",
//     image: "/api/placeholder/400/300"
//   }
// ];

// export default function BookingsPage() {
//   const [bookings] = useState(initialBookings);
//   const [hoveredId, setHoveredId] = useState<number | null>(null);

//   const getStatusColor = (status: string) => {
//     return status === "Confirmed" ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900";
//   };

//   return (
//     <div className="min-h-screen bg-[#fafafa]">
//       <div className="max-w-7xl mx-auto px-8 py-16">
//         <div className="mb-16 space-y-4">
//         <motion.div 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="mb-12 text-center"
//       >
//         <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
//           Your Bookings
//         </h1>
//         <p className="text-muted-foreground max-w-2xl mx-auto">
//           upcoming and past bookings
//         </p>
//       </motion.div>
//         </div>

//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
//         >
//           {bookings.map((booking, index) => (
//             <motion.div
//               key={booking.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               onHoverStart={() => setHoveredId(booking.id)}
//               onHoverEnd={() => setHoveredId(null)}
//               className="group cursor-pointer"
//             >
//               <div className="relative rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500">
//                 <div className="relative h-64 overflow-hidden">
//                   <img 
//                     src={booking.image}
//                     alt={booking.destination}
//                     className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0" />
                  
//                   <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
//                     <p className="text-sm font-light mb-2 opacity-90">
//                       {new Date(booking.date).toLocaleDateString('en-US', {
//                         month: 'long',
//                         day: 'numeric',
//                         year: 'numeric'
//                       })}
//                     </p>
//                     <h3 className="text-2xl font-light mb-1">{booking.destination}</h3>
//                   </div>
//                 </div>

//                 <div className="p-6 space-y-6">
//                   <div className="flex items-center justify-between">
//                     <span className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
//                       {booking.status}
//                     </span>
//                     <div className="flex items-center gap-2 text-neutral-500">
//                       <Clock className="w-4 h-4" />
//                       <span className="text-sm">{booking.duration}</span>
//                     </div>
//                   </div>

//                   <div className="flex items-end justify-between">
//                     <div>
//                       <p className="text-sm text-neutral-500 mb-1">Total Price</p>
//                       <p className="text-2xl font-light">${booking.price}</p>
//                     </div>
                    
//                     <motion.button
//                       initial={false}
//                       animate={{
//                         backgroundColor: hoveredId === booking.id ? '#000' : '#fff',
//                         color: hoveredId === booking.id ? '#fff' : '#000'
//                       }}
//                       className="flex items-center gap-2 px-6 py-3 rounded-full border border-neutral-200 hover:border-neutral-900 transition-colors duration-300"
//                     >
//                       <span className="text-sm">View Details</span>
//                       <ArrowRight className="w-4 h-4" />
//                     </motion.button>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>
//     </div>
//   );
// }



"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, MapPin, Calendar, Users } from "lucide-react"
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function BookingsPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId")

  const [booking, setBooking] = useState<any>(null)

  useEffect(() => {
    if (bookingId) {
      // Fetch booking details based on bookingId
      // For now, we'll use mock data
      const mockBooking = {
        id: bookingId,
        destination: "Paris, France",
        agency: "Wanderlust Adventures",
        location: "123 Traveler's Lane, New York, NY 10001",
        duration: "5 days",
        price: 1299,
        travelers: 2,
        travelDate: "2023-12-01",
        specialRequests: "Vegetarian meals",
        status: "Pending"
      }
      setBooking(mockBooking)
    }
  }, [bookingId])

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Your Bookings
          </h1>
          <p className="text-muted-foreground">
            View and manage your travel bookings
          </p>
        </div>

        {booking ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-primary/5 p-6">
                <div className="text-center">
                  <CheckCircle2 className="mx-auto text-primary w-12 h-12 mb-4" />
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-6">
                    Booking Confirmed!
                  </h2>
                  
                  <div className="mb-6">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Your Booking ID</p>
                    <p className="text-3xl font-bold text-primary font-mono tracking-wider">{booking.id}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-semibold text-lg">{booking.agency}</p>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <p className="text-sm">{booking.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 p-6">
                <div className="h-full flex flex-col">
                  <h3 className="font-semibold text-lg mb-4">Booking Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/10">
                      <MapPin className="w-6 h-6 text-primary" />
                      <p className="text-sm">{booking.destination}</p>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/10">
                      <Calendar className="w-6 h-6 text-primary" />
                      <p className="text-sm">{booking.travelDate}</p>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/10">
                      <Users className="w-6 h-6 text-primary" />
                      <p className="text-sm">{booking.travelers} travelers</p>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/10">
                      <p className="text-sm">Status: <span className="font-medium text-primary">{booking.status}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No bookings found.</p>
        )}
      </div>
    </ProtectedRoute>
  )
}