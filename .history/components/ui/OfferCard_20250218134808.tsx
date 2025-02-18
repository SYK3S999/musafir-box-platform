// Create a new file: components/OfferCard.tsx
import { Heart } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export type Offer = {
  id: number
  title: string
  description: string
  price: number
  category: string
  duration: string
  difficulty: string
  tags: string[]
  images: string[]
  agency_name: string
}

interface OfferCardProps {
  offer: Offer
  CategoryIcon: any
  onBookNow: (id: number) => void
  onToggleWishlist: (offer: Offer) => void
  isWishlisted: boolean
}

export function OfferCard({ 
  offer, 
  CategoryIcon, 
  onBookNow, 
  onToggleWishlist,
  isWishlisted 
}: OfferCardProps) {
  const primaryImage = offer.images[0]
  const secondaryImage = offer.images[1] || "https://via.placeholder.com/600x400"

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-background border border-primary/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group relative"
    >
      <div className="relative">
        <Image 
          src={primaryImage}
          alt={offer.title} 
          width={600}
          height={400}
          onError={(e) => {
            const imgElement = e.target as HTMLImageElement
            imgElement.src = secondaryImage
          }}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-primary/80 text-primary-foreground px-3 py-1 rounded-full text-sm">
          ${offer.price}
        </div>
        <div className="absolute top-4 left-4 bg-background/80 p-2 rounded-full">
          <CategoryIcon className="w-5 h-5 text-primary" />
        </div>
        <button
          onClick={() => onToggleWishlist(offer)}
          className="absolute bottom-4 right-4 bg-background/80 p-2 rounded-full hover:bg-background transition-colors"
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
            }`} 
          />
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">{offer.title}</h2>
        </div>
        
        <p className="text-sm text-muted-foreground mb-2">
          Offered by: <span className="font-medium text-primary">{offer.agency_name}</span>
        </p>
        
        <p className="text-muted-foreground mb-4">{offer.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {offer.tags.map((tag) => (
              <span 
                key={tag} 
                className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span>{offer.duration}</span>
            <span className="text-xs bg-primary/10 px-2 py-1 rounded-full">
              {offer.difficulty}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-6 pt-0">
        <button 
          onClick={() => onBookNow(offer.id)}
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          Book Now
        </button>
      </div>
    </motion.div>
  )
}