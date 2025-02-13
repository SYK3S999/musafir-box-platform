'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, User, Building2, Lock, ChevronRight, ChevronLeft, Check, Mail, Phone, Key, MapPin, Clock } from "lucide-react"

const steps = [
  { 
    id: "user-type", 
    title: "Account Type",
    icon: <User className="w-5 h-5" />,
    description: "Choose your journey",
    bgClass: "from-blue-500/20 via-purple-500/20 to-pink-500/20"
  },
  { 
    id: "personal-info", 
    title: "About You",
    icon: <User className="w-5 h-5" />,
    description: "Tell us about yourself",
    bgClass: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20"
  },
  { 
    id: "account-details", 
    title: "Security",
    icon: <Lock className="w-5 h-5" />,
    description: "Secure your account",
    bgClass: "from-orange-500/20 via-amber-500/20 to-yellow-500/20"
  },
  { 
    id: "agency-details", 
    title: "Agency Profile",
    icon: <Building2 className="w-5 h-5" />,
    description: "Complete your business profile",
    bgClass: "from-rose-500/20 via-pink-500/20 to-fuchsia-500/20"
  },
]

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
        repeat: Infinity,
        ease: "linear"
      }}
      className="absolute inset-0"
    >
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px]" />
    </motion.div>
  </div>
)

const StepIndicator = ({ currentStep, step }: { currentStep: number, step: { id: string, icon: JSX.Element, title: string, description: string, bgClass: string } }) => {
  const isActive = step.id === steps[currentStep].id
  const isCompleted = steps.indexOf(step) < currentStep

  return (
    <motion.div 
      className="relative flex flex-col items-center w-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={`
          w-12 h-12 rounded-full flex items-center justify-center
          ${isActive ? 'bg-primary shadow-lg shadow-primary/30' : 
            isCompleted ? 'bg-primary/80' : 'bg-gray-100 dark:bg-gray-800'}
          transition-all duration-500
        `}
        whileHover={{ scale: 1.05 }}
      >
        {isCompleted ? (
          <Check className="w-5 h-5 text-white" />
        ) : (
          <div className={`${isActive ? 'text-white' : 'text-gray-400'}`}>
            {step.icon}
          </div>
        )}
      </motion.div>
      <div className="mt-2 text-center">
        <span className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-gray-400'}`}>
          {step.title}
        </span>
      </div>
    </motion.div>
  )
}

const InputWithIcon = ({ icon, label, id, type = "text", required = true }: { icon: React.ReactNode, label: string, id: string, type?: string, required?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-2"
  >
    <Label htmlFor={id} className="block text-sm font-medium">
      {label}
    </Label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        {icon}
      </div>
      <Input
        id={id}
        name={id}
        type={type}
        required={required}
        className="pl-10 w-full"
      />
    </div>
  </motion.div>
)

const UserTypeCard = ({ type, icon, title, description, selected, onClick }: { type: string, icon: React.ReactNode, title: string, description: string, selected: boolean, onClick: () => void }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`
      relative overflow-hidden rounded-xl p-6 cursor-pointer
      ${selected ? 'ring-2 ring-primary bg-primary/5' : 'ring-1 ring-gray-200 hover:ring-primary/50'}
      transition-all duration-300
    `}
  >
    <div className="absolute top-4 right-4">
      <motion.div
        initial={false}
        animate={{ scale: selected ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
      >
        <Check className="w-4 h-4 text-white" />
      </motion.div>
    </div>
    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
  </motion.div>
)

const SuccessPopup = ({ message, onClose }: { message: string, onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.3 }}
    className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
  >
    <motion.div
      className="bg-white dark:bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4 shadow-xl text-center"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>
      <h3 className="text-2xl font-semibold mb-4">Success!</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
      <Button onClick={onClose} className="w-full">
        Return to Homepage
      </Button>
    </motion.div>
  </motion.div>
)

export default function Register() {
  const [step, setStep] = useState(0)
  const [userType, setUserType] = useState("client")
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      if (userType === "agency") {
        setSuccessMessage("Your agency registration is pending approval by our administrator. We'll notify you via email once reviewed.")
      } else {
        setSuccessMessage("Your journey begins now. Let's explore the world together.")
      }
      setShowSuccessPopup(true)
    }
  }

  const handleClosePopup = () => {
    setShowSuccessPopup(false)
    router.push("/") // Redirect to homepage after closing the popup
  }

  const renderStepContent = () => {
    switch (steps[step].id) {
      case "user-type":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <UserTypeCard
              type="client"
              icon={<User className="w-6 h-6 text-primary" />}
              title="Travel Enthusiast"
              description="Book incredible journeys and create unforgettable memories"
              selected={userType === "client"}
              onClick={() => setUserType("client")}
            />
            <UserTypeCard
              type="agency"
              icon={<Building2 className="w-6 h-6 text-primary" />}
              title="Travel Agency"
              description="Share your expertise and grow your business globally"
              selected={userType === "agency"}
              onClick={() => setUserType("agency")}
            />
          </motion.div>
        )
      case "personal-info":
        return (
          <div className="space-y-6">
            <InputWithIcon 
              icon={<User className="w-5 h-5" />}
              label="Full Name"
              id="name"
            />
            <InputWithIcon 
              icon={<Mail className="w-5 h-5" />}
              label="Email Address"
              id="email"
              type="email"
            />
            <InputWithIcon 
              icon={<Phone className="w-5 h-5" />}
              label="Phone Number"
              id="phone"
              type="tel"
            />
          </div>
        )
      case "account-details":
        return (
          <div className="space-y-6">
            <InputWithIcon 
              icon={<User className="w-5 h-5" />}
              label="Username"
              id="username"
            />
            <InputWithIcon 
              icon={<Key className="w-5 h-5" />}
              label="Password"
              id="password"
              type="password"
            />
            <InputWithIcon 
              icon={<Lock className="w-5 h-5" />}
              label="Confirm Password"
              id="confirm-password"
              type="password"
            />
          </div>
        )
      case "agency-details":
        return userType === "agency" ? (
          <div className="space-y-6">
            <InputWithIcon 
              icon={<Building2 className="w-5 h-5" />}
              label="Agency Name"
              id="agency-name"
            />
            <InputWithIcon 
              icon={<Key className="w-5 h-5" />}
              label="License Number"
              id="license"
            />
            <InputWithIcon 
              icon={<MapPin className="w-5 h-5" />}
              label="Agency Address"
              id="agency-address"
            />
          </div>
        ) : null
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <AnimatedBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-3xl"
      >
        <Card className="relative overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 shadow-xl">
          <div className={`absolute inset-0 bg-gradient-to-br ${steps[step].bgClass} opacity-20`} />
          
          <form onSubmit={handleSubmit}>
            <CardHeader className="text-center relative z-10 pb-0">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
              >
                <Plane className="w-8 h-8 text-primary" />
              </motion.div>
              
              <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Join Our Journey
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {steps[step].description}
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10 pt-8">
              <div className="mb-12">
                <div className="flex justify-between items-center max-w-2xl mx-auto px-6">
                  {steps.map((s, i) => (
                    <StepIndicator key={s.id} currentStep={step} step={s} />
                  ))}
                  <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-100 dark:bg-gray-800">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>

              <div className="max-w-xl mx-auto px-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between pt-8 relative z-10">
              {step > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
              )}
              <Button 
                type="submit"
                className={`flex items-center gap-2 ${step === 0 ? 'ml-auto' : ''}`}
              >
                {step === steps.length - 1 ? 'Complete Registration' : 'Continue'} 
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>

      <AnimatePresence>
        {showSuccessPopup && (
          <SuccessPopup message={successMessage} onClose={handleClosePopup} />
        )}
      </AnimatePresence>
    </div>
  )
}