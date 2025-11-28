/**
 * Dealer Contracts API Service
 * Handles all dealer contract-related API calls
 */

import { apiClient } from './client'

export interface DealerContractDto {
  id: string
  dealerId: string
  dealerName: string
  contractNumber: string
  startDate: string
  endDate: string
  terms: string
  commissionRate: number
  status: DealerContractStatus
  signedBy: string
  signedDate?: string
  createdAt: string
}

export enum DealerContractStatus {
  Draft = 0,
  Active = 1,
  Expired = 2,
  Terminated = 3,
}

export interface CreateDealerContractRequest {
  dealerId: string
  startDate: string
  endDate: string
  terms: string
  commissionRate: number
}

export interface UpdateDealerContractStatusRequest {
  status: DealerContractStatus
  signedBy?: string
}

export const dealerContractsApi = {
  /**
   * Get all dealer contracts
   */
  getDealerContracts: async (params?: {
    dealerId?: string
    status?: DealerContractStatus
  }): Promise<DealerContractDto[]> => {
    const queryParams: Record<string, string> = {}
    if (params?.dealerId) queryParams.dealerId = params.dealerId
    if (params?.status !== undefined) queryParams.status = String(params.status)

    const response = await apiClient.get<DealerContractDto[]>('/api/cms/dealer-contracts', queryParams)
    return response
  },

  /**
   * Get dealer contract by ID
   */
  getDealerContractById: async (id: string): Promise<DealerContractDto> => {
    const response = await apiClient.get<DealerContractDto>(`/api/cms/dealer-contracts/${id}`)
    return response
  },

  /**
   * Create new dealer contract
   */
  createDealerContract: async (data: CreateDealerContractRequest): Promise<DealerContractDto> => {
    const response = await apiClient.post<DealerContractDto>('/api/cms/dealer-contracts', data)
    return response
  },

  /**
   * Update dealer contract status
   */
  updateDealerContractStatus: async (
    id: string,
    data: UpdateDealerContractStatusRequest
  ): Promise<DealerContractDto> => {
    const response = await apiClient.put<DealerContractDto>(
      `/api/cms/dealer-contracts/${id}/status`,
      data
    )
    return response
  },
}
