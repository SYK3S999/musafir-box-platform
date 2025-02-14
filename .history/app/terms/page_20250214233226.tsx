'use client'
import { motion } from "framer-motion"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        <p className="text-lg mb-6">
          Welcome to MusafirBox. By using our website and services, you agree to comply with and be bound by the following
          terms and conditions of use.
        </p>
        <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
        <p className="mb-6">
          By accessing or using MusafirBox&apos;s services, you agree to be bound by these Terms of Service and all applicable
          laws and regulations. If you do not agree with any part of these terms, you may not use our services.
        </p>
        <h2 className="text-2xl font-bold mb-4">2. Use of Services</h2>
        <p className="mb-6">
          You agree to use MusafirBox&apos;s services only for lawful purposes and in a way that does not infringe the rights
          of, restrict or inhibit anyone else&apos;s use and enjoyment of the website.
        </p>
        <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
        <p className="mb-6">
          To access certain features of our services, you may be required to create an account. You are responsible for
          maintaining the confidentiality of your account and password and for restricting access to your computer.
        </p>
        <h2 className="text-2xl font-bold mb-4">4. Privacy Policy</h2>
        <p className="mb-6">
          Your use of MusafirBox&apos;s services is also governed by our Privacy Policy. Please review our Privacy Policy,
          which also governs the site and informs users of our data collection practices.
        </p>
        <h2 className="text-2xl font-bold mb-4">5. Modifications to Terms</h2>
        <p className="mb-6">
          MusafirBox reserves the right to modify these terms at any time. We will always post the most current version on
          our website. By continuing to use our services after changes have been made, you agree to be bound by the
          revised terms.
        </p>
      </motion.div>
    </div>
  )
}

