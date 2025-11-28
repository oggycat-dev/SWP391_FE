/**
 * CMS Auth Service - For Admin, EVMStaff, and EVMManager
 * Handles authentication for CMS users
 */

import { apiClient } from '../client'
import { AUTH_ENDPOINTS } from '@/lib/config/endpoints'
import type { User } from '@/lib/types'

interface LoginRequest {
  username: string
  password: string
}

interface LoginResponseData {
  token: string
  refreshToken: string
  role: string
}

interface RefreshTokenRequest {
  refreshToken: string
}

interface ApiResponse<T> {
  statusCode: number
  success: boolean
  message: string
  data: T
  timestamp: string
}

export const cmsAuthService = {
  /**
   * Login for CMS users (Admin, EVMStaff, DealerManager, DealerStaff)
   */
  login: async (data: LoginRequest): Promise<{ user: User; token: string }> => {
    console.log('[CMS Auth] Login')
    try {
      // Call backend API
      const response = await apiClient.post<LoginResponseData>(AUTH_ENDPOINTS.CMS.LOGIN, {
        username: data.username,
        password: data.password,
      })

      console.log('Login successful:', response)

      // Check if response has the expected structure
      if (!response?.token) {
        throw new Error('Invalid response format from server')
      }

      // Validate that user has CMS access (Admin, EVMStaff, DealerManager, or DealerStaff)
      const roleUpper = response.role.toUpperCase()
      if (
        roleUpper !== 'ADMIN' &&
        roleUpper !== 'EVMSTAFF' &&
        roleUpper !== 'DEALERMANAGER' &&
        roleUpper !== 'DEALERSTAFF'
      ) {
        throw new Error('Access denied. CMS login is only for Admin, EVMStaff, DealerManager, and DealerStaff.')
      }

      // Parse JWT to get user info
      const tokenParts = response.token.split('.')
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format')
      }

      const payload = JSON.parse(atob(tokenParts[1]))
      console.log('Token payload:', payload)

      // Extract user info from JWT claims
      const userId =
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
      const userName =
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
      const userEmail =
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']

      // Map backend response to frontend User type
      const user: User = {
        id: userId,
        email: userEmail,
        name: userName,
        role: response.role as any,
        createdAt: new Date().toISOString(),
      }

      // Store token
      if (typeof window !== 'undefined') {
        localStorage.setItem('evdms_auth_token', response.token)
        localStorage.setItem('evdms_refresh_token', response.refreshToken)
      }

      return {
        user,
        token: response.token,
      }
    } catch (error: any) {
      console.error('Login API error:', error)
      throw new Error(error?.message || 'Login failed. Please try again.')
    }
  },

  /**
   * Refresh token
   */
  refreshToken: async (refreshToken?: string): Promise<{ token: string; refreshToken: string }> => {
    console.log('[CMS Auth] Refresh Token')
    const token = refreshToken || (typeof window !== 'undefined' ? localStorage.getItem('evdms_refresh_token') : null)
    
    if (!token) {
      throw new Error('No refresh token available')
    }

    const response = await apiClient.post<LoginResponseData>(AUTH_ENDPOINTS.CMS.REFRESH_TOKEN, {
      refreshToken: token,
    })

    if (!response?.token) {
      throw new Error('Invalid response format from server')
    }

    // Store new tokens
    if (typeof window !== 'undefined') {
      localStorage.setItem('evdms_auth_token', response.token)
      localStorage.setItem('evdms_refresh_token', response.refreshToken)
    }

    return {
      token: response.token,
      refreshToken: response.refreshToken,
    }
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    console.log('[CMS Auth] Logout')
    try {
      await apiClient.post(AUTH_ENDPOINTS.CMS.LOGOUT, {})
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear tokens regardless of API call success
      if (typeof window !== 'undefined') {
        localStorage.removeItem('evdms_auth_token')
        localStorage.removeItem('evdms_refresh_token')
      }
    }
  },

  /**
   * Get stored token
   */
  getStoredToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('evdms_auth_token')
    }
    return null
  },
}

