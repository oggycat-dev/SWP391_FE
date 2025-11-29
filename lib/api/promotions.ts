/**
 * Promotions API Service
 * Handles all promotion-related API calls
 */

import { apiClient } from './client'
import type { 
  Promotion, 
  CreatePromotionRequest, 
  UpdatePromotionRequest,
  UpdatePromotionStatusRequest,
  PromotionStatus
} from '@/lib/types/promotion'
import { 
  mapDiscountTypeFromBackend, 
  mapPromotionStatusFromBackend,
  mapPromotionStatusToBackend
} from '@/lib/types/promotion'

// Backend response type with number enums
interface PromotionBackendDto {
  id: string
  promotionCode: string
  name: string
  description: string
  startDate: string
  endDate: string
  discountType: number
  discountPercentage: number
  discountAmount: number
  status: number
  applicableVehicleVariantIds: string[]
  applicableDealerIds: string[]
  maxUsageCount: number
  currentUsageCount: number
  imageUrl: string
  termsAndConditions: string
  createdAt: string
}

// Transform backend DTO to frontend type
function transformPromotionFromBackend(dto: PromotionBackendDto): Promotion {
  return {
    ...dto,
    discountType: mapDiscountTypeFromBackend(dto.discountType),
    status: mapPromotionStatusFromBackend(dto.status),
  }
}

export const promotionsApi = {
  /**
   * Get all promotions with optional filters
   */
  getPromotions: async (params?: {
    status?: PromotionStatus
    fromDate?: string
    toDate?: string
  }): Promise<Promotion[]> => {
    const queryParams: Record<string, string> = {}
    if (params) {
      if (params.status) queryParams.status = mapPromotionStatusToBackend(params.status).toString()
      if (params.fromDate) queryParams.fromDate = params.fromDate
      if (params.toDate) queryParams.toDate = params.toDate
    }
    const response = await apiClient.get<PromotionBackendDto[]>('/api/cms/promotions', queryParams)
    return response.map(transformPromotionFromBackend)
  },

  /**
   * Get promotion by ID
   */
  getPromotionById: async (id: string): Promise<Promotion> => {
    const response = await apiClient.get<PromotionBackendDto>(`/api/cms/promotions/${id}`)
    return transformPromotionFromBackend(response)
  },

  /**
   * Create new promotion
   */
  createPromotion: async (data: CreatePromotionRequest): Promise<Promotion> => {
    const response = await apiClient.post<PromotionBackendDto>('/api/cms/promotions', data)
    return transformPromotionFromBackend(response)
  },

  /**
   * Update existing promotion
   */
  updatePromotion: async (id: string, data: UpdatePromotionRequest): Promise<Promotion> => {
    const response = await apiClient.put<PromotionBackendDto>(`/api/cms/promotions/${id}`, data)
    return transformPromotionFromBackend(response)
  },

  /**
   * Update promotion status
   */
  updatePromotionStatus: async (id: string, data: UpdatePromotionStatusRequest): Promise<Promotion> => {
    const requestData = {
      status: mapPromotionStatusToBackend(data.status)
    }
    const response = await apiClient.put<PromotionBackendDto>(`/api/cms/promotions/${id}/status`, requestData)
    return transformPromotionFromBackend(response)
  },

  /**
   * Delete promotion (soft delete)
   */
  deletePromotion: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/cms/promotions/${id}`)
  },
}
