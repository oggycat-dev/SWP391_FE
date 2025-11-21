import { apiClient } from "./client"
import type { User } from "@/lib/types"

interface LoginRequest {
  username: string
  password: string
}

interface LoginResponse {
  statusCode: number
  success: boolean
  message: string
  data: {
    token: string
    refreshToken: string
    role: string
  }
  timestamp: string
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<{ user: User; token: string }> => {
    try {
      const response = await apiClient.post<LoginResponse>("/Auth/login", {
        username: credentials.username,
        password: credentials.password,
      })

      console.log("Login successful:", response)

      // Check if response has the expected structure
      if (!response?.data?.token) {
        throw new Error("Invalid response format from server")
      }

      // Parse JWT to get user info
      const tokenParts = response.data.token.split('.')
      if (tokenParts.length !== 3) {
        throw new Error("Invalid token format")
      }

      const payload = JSON.parse(atob(tokenParts[1]))
      console.log("Token payload:", payload)

      // Extract user info from JWT claims
      const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
      const userName = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
      const userEmail = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]

      // Map backend response to frontend User type
      const user: User = {
        id: userId,
        email: userEmail,
        name: userName,
        role: response.data.role.toUpperCase() as any,
        createdAt: response.timestamp,
      }

      return {
        user,
        token: response.data.token,
      }
    } catch (error: any) {
      console.error("Login API error:", error)
      throw new Error(error?.message || "Login failed. Please try again.")
    }
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("evdms_auth_token")
    }
    return apiClient.post("/Auth/logout", {})
  },
  me: () => apiClient.get<User>("/Auth/me"),
  getStoredToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("evdms_auth_token")
    }
    return null
  },
}
