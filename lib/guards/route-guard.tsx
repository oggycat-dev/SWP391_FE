/**
 * Route Guard Components
 * Role-based access control for routes
 * Following chemistry-subject-web pattern
 */

'use client'

import { ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { Role } from '@/lib/types'

// ============================================================================
// Protected Route - Requires Authentication
// ============================================================================

interface ProtectedRouteProps {
  children: ReactNode
  isAuthenticated: boolean
  isLoading?: boolean
}

export const ProtectedRoute = ({ 
  children, 
  isAuthenticated, 
  isLoading = false 
}: ProtectedRouteProps) => {
  const router = useRouter()
  const pathname = usePathname()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    return null
  }

  return <>{children}</>
}

// ============================================================================
// Public Only Route - Redirect to home if authenticated
// ============================================================================

interface PublicOnlyRouteProps {
  children: ReactNode
  isAuthenticated: boolean
  isLoading?: boolean
}

export const PublicOnlyRoute = ({ 
  children, 
  isAuthenticated, 
  isLoading = false 
}: PublicOnlyRouteProps) => {
  const router = useRouter()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isAuthenticated) {
    router.push('/dashboard')
    return null
  }

  return <>{children}</>
}

// ============================================================================
// Role-Based Route - Requires Specific Role(s)
// ============================================================================

interface RoleBasedRouteProps {
  children: ReactNode
  allowedRoles: Role[]
  userRole: Role | null
  isAuthenticated: boolean
  isLoading?: boolean
  redirectTo?: string
}

export const RoleBasedRoute = ({
  children,
  allowedRoles,
  userRole,
  isAuthenticated,
  isLoading = false,
  redirectTo = '/unauthorized',
}: RoleBasedRouteProps) => {
  const router = useRouter()
  const pathname = usePathname()

  if (isLoading) {
    return <div>Loading...</div>
  }

  // First check authentication
  if (!isAuthenticated) {
    router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    return null
  }

  // Then check role
  if (!userRole || !allowedRoles.includes(userRole)) {
    console.error('[RoleBasedRoute] Access Denied:', {
      userRole,
      allowedRoles,
      path: pathname,
    })
    router.push(redirectTo)
    return null
  }

  return <>{children}</>
}

// ============================================================================
// CMS Route - All 4 Main Roles
// ============================================================================

interface CmsRouteProps {
  children: ReactNode
  userRole: Role | null
  isAuthenticated: boolean
  isLoading?: boolean
}

export const CmsRoute = ({ 
  children, 
  userRole, 
  isAuthenticated, 
  isLoading 
}: CmsRouteProps) => {
  return (
    <RoleBasedRoute
      allowedRoles={['Admin', 'EVMStaff', 'DealerManager', 'DealerStaff']}
      userRole={userRole}
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      redirectTo="/unauthorized"
    >
      {children}
    </RoleBasedRoute>
  )
}

// ============================================================================
// EVM Route - Admin and EVMStaff Only
// ============================================================================

interface EvmRouteProps {
  children: ReactNode
  userRole: Role | null
  isAuthenticated: boolean
  isLoading?: boolean
}

export const EvmRoute = ({ 
  children, 
  userRole, 
  isAuthenticated, 
  isLoading 
}: EvmRouteProps) => {
  return (
    <RoleBasedRoute
      allowedRoles={['Admin', 'EVMStaff']}
      userRole={userRole}
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      redirectTo="/unauthorized"
    >
      {children}
    </RoleBasedRoute>
  )
}

// ============================================================================
// Dealer Route - DealerManager or DealerStaff Only
// ============================================================================

interface DealerRouteProps {
  children: ReactNode
  userRole: Role | null
  isAuthenticated: boolean
  isLoading?: boolean
}

export const DealerRoute = ({ 
  children, 
  userRole, 
  isAuthenticated, 
  isLoading 
}: DealerRouteProps) => {
  return (
    <RoleBasedRoute
      allowedRoles={['DealerManager', 'DealerStaff']}
      userRole={userRole}
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      redirectTo="/unauthorized"
    >
      {children}
    </RoleBasedRoute>
  )
}

// ============================================================================
// Admin Only Route
// ============================================================================

interface AdminOnlyRouteProps {
  children: ReactNode
  userRole: Role | null
  isAuthenticated: boolean
  isLoading?: boolean
}

export const AdminOnlyRoute = ({ 
  children, 
  userRole, 
  isAuthenticated, 
  isLoading 
}: AdminOnlyRouteProps) => {
  return (
    <RoleBasedRoute
      allowedRoles={['Admin']}
      userRole={userRole}
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      redirectTo="/unauthorized"
    >
      {children}
    </RoleBasedRoute>
  )
}

