/**
 * Custom hooks for Vehicle Requests
 */

import { useApi, useApiMutation } from './use-api'
import {
  vehicleRequestsApi,
  type VehicleRequestDto,
  type CreateVehicleRequestRequest,
} from '@/lib/api/vehicle-requests'

export function useVehicleRequests(options?: { enabled?: boolean; refetchInterval?: number }) {
  const { enabled = true, refetchInterval } = options || {}

  return useApi(
    () => vehicleRequestsApi.getVehicleRequests(),
    {
      enabled,
      refetchInterval,
    }
  )
}

export function useCreateVehicleRequest() {
  return useApiMutation<VehicleRequestDto, CreateVehicleRequestRequest>(
    (data) => vehicleRequestsApi.createVehicleRequest(data),
    {
      onSuccess: () => console.log('[useCreateVehicleRequest] Vehicle request created successfully'),
      onError: (error) => console.error('[useCreateVehicleRequest] Failed:', error),
    }
  )
}

