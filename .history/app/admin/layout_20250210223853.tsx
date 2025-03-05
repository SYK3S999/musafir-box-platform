import { AdminProvider } from "@/contexts/AdminContext"
import type React from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminProvider>{children}</AdminProvider>
}

