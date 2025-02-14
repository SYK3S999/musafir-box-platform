"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

const reasons = [
  {
    title: "Curated Experiences",
    description: "Hand-picked, exclusive journeys tailored to your preferences.",
    icon: "🌟",
    color: "from-blue-500/10 to-blue-500/20",
  },
  {
    title: "24/7 Concierge",
    description: "Round-the-clock support for a seamless travel experience.",
    icon: "🔔",
    color: "from-green-500/10 to-green-500/20",
  },
  {
    title: "Best Price Guarantee",
    description: "Unbeatable value for your dream getaways.",
    icon: "💎",
    color: "from-purple-500/10 to-purple-500/20",
  },
]

export function WhyChooseUs() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {reasons.map((reason, index) => (
          <motion.div
            key={reason.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <Card className="h-full overflow-hidden relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${reason.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <CardContent className="relative z-10 flex flex-col h-full p-6">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-4 group-hover:scale-110 transition-transform duration-300">
                    {reason.icon}
                  </span>
                  <h3 className="text-2xl font-bold text-primary">{reason.title}</h3>
                </div>
                <p className="text-foreground/80">{reason.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

