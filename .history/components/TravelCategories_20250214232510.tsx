"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Plane, Umbrella, GraduationCap, MapPin, LandPlot , Building2, Users, Tent } from "lucide-react"

const categories = [
  {
    name: "Hajj & Umrah",
    description: "Embark on a spiritual journey to the holy cities of Makkah and Madinah",
    icon: <LandPlot  className="w-8 h-8" />,
    color: "from-emerald-500/10 to-emerald-500/20",
    hover: "group-hover:from-emerald-500/20 group-hover:to-emerald-500/30",
    iconColor: "text-emerald-600",
    accent: "bg-emerald-500",
  },
  {
    name: "Beach Getaways",
    description: "Discover pristine beaches and coastal paradises worldwide",
    icon: <Umbrella className="w-8 h-8" />,
    color: "from-sky-500/10 to-sky-500/20",
    hover: "group-hover:from-sky-500/20 group-hover:to-sky-500/30",
    iconColor: "text-sky-600",
    accent: "bg-sky-500",
  },
  {
    name: "Study Visas",
    description: "Your gateway to international education and student life abroad",
    icon: <GraduationCap className="w-8 h-8" />,
    color: "from-violet-500/10 to-violet-500/20",
    hover: "group-hover:from-violet-500/20 group-hover:to-violet-500/30",
    iconColor: "text-violet-600",
    accent: "bg-violet-500",
  },
  {
    name: "Group Excursions",
    description: "Join guided tours and create memories with fellow travelers",
    icon: <Users className="w-8 h-8" />,
    color: "from-amber-500/10 to-amber-500/20",
    hover: "group-hover:from-amber-500/20 group-hover:to-amber-500/30",
    iconColor: "text-amber-600",
    accent: "bg-amber-500",
  },
  {
    name: "Business Travel",
    description: "Seamless corporate travel solutions and business visa services",
    icon: <Building2 className="w-8 h-8" />,
    color: "from-rose-500/10 to-rose-500/20",
    hover: "group-hover:from-rose-500/20 group-hover:to-rose-500/30",
    iconColor: "text-rose-600",
    accent: "bg-rose-500",
  },
  {
    name: "Immigration",
    description: "Expert guidance for permanent residency and migration services",
    icon: <Plane className="w-8 h-8" />,
    color: "from-indigo-500/10 to-indigo-500/20",
    hover: "group-hover:from-indigo-500/20 group-hover:to-indigo-500/30",
    iconColor: "text-indigo-600",
    accent: "bg-indigo-500",
  },
  {
    name: "Safari Adventures",
    description: "Explore wildlife and natural wonders in guided safari tours",
    icon: <Tent className="w-8 h-8" />,
    color: "from-lime-500/10 to-lime-500/20",
    hover: "group-hover:from-lime-500/20 group-hover:to-lime-500/30",
    iconColor: "text-lime-600",
    accent: "bg-lime-500",
  },
  {
    name: "Visit Visa",
    description: "Hassle-free tourist visa services for global destinations",
    icon: <MapPin className="w-8 h-8" />,
    color: "from-orange-500/10 to-orange-500/20",
    hover: "group-hover:from-orange-500/20 group-hover:to-orange-500/30",
    iconColor: "text-orange-600",
    accent: "bg-orange-500",
  },
]

const CategoryCard = ({ category, index }: { category: (typeof categories)[0], index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, amount: 0.2 }}
      className="h-full"
    >
      <Card className="group h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-500 relative dark:bg-background/50 dark:hover:bg-background/70">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${category.color} ${category.hover} transition-all duration-500`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 h-1 ${category.accent} scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
        />
        <CardContent className="relative p-6">
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className={`${category.iconColor} bg-white p-4 rounded-xl shadow-lg inline-block mb-4`}
          >
            {category.icon}
          </motion.div>

          <h3 className="text-2xl font-bold mb-2 text-primary tracking-tight">{category.name}</h3>

          <p className="text-muted-foreground mb-4 leading-relaxed">{category.description}</p>

          <Button
            asChild
            variant="secondary"
            className="group/button w-full bg-white/50 hover:bg-white transition-all duration-300"
          >
            <Link
              href={`/offers?category=${category.name.toLowerCase()}`}
              className="flex items-center justify-between"
            >
              <span>Explore {category.name}</span>
              <ArrowRight className="w-4 h-4 transform group-hover/button:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function TravelCategories() {
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
          Find Your Perfect Journey
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          From spiritual pilgrimages to educational opportunities abroad
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {categories.map((category, index) => (
          <CategoryCard key={category.name} category={category} index={index} />
        ))}
      </div>
    </div>
  )
}

export default TravelCategories