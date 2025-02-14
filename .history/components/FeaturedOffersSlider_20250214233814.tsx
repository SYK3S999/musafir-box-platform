import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays, Clock, MapPin } from "lucide-react";

const featuredOffers = [
  {
    id: 1,
    title: "Serene Bali Retreat",
    description: "7 days of tranquility in the heart of Ubud",
    price: "$1299",
    duration: "7 days",
    location: "Ubud, Bali",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
  },
  {
    id: 2,
    title: "Tokyo Tech Tour",
    description: "5 days exploring Japan's cutting-edge innovations",
    price: "$1799",
    duration: "5 days",
    location: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
  },
  {
    id: 3,
    title: "Moroccan Desert Adventure",
    description: "10 days traversing the Sahara's golden dunes",
    price: "$2199",
    duration: "10 days",
    location: "Sahara Desert",
    image: "https://images.unsplash.com/photo-1489493585363-d69421e0edd3",
  },
];

const OfferCard = ({ offer, isActive }) => (
  <div className="relative h-full w-full group">
    <div className="relative h-full w-full overflow-hidden">
      <Image
        src={offer.image || "/api/placeholder/1080/720"}
        alt={offer.title}
        layout="fill"
        objectFit="cover"
        priority={true}
        quality={90}
        className="transform group-hover:scale-110 transition-transform duration-700"
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
    
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 40 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10"
    >
      <div className="flex flex-col gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-4 text-white/80 text-sm md:text-base"
        >
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {offer.duration}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {offer.location}
          </span>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight"
        >
          {offer.title}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl"
        >
          {offer.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex justify-between items-center pt-4"
        >
          <div className="flex flex-col">
            <span className="text-white/70 text-sm">Starting from</span>
            <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              {offer.price}
            </span>
          </div>
          <Button
            size="lg"
            className="rounded-full bg-white text-black hover:bg-white/90 hover:scale-105 transition-all duration-300 px-6 py-3 text-base font-semibold shadow-lg shadow-white/10"
          >
            Book Now
          </Button>
        </motion.div>
      </div>
    </motion.div>
  </div>
);

const NavigationButton = ({ direction, onClick, children }) => (
  <Button
    variant="outline"
    size="icon"
    onClick={onClick}
    className={`
      absolute top-1/2 -translate-y-1/2 z-10
      ${direction === "left" ? "left-4 sm:left-6" : "right-4 sm:right-6"}
      rounded-full bg-white/5 backdrop-blur-md
      hover:bg-white/20 hover:scale-110
      transition-all duration-300
      border-white/10 shadow-lg
      w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
      opacity-0 group-hover:opacity-100
    `}
  >
    {children}
  </Button>
);

const ProgressIndicator = ({ total, current }) => (
  <div className="absolute bottom-6 right-6 z-10 flex gap-2">
    {[...Array(total)].map((_, index) => (
      <motion.div
        key={index}
        initial={{ scale: 0 }}
        animate={{
          scale: 1,
          backgroundColor: current === index ? "rgb(255, 255, 255)" : "rgba(255, 255, 255, 0.2)",
        }}
        className="w-2 h-2 rounded-full"
        transition={{ duration: 0.3 }}
      />
    ))}
  </div>
);

export function FeaturedOffersSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex === featuredOffers.length - 1 ? 0 : prevIndex + 1));
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const navigate = (newDirection) => {
    setDirection(newDirection);
    if (newDirection > 0) {
      setCurrentIndex((prevIndex) => (prevIndex === featuredOffers.length - 1 ? 0 : prevIndex + 1));
    } else {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? featuredOffers.length - 1 : prevIndex - 1));
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-2xl h-[500px] sm:h-[600px] md:h-[700px] group">
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
                    scale: 0.95,
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
                    scale: 0.95,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.5 },
                }}
                className="absolute w-full h-full"
              >
                <Card className="overflow-hidden h-full border-none shadow-2xl">
                  <OfferCard offer={offer} isActive={index === currentIndex} />
                </Card>
              </motion.div>
            )
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
  );
}

export default FeaturedOffersSlider;