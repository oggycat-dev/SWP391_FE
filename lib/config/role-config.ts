/**
 * Role-based configuration
 * Defines which roles can access which features
 */

import { UserRole } from '@/lib/types/enums'
import type { Role } from '@/lib/types'

// ============================================================================
// Route Access Configuration
// ============================================================================

export interface RouteConfig {
  path: string
  allowedRoles: Role[]
  label: string
  icon?: string
}

export const ROUTE_ACCESS: Record<string, Role[]> = {
  // Dashboard - All authenticated users
  '/dashboard': ['Admin', 'EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff', 'Customer'],

  // CMS routes (Admin, EVMStaff, EVMManager)
  '/dashboard/vehicles': ['Admin', 'EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff', 'Customer'],
  '/dashboard/inventory': ['Admin', 'EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff'],
  '/dashboard/dealers': ['Admin', 'EVMStaff', 'EVMManager'],
  '/dashboard/promotions': ['Admin', 'EVMStaff', 'EVMManager'],
  '/dashboard/reports': ['Admin', 'EVMStaff', 'EVMManager', 'DealerManager'],

  // Shared routes - Multiple roles can access
  '/dashboard/customers': ['Admin', 'EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff'],
  '/dashboard/orders': ['Admin', 'EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff', 'Customer'],
  '/dashboard/payments': ['Admin', 'EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff'],
  '/dashboard/inventory/request': ['DealerManager', 'DealerStaff'],

  // Dealer-only routes
  '/dashboard/quotations': ['DealerManager', 'DealerStaff'],
  '/dashboard/test-drives': ['DealerManager', 'DealerStaff', 'Customer'],
} as const

// ============================================================================
// Feature Permissions
// ============================================================================

export const FEATURE_PERMISSIONS = {
  // Vehicle Management
  canManageVehicles: ['Admin', 'EVMStaff', 'EVMManager'],
  canViewVehicles: ['Admin', 'EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff', 'Customer'],
  canEditVehicles: ['Admin', 'EVMStaff', 'EVMManager'],

  // Inventory Management
  canManageInventory: ['Admin', 'EVMStaff', 'EVMManager'],
  canViewInventory: ['Admin', 'EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff'],
  canRequestVehicles: ['DealerManager', 'DealerStaff'],

  // Dealer Management
  canManageDealers: ['Admin', 'EVMStaff', 'EVMManager'],
  canViewDealers: ['Admin', 'EVMStaff', 'EVMManager'],

  // Order Management
  canManageOrders: ['Admin', 'EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff'],
  canViewOrders: ['Admin', 'EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff', 'Customer'],
  canCreateOrders: ['DealerManager', 'DealerStaff'],

  // Quotation Management
  canManageQuotations: ['DealerManager', 'DealerStaff'],
  canViewQuotations: ['DealerManager', 'DealerStaff', 'Customer'],

  // Customer Management
  canManageCustomers: ['Admin', 'EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff'],
  canViewCustomers: ['Admin', 'EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff'],

  // Test Drive Management
  canManageTestDrives: ['DealerManager', 'DealerStaff'],
  canViewTestDrives: ['DealerManager', 'DealerStaff', 'Customer'],
  canRequestTestDrives: ['Customer'],

  // Promotion Management
  canManagePromotions: ['Admin', 'EVMStaff', 'EVMManager'],
  canViewPromotions: ['Admin', 'EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff', 'Customer'],

  // Reports
  canViewReports: ['Admin', 'EVMStaff', 'EVMManager'],
} as const

// ============================================================================
// Helper Functions
// ============================================================================

export const canAccessRoute = (path: string, userRole: Role | null): boolean => {
  if (!userRole) return false
  
  const allowedRoles = ROUTE_ACCESS[path]
  if (!allowedRoles) return true // No restriction

  return allowedRoles.includes(userRole)
}

export const canAccessFeature = (
  feature: keyof typeof FEATURE_PERMISSIONS,
  userRole: Role | null
): boolean => {
  if (!userRole) return false
  
  const allowedRoles = FEATURE_PERMISSIONS[feature] as readonly Role[]
  return allowedRoles.includes(userRole)
}

export const getDefaultRouteByRole = (role: Role | null): string => {
  if (!role) return '/login'
  
  const roleUpper = role.toUpperCase()
  
  if (roleUpper === 'ADMIN' || roleUpper === 'EVMSTAFF' || roleUpper === 'EVMMANAGER') {
    return '/dashboard'
  } else if (roleUpper === 'DEALERMANAGER' || roleUpper === 'DEALERSTAFF') {
    return '/dashboard'
  } else if (roleUpper === 'CUSTOMER') {
    return '/dashboard'
  }
  
  return '/dashboard'
}

