import { env } from "@/lib/config/env"
import { AUTH_ENDPOINTS } from "@/lib/config/endpoints"

interface RequestOptions extends RequestInit {
  params?: Record<string, string>
  signal?: AbortSignal
  _retry?: boolean // Internal flag to prevent infinite retry loop
}

interface ApiResponse<T> {
  statusCode: number
  success: boolean
  message: string
  data: T
  errors?: string[]
  timestamp: string
}

interface RefreshTokenResponse {
  token: string
  refreshToken: string
  role: string
}

class ApiClient {
  private baseUrl: string
  private isRefreshing = false
  private refreshSubscribers: ((token: string) => void)[] = []

  constructor() {
    this.baseUrl = env.api.baseUrl
  }

  /**
   * Subscribe to token refresh - used to queue failed requests
   */
  private subscribeTokenRefresh(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback)
  }

  /**
   * Notify all subscribers when token is refreshed
   */
  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token))
    this.refreshSubscribers = []
  }

  /**
   * Attempt to refresh the access token
   */
  private async refreshToken(): Promise<string | null> {
    if (typeof window === "undefined") return null

    const refreshToken = localStorage.getItem("evdms_refresh_token")
    if (!refreshToken) {
      console.warn("[ApiClient] No refresh token available")
      return null
    }

    try {
      console.log("[ApiClient] Attempting to refresh token...")
      
      // Determine which endpoint to use based on stored user role
      const storedUser = localStorage.getItem("evdms_user")
      let refreshEndpoint = AUTH_ENDPOINTS.CMS.REFRESH_TOKEN
      
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser)
          const role = user.role?.toUpperCase()
          
          if (role === "DEALERMANAGER" || role === "DEALERSTAFF") {
            refreshEndpoint = AUTH_ENDPOINTS.DEALER.REFRESH_TOKEN
          } else if (role === "CUSTOMER") {
            refreshEndpoint = AUTH_ENDPOINTS.CUSTOMER.REFRESH_TOKEN
          }
        } catch (e) {
          console.warn("[ApiClient] Failed to parse stored user, using CMS endpoint")
        }
      }

      const response = await fetch(`${this.baseUrl}${refreshEndpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        console.error("[ApiClient] Refresh token failed:", response.status)
        return null
      }

      const data: ApiResponse<RefreshTokenResponse> = await response.json()
      
      if (data.success && data.data?.token) {
        const newToken = data.data.token
        const newRefreshToken = data.data.refreshToken
        
        // Store new tokens
        localStorage.setItem("evdms_auth_token", newToken)
        localStorage.setItem("evdms_refresh_token", newRefreshToken)
        
        console.log("[ApiClient] Token refreshed successfully")
        return newToken
      }

      return null
    } catch (error) {
      console.error("[ApiClient] Token refresh error:", error)
      return null
    }
  }

  /**
   * Handle 401 errors by attempting to refresh token and retry request
   */
  private async handleUnauthorized<T>(
    endpoint: string,
    options: RequestOptions
  ): Promise<T> {
    // Prevent infinite retry loop
    if (options._retry) {
      console.error("[ApiClient] Already retried, logging out...")
      this.handleLogout()
      throw new Error("Unauthorized - Session expired")
    }

    // If already refreshing, wait for the refresh to complete
    if (this.isRefreshing) {
      console.log("[ApiClient] Token refresh in progress, queuing request...")
      return new Promise((resolve, reject) => {
        this.subscribeTokenRefresh((token: string) => {
          // Retry the request with new token
          this.request<T>(endpoint, { ...options, _retry: true })
            .then(resolve)
            .catch(reject)
        })
      })
    }

    // Start refresh process
    this.isRefreshing = true
    
    try {
      const newToken = await this.refreshToken()
      
      if (newToken) {
        // Notify all waiting requests
        this.onTokenRefreshed(newToken)
        
        // Retry the original request
        return await this.request<T>(endpoint, { ...options, _retry: true })
      } else {
        // Refresh failed, logout user
        this.handleLogout()
        throw new Error("Session expired - Please login again")
      }
    } finally {
      this.isRefreshing = false
    }
  }

  /**
   * Handle logout - clear tokens and redirect to login
   */
  private handleLogout() {
    if (typeof window === "undefined") return

    console.log("[ApiClient] Logging out user...")
    localStorage.removeItem("evdms_auth_token")
    localStorage.removeItem("evdms_refresh_token")
    localStorage.removeItem("evdms_user")
    
    // Redirect to login
    window.location.href = "/login"
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, signal, _retry, ...init } = options

    const url = new URL(`${this.baseUrl}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...init.headers,
    } as Record<string, string>

    // Add auth token if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("evdms_auth_token")
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }
    }

    try {
      const response = await fetch(url.toString(), {
        ...init,
        headers,
        signal,
      })

      // Handle abort
      if (signal?.aborted) {
        throw new DOMException("Request aborted", "AbortError")
      }

      // Parse response
      const data: ApiResponse<T> = await response.json()

      // Handle 401 Unauthorized - try to refresh token
      if (response.status === 401 && !_retry) {
        console.log("[ApiClient] 401 Unauthorized - attempting token refresh")
        return await this.handleUnauthorized<T>(endpoint, options)
      }

      // Check if response is successful
      if (!response.ok || !data.success) {
        const errorMessage = data.message || `API Error: ${response.statusText}`
        const error = new Error(errorMessage)
        ;(error as any).status = response.status
        ;(error as any).errors = data.errors
        throw error
      }

      // Return data from response
      return data.data
    } catch (error) {
      // Don't log abort errors
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.error("[ApiClient] Network error - server may be down")
      }

      console.error("API Request failed:", error)
      throw error
    }
  }

  get<T>(endpoint: string, params?: Record<string, string>, signal?: AbortSignal) {
    return this.request<T>(endpoint, { method: "GET", params, signal })
  }

  post<T>(endpoint: string, data: any, signal?: AbortSignal) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      signal,
    })
  }

  put<T>(endpoint: string, data: any, signal?: AbortSignal) {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      signal,
    })
  }

  patch<T>(endpoint: string, data: any, signal?: AbortSignal) {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
      signal,
    })
  }

  delete<T>(endpoint: string, signal?: AbortSignal) {
    return this.request<T>(endpoint, { method: "DELETE", signal })
  }
}

export const apiClient = new ApiClient()
