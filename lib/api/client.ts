import { env } from "@/lib/config/env"

interface RequestOptions extends RequestInit {
  params?: Record<string, string>
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = env.api.baseUrl
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...init } = options

    const url = new URL(`${this.baseUrl}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
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
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error("API Request failed:", error)
      throw error
    }
  }

  get<T>(endpoint: string, params?: Record<string, string>) {
    return this.request<T>(endpoint, { method: "GET", params })
  }

  post<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  put<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient()
