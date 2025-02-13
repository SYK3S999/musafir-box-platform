"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ReviewCard } from "@/components/ReviewCard"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for agency reviews
const initialReviews = [
  {
    id: 1,
    author: "John Doe",
    rating: 5,
    comment: "Excellent service! The trip was perfectly organized and exceeded our expectations.",
    date: "2023-06-15",
  },
  {
    id: 2,
    author: "Jane Smith",
    rating: 4,
    comment: "Great experience overall. The guides were knowledgeable and friendly.",
    date: "2023-06-10",
  },
  {
    id: 3,
    author: "Mike Johnson",
    rating: 5,
    comment: "Unforgettable journey! Every detail was taken care of. Highly recommended!",
    date: "2023-06-05",
  },
]

export default function AgencyReviewsPage() {
  const [reviews, setReviews] = useState(initialReviews)
  const [, setSortBy] = useState("newest")

  const sortReviews = (method: string) => {
    const sortedReviews = [...reviews]
    switch (method) {
      case "newest":
        sortedReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case "oldest":
        sortedReviews.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case "highest":
        sortedReviews.sort((a, b) => b.rating - a.rating)
        break
      case "lowest":
        sortedReviews.sort((a, b) => a.rating - b.rating)
        break
    }
    setReviews(sortedReviews)
  }

  return (
    <ProtectedRoute allowedRoles={["agency"]}>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Your Agency Reviews
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See what your clients are saying about your services
          </p>
        </motion.div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">Showing {reviews.length} reviews</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <Select
              onValueChange={(value) => {
                setSortBy(value)
                sortReviews(value)
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Rated</SelectItem>
                <SelectItem value="lowest">Lowest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ReviewCard author={review.author} rating={review.rating} comment={review.comment} date={review.date} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8 text-center">
          <Button variant="outline">Load More Reviews</Button>
        </div>
      </div>
    </ProtectedRoute>
  )
}

