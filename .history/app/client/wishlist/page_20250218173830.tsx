// Create a new file: app/(routes)/wishlist/page.tsx
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Heart, Undo2 } from "lucide-react"
import { OfferCard, type Offer } from "@/components/ui/OfferCard"
import { categoryIcons } from "@/lib/constants" // Move your categoryIcons to a constants file

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<Offer[]>([])
  const router = useRouter()

  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist))
    }
  }, [])

  const handleRemoveFromWishlist = (offer: Offer) => {
    const newWishlist = wishlistItems.filter(item => item.id !== offer.id)
    setWishlistItems(newWishlist)
    localStorage.setItem("wishlist", JSON.stringify(newWishlist))
  }

  const handleBookNow = (offerId: number) => {
    router.push(`/client/booking/`)
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Your Wishlist
            </h1>
            <p className="text-muted-foreground">
              {wishlistItems.length} saved destinations waiting for you
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all"
          >
            <Undo2 className="w-4 h-4" />
            Back to Offers
          </button>
        </div>

        <AnimatePresence>
          {wishlistItems.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 bg-secondary/50 rounded-xl"
            >
              <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-2xl font-semibold text-muted-foreground mb-4">
                Your wishlist is empty
              </p>
              <button
                onClick={() => router.push("/offers")}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
              >
                Explore Offers
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlistItems.map((offer) => {
                const CategoryIcon = categoryIcons[offer.category as keyof typeof categoryIcons]
                return (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    CategoryIcon={CategoryIcon}
                    onBookNow={handleBookNow}
                    onToggleWishlist={handleRemoveFromWishlist}
                    isWishlisted={true}
                  />
                )
              })}
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}