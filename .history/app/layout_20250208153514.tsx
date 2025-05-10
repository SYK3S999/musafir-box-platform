'use client'

import "./globals.css"
import { Inter } from "next/font/google"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AnimatePresence, motion } from "framer-motion"
import type React from "react"
import Chatbot from "@/components/Chatbot"
import { AuthProvider } from "@/contexts/AuthContext" // Added import for AuthProvider

const inter = Inter({ subsets: ["latin"] })

// export const metadata = {
//   title: "musaferBox - Your Ultimate Travel Companion",
//   description: "Discover and book amazing travel experiences with top agencies worldwide",
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <AnimatePresence mode="wait">
                <motion.main
                  className="flex-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {children}
                </motion.main>
              </AnimatePresence>
              <Footer />
            </div>
          </AuthProvider>
          <Toaster />
          <Chatbot />
        </ThemeProvider>
      </body>
    </html>
  )
}

