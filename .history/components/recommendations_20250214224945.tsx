import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Calendar, Star } from 'lucide-react';

const TravelRecommendations = () => {
  // This would typically come from an API
  const recommendations = [
    {
      id: 1,
      title: "Historical Tour of Rome",
      image: "/api/placeholder/800/400",
      location: "Rome, Italy",
      duration: "7 days",
      price: "€1,299",
      rating: 4.8,
      agency: "Italia Adventures",
      tags: ["Culture", "History"]
    },
    {
      id: 2,
      title: "Beach Paradise Maldives",
      image: "/api/placeholder/800/400",
      location: "Malé, Maldives",
      duration: "5 days",
      price: "$2,499",
      rating: 4.9,
      agency: "Island Escapes",
      tags: ["Beach", "Luxury"]
    },
    {
      id: 3,
      title: "Safari Adventure Kenya",
      image: "/api/placeholder/800/400",
      location: "Nairobi, Kenya",
      duration: "6 days",
      price: "$1,899",
      rating: 4.7,
      agency: "African Safaris",
      tags: ["Adventure", "Wildlife"]
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Recommended for You</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Personalized travel experiences picked just for you based on your preferences and past adventures
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  >
                    <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                  </Button>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>

                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{item.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{item.duration}</span>
                    <div className="flex items-center gap-1 ml-auto">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium">{item.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Starting from</p>
                      <p className="text-xl font-bold text-blue-600">{item.price}</p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      View Details
                    </Button>
                  </div>

                  <p className="text-sm text-gray-500 mt-3">Offered by {item.agency}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TravelRecommendations;