"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, Search, Home, Package, Info, Mail, User, Calendar, LogOut,  LayoutDashboard,Users,Building2, } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/contexts/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



const getNavItems = (role: string | undefined) => {
  const commonItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Offers", path: "/offers", icon: Package },
    { name: "About", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: Mail },

  ]

  const clientItems = [
    { name: "Agencies Bookings", path: "/client/bookings", icon: Calendar },

    { name: "Travel Alone", path: "/client/travel-alone", icon: Calendar },
    {name: "Travel Alone Bookings", path "/client/travel-alone/bookings"}
    // { name: "Profile", path: "/client/profile", icon: User },
  ]

  const agencyItems = [
    { name: "My Offers", path: "/agency/offers", icon: Package },
    { name: "Reviews", path: "/agency/reviews", icon: Calendar },
    // { name: "Profile", path: "/agency/profile", icon: User },
  ]
  const adminItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Agencies", path: "/admin/agencies", icon: Building2 },
  ]

  if (role === "client") {
    return [...commonItems, ...clientItems]
  } else if (role === "agency") {
    return [...commonItems, ...agencyItems]
  } else if (role === "admin") {
    return [...commonItems, ...adminItems]
  }
  return commonItems
}

const Header = () => {
  const { user, logout } = useAuth()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = getNavItems(user?.role)

  return (
    <motion.header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl shadow-lg dark:bg-background/95 dark:shadow-primary/10"
          : "bg-background/50 backdrop-blur-md dark:bg-background/80"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="container flex h-20 items-center px-4 sm:px-6 lg:px-8">
        <div className="mr-4 flex items-center flex-1">
          <Link 
            href="/" 
            className="mr-4 sm:mr-10 flex items-center space-x-2 relative group"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Image 
                src="/Musafer.png" 
                alt="musaferBox Logo" 
                width={100} 
                height={30} 
                className="w-24 sm:w-20 h-auto transition-opacity duration-300 group-hover:opacity-90" 
                priority
              />
              <motion.div 
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <motion.div
                  className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-300 ${
                    isActive(item.path)
                      ? "text-primary bg-primary/10 dark:bg-primary/20"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10"
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                  {isActive(item.path) && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      layoutId="navbar-indicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            ))}
          </nav>
        </div>

        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              className="md:hidden relative group"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 transition-transform duration-300 rotate-90 group-hover:rotate-180" />
                ) : (
                  <Menu className="h-5 w-5 transition-transform duration-300 group-hover:rotate-180" />
                )}
              </motion.div>
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <MobileNav navItems={navItems} />
          </SheetContent>
        </Sheet>

        <div className="flex items-center justify-end space-x-3 sm:space-x-4 flex-1">
          <AnimatePresence mode="wait">
            {isSearchOpen ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <Input
                  type="search"
                  placeholder="Search destinations..."
                  className="pr-10 w-full md:w-[300px] lg:w-[400px] bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary rounded-xl transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  autoFocus
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full hover:bg-primary/10 rounded-xl transition-colors duration-300"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                exit={{ scale: 0 }}
              >
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsSearchOpen(true)}
                  className="hover:bg-primary/10 rounded-xl transition-all duration-300 hover:scale-110"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <nav className="flex items-center space-x-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-10 w-10 rounded-xl overflow-hidden transition-transform duration-300 hover:scale-110"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/avatars/01.png" alt={user.name} className="object-cover" />
                      <AvatarFallback className="bg-primary/10">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56 mt-2 p-2" 
                  align="end" 
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="p-2 rounded-lg cursor-pointer">
                    <Link href={`/${user.role}/profile`} className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="p-2 rounded-lg cursor-pointer text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  asChild 
                  className="rounded-xl hover:bg-primary/10 transition-all duration-300 hover:scale-105"
                >
                  <Link href="/login">Log in</Link>
                </Button>
                <Button 
                  asChild
                  className="rounded-xl bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
                >
                  <Link href="/register">Sign up</Link>
                </Button>
              </>
            )}
            <ModeToggle />
          </nav>
        </div>
      </div>
    </motion.header>
  )
}

import { LucideIcon } from "lucide-react";

const MobileNav = ({ navItems }: { navItems: { name: string; path: string; icon: LucideIcon }[] }) => {
  return (
    <div className="min-h-screen bg-background pt-6 pb-20">
      <div className="px-6 pb-6 mb-6 border-b">
        <Link href="/" className="flex items-center space-x-2 relative group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image 
              src="/Musafer.png" 
              alt="musaferBox Logo" 
              width={120} 
              height={40} 
              className="w-24 sm:w-32 transition-opacity duration-300 group-hover:opacity-90" 
            />
          </motion.div>
        </Link>
      </div>
      <nav className="px-3">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <motion.div
              className="flex items-center space-x-4 px-4 py-3 rounded-xl hover:bg-primary/10 transition-all duration-300"
              whileHover={{ x: 5, backgroundColor: "rgba(var(--primary), 0.1)" }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </motion.div>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Header
