"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { getDefaultRouteByRole } from "@/lib/config/role-config"
import type { Role } from "@/lib/types"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) return

    if (!user) {
      // Not authenticated, redirect to login
      router.replace("/login")
    } else {
      // Authenticated, redirect to default route based on role
      const defaultRoute = getDefaultRouteByRole(user.role as Role)
      router.replace(defaultRoute)
    }
  }, [user, isLoading, router])

  // Show loading state while checking auth
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

