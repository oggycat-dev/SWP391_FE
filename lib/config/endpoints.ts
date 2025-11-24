/**
 * API Endpoints Configuration
 * Centralized endpoint definitions for all API calls
 * Note: Some endpoints are role-specific and will use dynamic prefix
 */

// Get prefixes from environment variables
const PREFIX_CMS = process.env.NEXT_PUBLIC_PREFIX_CMS || 'cms'
const PREFIX_DEALER = process.env.NEXT_PUBLIC_PREFIX_DEALER || 'dealer'
const PREFIX_CUSTOMER = process.env.NEXT_PUBLIC_PREFIX_CUSTOMER || 'customer'

// ============================================================================
// Auth Endpoints
// ============================================================================

export const AUTH_ENDPOINTS = {
  // CMS endpoints (Admin, EVMStaff, EVMManager)
  CMS: {
    LOGIN: `/api/${PREFIX_CMS}/auth/login`,
    LOGOUT: `/api/${PREFIX_CMS}/auth/logout`,
    REFRESH_TOKEN: `/api/${PREFIX_CMS}/auth/refresh-token`,
  },
  
  // Dealer endpoints (DealerManager, DealerStaff)
  // Note: Dealer may use CMS auth endpoints or have separate ones
  DEALER: {
    LOGIN: `/api/${PREFIX_CMS}/auth/login`, // Using CMS auth for now
    LOGOUT: `/api/${PREFIX_CMS}/auth/logout`,
    REFRESH_TOKEN: `/api/${PREFIX_CMS}/auth/refresh-token`,
  },
  
  // Customer endpoints
  CUSTOMER: {
    LOGIN: `/api/${PREFIX_CUSTOMER}/auth/login`,
    REGISTER: `/api/${PREFIX_CUSTOMER}/auth/register`,
    LOGOUT: `/api/${PREFIX_CUSTOMER}/auth/logout`,
    REFRESH_TOKEN: `/api/${PREFIX_CUSTOMER}/auth/refresh-token`,
  },
} as const

// ============================================================================
// Vehicle Endpoints
// ============================================================================

export const VEHICLE_ENDPOINTS = {
  // CMS endpoints
  CMS: {
    MODELS: `/api/${PREFIX_CMS}/vehicles/models`,
    MODEL_BY_ID: (id: string) => `/api/${PREFIX_CMS}/vehicles/models/${id}`,
    VARIANTS: `/api/${PREFIX_CMS}/vehicles/variants`,
    VARIANT_BY_ID: (id: string) => `/api/${PREFIX_CMS}/vehicles/variants/${id}`,
    COLORS: `/api/${PREFIX_CMS}/vehicles/colors`,
    COLOR_BY_ID: (id: string) => `/api/${PREFIX_CMS}/vehicles/colors/${id}`,
    INVENTORIES: `/api/${PREFIX_CMS}/vehicles/inventories`,
    INVENTORY_BY_ID: (id: string) => `/api/${PREFIX_CMS}/vehicles/inventories/${id}`,
  },
} as const

// ============================================================================
// Dealer Endpoints
// ============================================================================

export const DEALER_ENDPOINTS = {
  // CMS endpoints for managing dealers
  CMS: {
    BASE: `/api/${PREFIX_CMS}/dealers`,
    BY_ID: (id: string) => `/api/${PREFIX_CMS}/dealers/${id}`,
  },
  
  // Dealer endpoints for dealer operations
  DEALER: {
    CUSTOMERS: `/api/${PREFIX_DEALER}/customers`,
    CUSTOMER_BY_ID: (id: string) => `/api/${PREFIX_DEALER}/customers/${id}`,
    ORDERS: `/api/${PREFIX_DEALER}/orders`,
    ORDER_BY_ID: (id: string) => `/api/${PREFIX_DEALER}/orders/${id}`,
    QUOTATIONS: `/api/${PREFIX_DEALER}/quotations`,
    QUOTATION_BY_ID: (id: string) => `/api/${PREFIX_DEALER}/quotations/${id}`,
    PAYMENTS: `/api/${PREFIX_DEALER}/payments`,
    PAYMENT_BY_ID: (id: string) => `/api/${PREFIX_DEALER}/payments/${id}`,
    CONTRACTS: `/api/${PREFIX_DEALER}/contracts`,
    CONTRACT_BY_ID: (id: string) => `/api/${PREFIX_DEALER}/contracts/${id}`,
    TEST_DRIVES: `/api/${PREFIX_DEALER}/test-drives`,
    TEST_DRIVE_BY_ID: (id: string) => `/api/${PREFIX_DEALER}/test-drives/${id}`,
    VEHICLE_REQUESTS: `/api/${PREFIX_DEALER}/vehicle-requests`,
    VEHICLE_REQUEST_BY_ID: (id: string) => `/api/${PREFIX_DEALER}/vehicle-requests/${id}`,
  },
} as const

// ============================================================================
// Vehicle Request Endpoints
// ============================================================================

export const VEHICLE_REQUEST_ENDPOINTS = {
  // CMS endpoints
  CMS: {
    BASE: `/api/${PREFIX_CMS}/vehicle-requests`,
    BY_ID: (id: string) => `/api/${PREFIX_CMS}/vehicle-requests/${id}`,
  },
} as const

// ============================================================================
// User Endpoints
// ============================================================================

export const USER_ENDPOINTS = {
  // CMS endpoints
  CMS: {
    BASE: `/api/${PREFIX_CMS}/users`,
    BY_ID: (id: string) => `/api/${PREFIX_CMS}/users/${id}`,
  },
} as const

