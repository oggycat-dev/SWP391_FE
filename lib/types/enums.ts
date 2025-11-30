/**
 * User Role Enumeration
 * Maps to backend UserRole enum exactly
 * Note: EVMManager (2) is removed, but enum values remain for backward compatibility
 */
export enum UserRole {
  Admin = 0,
  EVMStaff = 1,
  // EVMManager = 2, // Removed
  DealerManager = 3,
  DealerStaff = 4,
  Customer = 5,
}

/**
 * Role string type for type safety
 * Frontend uses these 5 roles (EVMManager removed)
 */
export type UserRoleString = 
  | 'Admin' 
  | 'EVMStaff'
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

/**
 * Vehicle Category Enumeration
 * Maps to backend VehicleCategory enum exactly
 */
export enum VehicleCategory {
  Sedan = 'Sedan',
  SUV = 'SUV',
  Hatchback = 'Hatchback',
  Truck = 'Truck',
  Van = 'Van',
  Coupe = 'Coupe',
}

/**
 * Vehicle Category string type for type safety
 */
export type VehicleCategoryString =
  | 'Sedan'
  | 'SUV'
  | 'Hatchback'
  | 'Truck'
  | 'Van'
  | 'Coupe'

