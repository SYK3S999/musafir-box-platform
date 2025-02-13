'use client'

import {   Key, ReactElement, ReactNode, ReactPortal, useState } from "react"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Trash2, MapPin, Plus, X } from "lucide-react"
import Image from "next/image"
import ImageUpload from "@/components/ui/image_upload"
import { motion } from "framer-motion"

const initialOffers = [
  {
    id: 1,
    title: "Paris Getaway",
    destination: "Paris, France",
    duration: "5 days",
    price: 1299,
    description: "Experience the magic of Paris with this 5-day adventure.",
    status: "active",
    category: "city",
    difficulty: "Easy",
    tags: ["Cultural", "Urban"],
    images: [
      "/api/placeholder/600/400",
      "/api/placeholder/600/400"
    ]
  },
  {
    id: 2,
    title: "Tokyo Explorer",
    destination: "Tokyo, Japan",
    duration: "7 days",
    price: 1799,
    description: "Discover the wonders of Tokyo in this week-long journey.",
    status: "active",
    category: "city",
    difficulty: "Moderate",
    tags: ["Cultural", "Adventure"],
    images: [
      "/api/placeholder/600/400",
      "/api/placeholder/600/400"
    ]
  }
]

export default function AgencyOffersPage() {
  const [offers, setOffers] = useState(initialOffers)
  const [activeTab, setActiveTab] = useState("active")
  const [isEditing, setIsEditing] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  
  interface Offer {
    title: string;
    destination: string;
    duration: string;
    price: string;
    description: string;
    category: string;
    difficulty: string;
    tags: string[];
    images: string[];
  }

  const [newOffer, setNewOffer] = useState<Offer>({
    title: "",
    destination: "",
    duration: "",
    price: "",
    description: "",
    category: "city",
    difficulty: "Easy",
    tags: [],
    images: []
  })

  const difficultyOptions = ["Easy", "Moderate", "Challenging"]
  const categoryOptions = ["city", "beach", "adventure", "hajj"]

  const filteredOffers = offers.filter((offer) => activeTab === "all" || offer.status === activeTab)

  const handleEdit = (id: number) => {
    setIsEditing(id)
    setShowForm(true)
    const offerToEdit = offers.find((offer) => offer.id === id)
    if (offerToEdit) {
      setNewOffer({
        ...offerToEdit,
        price: offerToEdit.price.toString()
      })
    }
  }

  const handleSave = () => {
    if (isEditing) {
      setOffers(
        offers.map((offer) =>
          offer.id === isEditing ? { 
            ...offer, 
            ...newOffer, 
            price: Number(newOffer.price),
            images: newOffer.images.length ? newOffer.images : ["/api/placeholder/600/400"]
          } : offer
        )
      )
    } else {
      setOffers([
        ...offers,
        {
          id: offers.length + 1,
          ...newOffer,
          price: Number(newOffer.price),
          status: "active",
          images: newOffer.images.length ? newOffer.images : ["/api/placeholder/600/400"]
        },
      ])
    }
    setIsEditing(null)
    setShowForm(false)
    setNewOffer({
      title: "",
      destination: "",
      duration: "",
      price: "",
      description: "",
      category: "city",
      difficulty: "Easy",
      tags: [],
      images: []
    })
  }

  const handleDelete = (id: number) => {
    setOffers(offers.filter((offer) => offer.id !== id))
  }

  const handleInputChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target
    setNewOffer((prev) => ({ ...prev, [name]: value }))
  }

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      setNewOffer(prev => ({
        ...prev,
        tags: [...(prev.tags || []), e.currentTarget.value]
      }))
      e.currentTarget.value = ''
    }
  }

  const removeTag = (tagToRemove: string) => {
    setNewOffer(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  return (
    <ProtectedRoute allowedRoles={["agency"]}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
          <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        Manage Offers
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
        Create and manage your travel packages</p>
      </motion.div>
            <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Offer
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="all">All Offers</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-6">
                <OffersList offers={filteredOffers} onEdit={handleEdit} onDelete={handleDelete} />
              </TabsContent>
              <TabsContent value="active" className="mt-6">
                <OffersList offers={filteredOffers} onEdit={handleEdit} onDelete={handleDelete} />
              </TabsContent>
              <TabsContent value="draft" className="mt-6">
                <OffersList offers={filteredOffers} onEdit={handleEdit} onDelete={handleDelete} />
              </TabsContent>
            </Tabs>
          </div>

          {showForm && (
            <Card className="border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="text-2xl">{isEditing ? "Edit Offer" : "Create New Offer"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={newOffer.title}
                        onChange={handleInputChange}
                        placeholder="Enter offer title"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="destination">Destination</Label>
                      <Input
                        id="destination"
                        name="destination"
                        value={newOffer.destination}
                        onChange={handleInputChange}
                        placeholder="Enter destination"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        name="category"
                        value={newOffer.category}
                        onChange={handleInputChange}
                        className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2"
                      >
                        {categoryOptions.map(cat => (
                          <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <select
                        id="difficulty"
                        name="difficulty"
                        value={newOffer.difficulty}
                        onChange={handleInputChange}
                        className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2"
                      >
                        {difficultyOptions.map(diff => (
                          <option key={diff} value={diff}>{diff}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags (Press Enter to add)</Label>
                      <Input
                        id="tags"
                        placeholder="Add tags..."
                        onKeyPress={handleTagInput}
                        className="mt-1"
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newOffer.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm flex items-center gap-1"
                          >
                            {tag}
                            <X
                              className="w-3 h-3 cursor-pointer"
                              onClick={() => removeTag(tag)}
                            />
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        name="duration"
                        value={newOffer.duration}
                        onChange={handleInputChange}
                        placeholder="Enter duration (e.g., 5 days)"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={newOffer.price}
                        onChange={handleInputChange}
                        placeholder="Enter price"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <textarea
                        id="description"
                        name="description"
                        value={newOffer.description}
                        onChange={handleInputChange}
                        placeholder="Enter offer description"
                        className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2 min-h-[100px]"
                      />
                    </div>

                    <div>
  <Label>Images</Label>
    <ImageUpload 
    images={newOffer.images}
    setImages={(value: React.SetStateAction<string[]>) => 
      setNewOffer(prev => ({...prev, images: typeof value === 'function' ? value(prev.images) : value}))
    }
    maxImages={5}
  />
</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => {
                  setShowForm(false)
                  setIsEditing(null)
                  setNewOffer({
                    title: "",
                    destination: "",
                    duration: "",
                    price: "",
                    description: "",
                    category: "city",
                    difficulty: "Easy",
                    tags: [],
                    images: []
                  })
                }}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                  handleSave();
                  // Add a small delay to ensure the form is rendered before scrolling
                  setTimeout(() => {
                    document.getElementById('createOfferForm')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                    });
                  }, 100);
                  }} 
                  className="bg-primary hover:bg-primary/90"
                >
                  {isEditing ? "Update Offer" : "Create Offer"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

interface Offer {
  id: number;
  title: string;
  destination: string;
  duration: string;
  price: number;
  description: string;
  status: string;
  category: string;
  difficulty: string;
  tags: string[];
  images: string[];
}

interface OffersListProps {
  offers: Offer[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const OffersList = ({ offers, onEdit, onDelete }: OffersListProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {offers.map((offer: { id: Key | null | undefined; images: string[]; title: string | number | bigint | boolean | ReactElement | Iterable<ReactNode> | Promise<ReactNode> | null | undefined; price: string | number | bigint | boolean | ReactElement | Iterable<ReactNode> | ReactPortal | Promise<ReactNode> | null | undefined; description: string | number | bigint | boolean | ReactElement | Iterable<ReactNode> | ReactPortal | Promise<ReactNode> | null | undefined; tags: string[]; duration: string | number | bigint | boolean | ReactElement | Iterable<ReactNode> | ReactPortal | Promise<ReactNode> | null | undefined; difficulty: string | number | bigint | boolean | ReactElement | Iterable<ReactNode> | ReactPortal | Promise<ReactNode> | null | undefined }) => (
      <div
        key={offer.id}
        className="bg-background border border-primary/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
      >
        <div className="relative">
          <Image 
            src={offer.images[0] || "/api/placeholder/600/400"}
            alt={String(offer.title)}
            width={600}
            height={400}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4 bg-primary/80 text-primary-foreground px-3 py-1 rounded-full text-sm">
            ${String(offer.price)}
          </div>
          <div className="absolute top-4 left-4 bg-background/80 p-2 rounded-full">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">{String(offer.title)}</h2>
          </div>

          <p className="text-muted-foreground mb-4">{String(offer.description)}</p>

          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              {offer.tags?.map((tag: string) => (
                <span 
                  key={tag}
                  className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>{String(offer.duration)}</span>
              <span className="text-xs bg-primary/10 px-2 py-1 rounded-full">
                {String(offer.difficulty)}
              </span>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button className="flex-1" variant="outline" onClick={() => typeof offer.id === 'number' && onEdit(offer.id)}>
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button className="flex-1" variant="destructive" onClick={() => typeof offer.id === 'number' && onDelete(offer.id)}>
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    ))}
  </div>
)