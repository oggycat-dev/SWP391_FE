/**
 * Vehicles API Service (CMS)
 * Handles all vehicle-related API calls for CMS users
 * Includes: Models, Variants, Colors, Inventories
 */

import { apiClient } from './client'
import { VEHICLE_ENDPOINTS } from '@/lib/config/endpoints'

// ============================================================================
// Types - Vehicle Models
// ============================================================================

export interface VehicleModelDto {
  id: string
  modelCode: string
  modelName: string
  brand: string
  category: string
  year: number
  basePrice: number
  description: string
  imageUrls: string[]
  brochureUrl: string
  isActive: boolean
  createdAt: string
  modifiedAt?: string
}

export interface CreateVehicleModelRequest {
  modelCode: string
  modelName: string
  brand: string
  category: string
  year: number
  basePrice: number
  description: string
  imageUrls: string[]
  brochureUrl: string
}

export interface UpdateVehicleModelRequest {
  modelName: string
  brand: string
  category: string
  year: number
  basePrice: number
  description: string
  imageUrls: string[]
  brochureUrl: string
  isActive: boolean
}

export interface GetVehicleModelsParams {
  brand?: string
  category?: string
  year?: number
  isActive?: boolean
  page?: number
  pageSize?: number
}

// ============================================================================
// Types - Vehicle Variants
// ============================================================================

export interface VehicleVariantDto {
  id: string
  modelId: string
  variantName: string
  variantCode: string
  specifications: Record<string, any>
  price: number
  isActive: boolean
  createdAt: string
  modelName: string
}

export interface CreateVehicleVariantRequest {
  modelId: string
  variantName: string
  variantCode: string
  specifications: Record<string, any>
  price: number
}

export interface UpdateVehicleVariantRequest {
  variantName: string
  specifications: Record<string, any>
  price: number
  isActive: boolean
}

export interface GetVehicleVariantsParams {
  modelId?: string
  isActive?: boolean
  page?: number
  pageSize?: number
}

// ============================================================================
// Types - Vehicle Colors
// ============================================================================

export interface VehicleColorDto {
  id: string
  variantId: string
  colorName: string
  colorCode: string
  additionalPrice: number
  imageUrl: string
  isActive: boolean
  variantName: string
}

export interface CreateVehicleColorRequest {
  variantId: string
  colorName: string
  colorCode: string
  additionalPrice: number
  imageUrl: string
}

export interface UpdateVehicleColorRequest {
  colorName: string
  colorCode: string
  additionalPrice: number
  imageUrl: string
  isActive: boolean
}

export interface GetVehicleColorsParams {
  variantId?: string
  isActive?: boolean
  page?: number
  pageSize?: number
}

// ============================================================================
// Types - Vehicle Inventories
// ============================================================================

export enum VehicleInventoryStatus {
  Available = 'Available',
  Reserved = 'Reserved',
  Sold = 'Sold',
  Maintenance = 'Maintenance',
  InTransit = 'InTransit',
}

export interface VehicleInventoryDto {
  id: string
  variantId: string
  colorId: string
  vinNumber: string
  chassisNumber: string
  engineNumber: string
  status: string
  warehouseLocation: string
  manufactureDate: string
  importDate?: string
  soldDate?: string
  dealerId?: string
  allocatedToDealerDate?: string
  modelName: string
  variantName: string
  colorName: string
  dealerName?: string
}

export interface CreateVehicleInventoryRequest {
  variantId: string
  colorId: string
  vinNumber: string
  chassisNumber: string
  engineNumber: string
  warehouseLocation: string
  manufactureDate: string
  importDate?: string
}

export interface UpdateVehicleInventoryStatusRequest {
  id: string
  status: string
  warehouseLocation?: string
  dealerId?: string
}

export interface AllocateVehicleRequest {
  inventoryId: string
  dealerId: string
}

export interface GetVehicleInventoriesParams {
  variantId?: string
  colorId?: string
  status?: string
  dealerId?: string
  page?: number
  pageSize?: number
}

export interface GetCentralInventoryParams {
  vehicleVariantId?: string
  status?: string
}

// ============================================================================
// Types - Pagination
// ============================================================================

export interface PaginatedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

// ============================================================================
// API Services
// ============================================================================

export const vehiclesApi = {
  // ==========================================================================
  // Vehicle Models
  // ==========================================================================

  /**
   * Get all vehicle models (paginated)
   */
  getVehicleModels: async (
    params?: GetVehicleModelsParams,
    signal?: AbortSignal
  ): Promise<PaginatedResult<VehicleModelDto>> => {
    const queryParams: Record<string, string> = {}
    if (params?.brand) queryParams.brand = params.brand
    if (params?.category) queryParams.category = params.category
    if (params?.year) queryParams.year = String(params.year)
    if (params?.isActive !== undefined) queryParams.isActive = String(params.isActive)
    if (params?.page) queryParams.page = String(params.page)
    if (params?.pageSize) queryParams.pageSize = String(params.pageSize)

    return apiClient.get<PaginatedResult<VehicleModelDto>>(
      VEHICLE_ENDPOINTS.CMS.MODELS,
      queryParams,
      signal
    )
  },

  /**
   * Get vehicle model by ID
   */
  getVehicleModelById: async (id: string, signal?: AbortSignal): Promise<VehicleModelDto> => {
    return apiClient.get<VehicleModelDto>(VEHICLE_ENDPOINTS.CMS.MODEL_BY_ID(id), undefined, signal)
  },

  /**
   * Create new vehicle model (Admin, EVMStaff only)
   */
  createVehicleModel: async (
    data: CreateVehicleModelRequest,
    signal?: AbortSignal
  ): Promise<VehicleModelDto> => {
    return apiClient.post<VehicleModelDto>(VEHICLE_ENDPOINTS.CMS.MODELS, data, signal)
  },

  /**
   * Update vehicle model (Admin, EVMStaff only)
   */
  updateVehicleModel: async (
    id: string,
    data: UpdateVehicleModelRequest,
    signal?: AbortSignal
  ): Promise<VehicleModelDto> => {
    return apiClient.put<VehicleModelDto>(VEHICLE_ENDPOINTS.CMS.MODEL_BY_ID(id), data, signal)
  },

  /**
   * Delete vehicle model (Admin only)
   */
  deleteVehicleModel: async (id: string, signal?: AbortSignal): Promise<boolean> => {
    return apiClient.delete<boolean>(VEHICLE_ENDPOINTS.CMS.MODEL_BY_ID(id), signal)
  },

  // ==========================================================================
  // Vehicle Variants
  // ==========================================================================

  /**
   * Get all vehicle variants (paginated)
   */
  getVehicleVariants: async (
    params?: GetVehicleVariantsParams,
    signal?: AbortSignal
  ): Promise<PaginatedResult<VehicleVariantDto>> => {
    const queryParams: Record<string, string> = {}
    if (params?.modelId) queryParams.modelId = params.modelId
    if (params?.isActive !== undefined) queryParams.isActive = String(params.isActive)
    if (params?.page) queryParams.page = String(params.page)
    if (params?.pageSize) queryParams.pageSize = String(params.pageSize)

    return apiClient.get<PaginatedResult<VehicleVariantDto>>(
      VEHICLE_ENDPOINTS.CMS.VARIANTS,
      queryParams,
      signal
    )
  },

  /**
   * Get vehicle variant by ID
   */
  getVehicleVariantById: async (id: string, signal?: AbortSignal): Promise<VehicleVariantDto> => {
    return apiClient.get<VehicleVariantDto>(
      VEHICLE_ENDPOINTS.CMS.VARIANT_BY_ID(id),
      undefined,
      signal
    )
  },

  /**
   * Compare multiple vehicle variants
   */
  compareVehicles: async (variantIds: string[], signal?: AbortSignal): Promise<VehicleVariantDto[]> => {
    const queryParams: Record<string, string> = {}
    variantIds.forEach((id, index) => {
      queryParams[`variantIds[${index}]`] = id
    })

    return apiClient.get<VehicleVariantDto[]>(
      `${VEHICLE_ENDPOINTS.CMS.VARIANTS}/compare`,
      queryParams,
      signal
    )
  },

  /**
   * Create new vehicle variant (Admin, EVMStaff only)
   */
  createVehicleVariant: async (
    data: CreateVehicleVariantRequest,
    signal?: AbortSignal
  ): Promise<VehicleVariantDto> => {
    return apiClient.post<VehicleVariantDto>(VEHICLE_ENDPOINTS.CMS.VARIANTS, data, signal)
  },

  /**
   * Update vehicle variant (Admin, EVMStaff only)
   */
  updateVehicleVariant: async (
    id: string,
    data: UpdateVehicleVariantRequest,
    signal?: AbortSignal
  ): Promise<VehicleVariantDto> => {
    return apiClient.put<VehicleVariantDto>(VEHICLE_ENDPOINTS.CMS.VARIANT_BY_ID(id), data, signal)
  },

  /**
   * Delete vehicle variant (Admin only)
   */
  deleteVehicleVariant: async (id: string, signal?: AbortSignal): Promise<boolean> => {
    return apiClient.delete<boolean>(VEHICLE_ENDPOINTS.CMS.VARIANT_BY_ID(id), signal)
  },

  // ==========================================================================
  // Vehicle Colors
  // ==========================================================================

  /**
   * Get all vehicle colors (paginated)
   */
  getVehicleColors: async (
    params?: GetVehicleColorsParams,
    signal?: AbortSignal
  ): Promise<PaginatedResult<VehicleColorDto>> => {
    const queryParams: Record<string, string> = {}
    if (params?.variantId) queryParams.variantId = params.variantId
    if (params?.isActive !== undefined) queryParams.isActive = String(params.isActive)
    if (params?.page) queryParams.page = String(params.page)
    if (params?.pageSize) queryParams.pageSize = String(params.pageSize)

    return apiClient.get<PaginatedResult<VehicleColorDto>>(
      VEHICLE_ENDPOINTS.CMS.COLORS,
      queryParams,
      signal
    )
  },

  /**
   * Get vehicle color by ID
   */
  getVehicleColorById: async (id: string, signal?: AbortSignal): Promise<VehicleColorDto> => {
    return apiClient.get<VehicleColorDto>(VEHICLE_ENDPOINTS.CMS.COLOR_BY_ID(id), undefined, signal)
  },

  /**
   * Create new vehicle color (Admin, EVMStaff only)
   */
  createVehicleColor: async (
    data: CreateVehicleColorRequest,
    signal?: AbortSignal
  ): Promise<VehicleColorDto> => {
    return apiClient.post<VehicleColorDto>(VEHICLE_ENDPOINTS.CMS.COLORS, data, signal)
  },

  /**
   * Update vehicle color (Admin, EVMStaff only)
   */
  updateVehicleColor: async (
    id: string,
    data: UpdateVehicleColorRequest,
    signal?: AbortSignal
  ): Promise<VehicleColorDto> => {
    return apiClient.put<VehicleColorDto>(VEHICLE_ENDPOINTS.CMS.COLOR_BY_ID(id), data, signal)
  },

  /**
   * Delete vehicle color (Admin only)
   */
  deleteVehicleColor: async (id: string, signal?: AbortSignal): Promise<boolean> => {
    return apiClient.delete<boolean>(VEHICLE_ENDPOINTS.CMS.COLOR_BY_ID(id), signal)
  },

  // ==========================================================================
  // Vehicle Inventories
  // ==========================================================================

  /**
   * Get all vehicle inventories (paginated)
   */
  getVehicleInventories: async (
    params?: GetVehicleInventoriesParams,
    signal?: AbortSignal
  ): Promise<PaginatedResult<VehicleInventoryDto>> => {
    const queryParams: Record<string, string> = {}
    if (params?.variantId) queryParams.variantId = params.variantId
    if (params?.colorId) queryParams.colorId = params.colorId
    if (params?.status) queryParams.status = params.status
    if (params?.dealerId) queryParams.dealerId = params.dealerId
    if (params?.page) queryParams.page = String(params.page)
    if (params?.pageSize) queryParams.pageSize = String(params.pageSize)

    return apiClient.get<PaginatedResult<VehicleInventoryDto>>(
      VEHICLE_ENDPOINTS.CMS.INVENTORIES,
      queryParams,
      signal
    )
  },

  /**
   * Get central warehouse inventory (EVM)
   */
  getCentralInventory: async (
    params?: GetCentralInventoryParams,
    signal?: AbortSignal
  ): Promise<VehicleInventoryDto[]> => {
    const queryParams: Record<string, string> = {}
    if (params?.vehicleVariantId) queryParams.vehicleVariantId = params.vehicleVariantId
    if (params?.status) queryParams.status = params.status

    return apiClient.get<VehicleInventoryDto[]>(
      `${VEHICLE_ENDPOINTS.CMS.INVENTORIES}/central`,
      queryParams,
      signal
    )
  },

  /**
   * Get vehicle inventory by ID
   */
  getVehicleInventoryById: async (
    id: string,
    signal?: AbortSignal
  ): Promise<VehicleInventoryDto> => {
    return apiClient.get<VehicleInventoryDto>(
      VEHICLE_ENDPOINTS.CMS.INVENTORY_BY_ID(id),
      undefined,
      signal
    )
  },

  /**
   * Create new vehicle inventory (Admin, EVMStaff only)
   */
  createVehicleInventory: async (
    data: CreateVehicleInventoryRequest,
    signal?: AbortSignal
  ): Promise<VehicleInventoryDto> => {
    return apiClient.post<VehicleInventoryDto>(VEHICLE_ENDPOINTS.CMS.INVENTORIES, data, signal)
  },

  /**
   * Update vehicle inventory status
   */
  updateVehicleInventoryStatus: async (
    id: string,
    data: UpdateVehicleInventoryStatusRequest,
    signal?: AbortSignal
  ): Promise<boolean> => {
    return apiClient.patch<boolean>(
      `${VEHICLE_ENDPOINTS.CMS.INVENTORY_BY_ID(id)}/status`,
      data,
      signal
    )
  },

  /**
   * Allocate vehicle to dealer (Admin, EVMStaff only)
   */
  allocateVehicle: async (
    id: string,
    data: AllocateVehicleRequest,
    signal?: AbortSignal
  ): Promise<boolean> => {
    return apiClient.post<boolean>(
      `${VEHICLE_ENDPOINTS.CMS.INVENTORY_BY_ID(id)}/allocate`,
      data,
      signal
    )
  },
}
