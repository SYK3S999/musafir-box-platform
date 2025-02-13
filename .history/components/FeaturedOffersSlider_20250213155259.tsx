"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const featuredOffers = [
  {
    id: 1,
    title: "Serene Bali Retreat",
    description: "7 days of tranquility in the heart of Ubud",
    price: "$1299",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 2,
    title: "Tokyo Tech Tour",
    description: "5 days exploring Japan's cutting-edge innovations",
    price: "$1799",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 3,
    title: "Moroccan Desert Adventure",
    description: "10 days traversing the Sahara's golden dunes",
    price: "$2199",
    image: "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?auto=format&fit=crop&w=1080&q=80",
  },
]

const OfferCard = ({ offer, isActive }: { offer: typeof featuredOffers[0], isActive: boolean }) => (
  <div className="relative h-full w-full">
    <div className="relative h-full w-full">
      <Image
        src={offer.image || "/placeholder.svg"}
        alt={offer.title}
        layout="fill"
        objectFit="cover"
        priority={true}
        quality={90}
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white"
    >
      <motion.h3
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3"
      >
        {offer.title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-sm sm:text-base md:text-xl mb-4 sm:mb-6 text-gray-200"
      >
        {offer.description}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex justify-between items-center"
      >
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          {offer.price}
        </span>
        <Button
          size="sm"
          className="rounded-full bg-white text-black hover:bg-white/90 transition-all duration-300 px-4 py-2 text-sm sm:text-base font-semibold"
        >
          Book Now
        </Button>
      </motion.div>
    </motion.div>
  </div>
)

const NavigationButton = ({ direction, onClick, children }: { direction: 'left' | 'right', onClick: () => void, children: React.ReactNode }) => (
  <Button
    variant="outline"
    size="icon"
    onClick={onClick}
    className={`
      absolute top-1/2 -translate-y-1/2 z-10
      ${direction === "left" ? "left-2 sm:left-4" : "right-2 sm:right-4"}
      rounded-full bg-white/10 backdrop-blur-md
      hover:bg-white/30 hover:scale-110
      transition-all duration-300
      border-none shadow-lg
      w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
    `}
  >
    {children}
  </Button>
)

const ProgressIndicator = ({ total, current }: { total: number, current: number }) => (
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
    {[...Array(total)].map((_, index) => (
      <motion.div
        key={index}
        initial={{ scale: 0 }}
        animate={{
          scale: 1,
          backgroundColor: current === index ? "rgb(255, 255, 255)" : "rgba(255, 255, 255, 0.3)",
        }}
        className="w-2 h-2 rounded-full"
        transition={{ duration: 0.3 }}
      />
    ))}
  </div>
)

export function FeaturedOffersSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prevIndex) => (prevIndex === featuredOffers.length - 1 ? 0 : prevIndex + 1))
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const navigate = (newDirection: number) => {
    setDirection(newDirection)
    if (newDirection > 0) {
      setCurrentIndex((prevIndex) => (prevIndex === featuredOffers.length - 1 ? 0 : prevIndex + 1))
    } else {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? featuredOffers.length - 1 : prevIndex - 1))
    }
  }

  return (
    <div className="relative overflow-hidden rounded-xl shadow-2xl h-[400px] sm:h-[500px] md:h-[600px] group">
      <AnimatePresence initial={false} custom={direction}>
        {featuredOffers.map(
          (offer, index) =>
            index === currentIndex && (
              <motion.div
                key={offer.id}
                custom={direction}
                variants={{
                  enter: (direction) => ({
                    x: direction > 0 ? 1000 : -1000,
                    opacity: 0,
                    scale: 0.9,
                  }),
                  center: {
                    zIndex: 1,
                    x: 0,
                    opacity: 1,
                    scale: 1,
                  },
                  exit: (direction) => ({
                    zIndex: 0,
                    x: direction < 0 ? 1000 : -1000,
                    opacity: 0,
                    scale: 0.9,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                }}
                className="absolute w-full h-full"
              >
                <Card className="overflow-hidden h-full border-none shadow-2xl">
                  <OfferCard offer={offer} isActive={index === currentIndex} />
                </Card>
              </motion.div>
            ),
        )}
      </AnimatePresence>

      <NavigationButton direction="left" onClick={() => navigate(-1)}>
        <ChevronLeft className="h-6 w-6" />
      </NavigationButton>

      <NavigationButton direction="right" onClick={() => navigate(1)}>
        <ChevronRight className="h-6 w-6" />
      </NavigationButton>

      <ProgressIndicator total={featuredOffers.length} current={currentIndex} />
    </div>
  )
}

export default FeaturedOffersSlider

