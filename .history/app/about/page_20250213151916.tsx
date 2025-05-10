"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Globe, Heart, Leaf, Lightbulb, Users } from "lucide-react"

const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(236,72,153,0.1),transparent_50%)]" />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0.5, 1, 0.5],
        scale: [1, 1.2, 1],
      }}
      transition={{ 
        duration: 10,
        repeat: Infinity,
        ease: "linear"
      }}
      className="absolute inset-0"
    >
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px]" />
    </motion.div>
  </div>
)

interface ValueCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const ValueCard = ({ icon: Icon, title, description }: ValueCardProps) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="flex items-start space-x-3 p-4 rounded-xl bg-white/30 backdrop-blur-sm"
  >
    <div className="flex-shrink-0">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Icon className="w-5 h-5 text-primary" />
      </div>
    </div>
    <div>
      <h3 className="font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </motion.div>
)

export default function AboutPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Section - About Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="w-full max-w-xl"
        >
          <Card className="relative overflow-hidden border-none shadow-none bg-transparent">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 opacity-10" />
            
            <CardHeader className="text-center relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
              >
                <Globe className="w-8 h-8 text-primary" />
              </motion.div>
              
              <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                About musaferBox
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Your ultimate travel companion for unforgettable experiences
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 relative z-10 pt-4">
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-gray-600"
              >
                musaferBox is your ultimate travel companion, connecting you with top travel agencies and unforgettable
                experiences around the world. Our mission is to make travel planning easy, enjoyable, and accessible to
                everyone.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600"
              >
                Founded in 2023, we've quickly grown to become a trusted platform for both travelers and travel agencies. We
                believe that every journey has the potential to be life-changing, and we're here to help you make those dreams
                a reality.
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Right Section - Values */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
        <AnimatedBackground />
        <div className="relative z-10 w-full h-full flex flex-col justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 max-w-md mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Our Values
              </h2>
              <p className="text-gray-600">
                What drives us to create amazing travel experiences
              </p>
            </div>

            <ValueCard
              icon={Heart}
              title="Passion for Travel"
              description="We're dedicated to creating unforgettable journey experiences"
            />

            <ValueCard
              icon={Users}
              title="Customer Satisfaction"
              description="Your happiness and comfort are our top priorities"
            />

            <ValueCard
              icon={Leaf}
              title="Sustainability"
              description="Committed to environmentally responsible travel practices"
            />

            <ValueCard
              icon={Lightbulb}
              title="Innovation"
              description="Constantly improving our services with cutting-edge solutions"
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

