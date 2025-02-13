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
    { name: "My Bookings", path: "/client/bookings", icon: Calendar },
    { name: "Wishlist", path: "/client/wishlist", icon: Package },
    { name: "Travel Alone", path: "/client/travel-alone", icon: Calendar },
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
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-lg shadow-lg dark:bg-background/90 dark:shadow-primary/5"
          : "bg-background/50 backdrop-blur-sm dark:bg-background/70"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="mr-4 flex items-center flex-1">
        <Link href="/" className="mr-4 sm:mr-8 flex items-center space-x-2">
            <Image 
              src="/images/Musafer.png" 
              alt="Voyageur Logo" 
              width={100}
              height={30} 
              className="w-16 sm:w-20 h-auto" 
              priority
            />
        </Link>
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <motion.div
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors relative ${
                    isActive(item.path)
                      ? "text-primary dark:text-primary"
                      : "text-muted-foreground hover:text-primary dark:text-muted-foreground dark:hover:text-primary"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                  {isActive(item.path) && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="navbar-indicator"
                    />
                  )}
                </motion.div>
              </Link>
            ))}
          </nav>
        </div>

        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.div>
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <MobileNav navItems={navItems} />
          </SheetContent>
        </Sheet>

        <div className="flex items-center justify-end space-x-2 sm:space-x-4 flex-1">
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
                  className="pr-10 w-full md:w-[300px] lg:w-[400px] bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary"
                  autoFocus
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsSearchOpen(true)}
                  className="hover:bg-primary/10"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <nav className="flex items-center space-x-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/${user.role}/profile`}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild className="mr-2">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild>
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

const MobileNav = ({ navItems }: { navItems: { name: string; path: string; icon: any }[] }) => {
  return (
    <div className="min-h-screen bg-background pt-6 pb-20">
      <div className="px-6 pb-6 mb-6 border-b">
        <Link href="/" className="mr-4 sm:mr-8 flex items-center space-x-2 relative group">
            <Image src="/images/Musafer.png" alt="Voyageur Logo" width={120} height={40} className="w-24 sm:w-32" />
          </Link>
      </div>
      <nav className="px-3">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <motion.div
              className="flex items-center space-x-4 px-3 py-4 rounded-lg hover:bg-primary/10 transition-colors"
              whileHover={{ x: 5 }}
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

