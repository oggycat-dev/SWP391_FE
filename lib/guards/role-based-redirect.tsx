/**
 * RoleBasedRedirect - Redirects to appropriate dashboard based on user role
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getDefaultRouteByRole } from '@/lib/config/role-config'
import type { Role } from '@/lib/types'

interface RoleBasedRedirectProps {
  userRole: Role | null
}

export const RoleBasedRedirect = ({ userRole }: RoleBasedRedirectProps) => {
  const router = useRouter()

  useEffect(() => {
    const defaultRoute = getDefaultRouteByRole(userRole)
    router.replace(defaultRoute)
  }, [userRole, router])

  return <div>Redirecting...</div>
}

