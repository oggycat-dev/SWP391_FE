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
  // Dashboard - All authenticated users (except Customer)
  '/dashboard': ['Admin', 'EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff'],

  // CMS routes - Admin & EVM roles
  '/dashboard/vehicles': ['Admin', 'EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff'],
  '/dashboard/inventory': ['Admin', 'EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff'],
  '/dashboard/dealers': ['Admin', 'EVMStaff', 'EVMManager'],
  '/dashboard/dealers/contracts': ['Admin', 'EVMManager'],
  '/dashboard/promotions': ['Admin', 'EVMStaff', 'EVMManager'],
  '/dashboard/reports': ['Admin', 'EVMStaff', 'EVMManager', 'DealerManager'],

  // Admin-only routes
  '/dashboard/users': ['Admin'],

  // Dealer routes - EVMStaff, Dealer roles (NOT Admin)
  '/dashboard/customers': ['EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff'],
  '/dashboard/orders': ['EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff'],
  '/dashboard/payments': ['EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff'],
  '/dashboard/inventory/request': ['DealerManager', 'DealerStaff'],

  // Dealer-only routes
  '/dashboard/quotations': ['DealerManager', 'DealerStaff'],
  '/dashboard/test-drives': ['DealerManager', 'DealerStaff'],
} as const

// ============================================================================
// Feature Permissions
// ============================================================================

export const FEATURE_PERMISSIONS = {
  // Vehicle Management
  canManageVehicles: ['Admin', 'EVMStaff', 'EVMManager'],
  canViewVehicles: ['Admin', 'EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff'],
  canEditVehicles: ['Admin', 'EVMStaff', 'EVMManager'],

  // Inventory Management
  canManageInventory: ['Admin', 'EVMStaff', 'EVMManager'],
  canViewInventory: ['Admin', 'EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff'],
  canRequestVehicles: ['DealerManager', 'DealerStaff'],

  // Dealer Management
  canManageDealers: ['Admin', 'EVMManager'], // Create dealers
  canViewDealers: ['Admin', 'EVMStaff', 'EVMManager'], // View dealers

  // Order Management
  canManageOrders: ['EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff'],
  canViewOrders: ['EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff'],
  canCreateOrders: ['DealerManager', 'DealerStaff'],
  canApproveOrders: ['DealerManager'], // Only manager can approve

  // Quotation Management
  canManageQuotations: ['DealerManager', 'DealerStaff'],
  canViewQuotations: ['DealerManager', 'DealerStaff'],

  // Customer Management
  canManageCustomers: ['EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff'],
  canViewCustomers: ['EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff'],

  // Test Drive Management
  canManageTestDrives: ['DealerManager', 'DealerStaff'],
  canViewTestDrives: ['DealerManager', 'DealerStaff'],

  // Promotion Management
  canManagePromotions: ['Admin', 'EVMManager'], // SalesManager in backend
  canViewPromotions: ['Admin', 'EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff'],

  // Reports
  canViewReports: ['Admin', 'EVMStaff', 'EVMManager', 'DealerManager'],
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
  
  // Admin and EVM roles - CMS Dashboard
  if (roleUpper === 'ADMIN' || roleUpper === 'EVMSTAFF' || roleUpper === 'EVMMANAGER') {
    return '/dashboard'
  }
  
  // Dealer roles - Dealer Dashboard
  if (roleUpper === 'DEALERMANAGER' || roleUpper === 'DEALERSTAFF') {
    return '/dashboard'
  }
  
  // Customer - Customer portal (if implemented)
  if (roleUpper === 'CUSTOMER') {
    return '/customer/dashboard'
  }
  
  return '/dashboard'
}

