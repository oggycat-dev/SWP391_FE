/**
 * Dealer Auth Service - For DealerManager and DealerStaff
 * Handles authentication for Dealer users
 * Note: Currently uses CMS auth endpoints as dealers authenticate through CMS
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

export const dealerAuthService = {
  /**
   * Login for Dealer users (DealerManager, DealerStaff)
   * Uses CMS auth endpoint but validates dealer roles
   */
  login: async (data: LoginRequest): Promise<{ user: User; token: string }> => {
    console.log('[Dealer Auth] Login')
    try {
      // apiClient.post already unwraps the response.data, so response is LoginResponseData directly
      const response = await apiClient.post<LoginResponseData>(AUTH_ENDPOINTS.DEALER.LOGIN, {
        username: data.username,
        password: data.password,
      })

      console.log('Login successful:', response)

      // Check if response has the expected structure
      if (!response?.token) {
        throw new Error('Invalid response format from server')
      }

      // Validate that user has Dealer access (DealerManager or DealerStaff)
      const roleUpper = response.role.toUpperCase()
      if (roleUpper !== 'DEALERMANAGER' && roleUpper !== 'DEALERSTAFF') {
        throw new Error('Access denied. Dealer login is only for DealerManager and DealerStaff.')
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
    console.log('[Dealer Auth] Refresh Token')
    const token = refreshToken || (typeof window !== 'undefined' ? localStorage.getItem('evdms_refresh_token') : null)
    
    if (!token) {
      throw new Error('No refresh token available')
    }

    const response = await apiClient.post<LoginResponseData>(AUTH_ENDPOINTS.DEALER.REFRESH_TOKEN, {
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
    console.log('[Dealer Auth] Logout')
    try {
      await apiClient.post(AUTH_ENDPOINTS.DEALER.LOGOUT, {})
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

