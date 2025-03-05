"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {  Mail, User, MessageSquare, Phone, MapPin, Clock } from "lucide-react"

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

const InputWithIcon = ({ icon, label, id, type = "text", value, onChange, placeholder }: { icon: React.ReactNode, label: string, id: string, type?: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string }) => (
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

interface ContactInfoProps {
  icon: React.ReactNode;
  title: string;
  content: string;
}

const ContactInfo = ({ icon, title, content }: ContactInfoProps) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="flex items-start space-x-3 p-4 rounded-xl bg-white/30 backdrop-blur-sm"
  >
    <div className="flex-shrink-0">
      <div className="p-2 bg-primary/10 rounded-lg">
        {icon}
      </div>
    </div>
    <div>
      <h3 className="font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{content}</p>
    </div>
  </motion.div>
)

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const { toast } = useToast()

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    toast({
      title: "Message Sent Successfully! 📨",
      description: "We'll get back to you as soon as possible. Thank you for reaching out!",
      duration: 5000,
    })
    setName("")
    setEmail("")
    setMessage("")
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Contact Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="w-full max-w-xl"
        >
          <Card className="relative overflow-hidden border-none shadow-none bg-transparent">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 opacity-10" />
            
            <form onSubmit={handleSubmit}>
              <CardHeader className="text-center relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
                >
                  <MessageSquare className="w-8 h-8 text-primary" />
                </motion.div>
                
                <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  Get in Touch
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 relative z-10 pt-4">
                <InputWithIcon 
                  icon={<User className="w-5 h-5" />}
                  label="Full Name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
                <InputWithIcon 
                  icon={<Mail className="w-5 h-5" />}
                  label="Email Address"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                />
                <div className="space-y-2">
                  <Label htmlFor="message" className="block text-sm font-medium">
                    Your Message
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?"
                      className="min-h-[150px] resize-none"
                      required
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="relative z-10">
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>

      {/* Right Section - Contact Information */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
        <AnimatedBackground />
        <div className="relative z-10 w-full h-full flex flex-col justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 max-w-md mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Contact Information
              </h2>
              <p className="text-gray-600">
                Choose the most convenient way to reach us
              </p>
            </div>

            <ContactInfo
              icon={<Mail className="w-5 h-5 text-primary" />}
              title="Email Us"
              content="support@travelapp.com"
            />

            <ContactInfo
              icon={<Phone className="w-5 h-5 text-primary" />}
              title="Call Us"
              content="+1 (555) 123-4567"
            />

            <ContactInfo
              icon={<MapPin className="w-5 h-5 text-primary" />}
              title="Visit Us"
              content="123 Travel Street, Adventure City, AC 12345"
            />

            <ContactInfo
              icon={<Clock className="w-5 h-5 text-primary" />}
              title="Business Hours"
              content="Monday - Friday, 9:00 AM - 6:00 PM"
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

