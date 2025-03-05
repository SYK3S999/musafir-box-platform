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
import { Plane, Mail, Lock } from "lucide-react"
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
  icon: React.ReactNode;
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const InputWithIcon = ({ icon, label, id, type = "text", value, onChange, placeholder }: InputWithIconProps) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
    <Label htmlFor={id} className="block text-sm font-medium">
      {label}
    </Label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{icon}</div>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="pl-10 w-full"
      />
    </div>
  </motion.div>
)

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      await login(email, password)
      toast({
        title: "Welcome back! 🌟",
        description: "Get ready to explore amazing destinations.",
        duration: 5000,
      })
      router.push("/")
    } catch {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
        duration: 5000,
      })
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
                  onChange={(e: { target: { value: SetStateAction<string> } }) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
                <InputWithIcon
                  icon={<Lock className="w-5 h-5" />}
                  label="Password"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e: { target: { value: SetStateAction<string> } }) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />

                <div className="flex items-center justify-between text-sm">
                  <Link href="/forgot-password" className="text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 relative z-10">
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
                <p className="text-sm text-center text-gray-600">
                  Don&apos;t have an account?{" "}
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

