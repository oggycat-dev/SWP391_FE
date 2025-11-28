/**
 * User Role Enumeration
 * Maps to backend UserRole enum exactly
 */
export enum UserRole {
  Admin = 0,
  EVMStaff = 1,
  EVMManager = 2,
  DealerManager = 3,
  DealerStaff = 4,
  Customer = 5,
}

/**
 * Role string type for type safety
 * Frontend uses these 6 roles to match backend
 */
export type UserRoleString = 
  | 'Admin' 
  | 'EVMStaff'
  | 'EVMManager'
  | 'DealerManager' 
  | 'DealerStaff'
  | 'Customer'

/**
 * API Prefix type
 * CMS for Admin/EVM roles, Dealer for dealer roles, Customer for customer portal
 */
export type ApiPrefix = 'cms' | 'dealer' | 'customer'

/**
 * Status Enumeration
 * Maps to backend Status enum
 */
export enum Status {
  Inactive = 0,
  Active = 1,
  Pending = 2,
  Suspended = 3,
}

/**
 * Status string type for type safety
 */
export type StatusString = 
  | 'Inactive'
  | 'Active' 
  | 'Pending'
  | 'Suspended'

