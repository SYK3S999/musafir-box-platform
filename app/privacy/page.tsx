'use client'

import { motion } from "framer-motion"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-lg mb-6">
          At musaferBox, we are committed to protecting your privacy and ensuring the security of your personal
          information. This Privacy Policy outlines how we collect, use, and safeguard your data.
        </p>
        <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
        <p className="mb-6">
          We collect information you provide directly to us, such as when you create an account, make a booking, or
          contact our customer support. This may include your name, email address, phone number, and payment
          information.
        </p>
        <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
        <p className="mb-6">
          We use the information we collect to provide, maintain, and improve our services, process your transactions,
          and communicate with you about your account and our services.
        </p>
        <h2 className="text-2xl font-bold mb-4">3. Information Sharing and Disclosure</h2>
        <p className="mb-6">
          We do not sell or rent your personal information to third parties. We may share your information with travel
          agencies or service providers necessary to fulfill your bookings or as required by law.
        </p>
        <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
        <p className="mb-6">
          We implement appropriate technical and organizational measures to protect your personal information against
          unauthorized or unlawful processing, accidental loss, destruction, or damage.
        </p>
        <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
        <p className="mb-6">
          You have the right to access, correct, or delete your personal information. You may also have the right to
          restrict or object to certain processing of your data. To exercise these rights, please contact us using the
          information provided below.
        </p>
        <h2 className="text-2xl font-bold mb-4">6. Changes to This Policy</h2>
        <p className="mb-6">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
          Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
        </p>
        <p className="text-lg">
          If you have any questions about this Privacy Policy, please contact us at privacy@musaferBox.com.
        </p>
      </motion.div>
    </div>
  )
}

