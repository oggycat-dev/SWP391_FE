/**
 * Dealer Types
 */

export type DebtStatus = 'Current' | 'Overdue' | 'Paid' | 'WrittenOff'

export interface DealerDebt {
  id: string
  dealerId: string
  dealerName: string
  debtCode: string
  totalDebt: number
  paidAmount: number
  remainingAmount: number
  dueDate: string
  status: DebtStatus
  notes: string
  createdAt: string
}

export interface CreateDealerDebtRequest {
  dealerId: string
  totalDebt: number
  dueDate: string
  notes?: string
}

export interface PayDealerDebtRequest {
  paymentAmount: number
  notes?: string
}

export interface DealerDebtsResponse {
  items: DealerDebt[]
  totalCount: number
  pageNumber: number
  pageSize: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
