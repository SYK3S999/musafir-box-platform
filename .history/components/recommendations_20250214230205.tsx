import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Compass, MapPin, Calendar, Building } from 'lucide-react';

const TravelRecommendations = () => {
  // Mock recommendations data
  const recommendations = [
    {
      id: 1,
      title: "Historical Tour of Rome",
      description: "Explore the ancient wonders of the Eternal City",
      price: 1299,
      category: "city",
      duration: "7 days",
      difficulty: "Easy",
      tags: ["Cultural", "Historical"],
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
      agency_name: "Italia Adventures"
    },
    {
      id: 2,
      title: "Maldives Paradise Escape",
      description: "Experience luxury in pristine island paradise",
      price: 2499,
      category: "beach",
      duration: "5 days",
      difficulty: "Easy",
      tags: ["Luxury", "Beach"],
      image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=800&q=80",
      agency_name: "Island Escapes"
    },
    {
      id: 3,
      title: "African Safari Adventure",
      description: "Witness the majestic wildlife of Kenya",
      price: 1899,
      category: "adventure",
      duration: "6 days",
      difficulty: "Moderate",
      tags: ["Wildlife", "Adventure"],
      image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
      agency_name: "African Safaris"
    }
  ];

  return (
    <section className="container mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Recommended for You
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Curated experiences based on your preferences and travel history
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {recommendations.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-background border border-primary/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
          >
            <div className="relative">
              <Image 
                src={item.image}
                alt={item.title}
                width={600}
                height={400}
                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4 bg-primary/80 text-primary-foreground px-3 py-1 rounded-full text-sm">
                ${item.price}
              </div>
              <div className="absolute top-4 left-4 bg-background/80 p-2 rounded-full">
                <Building className="w-5 h-5 text-primary" />
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{item.title}</h3>
              </div>

              <p className="text-sm text-muted-foreground mb-2">
                Offered by: <span className="font-medium text-primary">{item.agency_name}</span>
              </p>

              <p className="text-muted-foreground mb-4">{item.description}</p>

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {item.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <span>{item.duration}</span>
                  <span className="text-xs bg-primary/10 px-2 py-1 rounded-full">
                    {item.difficulty}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button 
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Compass className="w-5 h-5" />
                Book Now
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default TravelRecommendations;