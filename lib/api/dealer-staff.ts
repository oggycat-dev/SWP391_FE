/**
 * Dealer Staff API Service
 * Handles all dealer staff management API calls
 */

import { apiClient } from './client'

export interface DealerStaff {
  id: string
  userId: string
  dealerId: string
  userName: string
  email: string
  fullName: string
  position: string
  salesTarget: number
  commissionRate: number
  isActive: boolean
  joinedDate: string
}

export interface CreateDealerStaffRequest {
  userId: string
  dealerId: string
}

export interface UpdateDealerStaffRequest {
  position?: string
  salesTarget?: number
  commissionRate?: number
  isActive?: boolean
}

export const dealerStaffApi = {
  /**
   * Get all dealer staff
   */
  getDealerStaff: async (dealerId?: string): Promise<DealerStaff[]> => {
    const queryParams: Record<string, string> = {}
    if (dealerId) {
      queryParams.dealerId = dealerId
    }
    const response = await apiClient.get<DealerStaff[]>('/api/cms/dealer-staff', queryParams)
    return response
  },

  /**
   * Add staff member to dealer
   */
  addDealerStaff: async (data: CreateDealerStaffRequest): Promise<DealerStaff> => {
    const response = await apiClient.post<DealerStaff>('/api/cms/dealer-staff', data)
    return response
  },

  /**
   * Update dealer staff information
   */
  updateDealerStaff: async (id: string, data: UpdateDealerStaffRequest): Promise<DealerStaff> => {
    const response = await apiClient.put<DealerStaff>(`/api/cms/dealer-staff/${id}`, data)
    return response
  },

  /**
   * Delete dealer staff
   */
  deleteDealerStaff: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete<boolean>(`/api/cms/dealer-staff/${id}`)
    return response
  },
}

