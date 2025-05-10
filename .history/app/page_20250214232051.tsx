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
  <motion.div
    className="relative mb-8"
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    viewport={{ once: true, amount: 0.2 }}
  >
    <h2 className="text-3xl md:text-5xl font-bold text-center">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/80">
        {children}
      </span>
    </h2>
    <div className="absolute -z-10 inset-0 blur-3xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 opacity-50" />
  </motion.div>
)

const SectionWrapper = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.section
    className={`relative py-20 ${className}`}
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true, amount: 0.2 }}
  >
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-30" />
    </div>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  </motion.section>
)

const SectionSeparator = () => (
  <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
)

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      
      <div className="relative">
        {/* Floating background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-primary/10 via-transparent to-transparent rotate-12 blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-primary/10 via-transparent to-transparent -rotate-12 blur-3xl" />
        </div>

        <SectionWrapper className="bg-gradient-to-l from-background via-primary/5 to-background">
          <SectionTitle>Featured Offers</SectionTitle>
          <FeaturedOffersSlider />
        </SectionWrapper>

        <SectionSeparator />

        <SectionWrapper>
          <SectionTitle>Recommended for You</SectionTitle>
          <TravelRecommendations />
        </SectionWrapper>

        <SectionSeparator />

        <SectionWrapper className="bg-gradient-to-r from-background via-primary/5 to-background">
          <TravelCategories />
        </SectionWrapper>

        <SectionSeparator />

        <SectionWrapper className="bg-gradient-to-l from-background via-primary/5 to-background">
          <SectionTitle>Why musaferBox Stands Out</SectionTitle>
          <WhyChooseUs />
        </SectionWrapper>

        <SectionSeparator />

        <SectionWrapper>
          <SectionTitle>Premium Agencies</SectionTitle>
          <PremiumAgencies />
        </SectionWrapper>
      </div>
    </div>
  )
}