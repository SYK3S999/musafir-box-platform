'use client'

import { HeroSection } from "@/components/HeroSection"
import { FeaturedOffersSlider } from "@/components/FeaturedOffersSlider"
import { TravelCategories } from "@/components/TravelCategories"
import { WhyChooseUs } from "@/components/WhyChooseUs"
import { PremiumAgencies } from "@/components/PremiumAgencies"
import { motion, useScroll, useTransform } from "framer-motion"
import type React from "react"
import TravelRecommendations from "@/components/recommendations"

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    className="relative mb-12"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    viewport={{ once: true, amount: 0.2 }}
  >
    <motion.div
      className="absolute -inset-x-4 -inset-y-2 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 blur-3xl -z-10"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
      viewport={{ once: true }}
    />
    <h2 className="text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
      {children}
    </h2>
    <div className="mt-4 flex justify-center">
      <div className="h-1 w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full" />
    </div>
  </motion.div>
)

const SectionWrapper = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3])
  
  return (
    <motion.section
      className={`relative py-20 md:py-32 overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div 
        className="absolute inset-0 -z-10"
        style={{ opacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-40" />
      </motion.div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </motion.section>
  )
}

const SectionSeparator = () => (
  <div className="relative h-24 md:h-32">
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-30" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-4 h-4 rotate-45 border-r border-b border-primary/20" />
    </motion.div>
  </div>
)

export default function Home() {
  return (
    <div className="flex flex-col bg-background">
      <HeroSection />

      <SectionSeparator />

      <SectionWrapper>
        <SectionTitle>Featured Offers</SectionTitle>
        <FeaturedOffersSlider />
      </SectionWrapper>

      <SectionSeparator />

      <SectionWrapper className="bg-gradient-conic from-background via-primary/5 to-background">
        <TravelCategories />
      </SectionWrapper>

      <SectionSeparator />

      <SectionWrapper className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
        <TravelRecommendations />
      </SectionWrapper>

      <SectionSeparator />

      <SectionWrapper className="bg-gradient-to-b from-background via-primary/5 to-background">
        <WhyChooseUs />
      </SectionWrapper>

      <SectionSeparator />

      <SectionWrapper className="bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
        <PremiumAgencies />
      </SectionWrapper>
    </div>
  )
}