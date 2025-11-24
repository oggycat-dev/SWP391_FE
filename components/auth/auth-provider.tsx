"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { User, Role } from "@/lib/types"
import { getAuthServiceByRole } from "@/lib/api/auth/auth-service-factory"
import { getDefaultRouteByRole } from "@/lib/config/role-config"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("evdms_auth_token")
      if (!token) {
        setIsLoading(false)
        if (pathname !== "/login") {
          router.push("/login")
        }
        return
      }

      try {
        // In a real app, we would validate the token and fetch user profile here
        // For this demo, we'll simulate restoring a session if we have a token
        // Ideally, you'd have an endpoint like /auth/me
        // const user = await authApi.me();
        // setUser(user);

        // Try to restore user from token if available
        // For now, we'll just check if token exists
        // In production, decode JWT or call /me endpoint
        const storedUser = localStorage.getItem("evdms_user")
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser))
          } catch {
            // Invalid stored user, clear it
            localStorage.removeItem("evdms_user")
          }
        }
      } catch (error) {
        console.error("Auth initialization failed", error)
        localStorage.removeItem("evdms_auth_token")
        localStorage.removeItem("evdms_refresh_token")
        localStorage.removeItem("evdms_user")
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [pathname, router])

  const login = (token: string, userData: User) => {
    localStorage.setItem("evdms_auth_token", token)
    localStorage.setItem("evdms_user", JSON.stringify(userData))
    setUser(userData)
    
    // Redirect to appropriate dashboard based on role
    const defaultRoute = getDefaultRouteByRole(userData.role as Role)
    router.push(defaultRoute)
  }

  const logout = async () => {
    try {
      // Get the appropriate auth service based on user role
      if (user?.role) {
        const authService = getAuthServiceByRole(user.role as Role)
        await authService.logout()
      } else {
        // Fallback: clear tokens
        localStorage.removeItem("evdms_auth_token")
        localStorage.removeItem("evdms_refresh_token")
      }
    } catch (error) {
      console.error("Logout error:", error)
      // Clear tokens anyway
      localStorage.removeItem("evdms_auth_token")
      localStorage.removeItem("evdms_refresh_token")
    } finally {
      localStorage.removeItem("evdms_user")
      setUser(null)
      router.push("/login")
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
