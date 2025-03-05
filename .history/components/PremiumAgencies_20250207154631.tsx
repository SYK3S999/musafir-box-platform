"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const premiumAgencies = [
  { name: "Luxe Voyages", logo: "https://logo.clearbit.com/fourseasons.com", speciality: "Luxury Travel" },
  { name: "EcoAdventures", logo: "https://logo.clearbit.com/intrepidtravel.com", speciality: "Sustainable Tourism" },
  { name: "CulturalOdyssey", logo: "https://logo.clearbit.com/gadventures.com", speciality: "Cultural Experiences" },
  { name: "UrbanEscapades", logo: "https://logo.clearbit.com/airbnb.com", speciality: "City Breaks" },
]

export function PremiumAgencies() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <motion.h2
        className="text-4xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        Featured Premium Agencies
      </motion.h2>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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
            <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Image
                  src={agency.logo || "/placeholder.svg"}
                  alt={`${agency.name} logo`}
                  width={80}
                  height={80}
                  className="mb-4 rounded-full"
                />
                <h3 className="text-xl font-bold mb-2 text-center">{agency.name}</h3>
                <p className="text-sm text-foreground/60 mb-4 text-center">{agency.speciality}</p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/agencies/${agency.name.toLowerCase().replace(" ", "-")}`}>View Offers</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      <div className="text-center mt-12">
        <Button variant="default" size="lg" asChild>
          <Link href="/register?type=agency">Become a Premium Agency</Link>
        </Button>
      </div>
    </div>
  )
}

