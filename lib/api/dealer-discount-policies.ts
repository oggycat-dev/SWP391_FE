/**
 * Dealer Discount Policies API Service
 * Handles all dealer discount policy management API calls
 */

import { apiClient } from './client'

export interface DealerDiscountPolicy {
  id: string
  dealerId: string
  dealerName: string
  discountRate: number
  minOrderQuantity: number
  maxDiscountAmount: number
  effectiveDate: string
  expiryDate: string
  isActive: boolean
  conditions: string
  createdAt: string
}

export interface CreateDealerDiscountPolicyRequest {
  dealerId: string
  discountRate: number
  minOrderQuantity: number
  maxDiscountAmount: number
  effectiveDate: string
  expiryDate: string
  conditions?: string
}

export interface UpdateDealerDiscountPolicyRequest {
  discountRate?: number
  minOrderQuantity?: number
  maxDiscountAmount?: number
  effectiveDate?: string
  expiryDate?: string
  isActive?: boolean
  conditions?: string
}

export const dealerDiscountPoliciesApi = {
  /**
   * Get all dealer discount policies
   */
  getDealerDiscountPolicies: async (params?: {
    dealerId?: string
    activeOnly?: boolean
  }): Promise<DealerDiscountPolicy[]> => {
    const queryParams: Record<string, string> = {}
    if (params?.dealerId) {
      queryParams.dealerId = params.dealerId
    }
    if (params?.activeOnly !== undefined) {
      queryParams.activeOnly = String(params.activeOnly)
    }
    const response = await apiClient.get<DealerDiscountPolicy[]>('/api/cms/dealer-discount-policies', queryParams)
    return response
  },

  /**
   * Create new dealer discount policy
   */
  createDealerDiscountPolicy: async (data: CreateDealerDiscountPolicyRequest): Promise<DealerDiscountPolicy> => {
    const response = await apiClient.post<DealerDiscountPolicy>('/api/cms/dealer-discount-policies', data)
    return response
  },

  /**
   * Update dealer discount policy
   */
  updateDealerDiscountPolicy: async (id: string, data: UpdateDealerDiscountPolicyRequest): Promise<DealerDiscountPolicy> => {
    const response = await apiClient.put<DealerDiscountPolicy>(`/api/cms/dealer-discount-policies/${id}`, data)
    return response
  },

  /**
   * Delete (deactivate) dealer discount policy
   */
  deleteDealerDiscountPolicy: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete<boolean>(`/api/cms/dealer-discount-policies/${id}`)
    return response
  },
}

