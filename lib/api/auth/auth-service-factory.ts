/**
 * Auth Service Factory
 * All 4 roles use CMS auth service
 */

import { cmsAuthService } from './cms-auth.service'
import type { Role } from '@/lib/types'
import type { ApiPrefix } from '@/lib/types/enums'

type AuthService = typeof cmsAuthService

/**
 * Get auth service based on user role
 * All roles use CMS auth service
 */
export const getAuthServiceByRole = (role: Role | null): AuthService => {
  return cmsAuthService
}

/**
 * Get auth service based on API prefix
 * All roles use CMS auth service
 */
export const getAuthServiceByPrefix = (prefix: ApiPrefix): AuthService => {
  return cmsAuthService
}

