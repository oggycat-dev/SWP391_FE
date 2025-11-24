/**
 * AuthPrefixProvider - Determines API prefix (cms/dealer/customer) based on user role
 * Following chemistry-subject-web architecture pattern
 */

'use client'

import { createContext, useContext, ReactNode, useMemo } from 'react'
import { UserRole, type ApiPrefix } from '@/lib/types/enums'
import type { Role } from '@/lib/types'

interface AuthPrefixContextValue {
  prefix: ApiPrefix
  isCmsUser: boolean
  isDealerUser: boolean
  isCustomerUser: boolean
  basePath: string // Route base path: /cms, /dealer, or /customer
}

const AuthPrefixContext = createContext<AuthPrefixContextValue | undefined>(undefined)

interface AuthPrefixProviderProps {
  children: ReactNode
  userRole?: Role | null
}

export const AuthPrefixProvider = ({ children, userRole }: AuthPrefixProviderProps) => {
  const value = useMemo((): AuthPrefixContextValue => {
    // If no user role, default to cms (for login attempt)
    if (!userRole) {
      return {
        prefix: 'cms',
        isCmsUser: false,
        isDealerUser: false,
        isCustomerUser: false,
        basePath: '/dashboard',
      }
    }

    // Check user role and determine prefix
    const roleUpper = userRole.toUpperCase()
    const isCmsUser = 
      roleUpper === 'ADMIN' || 
      roleUpper === 'EVMSTAFF' || 
      roleUpper === 'EVMMANAGER'
    const isDealerUser = 
      roleUpper === 'DEALERMANAGER' || 
      roleUpper === 'DEALERSTAFF'
    const isCustomerUser = roleUpper === 'CUSTOMER'

    let prefix: ApiPrefix = 'cms'
    let basePath = '/dashboard'

    if (isCmsUser) {
      prefix = 'cms'
      basePath = '/dashboard'
    } else if (isDealerUser) {
      prefix = 'dealer'
      basePath = '/dashboard'
    } else if (isCustomerUser) {
      prefix = 'customer'
      basePath = '/dashboard'
    }

    return {
      prefix,
      isCmsUser,
      isDealerUser,
      isCustomerUser,
      basePath,
    }
  }, [userRole])

  return <AuthPrefixContext.Provider value={value}>{children}</AuthPrefixContext.Provider>
}

/**
 * Hook to get current API prefix and route base path
 */
export const useAuthPrefix = () => {
  const context = useContext(AuthPrefixContext)
  if (context === undefined) {
    throw new Error('useAuthPrefix must be used within AuthPrefixProvider')
  }
  return context
}

/**
 * Hook to get API endpoint with correct prefix
 * @param cmsEndpoint - Endpoint for CMS users (without /api/cms prefix)
 * @param dealerEndpoint - Endpoint for Dealer users (without /api/dealer prefix)
 * @param customerEndpoint - Endpoint for Customer users (without /api/customer prefix)
 * @returns Full endpoint path with prefix
 */
export const useApiEndpoint = (
  cmsEndpoint: string,
  dealerEndpoint: string,
  customerEndpoint: string
) => {
  const { prefix } = useAuthPrefix()
  if (prefix === 'cms') {
    return `/api/cms${cmsEndpoint}`
  } else if (prefix === 'dealer') {
    return `/api/dealer${dealerEndpoint}`
  } else {
    return `/api/customer${customerEndpoint}`
  }
}

