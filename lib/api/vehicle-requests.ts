/**
 * Vehicle Requests API Service
 * Handles all vehicle request-related API calls for Dealer
 */

import { apiClient } from './client'
import { getCurrentApiPrefix } from '@/lib/utils/api-prefix'

export enum VehicleRequestStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  InTransit = 'InTransit',
  Delivered = 'Delivered',
}

export interface VehicleRequestDto {
  id: string
  dealerId: string
  vehicleId: string
  variantId?: string
  colorId?: string
  quantity: number
  status: VehicleRequestStatus
  requestedBy: string
  approvedBy?: string
  notes?: string
  createdAt: string
  updatedAt?: string
}

export interface CreateVehicleRequestRequest {
  vehicleId: string
  variantId?: string
  colorId?: string
  quantity: number
  notes?: string
}

export const vehicleRequestsApi = {
  /**
   * Get all vehicle requests for the dealer
   */
  getVehicleRequests: async (signal?: AbortSignal): Promise<VehicleRequestDto[]> => {
    const prefix = getCurrentApiPrefix()
    const endpoint = `/api/${prefix}/vehicle-requests`
    return apiClient.get<VehicleRequestDto[]>(endpoint, undefined, signal)
  },

  /**
   * Create new vehicle request
   */
  createVehicleRequest: async (
    data: CreateVehicleRequestRequest,
    signal?: AbortSignal
  ): Promise<VehicleRequestDto> => {
    const prefix = getCurrentApiPrefix()
    const endpoint = `/api/${prefix}/vehicle-requests`
    return apiClient.post<VehicleRequestDto>(endpoint, data, signal)
  },
}

