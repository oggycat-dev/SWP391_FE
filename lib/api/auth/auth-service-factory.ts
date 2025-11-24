/**
 * Auth Service Factory
 * Returns the appropriate auth service based on user role or prefix
 */

import { cmsAuthService } from './cms-auth.service'
import { dealerAuthService } from './dealer-auth.service'
import { customerAuthService } from './customer-auth.service'
import type { Role } from '@/lib/types'
import type { ApiPrefix } from '@/lib/types/enums'

type AuthService = typeof cmsAuthService | typeof dealerAuthService | typeof customerAuthService

/**
 * Get auth service based on user role
 */
export const getAuthServiceByRole = (role: Role | null): AuthService => {
  if (!role) {
    return cmsAuthService // Default to CMS
  }

  const roleUpper = role.toUpperCase()

  if (roleUpper === 'ADMIN' || roleUpper === 'EVMSTAFF' || roleUpper === 'EVMMANAGER') {
    return cmsAuthService
  } else if (roleUpper === 'DEALERMANAGER' || roleUpper === 'DEALERSTAFF') {
    return dealerAuthService
  } else if (roleUpper === 'CUSTOMER') {
    return customerAuthService
  }

  return cmsAuthService // Default to CMS
}

/**
 * Get auth service based on API prefix
 */
export const getAuthServiceByPrefix = (prefix: ApiPrefix): AuthService => {
  switch (prefix) {
    case 'cms':
      return cmsAuthService
    case 'dealer':
      return dealerAuthService
    case 'customer':
      return customerAuthService
    default:
      return cmsAuthService
  }
}

