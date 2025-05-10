import { motion } from "framer-motion"
import Link from "next/link"
import { Mail, MapPin, Plane, Book, Calendar, GraduationCap } from "lucide-react"

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <motion.footer
      className="relative footer-gradient text-secondary-foreground overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated circles */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Diagonal lines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(45deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 relative">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-12">
          {/* Company Info - Spans 5 columns */}
          <motion.div className="lg:col-span-5 space-y-6 sm:space-y-8" variants={itemVariants}>
            <div className="space-y-4">
              <h3 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                musaferBox
              </h3>
              <p className="text-lg text-secondary-foreground/90 leading-relaxed">
                Embark on extraordinary journeys with musaferBox. Where every destination tells a story, and every journey
                becomes a cherished memory.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="backdrop-blur-md bg-primary/5 rounded-2xl p-4 hover:bg-primary/10 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-1 text-primary" />
                  <div>
                    <h4 className="font-medium mb-1">Visit Us</h4>
                    <p className="text-sm text-secondary-foreground/80">123 Travel Street, World</p>
                  </div>
                </div>
              </div>
              <div className="backdrop-blur-md bg-primary/5 rounded-2xl p-4 hover:bg-primary/10 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 mt-1 text-primary" />
                  <div>
                    <h4 className="font-medium mb-1">Email Us</h4>
                    <p className="text-sm text-secondary-foreground/80">contact@musaferBox.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {["facebook", "instagram", "twitter"].map((platform) => (
                <motion.a
                  key={platform}
                  href={`#${platform}`}
                  className="relative group"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-primary/10 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300" />
                  <div className="relative bg-primary/5 p-3 rounded-lg backdrop-blur-sm group-hover:bg-primary/10 transition-all duration-300">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      {platform === "facebook" && (
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      )}
                      {platform === "instagram" && (
                        <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.88 4.88 0 0 1-1.772-1.153A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                      )}
                      {platform === "twitter" && (
                        <path d="M23 3.01s-2.018 1.192-3.14 1.53a4.48 4.48 0 0 0-7.86 3v1a10.66 10.66 0 0 1-9-4.53s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5 0-.278-.028-.556-.08-.83C21.94 5.674 23 3.01 23 3.01z" />
                      )}
                    </svg>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links & Categories - Spans 7 columns */}
          <motion.div
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            variants={itemVariants}
          >
            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold">Quick Links</h4>
              <ul className="space-y-4">
                {[
                  { name: "About Us", href: "/about" },
                  { name: "Contact", href: "/contact" },
                  { name: "Terms of Service", href: "/terms" },
                  { name: "Privacy Policy", href: "/privacy" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group flex items-center text-secondary-foreground/90 hover:text-secondary-foreground transition-colors duration-300"
                    >
                      <span className="w-8 h-[1px] bg-primary/50 group-hover:w-12 group-hover:bg-primary transition-all duration-300 mr-2" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Travel Categories */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold">Travel Categories</h4>
              <ul className="space-y-4">
                {[
                  { name: "Hajj", icon: Plane, category: "hajj" },
                  { name: "Omra", icon: Book, category: "omra" },
                  { name: "Organized Trips", icon: Calendar, category: "organized" },
                  { name: "Study Visa", icon: GraduationCap, category: "study" },
                ].map((item) => (
                  <li key={item.category}>
                    <Link
                      href={`/offers?category=${item.category}`}
                      className="group flex items-center gap-3 text-secondary-foreground/90 hover:text-secondary-foreground transition-colors duration-300"
                    >
                      <span className="p-2 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300">
                        <item.icon className="w-4 h-4 text-primary" />
                      </span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold">Newsletter</h4>
              <p className="text-secondary-foreground/90">Subscribe to receive travel updates and exclusive offers.</p>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2.5 rounded-xl bg-primary/5 backdrop-blur-sm border border-primary/20 focus:border-primary/30 outline-none transition-colors duration-300 text-secondary-foreground placeholder:text-secondary-foreground/50"
                  />
                </div>
                <button className="w-full px-4 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 backdrop-blur-sm transition-colors duration-300 font-medium text-secondary-foreground">
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          variants={itemVariants}
          className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-primary/20 text-center"
        >
          <p className="text-sm sm:text-base text-secondary-foreground/70">
            © {new Date().getFullYear()} musaferBox. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  )
}

export default Footer

