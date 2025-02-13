"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function GetStartedCTA() {
  return (
    <section className="py-16 bg-gradient-to-t from-background to-secondary/20">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="bg-gradient-to-br from-primary to-secondary text-white">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Get Started Today</CardTitle>
              <CardDescription className="text-xl text-center text-white/80">
                Ready to plan your next trip?
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button asChild size="lg" variant="secondary" className="rounded-full text-primary font-bold">
                <Link href="/register">Sign Up Now</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

