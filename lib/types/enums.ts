/**
 * User Role Enumeration
 * Maps to backend UserRole enum
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
 */
export type ApiPrefix = 'cms' | 'dealer' | 'customer'

