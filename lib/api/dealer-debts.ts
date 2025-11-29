/**
 * Dealer Debts API Service
 * Handles all dealer debt-related API calls
 */

import { apiClient } from './client'
import type { 
  DealerDebt, 
  CreateDealerDebtRequest, 
  PayDealerDebtRequest 
} from '@/lib/types/dealer'

export const dealerDebtsApi = {
  /**
   * Get all dealer debts with optional filtering by dealerId
   */
  getDealerDebts: async (dealerId?: string): Promise<DealerDebt[]> => {
    const params: Record<string, string> = {}
    if (dealerId) {
      params.dealerId = dealerId
    }
    const response = await apiClient.get<DealerDebt[]>('/api/cms/dealer-debts', params)
    return response
  },

  /**
   * Get dealer debt by ID
   */
  getDealerDebtById: async (id: string): Promise<DealerDebt> => {
    const response = await apiClient.get<DealerDebt>(`/api/cms/dealer-debts/${id}`)
    return response
  },

  /**
   * Create new dealer debt
   */
  createDealerDebt: async (data: CreateDealerDebtRequest): Promise<DealerDebt> => {
    const response = await apiClient.post<DealerDebt>('/api/cms/dealer-debts', data)
    return response
  },

  /**
   * Record payment for dealer debt
   */
  payDealerDebt: async (id: string, data: PayDealerDebtRequest): Promise<DealerDebt> => {
    const response = await apiClient.put<DealerDebt>(`/api/cms/dealer-debts/${id}/pay`, data)
    return response
  },
}
