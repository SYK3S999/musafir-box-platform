"use client"
import { useState, useMemo, Suspense, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { 
  MapPin, Filter, Search, Plane, Building, Compass, SunDim, Waves, X, Heart
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

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

const offers: Offer[] = [
  {
    id: 1,
    title: "Magical Maldives Getaway",
    description: "7 days of pure bliss in the heart of the Indian Ocean",
    price: 1999,
    category: "beach",
    duration: "7 days",
    difficulty: "Easy",
    tags: ["Luxury", "Relaxation"],
    images: ["https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=800&q=80"],
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
    images: ["https://img.freepik.com/photos-gratuite/dans-celebre-mosquee-sheikh-zayed-abu-dhabi-nuit-emirats-arabes-unis_268835-1068.jpg"],
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
    images: ["https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80"],
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
    images: ["https://img.freepik.com/photos-gratuite/jeune-fille-marches-maison-arbre-au-lever-du-soleil-dans-ile-nusa-penida-bali-indonesie_335224-350.jpg"],
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
    images: ["https://img.freepik.com/photos-gratuite/ombres-chameaux-dans-desert-du-sahara-merzouga_661209-123.jpg"],
    agency_name: "Sacred Journeys"
  }
]

const categoryIcons = {
  beach: Waves,
  city: Building,
  hajj: Compass,
  omra: SunDim,
  adventure: Plane,
  all: MapPin
}

// Modal for Wishlist Login Prompt (unchanged)
function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Login Required</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-muted-foreground">Please log in as a client to add items to your wishlist.</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => router.push('/login')}>Log In</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Modal for Booking Login Prompt
function BookingLoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Login Required</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-muted-foreground">You need to log in as a client to book this offer.</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => router.push("/login")}>Log In</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Modal for Non-Client Permission
function PermissionModal({ isOpen, onClose, role }: { isOpen: boolean; onClose: () => void; role: string | null }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Permission Denied</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-muted-foreground">
            {role === "agency" 
              ? "Agencies cannot book offers directly. Only clients can make bookings."
              : role === "admin" 
              ? "Admins cannot book offers. This feature is exclusive to clients."
              : "You need to be logged in as a client to book this offer."}
          </p>
          <div className="flex justify-end space-x-2">
            <Button onClick={onClose}>Got It</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Enhanced OfferCard
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
  onBookNow: (offer: Offer) => void
  onToggleWishlist: (offer: Offer) => void
  isWishlisted: boolean
  user: any
}) {
  const [showLoginModal, setShowLoginModal] = useState(false); // For wishlist
  const [showBookingLoginModal, setShowBookingLoginModal] = useState(false); // For booking when not logged in
  const [showPermissionModal, setShowPermissionModal] = useState(false); // For non-clients
  const [isBooking, setIsBooking] = useState(false); // Feedback for booking action
  const primaryImage = offer.images[0];
  const secondaryImage = offer.images[1] || "https://via.placeholder.com/600x400";

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || user.role !== "client") {
      setShowLoginModal(true);
      return;
    }
    onToggleWishlist(offer);
  };

  const handleBookNowClick = () => {
    if (!user) {
      setShowBookingLoginModal(true); // Show login prompt for unauthenticated users
    } else if (user.role !== "client") {
      setShowPermissionModal(true); // Show permission denied for agency/admin
    } else {
      setIsBooking(true); // Client: Proceed with booking
      onBookNow(offer);
      setTimeout(() => setIsBooking(false), 1000); // Reset booking state
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-background border border-primary/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group relative"
      title={`${offer.title} - ${offer.description}`}
    >
      <div className="relative">
        <Image 
          src={primaryImage}
          alt={offer.title} 
          width={600}
          height={400}
          onError={(e) => {
            const imgElement = e.target as HTMLImageElement;
            imgElement.src = secondaryImage;
          }}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-primary/80 text-primary-foreground px-3 py-1 rounded-full text-sm">
          ${offer.price}
        </div>
        <div className="absolute top-4 left-4 bg-background/80 p-2 rounded-full" title={`Category: ${offer.category}`}>
          <CategoryIcon className="w-5 h-5 text-primary" />
        </div>
        <button
          onClick={handleWishlistClick}
          className="absolute bottom-4 right-4 bg-background/80 p-2 rounded-full hover:bg-background transition-colors"
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} 
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
              <span key={tag} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs" title={`Tag: ${tag}`}>
                {tag}
              </span>
            ))}
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span>{offer.duration}</span>
            <span className="text-xs bg-primary/10 px-2 py-1 rounded-full">{offer.difficulty}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6 pt-0">
        <button 
          onClick={handleBookNowClick}
          disabled={isBooking}
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          title={user && user.role === "client" ? "Start booking this offer" : "Login as a client to book"}
        >
          {isBooking ? "Booking..." : "Book Now"}
        </button>
      </div>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <BookingLoginModal isOpen={showBookingLoginModal} onClose={() => setShowBookingLoginModal(false)} />
      <PermissionModal 
        isOpen={showPermissionModal} 
        onClose={() => setShowPermissionModal(false)} 
        role={user ? user.role : null} // Pass role for tailored message
      />
    </motion.div>
  );
}

// Updated RecommendedOffers Component
function RecommendedOffers({
  wishlist,
  onBookNow,
  onToggleWishlist,
  user
}: {
  wishlist: Offer[]
  onBookNow: (offer: Offer) => void
  onToggleWishlist: (offer: Offer) => void
  user: any
}) {
  // Determine preferred categories from wishlist, fallback to popular categories
  const preferredCategories = useMemo(() => {
    const wishlistCategories = Array.from(new Set(wishlist.map(offer => offer.category)));
    return wishlistCategories.length > 0 ? wishlistCategories : ["beach", "city"];
  }, [wishlist]);

  // Filter recommended offers with fallback to ensure offers are always shown
  const recommendedOffers = useMemo(() => {
    // Step 1: Try preferred categories, non-wishlisted, within price range
    let recs = offers
      .filter(offer => 
        !wishlist.some(w => w.id === offer.id) && // Exclude wishlisted
        preferredCategories.includes(offer.category) && // Match preferred categories
        offer.price >= 1000 && offer.price <= 2500 // Price range
      )
      .slice(0, 3); // Limit to 3

    // Step 2: If fewer than 3 offers, add non-wishlisted offers from any category
    if (recs.length < 3) {
      const additional = offers
        .filter(offer => 
          !wishlist.some(w => w.id === offer.id) && // Non-wishlisted
          !recs.some(r => r.id === offer.id) && // Not already included
          offer.price >= 1000 && offer.price <= 2500 // Price range
        )
        .slice(0, 3 - recs.length); // Fill up to 3
      recs = [...recs, ...additional];
    }

    // Step 3: If still fewer than 3, relax price range
    if (recs.length < 3) {
      const more = offers
        .filter(offer => 
          !wishlist.some(w => w.id === offer.id) && // Non-wishlisted
          !recs.some(r => r.id === offer.id) // Not already included
        )
        .slice(0, 3 - recs.length); // Fill up to 3
      recs = [...recs, ...more];
    }

    return recs.slice(0, 3); // Ensure max 3 offers
  }, [wishlist, preferredCategories]);

  if (recommendedOffers.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, amount: 0.2 }}
      className="relative py-20"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-30" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/80">
              Recommended for You
            </span>
          </h2>
          <div className="absolute -z-10 inset-0 blur-3xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 opacity-50" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {recommendedOffers.map((offer) => {
            const CategoryIcon = categoryIcons[offer.category as keyof typeof categoryIcons] || MapPin;
            const isWishlisted = wishlist.some(item => item.id === offer.id);
            return (
              <OfferCard
                key={offer.id}
                offer={offer}
                CategoryIcon={CategoryIcon}
                onBookNow={onBookNow}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={isWishlisted}
                user={user}
              />
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}

// Separator Component (reused from Home.tsx)
const SectionSeparator = () => (
  <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
);

function OffersContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("price");
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [difficulty, setDifficulty] = useState("all");
  const [wishlist, setWishlist] = useState<Offer[]>([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);

  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      localStorage.removeItem("wishlist");
    }
  }, [user]);

  const handleToggleWishlist = (offer: Offer) => {
    if (!user || user.role !== "client") return;

    const newWishlist = wishlist.some(item => item.id === offer.id)
      ? wishlist.filter(item => item.id !== offer.id)
      : [...wishlist, offer];
    
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
  };

  const handleBookNow = (offer: Offer) => {
    const query = new URLSearchParams({
      offerId: offer.id.toString(),
      title: offer.title,
      category: offer.category,
      price: offer.price.toString(),
      agency: offer.agency_name,
    }).toString();
    router.push(`/client/booking?${query}`);
  };

  const filteredOffers = useMemo(() => {
    setIsLoadingFilters(true);
    const result = offers
      .filter(offer => 
        (selectedCategory === "all" || offer.category === selectedCategory) &&
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        offer.price >= priceRange[0] &&
        offer.price <= priceRange[1] &&
        (difficulty === "all" || offer.difficulty.toLowerCase() === difficulty.toLowerCase())
      )
      .sort((a, b) => {
        switch(sortBy) {
          case "price": return a.price - b.price;
          case "duration": 
            const getDays = (duration: string) => parseInt(duration.split(' ')[0]);
            return getDays(a.duration) - getDays(b.duration);
          default: return 0;
        }
      });
    setTimeout(() => setIsLoadingFilters(false), 300);
    return result;
  }, [searchTerm, selectedCategory, sortBy, priceRange, difficulty]);

  const categories = [
    { value: "all", label: "All", icon: categoryIcons.all },
    { value: "beach", label: "Beach", icon: categoryIcons.beach },
    { value: "city", label: "City", icon: categoryIcons.city },
    { value: "hajj", label: "Hajj", icon: categoryIcons.hajj },
    { value: "adventure", label: "Adventure", icon: categoryIcons.adventure }
  ];

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("price");
    setPriceRange([0, 3000]);
    setDifficulty("all");
  };

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

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              aria-label="Search travel offers by destination"
            />
          </div>
          <div className="col-span-1">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <select
                value={`${priceRange[0]}-${priceRange[1]}`}
                onChange={(e) => {
                  const [min, max] = e.target.value.split('-').map(Number);
                  setPriceRange([min, max]);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                aria-label="Filter by price range"
              >
                <option value="0-3000">All Prices</option>
                <option value="0-1500">Under $1,500</option>
                <option value="1500-2500">$1,500 - $2,500</option>
                <option value="2500-3000">Over $2,500</option>
              </select>
            </div>
          </div>
          <div className="col-span-1">
            <div className="relative">
              <Compass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                aria-label="Filter by difficulty level"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="challenging">Challenging</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex space-x-2 items-center overflow-x-auto">
            {categories.map((category) => {
              const Icon = category.icon;
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
                  title={`Filter by ${category.label}`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </motion.button>
              );
            })}
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-4 pr-10 py-2 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                aria-label="Sort offers"
              >
                <option value="price">Sort by Price</option>
                <option value="duration">Sort by Duration</option>
              </select>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/client/wishlist")}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-secondary/80 transition-all"
              title="View your saved wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? "fill-red-500 text-red-500" : ""}`} />
              Wishlist ({wishlist.length})
            </motion.button>
            <motion.button
              onClick={clearFilters}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-secondary/80 transition-all"
              title="Reset all filters"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isLoadingFilters ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">Filtering offers...</p>
          </motion.div>
        ) : filteredOffers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 bg-secondary/50 rounded-xl"
          >
            <p className="text-2xl font-semibold text-muted-foreground">
              No offers found matching your search
            </p>
            <Button onClick={clearFilters} className="mt-4" variant="outline">
              Reset Filters
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredOffers.map((offer) => {
              const CategoryIcon = categoryIcons[offer.category as keyof typeof categoryIcons] || MapPin;
              const isWishlisted = wishlist.some(item => item.id === offer.id);

              return (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  CategoryIcon={CategoryIcon}
                  onBookNow={handleBookNow}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={isWishlisted}
                  user={user}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recommended Offers Section for Logged-In Clients */}
      {user && user.role === "client" && (
        <>
          <SectionSeparator />
          <RecommendedOffers
            wishlist={wishlist}
            onBookNow={handleBookNow}
            onToggleWishlist={handleToggleWishlist}
            user={user}
          />
        </>
      )}
    </div>
  );
}

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
  );
}

export default function OffersPage() {
  return (
    <Suspense fallback={<OffersLoading />}>
      <OffersContent />
    </Suspense>
  );
}