"use client"

import { SetStateAction, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { Plane, Mail, Lock, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

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
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
      className="absolute inset-0"
    >
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px]" />
    </motion.div>
  </div>
)

interface InputWithIconProps {
  icon: React.ReactNode
  label: string
  id: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  error?: string
}

const InputWithIcon = ({ 
  icon, 
  label, 
  id, 
  type = "text", 
  value, 
  onChange, 
  placeholder,
  error 
}: InputWithIconProps) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
    <Label htmlFor={id} className="block text-sm font-medium">
      {label}
    </Label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        {icon}
      </div>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className={`pl-10 w-full ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
      />
    </div>
    {error && (
      <p className="text-sm text-red-500 mt-1">{error}</p>
    )}
  </motion.div>
)

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setIsLoading(true)
      await login(email, password)
      
      toast({
        title: "Welcome back! 🌟",
        description: "Get ready to explore amazing destinations.",
        duration: 5000,
      })
      
      router.push("/")
    } catch (error) {
      let errorMessage = "Please check your credentials and try again."
      
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      })
      
      // Clear password on failed login
      setPassword("")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
        <AnimatedBackground />
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="mb-8">
              <Plane className="w-20 h-20 text-primary mx-auto" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome Back</h1>
            <p className="text-lg text-gray-600 max-w-md">
              Resume your journey and discover new destinations waiting for you.
            </p>

            {/* Decorative Stats */}
            <div className="mt-12 grid grid-cols-2 gap-6 max-w-sm mx-auto">
              <motion.div whileHover={{ scale: 1.05 }} className="bg-white/30 backdrop-blur-sm p-4 rounded-xl">
                <div className="text-3xl font-bold text-primary mb-2">200+</div>
                <div className="text-sm text-gray-600">Destinations</div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="bg-white/30 backdrop-blur-sm p-4 rounded-xl">
                <div className="text-3xl font-bold text-primary mb-2">1M+</div>
                <div className="text-sm text-gray-600">Happy Travelers</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Card className="relative overflow-hidden border-none shadow-none bg-transparent">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-10" />

            <form onSubmit={handleSubmit}>
              <CardHeader className="text-center relative z-10">
                <div className="lg:hidden">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  >
                    <Plane className="w-8 h-8 text-primary" />
                  </motion.div>
                </div>
                <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-base mt-2">Sign in to continue your journey</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 relative z-10 pt-4">
                <InputWithIcon
                  icon={<Mail className="w-5 h-5" />}
                  label="Email Address"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrors((prev) => ({ ...prev, email: undefined }))
                  }}
                  placeholder="Enter your email"
                  error={errors.email}
                />
                <InputWithIcon
                  icon={<Lock className="w-5 h-5" />}
                  label="Password"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrors((prev) => ({ ...prev, password: undefined }))
                  }}
                  placeholder="Enter your password"
                  error={errors.password}
                />

                <div className="flex items-center justify-between text-sm">
                  <Link href="/forgot-password" className="text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 relative z-10">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
                <p className="text-sm text-center text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-primary hover:underline font-medium">
                    Create account
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}