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
    className="relative mb-10"
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    viewport={{ once: true, amount: 0.2 }}
  >
    <h2 className="text-3xl md:text-4xl font-bold text-center">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/80">
        {children}
      </span>
    </h2>
    <motion.div 
      className="absolute -z-10 inset-0 blur-3xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 opacity-50"
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3] 
      }}
      transition={{ 
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  </motion.div>
)

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  index: number
}

const SectionWrapper = ({ children, className = "", index }: SectionWrapperProps) => {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])
  
  const isEven = index % 2 === 0

  return (
    <motion.section
      className={`relative py-16 ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Dynamic background elements */}
      <motion.div 
        className="absolute inset-0 -z-10"
        style={{ opacity }}
      >
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-r 
            ${isEven ? 'from-primary/5 via-transparent to-primary/10' : 'from-primary/10 via-transparent to-primary/5'}`}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"
          style={{ scale }}
          animate={{
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Animated border elements */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </motion.section>
  )
}

const FloatingBackground = () => (
  <div className="fixed inset-0 -z-20">
    <motion.div
      className="absolute inset-0"
      animate={{
        backgroundImage: [
          'radial-gradient(circle at 20% 20%, var(--primary-color) 0%, transparent 70%)',
          'radial-gradient(circle at 80% 80%, var(--primary-color) 0%, transparent 70%)',
          'radial-gradient(circle at 20% 20%, var(--primary-color) 0%, transparent 70%)'
        ]
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{
        '--primary-color': 'rgba(var(--primary), 0.03)'
      } as any}
    />
  </div>
)

export default function Home() {
  return (
    <div className="flex flex-col relative">
      <FloatingBackground />
      
      <HeroSection />

      <div className="relative">
        <SectionWrapper index={0}>
          <SectionTitle>Featured Offers</SectionTitle>
          <FeaturedOffersSlider />
        </SectionWrapper>

        <SectionWrapper index={1} className="bg-gradient-to-r from-background via-primary/5 to-background">
          <TravelCategories />
        </SectionWrapper>

        <SectionWrapper index={2}>
          <TravelRecommendations />
        </SectionWrapper>

        <SectionWrapper index={3} className="bg-gradient-to-l from-background via-primary/5 to-background">
          <WhyChooseUs />
        </SectionWrapper>

        <SectionWrapper index={4}>
          <PremiumAgencies />
        </SectionWrapper>
      </div>
    </div>
  )
}