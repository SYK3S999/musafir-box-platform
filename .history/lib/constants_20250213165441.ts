// lib/constants.ts

import { 
    MapPin, 
    Waves, 
    Building, 
    Compass, 
    SunDim, 
    Plane 
  } from "lucide-react"
  
  export const categoryIcons = {
    beach: Waves,
    city: Building,
    hajj: Compass,
    omra: SunDim,
    adventure: Plane,
    all: MapPin
  }
  
  export const categories = [
    { value: "all", label: "All", icon: categoryIcons.all },
    { value: "beach", label: "Beach", icon: categoryIcons.beach },
    { value: "city", label: "City", icon: categoryIcons.city },
    { value: "hajj", label: "Hajj", icon: categoryIcons.hajj },
    { value: "adventure", label: "Adventure", icon: categoryIcons.adventure }
  ]
  
  export const difficultyOptions = [
    { value: "all", label: "All Difficulties" },
    { value: "easy", label: "Easy" },
    { value: "moderate", label: "Moderate" },
    { value: "challenging", label: "Challenging" }
  ]
  
  export const priceRangeOptions = [
    { value: "0-3000", label: "All Prices" },
    { value: "0-1500", label: "Under $1,500" },
    { value: "1500-2500", label: "$1,500 - $2,500" },
    { value: "2500-3000", label: "Over $2,500" }
  ]