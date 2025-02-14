"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Calendar, Users } from "lucide-react"
import { useState } from "react"

export function HeroSection() {
  const [activeTab, setActiveTab] = useState('destination')

  const backgroundImages = [
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2021&q=80",
    
  ]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Fade Effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <Image
          src={backgroundImages[currentImageIndex]}
          alt="Travel Hero"
          fill
          style={{ objectFit: "cover" }}
          priority
          className="transition-transform duration-10000 scale-105"
        />
      </motion.div>

      {/* Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 10, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-primary/20 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center text-white max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-primary-foreground to-white">
            Your Journey Begins Here
          </span>
        </motion.h1>

        <motion.p
          className="text-xl sm:text-2xl md:text-3xl mb-12 text-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Discover extraordinary destinations with expert guides
        </motion.p>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Search Tabs */}
          <div className="flex justify-center space-x-4 mb-6">
            {[
              { id: 'destination', icon: MapPin, label: 'Destination' },
              { id: 'dates', icon: Calendar, label: 'Dates' },
              { id: 'travelers', icon: Users, label: 'Travelers' }
            ].map(({ id, icon: Icon, label }) => (
              <Button
                key={id}
                variant="ghost"
                onClick={() => setActiveTab(id)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  activeTab === id 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative backdrop-blur-md bg-white/10 rounded-full p-2 flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Input
                type="text"
                placeholder="Where would you like to go?"
                className="w-full pl-12 pr-4 py-6 bg-transparent text-white placeholder-white/70 border-0 focus:ring-0 text-lg"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
            </div>
            <Button 
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Search
            </Button>
          </div>
        </motion.div>

        {/* Popular Searches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <span className="text-white/60">Popular:</span>
          {['Dubai', 'Maldives', 'Paris', 'Tokyo'].map((place) => (
            <Button
              key={place}
              variant="ghost"
              className="text-white/80 hover:text-white text-sm px-3 py-1 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300"
            >
              {place}
            </Button>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}

export default HeroSection