// data/offers.ts

export interface Offer {
    id: number
    title: string
    description: string
    price: number
    category: 'beach' | 'city' | 'hajj' | 'adventure'
    duration: string
    difficulty: 'Easy' | 'Moderate' | 'Challenging'
    tags: string[]
    images: string[]
    agency_name: string
  }
  
  export const offers: Offer[] = [
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
        "/api/placeholder/800/600",
        "/api/placeholder/800/600"
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
        "/api/placeholder/800/600",
        "/api/placeholder/800/600"
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
        "/api/placeholder/800/600",
        "/api/placeholder/800/600"
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
        "/api/placeholder/800/600",
        "/api/placeholder/800/600"
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
        "/api/placeholder/800/600",
        "/api/placeholder/800/600"
      ],
      agency_name: "Sacred Journeys"
    }
  ]