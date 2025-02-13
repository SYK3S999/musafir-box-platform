"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Check,
  User,
  Building2,
  Lock,
  ChevronRight,
  ChevronLeft,
  Mail,
  Phone,
  Key,
  MapPin,
  Plane,
} from "lucide-react";

// Define your registration steps. Notice that if the user is a client, you can choose to skip the agency step.
const steps = [
  { id: "user-type", title: "Account Type", description: "Choose your journey" },
  { id: "personal-info", title: "About You", description: "Tell us about yourself" },
  { id: "account-details", title: "Security", description: "Secure your account" },
  { id: "agency-details", title: "Agency Profile", description: "Complete your business profile" },
];

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [userType, setUserType] = useState<"client" | "agency">("client");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Hold all the form values in state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    // Agency fields:
    agencyName: "",
    license: "",
    agencyAddress: "",
  });

  // Determine the maximum step for the current user type
  const maxStep = userType === "agency" ? steps.length - 1 : steps.length - 2;

  // Update state for each input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle the form submission on each step
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    // Move to the next step if not yet at the final step
    if (step < maxStep) {
      setStep(step + 1);
      return;
    }

    // Final step: validate and submit the registration data
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    // Prepare the payload according to your Flask API
    const payload: any = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: userType,
    };

    if (userType === "agency") {
      payload.agency_name = formData.agencyName;
      payload.license_number = formData.license;
      payload.agency_address = formData.agencyAddress;
      // You can add an agency_description if needed.
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.error || "Registration failed.");
      } else {
        setSuccessMessage(
          userType === "agency"
            ? "Your agency registration is pending approval. We'll notify you once reviewed."
            : "Your journey begins now. Let's explore the world together."
        );
        setShowSuccessPopup(true);
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again later.");
    }
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    router.push("/"); // Redirect to homepage after closing the popup
  };

  // Render the content for each registration step.
  const renderStepContent = () => {
    switch (steps[step].id) {
      case "user-type":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <div
              onClick={() => {
                setUserType("client");
                setStep(step + 1);
              }}
              className="cursor-pointer border p-4 rounded hover:border-primary"
            >
              <User className="w-6 h-6" />
              <h3>Travel Enthusiast</h3>
              <p>Book incredible journeys and create memories.</p>
            </div>
            <div
              onClick={() => {
                setUserType("agency");
                setStep(step + 1);
              }}
              className="cursor-pointer border p-4 rounded hover:border-primary"
            >
              <Building2 className="w-6 h-6" />
              <h3>Travel Agency</h3>
              <p>Share your expertise and grow your business.</p>
            </div>
          </motion.div>
        );
      case "personal-info":
        return (
          <div className="space-y-6">
            <InputWithIcon
              icon={<User className="w-5 h-5" />}
              label="Full Name"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <InputWithIcon
              icon={<Mail className="w-5 h-5" />}
              label="Email Address"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <InputWithIcon
              icon={<Phone className="w-5 h-5" />}
              label="Phone Number"
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
        );
      case "account-details":
        return (
          <div className="space-y-6">
            <InputWithIcon
              icon={<Key className="w-5 h-5" />}
              label="Password"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <InputWithIcon
              icon={<Lock className="w-5 h-5" />}
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </div>
        );
      case "agency-details":
        return userType === "agency" ? (
          <div className="space-y-6">
            <InputWithIcon
              icon={<Building2 className="w-5 h-5" />}
              label="Agency Name"
              id="agencyName"
              name="agencyName"
              value={formData.agencyName}
              onChange={handleInputChange}
            />
            <InputWithIcon
              icon={<Key className="w-5 h-5" />}
              label="License Number"
              id="license"
              name="license"
              value={formData.license}
              onChange={handleInputChange}
            />
            <InputWithIcon
              icon={<MapPin className="w-5 h-5" />}
              label="Agency Address"
              id="agencyAddress"
              name="agencyAddress"
              value={formData.agencyAddress}
              onChange={handleInputChange}
            />
          </div>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl">
        <form onSubmit={handleSubmit}>
          <div className="bg-white p-8 rounded shadow-md">
            <h1 className="text-3xl mb-6 text-center">Join Our Journey</h1>
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
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
            <div className="flex justify-between mt-8">
              {step > 0 && (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
              )}
              <Button type="submit">
                {step === maxStep ? "Complete Registration" : "Continue"}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </form>
      </motion.div>

      <AnimatePresence>
        {showSuccessPopup && (
          <SuccessPopup message={successMessage} onClose={handleClosePopup} />
        )}
      </AnimatePresence>
    </div>
  );
}

// A modified InputWithIcon component that accepts value and onChange
const InputWithIcon = ({
  icon,
  label,
  id,
  name,
  type = "text",
  required = true,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  id: string;
  name: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
    <Label htmlFor={id} className="block text-sm font-medium">
      {label}
    </Label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">{icon}</div>
      <Input id={id} name={name} type={type} required={required} className="pl-10 w-full" value={value} onChange={onChange} />
    </div>
  </motion.div>
);

// A simple SuccessPopup component to notify the user upon successful registration
const SuccessPopup = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.3 }}
    className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
  >
    <motion.div
      className="bg-white rounded-lg p-8 w-full max-w-md text-center"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-2xl font-semibold mb-4">Success!</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <Button onClick={onClose} className="w-full">
        Return to Homepage
      </Button>
    </motion.div>
  </motion.div>
);
