'use client'
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import type React from "react" // Added import for React
import type { HTMLAttributes } from "react"

type CardProps = HTMLAttributes<HTMLDivElement>

interface AnimatedCardProps extends CardProps {
  index: number;
  children: React.ReactNode;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, index, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card {...props}>{children}</Card>
    </motion.div>
  )
}

