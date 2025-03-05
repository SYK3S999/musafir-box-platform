import { useState, useMemo, Suspense, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { 
  MapPin, 
  Filter, 
  Search, 
  Plane, 
  Building, 
  Compass, 
  SunDim, 
  Waves,
  X,
  Heart
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

// Types
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

// Enhanced mock data with multiple image fallbacks
const offers = [
  {
    id: 1,
    title: "Magical Maldives Getaway",
    description: "7 days of pure bliss in the heart of the Indian Ocean",
    price: 1999,
    category: "beach",
    duration: "7 days",
    difficulty: "Easy",
    tags: ["Luxury", "Relaxation"],
    images: [
      "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=800&q=80"
    ],
    agency_name: "Wanderlust Adventures"
  },
  {
    id: 2,
    title: "Spiritual Hajj Journey",
    description: "A guided 14-day pilgrimage to the holy city of Mecca",
    price: 2499,
    category: "hajj",
    duration: "14 days",
    difficulty: "Challenging",
    tags: ["Spiritual", "Religious"],
    images: [
      "https://img.freepik.com/photos-gratuite/dans-celebre-mosquee-sheikh-zayed-abu-dhabi-nuit-emirats-arabes-unis_268835-1068.jpg"
    ],
    agency_name: "Sacred Journeys"
  },
  {
    id: 3,
    title: "Enchanting Paris Escape",
    description: "5 days in the City of Light, including skip-the-line Eiffel Tower access",
    price: 1299,
    category: "city",
    duration: "5 days",
    difficulty: "Easy",
    tags: ["Cultural", "Urban"],
    images: [
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80"
    ],
    agency_name: "Sacred Journeys"
  },
  {
    id: 4,
    title: "Bali Adventure Retreat",
    description: "10 days exploring the natural wonders and culture of Bali",
    price: 1799,
    category: "beach",
    duration: "10 days",
    difficulty: "Moderate",
    tags: ["Adventure", "Nature"],
    images: [
      "https://img.freepik.com/photos-gratuite/jeune-fille-marches-maison-arbre-au-lever-du-soleil-dans-ile-nusa-penida-bali-indonesie_335224-350.jpg"
    ],
    agency_name: "Sacred Journeys"
  },
  {
    id: 5,
    title: "Moroccan Desert Expedition",
    description: "8 days traversing the stunning landscapes of Morocco",
    price: 1599,
    category: "adventure",
    duration: "8 days",
    difficulty: "Challenging",
    tags: ["Cultural", "Adventure"],
    images: [
      "https://img.freepik.com/photos-gratuite/ombres-chameaux-dans-desert-du-sahara-merzouga_661209-123.jpg"
    ],
    agency_name: "Sacred Journeys"
  }
]
type User = {
  id: string;
  type: 'client' | 'admin' | 'agent';
} | null;


const categoryIcons = {
  beach: Waves,
  city: Building,
  hajj: Compass,
  omra: SunDim,
  adventure: Plane,
  all: MapPin
}
function LoginModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const router = useRouter()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Login Required</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-muted-foreground">
            Please log in to add items to your wishlist.
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => router.push('/login')}>
              Log In
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
function OfferCard({ 
  offer, 
  CategoryIcon, 
  onBookNow, 
  onToggleWishlist,
  isWishlisted,
  user
}: {
  offer: Offer
  CategoryIcon: any
  onBookNow: (id: number) => void
  onToggleWishlist: (offer: Offer) => void
  isWishlisted: boolean
  user: { id: string; role: "client" | "agency" | "admin" } | null // ✅ Match AuthContext user
}) {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const primaryImage = offer.images[0]
  const secondaryImage = offer.images[1] || "https://via.placeholder.com/600x400"

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || user.role !== 'client') {
      setShowLoginModal(true);
      return; // Stop execution here
    }
    onToggleWishlist(offer);
  };
  

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
          onClick={handleWishlistClick}
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
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </motion.div>
  )
}


function OffersContent() {
  const { user } = useAuth() // ✅ Get authenticated user

  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || "all"
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [sortBy, setSortBy] = useState("price")
  const [priceRange, setPriceRange] = useState([0, 3000])
  const [difficulty, setDifficulty] = useState("all")
  const [wishlist, setWishlist] = useState<Offer[]>([])

  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist))
    }
  }, [])
  useEffect(() => {
  if (!user) {
    // Reset wishlist when user logs out
    setWishlist([]);
    localStorage.removeItem("wishlist"); // Clear wishlist from localStorage
  }
}, [user]); // Run this effect when `user` changes

  

  const handleToggleWishlist = (offer: Offer) => {
    if (!user || user.role !== "client") return // ✅ Prevent action if user is not a client

    const isCurrentlyWishlisted = wishlist.some(item => item.id === offer.id)
    let newWishlist: Offer[]
    
    if (isCurrentlyWishlisted) {
      newWishlist = wishlist.filter(item => item.id !== offer.id)
    } else {
      newWishlist = [...wishlist, offer]
    }
    
    setWishlist(newWishlist)
    localStorage.setItem("wishlist", JSON.stringify(newWishlist))
  }

  const filteredOffers = useMemo(() => {
    return offers
      .filter(offer => 
        (selectedCategory === "all" || offer.category === selectedCategory) &&
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        offer.price >= priceRange[0] &&
        offer.price <= priceRange[1] &&
        (difficulty === "all" || offer.difficulty.toLowerCase() === difficulty.toLowerCase())
      )
      .sort((a, b) => {
        switch(sortBy) {
          case "price": return a.price - b.price
          case "duration": 
            const getDays = (duration: string) => parseInt(duration.split(' ')[0])
            return getDays(a.duration) - getDays(b.duration)
          default: return 0
        }
      })
  }, [searchTerm, selectedCategory, sortBy, priceRange, difficulty])

  const categories = [
    { value: "all", label: "All", icon: categoryIcons.all },
    { value: "beach", label: "Beach", icon: categoryIcons.beach },
    { value: "city", label: "City", icon: categoryIcons.city },
    { value: "hajj", label: "Hajj", icon: categoryIcons.hajj },
    { value: "adventure", label: "Adventure", icon: categoryIcons.adventure }
  ]

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSortBy("price")
    setPriceRange([0, 3000])
    setDifficulty("all")
  }

  const handleBookNow = (offerId: number) => {
    router.push(`/booking/${offerId}`)
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Discover Your Next Adventure
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our curated selection of unique travel experiences tailored to your wanderlust.
        </p>
      </motion.div>

      {/* Advanced Filtering Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Price Range */}
          <div className="col-span-1">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <select
                value={`${priceRange[0]}-${priceRange[1]}`}
                onChange={(e) => {
                  const [min, max] = e.target.value.split('-').map(Number)
                  setPriceRange([min, max])
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="0-3000">All Prices</option>
                <option value="0-1500">Under $1,500</option>
                <option value="1500-2500">$1,500 - $2,500</option>
                <option value="2500-3000">Over $2,500</option>
              </select>
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="col-span-1">
            <div className="relative">
              <Compass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="challenging">Challenging</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category and Sort Row */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Category Filter */}
          <div className="flex space-x-2 items-center overflow-x-auto">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <motion.button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl transition-all
                    ${selectedCategory === category.value 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </motion.button>
              )
            })}
          </div>

          {/* Sort and Clear Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-4 pr-10 py-2 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="price">Sort by Price</option>
                <option value="duration">Sort by Duration</option>
              </select>
            </div>

            {/* Wishlist Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/client/wishlist")}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-secondary/80 transition-all"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? "fill-red-500 text-red-500" : ""}`} />
              Wishlist ({wishlist.length})
            </motion.button>

            <motion.button
              onClick={clearFilters}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-secondary/80 transition-all"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Offers Grid */}
      <AnimatePresence>
        {filteredOffers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 bg-secondary/50 rounded-xl"
          >
            <p className="text-2xl font-semibold text-muted-foreground">
              No offers found matching your search
            </p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredOffers.map((offer) => {
              const CategoryIcon = categoryIcons[offer.category as keyof typeof categoryIcons] || MapPin
              const isWishlisted = wishlist.some(item => item.id === offer.id)

              return (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  CategoryIcon={CategoryIcon}
                  onBookNow={handleBookNow}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={isWishlisted} user={user}                />
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Loading fallback component
function OffersLoading() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="animate-pulse">
        <div className="h-20 bg-secondary/50 rounded-xl mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="h-12 bg-secondary/50 rounded-xl col-span-2"></div>
          <div className="h-12 bg-secondary/50 rounded-xl"></div>
          <div className="h-12 bg-secondary/50 rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-background border border-primary/10 rounded-2xl overflow-hidden h-[500px]">
              <div className="h-56 bg-secondary/50"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-secondary/50 rounded w-3/4"></div>
                <div className="h-4 bg-secondary/50 rounded w-1/2"></div>
                <div className="h-20 bg-secondary/50 rounded"></div>
                <div className="h-10 bg-secondary/50 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Main exported component wrapped in Suspense
export default function OffersPage() {
  return (
    <Suspense fallback={<OffersLoading />}>
      <OffersContent />
    </Suspense>
  )
}
