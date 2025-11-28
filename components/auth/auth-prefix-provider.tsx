/**
 * AuthPrefixProvider - Determines API prefix (cms) based on user role
 * All 4 roles (Admin, EVMStaff, DealerManager, DealerStaff) use CMS API
 */

'use client'

import { createContext, useContext, ReactNode, useMemo } from 'react'
import { UserRole, type ApiPrefix } from '@/lib/types/enums'
import type { Role } from '@/lib/types'

interface AuthPrefixContextValue {
  prefix: ApiPrefix
  isCmsUser: boolean
  isEvmUser: boolean
  isDealerUser: boolean
  basePath: string
}

const AuthPrefixContext = createContext<AuthPrefixContextValue | undefined>(undefined)

interface AuthPrefixProviderProps {
  children: ReactNode
  userRole?: Role | null
}

export const AuthPrefixProvider = ({ children, userRole }: AuthPrefixProviderProps) => {
  const value = useMemo((): AuthPrefixContextValue => {
    // If no user role, default to cms
    if (!userRole) {
      return {
        prefix: 'cms',
        isCmsUser: false,
        isEvmUser: false,
        isDealerUser: false,
        basePath: '/dashboard',
      }
    }

    // Check user role and determine flags
    const roleUpper = userRole.toUpperCase()
    const isAdmin = roleUpper === 'ADMIN'
    const isEvmStaff = roleUpper === 'EVMSTAFF'
    const isDealerManager = roleUpper === 'DEALERMANAGER'
    const isDealerStaff = roleUpper === 'DEALERSTAFF'
    
    const isCmsUser = isAdmin || isEvmStaff || isDealerManager || isDealerStaff
    const isEvmUser = isAdmin || isEvmStaff
    const isDealerUser = isDealerManager || isDealerStaff

    // All users use CMS API prefix
    return {
      prefix: 'cms',
      isCmsUser,
      isEvmUser,
      isDealerUser,
      basePath: '/dashboard',
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
 * All users use CMS API endpoints
 * @param endpoint - Endpoint path (without /api/cms prefix)
 * @returns Full endpoint path with prefix
 */
export const useApiEndpoint = (endpoint: string) => {
  const { prefix } = useAuthPrefix()
  return `/api/${prefix}${endpoint}`
}

