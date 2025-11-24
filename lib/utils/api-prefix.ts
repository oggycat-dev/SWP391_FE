/**
 * API Prefix Utility
 * Determines the correct API prefix (cms/dealer/customer) based on user role
 */

import type { Role } from '@/lib/types'

/**
 * Get API prefix from user role
 * @param role - User role string
 * @returns API prefix: 'cms', 'dealer', or 'customer'
 */
export function getApiPrefixFromRole(role: Role | string | null): 'cms' | 'dealer' | 'customer' {
  if (!role) {
    console.warn('[getApiPrefixFromRole] No role provided, defaulting to cms')
    return 'cms' // Default to cms for unauthenticated
  }

  const roleUpper = String(role).toUpperCase().trim()

  // CMS roles: Admin, EVMStaff, EVMManager
  if (roleUpper === 'ADMIN' || roleUpper === 'EVMSTAFF' || roleUpper === 'EVMMANAGER') {
    console.log('[getApiPrefixFromRole] CMS role detected:', roleUpper, '-> prefix: cms')
    return 'cms'
  }

  // Dealer roles: DealerManager, DealerStaff
  if (roleUpper === 'DEALERMANAGER' || roleUpper === 'DEALERSTAFF') {
    console.log('[getApiPrefixFromRole] Dealer role detected:', roleUpper, '-> prefix: dealer')
    return 'dealer'
  }

  // Customer role
  if (roleUpper === 'CUSTOMER') {
    console.log('[getApiPrefixFromRole] Customer role detected:', roleUpper, '-> prefix: customer')
    return 'customer'
  }

  // Default to cms
  console.warn('[getApiPrefixFromRole] Unknown role:', roleUpper, ', defaulting to cms')
  return 'cms'
}

/**
 * Get API prefix from localStorage (current user)
 * @returns API prefix based on stored user role
 */
export function getCurrentApiPrefix(): 'cms' | 'dealer' | 'customer' {
  if (typeof window === 'undefined') return 'cms'

  try {
    const userStr = localStorage.getItem('evdms_user')
    if (userStr) {
      const user = JSON.parse(userStr)
      const role = user.role
      console.log('[getCurrentApiPrefix] Raw user from localStorage:', user)
      console.log('[getCurrentApiPrefix] User role:', role, 'Type:', typeof role)
      
      if (role) {
        const prefix = getApiPrefixFromRole(role)
        console.log('[getCurrentApiPrefix] Determined prefix:', prefix, 'for role:', role)
        return prefix
      } else {
        console.warn('[getCurrentApiPrefix] User object found but role is missing:', user)
      }
    } else {
      console.warn('[getCurrentApiPrefix] No user found in localStorage')
    }
  } catch (error) {
    console.error('[getCurrentApiPrefix] Error parsing user from localStorage:', error)
  }

  console.warn('[getCurrentApiPrefix] Defaulting to cms')
  return 'cms' // Default
}

/**
 * Build API endpoint with dynamic prefix
 * @param endpoint - Endpoint path without prefix (e.g., '/customers')
 * @param role - Optional role to determine prefix. If not provided, uses current user from localStorage
 * @returns Full endpoint path with prefix (e.g., '/api/cms/customers')
 */
export function buildApiEndpoint(
  endpoint: string,
  role?: Role | string | null
): string {
  const prefix = role !== undefined ? getApiPrefixFromRole(role) : getCurrentApiPrefix()
  
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  
  return `/api/${prefix}/${cleanEndpoint}`
}

