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
        // Don't auto-redirect here, let middleware handle it
        // This prevents flash of redirect on page load
        return
      }

      try {
        // Try to restore user from localStorage
        const storedUser = localStorage.getItem("evdms_user")
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser)
            setUser(userData)
            
            // Validate token is not expired by checking JWT exp
            // If token is valid, keep user logged in
            const tokenParts = token.split('.')
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]))
              const exp = payload.exp * 1000 // Convert to milliseconds
              
              if (Date.now() >= exp) {
                console.log("[AuthProvider] Token expired, will refresh on next API call")
                // Don't logout here, let the API client handle refresh
              }
            }
          } catch (error) {
            // Invalid stored user or token, clear everything
            console.error("[AuthProvider] Invalid stored data:", error)
            localStorage.removeItem("evdms_user")
            localStorage.removeItem("evdms_auth_token")
            localStorage.removeItem("evdms_refresh_token")
            setUser(null)
          }
        } else {
          // Have token but no user data, clear token
          localStorage.removeItem("evdms_auth_token")
          localStorage.removeItem("evdms_refresh_token")
        }
      } catch (error) {
        console.error("Auth initialization failed", error)
        localStorage.removeItem("evdms_auth_token")
        localStorage.removeItem("evdms_refresh_token")
        localStorage.removeItem("evdms_user")
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [pathname, router])

  const login = (token: string, userData: User) => {
    localStorage.setItem("evdms_auth_token", token)
    localStorage.setItem("evdms_user", JSON.stringify(userData))
    
    // Set cookie for middleware (expires in 7 days)
    const expires = new Date()
    expires.setDate(expires.getDate() + 7)
    document.cookie = `evdms_auth_token=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`
    
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
      
      // Clear cookie
      document.cookie = "evdms_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax"
      
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
