'use client'

import { HeroSection } from "@/components/HeroSection"
import { FeaturedOffersSlider } from "@/components/FeaturedOffersSlider"
import { TravelCategories } from "@/components/TravelCategories"
import { WhyChooseUs } from "@/components/WhyChooseUs"
import { PremiumAgencies } from "@/components/PremiumAgencies"
import { motion } from "framer-motion"
import type React from "react"
import TravelRecommendations from "@/components/recommendations"

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <motion.h2
    className="text-5xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true, amount: 0.2 }}
  >
    {children}
  </motion.h2>
)

const SectionWrapper = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.section
    className={`py-16 md:py-24 ${className}`}
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true, amount: 0.2 }}
  >
    {children}
  </motion.section>
)

const SectionSeparator = () => (
  <div className="relative h-32">
    <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent opacity-30" />
    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
  </div>
)

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />

      <SectionSeparator />

      <SectionWrapper>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle>Featured Offers</SectionTitle>
          <FeaturedOffersSlider />
        </div>
      </SectionWrapper>

      <SectionSeparator />

      <SectionWrapper className="bg-gradient-conic from-background via-primary/5 to-background">
        <TravelCategories />
      </SectionWrapper>
      <SectionSeparator />
      <SectionWrapper>
        <TravelRecommendations />
      </SectionWrapper>
      <SectionSeparator />
      <SectionWrapper>
        <WhyChooseUs />
      </SectionWrapper>

      <SectionSeparator />

      <SectionWrapper className="bg-gradient-radial from-primary/5 to-background">
        <PremiumAgencies />
      </SectionWrapper>
    </div>
  )
}

