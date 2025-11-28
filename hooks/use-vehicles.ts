/**
 * Custom hooks for Vehicles (CMS)
 * Manages lifecycle and prevents duplicate API calls
 */

import { useApi, useApiMutation } from './use-api'
import {
  vehiclesApi,
  type VehicleModelDto,
  type VehicleVariantDto,
  type VehicleColorDto,
  type VehicleInventoryDto,
  type CreateVehicleModelRequest,
  type UpdateVehicleModelRequest,
  type CreateVehicleVariantRequest,
  type UpdateVehicleVariantRequest,
  type CreateVehicleColorRequest,
  type UpdateVehicleColorRequest,
  type CreateVehicleInventoryRequest,
  type UpdateVehicleInventoryStatusRequest,
  type AllocateVehicleRequest,
  type GetVehicleModelsParams,
  type GetVehicleVariantsParams,
  type GetVehicleColorsParams,
  type GetVehicleInventoriesParams,
  type GetCentralInventoryParams,
  type PaginatedResult,
} from '@/lib/api/vehicles'

// ============================================================================
// Vehicle Models Hooks
// ============================================================================

export function useVehicleModels(
  params?: GetVehicleModelsParams,
  options?: { enabled?: boolean; refetchInterval?: number }
) {
  const { enabled = true, refetchInterval } = options || {}

  return useApi(
    () => vehiclesApi.getVehicleModels(params),
    {
      enabled,
      refetchInterval,
    }
  )
}

export function useVehicleModel(id: string | null, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {}

  return useApi(
    () => {
      if (!id) throw new Error('Vehicle Model ID is required')
      return vehiclesApi.getVehicleModelById(id)
    },
    {
      enabled: enabled && !!id,
    }
  )
}

export function useCreateVehicleModel() {
  return useApiMutation<VehicleModelDto, CreateVehicleModelRequest>(
    (data) => vehiclesApi.createVehicleModel(data),
    {
      onSuccess: () => console.log('[useCreateVehicleModel] Vehicle model created successfully'),
      onError: (error) => console.error('[useCreateVehicleModel] Failed:', error),
    }
  )
}

export function useUpdateVehicleModel() {
  return useApiMutation<VehicleModelDto, { id: string; data: UpdateVehicleModelRequest }>(
    ({ id, data }) => vehiclesApi.updateVehicleModel(id, data),
    {
      onSuccess: () => console.log('[useUpdateVehicleModel] Vehicle model updated successfully'),
      onError: (error) => console.error('[useUpdateVehicleModel] Failed:', error),
    }
  )
}

export function useDeleteVehicleModel() {
  return useApiMutation<boolean, string>(
    (id) => vehiclesApi.deleteVehicleModel(id),
    {
      onSuccess: () => console.log('[useDeleteVehicleModel] Vehicle model deleted successfully'),
      onError: (error) => console.error('[useDeleteVehicleModel] Failed:', error),
    }
  )
}

// ============================================================================
// Vehicle Variants Hooks
// ============================================================================

export function useVehicleVariants(
  params?: GetVehicleVariantsParams,
  options?: { enabled?: boolean; refetchInterval?: number }
) {
  const { enabled = true, refetchInterval } = options || {}

  return useApi(
    () => vehiclesApi.getVehicleVariants(params),
    {
      enabled,
      refetchInterval,
    }
  )
}

export function useVehicleVariant(id: string | null, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {}

  return useApi(
    () => {
      if (!id) throw new Error('Vehicle Variant ID is required')
      return vehiclesApi.getVehicleVariantById(id)
    },
    {
      enabled: enabled && !!id,
    }
  )
}

export function useCompareVehicles(variantIds: string[], options?: { enabled?: boolean }) {
  const { enabled = true } = options || {}

  return useApi(
    () => vehiclesApi.compareVehicles(variantIds),
    {
      enabled: enabled && variantIds.length > 0,
    }
  )
}

export function useCreateVehicleVariant() {
  return useApiMutation<VehicleVariantDto, CreateVehicleVariantRequest>(
    (data) => vehiclesApi.createVehicleVariant(data),
    {
      onSuccess: () => console.log('[useCreateVehicleVariant] Vehicle variant created successfully'),
      onError: (error) => console.error('[useCreateVehicleVariant] Failed:', error),
    }
  )
}

export function useUpdateVehicleVariant() {
  return useApiMutation<VehicleVariantDto, { id: string; data: UpdateVehicleVariantRequest }>(
    ({ id, data }) => vehiclesApi.updateVehicleVariant(id, data),
    {
      onSuccess: () => console.log('[useUpdateVehicleVariant] Vehicle variant updated successfully'),
      onError: (error) => console.error('[useUpdateVehicleVariant] Failed:', error),
    }
  )
}

export function useDeleteVehicleVariant() {
  return useApiMutation<boolean, string>(
    (id) => vehiclesApi.deleteVehicleVariant(id),
    {
      onSuccess: () => console.log('[useDeleteVehicleVariant] Vehicle variant deleted successfully'),
      onError: (error) => console.error('[useDeleteVehicleVariant] Failed:', error),
    }
  )
}

// ============================================================================
// Vehicle Colors Hooks
// ============================================================================

export function useVehicleColors(
  params?: GetVehicleColorsParams,
  options?: { enabled?: boolean; refetchInterval?: number }
) {
  const { enabled = true, refetchInterval } = options || {}

  return useApi(
    () => vehiclesApi.getVehicleColors(params),
    {
      enabled,
      refetchInterval,
    }
  )
}

export function useVehicleColor(id: string | null, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {}

  return useApi(
    () => {
      if (!id) throw new Error('Vehicle Color ID is required')
      return vehiclesApi.getVehicleColorById(id)
    },
    {
      enabled: enabled && !!id,
    }
  )
}

export function useCreateVehicleColor() {
  return useApiMutation<VehicleColorDto, CreateVehicleColorRequest>(
    (data) => vehiclesApi.createVehicleColor(data),
    {
      onSuccess: () => console.log('[useCreateVehicleColor] Vehicle color created successfully'),
      onError: (error) => console.error('[useCreateVehicleColor] Failed:', error),
    }
  )
}

export function useUpdateVehicleColor() {
  return useApiMutation<VehicleColorDto, { id: string; data: UpdateVehicleColorRequest }>(
    ({ id, data }) => vehiclesApi.updateVehicleColor(id, data),
    {
      onSuccess: () => console.log('[useUpdateVehicleColor] Vehicle color updated successfully'),
      onError: (error) => console.error('[useUpdateVehicleColor] Failed:', error),
    }
  )
}

export function useDeleteVehicleColor() {
  return useApiMutation<boolean, string>(
    (id) => vehiclesApi.deleteVehicleColor(id),
    {
      onSuccess: () => console.log('[useDeleteVehicleColor] Vehicle color deleted successfully'),
      onError: (error) => console.error('[useDeleteVehicleColor] Failed:', error),
    }
  )
}

// ============================================================================
// Vehicle Inventories Hooks
// ============================================================================

export function useVehicleInventories(
  params?: GetVehicleInventoriesParams,
  options?: { enabled?: boolean; refetchInterval?: number }
) {
  const { enabled = true, refetchInterval } = options || {}

  return useApi(
    () => vehiclesApi.getVehicleInventories(params),
    {
      enabled,
      refetchInterval,
    }
  )
}

export function useCentralInventory(
  params?: GetCentralInventoryParams,
  options?: { enabled?: boolean; refetchInterval?: number }
) {
  const { enabled = true, refetchInterval } = options || {}

  return useApi(
    () => vehiclesApi.getCentralInventory(params),
    {
      enabled,
      refetchInterval,
    }
  )
}

export function useVehicleInventory(id: string | null, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {}

  return useApi(
    () => {
      if (!id) throw new Error('Vehicle Inventory ID is required')
      return vehiclesApi.getVehicleInventoryById(id)
    },
    {
      enabled: enabled && !!id,
    }
  )
}

export function useCreateVehicleInventory() {
  return useApiMutation<VehicleInventoryDto, CreateVehicleInventoryRequest>(
    (data) => vehiclesApi.createVehicleInventory(data),
    {
      onSuccess: () => console.log('[useCreateVehicleInventory] Vehicle inventory created successfully'),
      onError: (error) => console.error('[useCreateVehicleInventory] Failed:', error),
    }
  )
}

export function useUpdateVehicleInventoryStatus() {
  return useApiMutation<boolean, { id: string; data: UpdateVehicleInventoryStatusRequest }>(
    ({ id, data }) => vehiclesApi.updateVehicleInventoryStatus(id, data),
    {
      onSuccess: () => console.log('[useUpdateVehicleInventoryStatus] Status updated successfully'),
      onError: (error) => console.error('[useUpdateVehicleInventoryStatus] Failed:', error),
    }
  )
}

export function useAllocateVehicle() {
  return useApiMutation<boolean, { id: string; data: AllocateVehicleRequest }>(
    ({ id, data }) => vehiclesApi.allocateVehicle(id, data),
    {
      onSuccess: () => console.log('[useAllocateVehicle] Vehicle allocated successfully'),
      onError: (error) => console.error('[useAllocateVehicle] Failed:', error),
    }
  )
}

