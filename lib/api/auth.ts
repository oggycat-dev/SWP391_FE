/**
 * Legacy Auth API - For backward compatibility
 * @deprecated Use cmsAuthService, dealerAuthService, or customerAuthService instead
 * This file is kept for backward compatibility but will route to appropriate service based on role
 */

import { cmsAuthService } from './auth/cms-auth.service'
import { dealerAuthService } from './auth/dealer-auth.service'
import { customerAuthService } from './auth/customer-auth.service'
import { getAuthServiceByRole } from './auth/auth-service-factory'
import type { User } from '@/lib/types'
import type { Role } from '@/lib/types'

interface LoginRequest {
  username: string
  password: string
}

/**
 * @deprecated Use cmsAuthService, dealerAuthService, or customerAuthService instead
 */
export const authApi = {
  /**
   * @deprecated Use specific auth service based on user role
   * This method will try to determine the correct service based on login response
   */
  login: async (
    credentials: LoginRequest,
    role?: Role | null
  ): Promise<{ user: User; token: string }> => {
    // If role is provided, use the appropriate service
    if (role) {
      const authService = getAuthServiceByRole(role)
      return authService.login(credentials)
    }

    // Otherwise, try CMS first (most common)
    try {
      return await cmsAuthService.login(credentials)
    } catch (error) {
      // If CMS fails, try Customer
      try {
        return await customerAuthService.login(credentials)
      } catch (customerError) {
        // If both fail, try Dealer
        return await dealerAuthService.login(credentials)
      }
    }
  },

  /**
   * @deprecated Use specific auth service logout method
   */
  logout: async (role?: Role | null): Promise<void> => {
    if (role) {
      const authService = getAuthServiceByRole(role)
      return authService.logout()
    }

    // Try to logout from all services
    try {
      await cmsAuthService.logout()
    } catch {
      // Ignore errors
    }
  },

  /**
   * @deprecated Use specific auth service getStoredToken method
   */
  getStoredToken: (): string | null => {
    return cmsAuthService.getStoredToken()
  },
}
