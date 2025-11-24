import { env } from "@/lib/config/env"

interface RequestOptions extends RequestInit {
  params?: Record<string, string>
      signal?: AbortSignal
}

interface ApiResponse<T> {
  statusCode: number
  success: boolean
  message: string
  data: T
  errors?: string[]
  timestamp: string
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = env.api.baseUrl
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, signal, ...init } = options

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
