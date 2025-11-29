/**
 * Dealer Debts API Service
 * Handles all dealer debt management API calls
 */

import { apiClient } from './client'

export interface DealerDebt {
  id: string
  dealerId: string
  dealerName: string
  debtAmount: number
  paidAmount: number
  remainingAmount: number
  dueDate: string
  status: 'Pending' | 'PartiallyPaid' | 'Paid' | 'Overdue'
  notes: string
  createdAt: string
  lastPaymentDate?: string
}

export interface CreateDealerDebtRequest {
  dealerId: string
  debtAmount: number
  dueDate: string
  notes?: string
}

export interface PayDealerDebtRequest {
  paymentAmount: number
  notes?: string
}

export const dealerDebtsApi = {
  /**
   * Get all dealer debts
   */
  getDealerDebts: async (dealerId?: string): Promise<DealerDebt[]> => {
    const queryParams: Record<string, string> = {}
    if (dealerId) {
      queryParams.dealerId = dealerId
    }
    const response = await apiClient.get<DealerDebt[]>('/api/cms/dealer-debts', queryParams)
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

