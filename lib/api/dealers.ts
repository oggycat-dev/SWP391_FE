/**
 * Dealers API Service
 * Handles all dealer-related API calls
 */

import { apiClient } from './client'

export interface Dealer {
  id: string
  dealerCode: string
  dealerName: string
  address: string
  city: string
  district: string
  phoneNumber: string
  email: string
  managerName: string
  status: string
  debtLimit: number
  currentDebt: number
  contractStartDate: string
  contractEndDate: string
  createdAt: string
}

export interface CreateDealerRequest {
  dealerCode: string
  dealerName: string
  address: string
  city: string
  district: string
  phoneNumber: string
  email: string
  debtLimit: number
}

export interface UpdateDealerRequest extends Partial<CreateDealerRequest> {
  status?: string
}

export interface DealersResponse {
  items: Dealer[]
  totalCount: number
  pageNumber: number
  pageSize: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export const dealersApi = {
  /**
   * Get all dealers with pagination and filters
   */
  getDealers: async (params?: {
    status?: string
    city?: string
    pageNumber?: number
    pageSize?: number
    searchTerm?: string
  }): Promise<DealersResponse> => {
    const queryParams: Record<string, string> = {}
    if (params) {
      if (params.status) queryParams.status = params.status
      if (params.city) queryParams.city = params.city
      if (params.pageNumber) queryParams.pageNumber = String(params.pageNumber)
      if (params.pageSize) queryParams.pageSize = String(params.pageSize)
      if (params.searchTerm) queryParams.searchTerm = params.searchTerm
    }
    const response = await apiClient.get<DealersResponse>('/api/cms/dealers', queryParams)
    return response
  },

  /**
   * Get dealer by ID
   */
  getDealerById: async (id: string): Promise<Dealer> => {
    const response = await apiClient.get<Dealer>(`/api/cms/dealers/${id}`)
    return response
  },

  /**
   * Create new dealer
   */
  createDealer: async (data: CreateDealerRequest): Promise<Dealer> => {
    const response = await apiClient.post<Dealer>('/api/cms/dealers', data)
    return response
  },

  /**
   * Get dealer debt information
   */
  getDealerDebt: async (id: string): Promise<{
    currentDebt: number
    debtLimit: number
    availableCredit: number
    overdueAmount: number
  }> => {
    const response = await apiClient.get<{
      currentDebt: number
      debtLimit: number
      availableCredit: number
      overdueAmount: number
    }>(`/api/cms/dealers/${id}/debt`)
    return response
  },
}
