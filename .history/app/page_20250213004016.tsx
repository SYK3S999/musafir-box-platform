import React from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from "@/components/HeroSection";
import { FeaturedOffersSlider } from "@/components/FeaturedOffersSlider";
import { TravelCategories } from "@/components/TravelCategories";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { PremiumAgencies } from "@/components/PremiumAgencies";

// Fade-in animation variant
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Section Title Component with modern styling
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <motion.h2 
    className="text-3xl font-bold text-gray-900 mb-8 relative"
    variants={fadeIn}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
  >
    <span className="relative z-10">
      {children}
    </span>
    <span className="absolute bottom-0 left-0 w-12 h-1 bg-blue-600 rounded-full"></span>
  </motion.h2>
);

// Section Wrapper with consistent spacing and animations
const SectionWrapper = ({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string 
}) => (
  <motion.section 
    className={`py-16 px-4 md:px-8 max-w-7xl mx-auto ${className}`}
    variants={fadeIn}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
  >
    {children}
  </motion.section>
);

// Modern section separator with gradient and wave
const SectionSeparator = () => (
  <div className="relative h-24 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
    <svg
      className="absolute bottom-0 w-full h-16"
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
    >
      <path
        fill="currentColor"
        className="text-white"
        d="M0,50 C240,100 480,0 720,50 C960,100 1200,0 1440,50 L1440,100 L0,100 Z"
      />
    </svg>
  </div>
);

export default function Home() {
  return (
    <main className="bg-gray-50">
      {/* Hero Section */}
      <SectionWrapper className="pt-0">
        <HeroSection />
      </SectionWrapper>

      <SectionSeparator />

      {/* Featured Offers Section */}
      <SectionWrapper className="bg-white">
        <SectionTitle>Featured Offers</SectionTitle>
        <FeaturedOffersSlider />
      </SectionWrapper>

      <SectionSeparator />

      {/* Travel Categories Section */}
      <SectionWrapper>
        <SectionTitle>Explore Travel Categories</SectionTitle>
        <TravelCategories />
      </SectionWrapper>

      <SectionSeparator />

      {/* Why Choose Us Section */}
      <SectionWrapper className="bg-white">
        <SectionTitle>Why Choose Us</SectionTitle>
        <WhyChooseUs />
      </SectionWrapper>

      <SectionSeparator />

      {/* Premium Agencies Section */}
      <SectionWrapper>
        <SectionTitle>Premium Travel Agencies</SectionTitle>
        <PremiumAgencies />
      </SectionWrapper>
    </main>
  );
}