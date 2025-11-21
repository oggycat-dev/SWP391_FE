"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { User } from "@/lib/types"
import { authApi } from "@/lib/api/auth"

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
      const token = authApi.getStoredToken()
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

        // Mock restoration for demo purposes if no API is actually running
        if (!user) {
          // This is just a fallback to prevent infinite loading in demo
          // In production, this should fail if /me endpoint fails
        }
      } catch (error) {
        console.error("Auth initialization failed", error)
        localStorage.removeItem("evdms_auth_token")
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [pathname, router])

  const login = (token: string, userData: User) => {
    localStorage.setItem("evdms_auth_token", token)
    setUser(userData)
    router.push("/dashboard")
  }

  const logout = async () => {
    await authApi.logout()
    setUser(null)
    router.push("/login")
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
