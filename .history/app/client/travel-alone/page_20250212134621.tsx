import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Compass,
  MapPin,
  Plus,
  Minus,
  Plane,
  Hotel,
  Car,
  Utensils,
  Camera,
  DollarSign,
  Activity,
  Clock
} from "lucide-react";
import Link from "next/link";

const TravelAlonePage = () => {
  const [destinations, setDestinations] = useState<Array<{ name: string; duration: number; mustSee: string[] }>>([]);
  const [newDestination, setNewDestination] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [travelers, setTravelers] = useState(1);
  const [notes, setNotes] = useState("");
  const [budget, setBudget] = useState([2000]);
  const [selectedTab, setSelectedTab] = useState("basics");
  const [preferences, setPreferences] = useState({
    accommodationType: "hotel",
    transportation: "flight",
    activities: [] as string[],
    dietaryRestrictions: [] as string[],
    pacePreference: "moderate",
    photographyInterest: false,
    guidedTours: false,
    localExperiences: true,
  });

  const activityOptions = [
    { value: "sightseeing", label: "Sightseeing", icon: Camera },
    { value: "culture", label: "Cultural Activities", icon: Activity },
    { value: "food", label: "Food & Dining", icon: Utensils },
    { value: "adventure", label: "Adventure Sports", icon: Activity },
  ];

  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Halal",
    "Kosher",
    "None"
  ];

  const addDestination = () => {
    if (newDestination.trim() !== "") {
      setDestinations([...destinations, {
        name: newDestination.trim(),
        duration: 2,
        mustSee: []
      }]);
      setNewDestination("");
    }
  };

  const removeDestination = (index: number) => {
    setDestinations(destinations.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      addDestination();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Plan Your Solo Adventure
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Customize every detail of your journey for an unforgettable experience
        </p>
      </motion.div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Compass className="w-6 h-6" />
            Your Travel Plan
          </CardTitle>
          <CardDescription>Design your perfect trip</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="basics">Basic Info</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="planning">Trip Planning</TabsTrigger>
            </TabsList>

            <TabsContent value="basics" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="destinations">Destinations</Label>
                <div className="flex gap-2">
                  <Input
                    id="destinations"
                    placeholder="Add a destination"
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button onClick={addDestination} type="button">
                    <Plus className="w-4 h-4 mr-2" /> Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {destinations.map((dest, index) => (
                    <div
                      key={index}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      {dest.name}
                      <button
                        onClick={() => removeDestination(index)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-range">Travel Dates</Label>
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              </div>

              <div className="space-y-2">
                <Label>Budget Range (USD)</Label>
                <div className="pt-6">
                  <Slider
                    value={budget}
                    onValueChange={setBudget}
                    max={10000}
                    step={100}
                    className="w-full"
                  />
                  <div className="mt-2 text-center font-medium">
                    ${budget[0].toLocaleString()}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Accommodation Type</Label>
                  <Select
                    value={preferences.accommodationType}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, accommodationType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="hostel">Hostel</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="boutique">Boutique Hotel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Transportation Preference</Label>
                  <Select
                    value={preferences.transportation}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, transportation: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flight">Flight</SelectItem>
                      <SelectItem value="train">Train</SelectItem>
                      <SelectItem value="bus">Bus</SelectItem>
                      <SelectItem value="rental">Car Rental</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Trip Pace</Label>
                <Select
                  value={preferences.pacePreference}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, pacePreference: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relaxed">Relaxed</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="intense">Intense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Activities Interest</Label>
                <div className="grid grid-cols-2 gap-2">
                  {activityOptions.map((activity) => (
                    <div
                      key={activity.value}
                      className="flex items-center space-x-2 p-2 border rounded-lg"
                    >
                      <Switch
                        checked={preferences.activities.includes(activity.value)}
                        onCheckedChange={(checked) => {
                          const newActivities = checked
                            ? [...preferences.activities, activity.value]
                            : preferences.activities.filter((a) => a !== activity.value);
                          setPreferences({ ...preferences, activities: newActivities });
                        }}
                      />
                      <activity.icon className="w-4 h-4" />
                      <span>{activity.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Dietary Restrictions</Label>
                <Select
                  value={preferences.dietaryRestrictions[0] || ""}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, dietaryRestrictions: [value] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select dietary restrictions" />
                  </SelectTrigger>
                  <SelectContent>
                    {dietaryOptions.map((option) => (
                      <SelectItem key={option} value={option.toLowerCase()}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="planning" className="space-y-6">
              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea
                  placeholder="Any specific requirements, interests, or preferences?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-32"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={preferences.guidedTours}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, guidedTours: checked })
                    }
                  />
                  <Label>Include Guided Tours</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={preferences.localExperiences}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, localExperiences: checked })
                    }
                  />
                  <Label>Local Experiences</Label>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline">Save Draft</Button>
          <Button>Create Itinerary</Button>
        </CardFooter>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground mb-4">Need inspiration or assistance?</p>
        <div className="flex gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/offers">Explore Curated Offers</Link>
          </Button>
          <Button asChild>
            <Link href="/travel-guides">Travel Guides</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TravelAlonePage;