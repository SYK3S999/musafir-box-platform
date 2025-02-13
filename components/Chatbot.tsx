"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SendHorizontal, Bot, User, MessageSquare, X } from "lucide-react"

interface MessageProps {
  text: string;
  isBot: boolean;
  animate?: boolean;
}

const Message = ({ text, isBot, animate = true }: MessageProps) => (
  <motion.div
    initial={animate ? { opacity: 0, y: 20 } : false}
    animate={animate ? { opacity: 1, y: 0 } : false}
    className={`flex items-start space-x-2 ${isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}
  >
    <div className="flex-shrink-0">
      <div className="p-1.5 bg-primary/10 rounded-lg">
        {isBot ? (
          <Bot className="w-4 h-4 text-primary" />
        ) : (
          <User className="w-4 h-4 text-primary" />
        )}
      </div>
    </div>
    <div className={`flex-1 p-2 rounded-xl bg-secondary ${isBot ? 'rounded-tl-none' : 'rounded-tr-none'}`}>
      <p className="text-sm text-foreground">{text}</p>
    </div>
  </motion.div>
)

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your travel assistant. How can I help you plan your perfect trip today?", isBot: true },
  ])
  const [inputText, setInputText] = useState("")

  // Pre-defined Q&A pairs
  const qaPairs = {
    "best time to visit bali": "The best time to visit Bali is during the dry season (April to October). You'll experience less rainfall and lower humidity, perfect for beach activities and outdoor explorations. However, July and August are peak tourist seasons, so consider May, June, or September for better rates.",
    
    "cheapest time to fly": "Generally, flights are cheapest when booked 3-4 months in advance. For international trips, Tuesday and Wednesday flights often have lower fares. Off-season travel (avoiding school holidays and peak seasons) can also save you significant money.",
    
    "what documents do i need for international travel": "Essential documents include: 1) Valid passport (valid for at least 6 months beyond your stay) 2) Necessary visas 3) Travel insurance documents 4) Vaccination records if required 5) Return flight tickets. Always check specific requirements for your destination country.",
    
    "best places for solo travel": "Popular solo travel destinations include: Japan (safe and efficient), New Zealand (adventure-friendly), Portugal (affordable and welcoming), Thailand (backpacker-friendly), and Iceland (safe and scenic). These countries offer good infrastructure and welcoming atmospheres for solo travelers.",
    
    "how to deal with jet lag": "To minimize jet lag: 1) Adjust your sleep schedule before travel 2) Stay hydrated during flight 3) Avoid alcohol and caffeine 4) Get sunlight at your destination 5) Try to stay awake until local nighttime 6) Consider melatonin supplements if recommended by your doctor.",
    
    "travel insurance recommendations": "Consider insurance that covers: medical emergencies, trip cancellation/interruption, lost baggage, and emergency evacuation. Popular providers include World Nomads for adventurous travelers and Allianz for comprehensive coverage. Always read the fine print for coverage details.",
    
    "packing tips": "Key packing tips: 1) Roll clothes instead of folding 2) Use packing cubes 3) Pack versatile clothing items 4) Bring a portable charger 5) Pack essential medications in carry-on 6) Include a basic first-aid kit 7) Remember universal adapter for electronics.",
    
    "safest countries": "Some of the safest countries for tourists include: Iceland, New Zealand, Japan, Singapore, Switzerland, and Norway. These countries have low crime rates, good healthcare systems, and reliable infrastructure.",
    
    "budget travel tips": "Save money by: 1) Booking in advance 2) Using flight price alerts 3) Staying in hostels or local guesthouses 4) Cooking some meals yourself 5) Using public transportation 6) Traveling in shoulder season 7) Getting city tourist cards for attractions.",
    
    "best honeymoon destinations": "Popular honeymoon spots include: Maldives (luxury beaches), Santorini (romantic views), Bora Bora (overwater bungalows), Tuscany (food and wine), and Fiji (tropical paradise). Consider your interests and budget when choosing.",
    
    "travel vaccination requirements": "Common travel vaccines include: Hepatitis A/B, Typhoid, Yellow Fever (required for certain countries), and routine vaccinations. Consult a travel clinic 4-6 weeks before your trip for specific recommendations based on your destination.",
    
    "local customs to be aware of": "Important customs vary by country. Some general tips: 1) Research appropriate dress codes 2) Learn basic greetings in local language 3) Understand tipping customs 4) Know eating etiquette 5) Be aware of religious customs and holy sites.",
    
    "best travel rewards cards": "Popular travel credit cards include those from Chase Sapphire, American Express Platinum, and Capital One Venture. Look for cards offering: good sign-up bonuses, flexible rewards redemption, travel insurance, and no foreign transaction fees.",
    
    "family friendly destinations": "Great family destinations include: Orlando (theme parks), Costa Rica (nature and adventure), Hawaii (beaches and culture), London (history and entertainment), and Japan (safety and unique experiences). Look for places with kid-friendly activities and good safety records.",
    
    "travel photography tips": "Improve your travel photos by: 1) Shooting during golden hour 2) Using rule of thirds 3) Including local people (with permission) 4) Capturing details, not just landmarks 5) Getting up early for empty shots 6) Using a tripod for low-light situations."
  }

  const handleSend = () => {
    if (!inputText.trim()) return

    const newUserMessage = { text: inputText, isBot: false }
    setMessages(prev => [...prev, newUserMessage])
    
    // Find the best matching question
    const userQuestion = inputText.toLowerCase()
    let bestMatch: string | null = null
    let bestMatchScore = 0

    Object.entries(qaPairs).forEach(([question, answer]) => {
      const words = question.split(' ')
      const matchingWords = words.filter(word => userQuestion.includes(word))
      const score = matchingWords.length / words.length

      if (score > bestMatchScore) {
        bestMatchScore = score
        bestMatch = answer
      }
    })

    setTimeout(() => {
      const botResponse = bestMatchScore > 0.3 && bestMatch
        ? bestMatch 
        : "I'm not sure about that specific query. Could you rephrase your question? I can help with topics like best travel times, destinations, packing tips, or travel documents."
      
      setMessages(prev => [...prev, { text: botResponse, isBot: true }])
    }, 1000)

    setInputText("")
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          className="w-10 h-10 rounded-full shadow-lg"
        >
          <MessageSquare className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-16 right-4 z-50 w-full max-w-[300px]"
          >
            <Card className="border shadow-lg bg-background">
              <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 py-3 px-4">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <CardTitle className="text-base">Travel Assistant</CardTitle>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>

              <CardContent className="space-y-4 p-4 pt-0">
                <div className="h-[280px] overflow-y-auto space-y-3 pr-2">
                  {messages.map((message, index) => (
                    <Message key={index} {...message} />
                  ))}
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-2">
                <div className="flex w-full space-x-2">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 h-8 text-sm"
                  />
                  <Button onClick={handleSend} size="icon" className="h-8 w-8">
                    <SendHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

