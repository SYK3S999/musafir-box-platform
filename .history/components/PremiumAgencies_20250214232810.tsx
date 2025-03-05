"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star, Award, ShieldCheck, ArrowRight } from "lucide-react"

const premiumAgencies = [
  {
    name: "Luxe Voyages",
    logo: "/api/placeholder/120/120",
    speciality: "Luxury Travel",
    rating: 4.9,
    reviews: 528,
    verified: true,
    featured: true
  },
  {
    name: "EcoAdventures",
    logo: "/api/placeholder/120/120",
    speciality: "Sustainable Tourism",
    rating: 4.8,
    reviews: 341,
    verified: true,
    featured: false
  },
  {
    name: "CulturalOdyssey",
    logo: "/api/placeholder/120/120",
    speciality: "Cultural Experiences",
    rating: 4.7,
    reviews: 423,
    verified: true,
    featured: false
  },
  {
    name: "UrbanEscapades",
    logo: "/api/placeholder/120/120",
    speciality: "City Breaks",
    rating: 4.8,
    reviews: 387,
    verified: true,
    featured: false
  },
]

export function PremiumAgencies() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.2 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Premium Travel Partners
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Collaborate with top-rated agencies for unforgettable journeys
        </p>
      </motion.div>
      
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {premiumAgencies.map((agency, index) => (
          <motion.div
            key={agency.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <Card className="group h-full overflow-hidden border border-primary/10 bg-gradient-to-br from-background to-primary/5 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
              <CardContent className="relative p-6">
                {agency.featured && (
                  <div className="absolute -right-12 top-4 rotate-45 bg-primary px-12 py-1">
                    <span className="text-xs font-semibold text-white">Featured</span>
                  </div>
                )}
                
                <div className="relative mb-6">
                  <div className="relative h-24 w-24 mx-auto">
                    <Image
                      src={agency.logo}
                      alt={`${agency.name} logo`}
                      width={120}
                      height={120}
                      className="rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    {agency.verified && (
                      <div className="absolute -right-2 -bottom-2 bg-primary rounded-full p-1.5">
                        <ShieldCheck className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{agency.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{agency.speciality}</p>
                  <div className="flex items-center justify-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium">{agency.rating}</span>
                    <span className="text-sm text-muted-foreground">({agency.reviews} reviews)</span>
                  </div>
                </div>

                <Button 
                  variant="default" 
                  className="w-full group/button bg-primary/90 hover:bg-primary transition-all duration-300"
                  asChild
                >
                  <Link 
                    href={`/agencies/${agency.name.toLowerCase().replace(" ", "-")}`}
                    className="flex items-center justify-between"
                  >
                    <span>View Offers</span>
                    <ArrowRight className="w-4 h-4 transform group-hover/button:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="text-center mt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="inline-flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-primary" />
          <span className="text-lg font-medium">Join Our Premium Network</span>
        </div>
        <Button 
          variant="outline" 
          size="lg" 
          className="group border-primary/20 hover:border-primary/40"
          asChild
        >
          <Link href="/register?type=agency" className="flex items-center gap-2">
            Become a Premium Agency
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}

export default PremiumAgencies