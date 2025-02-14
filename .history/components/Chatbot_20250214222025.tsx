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
    
    "packing tips": "Key packing tips: 1) Roll clothes instead of folding 2) Use packing cubes 3) Pack versatile clothing items 4) Bring a portable charger 5) Pack essential medications in carry-on 6) Include a basic first-aid kit 7) Remember a universal adapter for electronics.",
    
    "safest countries": "Some of the safest countries for tourists include: Iceland, New Zealand, Japan, Singapore, Switzerland, and Norway. These countries have low crime rates, good healthcare systems, and reliable infrastructure.",
    
    "budget travel tips": "Save money by: 1) Booking in advance 2) Using flight price alerts 3) Staying in hostels or local guesthouses 4) Cooking some meals yourself 5) Using public transportation 6) Traveling in shoulder season 7) Getting city tourist cards for attractions.",
    
    "best honeymoon destinations": "Popular honeymoon spots include: Maldives (luxury beaches), Santorini (romantic views), Bora Bora (overwater bungalows), Tuscany (food and wine), and Fiji (tropical paradise). Consider your interests and budget when choosing.",
    
    "travel vaccination requirements": "Common travel vaccines include: Hepatitis A/B, Typhoid, Yellow Fever (required for certain countries), and routine vaccinations. Consult a travel clinic 4-6 weeks before your trip for specific recommendations based on your destination.",
    
    "local customs to be aware of": "Important customs vary by country. Some general tips: 1) Research appropriate dress codes 2) Learn basic greetings in the local language 3) Understand tipping customs 4) Know eating etiquette 5) Be aware of religious customs and holy sites.",
    
    "best travel rewards cards": "Popular travel credit cards include those from Chase Sapphire, American Express Platinum, and Capital One Venture. Look for cards offering: good sign-up bonuses, flexible rewards redemption, travel insurance, and no foreign transaction fees.",
    
    "family friendly destinations": "Great family destinations include: Orlando (theme parks), Costa Rica (nature and adventure), Hawaii (beaches and culture), London (history and entertainment), and Japan (safety and unique experiences). Look for places with kid-friendly activities and good safety records.",
    
    "travel photography tips": "Improve your travel photos by: 1) Shooting during golden hour 2) Using the rule of thirds 3) Including local people (with permission) 4) Capturing details, not just landmarks 5) Getting up early for unique shots 6) Using a tripod for low-light situations.",
    
    "how to choose a travel destination": "Deciding on a travel destination depends on your interests, budget, and the type of experience you seek. Research cultural, historical, and natural attractions, and consider the weather and local events.",
    
    "how to stay connected while traveling": "To stay connected, consider purchasing a local SIM card, using portable Wi-Fi devices, or opting for an international roaming plan. Many airports and hotels also offer free Wi-Fi.",
    
    "what are the best travel blogs to follow": "Some popular travel blogs include Nomadic Matt, The Blonde Abroad, Expert Vagabond, and The Points Guy. They offer insider tips, itineraries, and reviews to help you plan your trip.",
    
    "how to plan a road trip": "For a successful road trip, map out your route, book accommodations ahead of time, plan rest stops, and ensure your vehicle is in top condition. Don’t forget an emergency kit and a flexible itinerary.",
    
    "what to do if you miss your flight": "If you miss your flight, contact your airline immediately to explore rebooking options. Review your ticket’s terms and consider travel insurance, which can help cover unexpected delays or cancellations.",
    
    "how to travel with pets": "Traveling with pets requires preparation. Check airline policies, schedule a vet visit for vaccinations and health certificates, invest in a sturdy pet carrier, and research pet-friendly accommodations.",
    
    "how to find local experiences while traveling": "Seek authentic experiences by using local tour guides, exploring community events, and checking platforms like Airbnb Experiences. Engaging with locals can lead to hidden gems.",
    
    "what are some travel safety tips": "Stay safe by keeping valuables secure, being aware of your surroundings, avoiding isolated areas after dark, and having local emergency numbers on hand. Research the safety of your destination before you go.",
    
    "how to handle language barriers": "Learn key phrases in the local language, use translation apps like Google Translate, and carry a phrasebook. Being patient and respectful goes a long way when communicating.",
    
    "how to manage travel budgets": "Monitor your expenses with budgeting apps, set a daily spending limit, choose affordable lodging and meals, and always have a small emergency fund for unexpected costs.",
    
    "what are the best travel apps": "Essential travel apps include Google Maps for navigation, TripIt for itinerary organization, XE Currency for currency conversion, and local apps for ride-sharing and dining recommendations.",
    
    "how to avoid travel scams": "Research common scams in your destination, avoid sharing too much personal information, use reputable tour operators, and be cautious with unsolicited help from strangers.",
    
    "what are some eco-friendly travel tips": "Travel sustainably by reducing single-use plastics, using refillable water bottles, choosing eco-friendly accommodations, supporting local businesses, and respecting nature and wildlife.",
    
    "how to travel with kids": "Traveling with children means planning ahead: choose kid-friendly destinations, pack snacks and activities, and plan regular breaks. Look for accommodations that offer family amenities.",
    
    "how to prepare for a long flight": "For long flights, stay hydrated, dress comfortably, pack healthy snacks, and bring entertainment like books or downloaded movies. Also, remember to move around periodically to improve circulation.",
    
    "how to pack efficiently": "Maximize space by rolling your clothes, using packing cubes, and selecting versatile pieces that can be mixed and matched. Always pack essential items in your carry-on.",
    
    "what should i do in case of travel emergency": "In an emergency, contact local authorities, reach out to your embassy or consulate, keep copies of important documents, and utilize your travel insurance for assistance.",
    
    "how to handle cultural differences": "Respect cultural differences by researching local customs before your trip, observing appropriate dress codes, and being open-minded. When in doubt, ask locals for guidance.",
    
    "what are the best destinations for adventure travel": "Adventure travelers often enjoy destinations like New Zealand, Costa Rica, Nepal, South Africa, and Canada, which offer activities such as hiking, rafting, and wildlife safaris.",
    
    "how to travel on a shoestring budget": "Travel on a budget by opting for hostels or budget accommodations, eating street food, using public transportation, and taking advantage of free attractions and tours.",
    
    "how to find authentic local cuisine": "Explore local markets, dine at family-run restaurants, and ask locals for recommendations. Authentic cuisine is often found away from major tourist areas.",
    
    "what are some travel etiquette tips": "Be respectful of local customs: greet people politely, dress appropriately, tip when customary, and be mindful of noise and public behavior in different cultures.",
    
    "how to overcome travel anxiety": "Ease travel anxiety by planning well in advance, researching your destination, packing early, and maintaining a flexible schedule. Consider traveling with a friend or joining a group tour.",
    
    "what travel gear is essential": "Essential travel gear includes comfortable walking shoes, a universal travel adapter, a portable charger, a sturdy backpack, and weather-appropriate clothing. A good travel pillow and reusable water bottle are also useful.",
    
    "how to get the best hotel deals": "Compare prices on multiple booking sites, sign up for newsletters and loyalty programs, and consider traveling during off-peak seasons. Reading guest reviews can also help ensure quality and value.",
    
    "how to handle lost luggage": "If your luggage is lost, report it immediately to your airline, file a claim, and keep your travel essentials in your carry-on. Document your belongings and follow up regularly until your luggage is recovered.",
    
    "what to do if your passport is lost": "If your passport is lost, contact local authorities and your embassy or consulate as soon as possible. File a police report, and have photocopies of your passport and other documents ready for verification.",
    
    "how to enjoy travel during off-peak times": "Traveling during off-peak seasons can offer lower prices and fewer crowds. Research seasonal attractions, and take advantage of unique experiences that aren’t available during peak times.",
    
    "what are some unique travel experiences": "Seek out unique experiences such as hot air balloon rides, local festivals, cooking classes, or guided tours that focus on regional history and culture. These often provide a deeper connection to the destination.",
    
    "how to travel with disabilities": "Plan ahead by researching accessible accommodations, transportation, and attractions. Contact service providers to confirm accessibility features and consider working with travel agencies that specialize in accessible travel.",
    
    "what are some underrated travel destinations": "Consider exploring lesser-known destinations like Georgia (the country), Albania, Colombia, or Vietnam. These spots offer rich culture and natural beauty without the heavy tourist traffic.",
    
    "how to maintain fitness while traveling": "Keep active by walking or biking, using hotel gyms, or following body-weight workout routines. Many destinations also offer local fitness classes or outdoor activities like hiking.",
    
    "what are the benefits of group travel": "Group travel can reduce costs, provide shared experiences, and enhance safety through numbers. It also offers the chance to meet new people and see a destination from different perspectives.",
    
    "how to travel responsibly": "Practice responsible travel by supporting local economies, minimizing waste, respecting cultural sites, and leaving a positive impact on the communities you visit. Choose eco-friendly activities and accommodations whenever possible.",
    
    "what is travel hacking": "Travel hacking involves using strategies such as credit card rewards, frequent flyer programs, and special travel deals to reduce travel expenses. It requires research and smart planning to maximize points and miles for free or discounted travel."
  };
  
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

