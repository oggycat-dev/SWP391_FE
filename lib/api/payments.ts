/**
 * Payments API Service
 * Handles all payment-related API calls for Dealer
 */

import { apiClient } from './client'
import { getCurrentApiPrefix } from '@/lib/utils/api-prefix'

export enum PaymentStatus {
  Pending = 'Pending',
  Partial = 'Partial',
  Completed = 'Completed',
  Failed = 'Failed',
}

export enum PaymentType {
  Cash = 'Cash',
  BankTransfer = 'BankTransfer',
  CreditCard = 'CreditCard',
  Installment = 'Installment',
}

export interface PaymentDto {
  id: string
  orderId: string
  amount: number
  paymentType: PaymentType
  paymentDate: string
  status: PaymentStatus
  transactionReference?: string
  notes?: string
  createdAt: string
}

export interface PaymentSummaryDto {
  orderId: string
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  payments: PaymentDto[]
}

export interface CreatePaymentRequest {
  orderId: string
  amount: number
  paymentType: PaymentType
  paymentDate: string
  transactionReference?: string
  notes?: string
}

export interface InstallmentPlanDto {
  id: string
  orderId: string
  bankName: string
  loanAmount: number
  downPayment: number
  termMonths: number
  monthlyInterestRate: number
  monthlyPayment: number
  totalInterest: number
  totalAmount: number
  startDate: string
  endDate: string
  createdAt: string
}

export interface CreateInstallmentPlanRequest {
  orderId: string
  bankName: string
  downPayment: number
  termMonths: number
  monthlyInterestRate: number
  startDate: string
}

export const paymentsApi = {
  /**
   * Get payments for an order
   */
  getPaymentsByOrder: async (orderId: string, signal?: AbortSignal): Promise<PaymentSummaryDto> => {
    const prefix = getCurrentApiPrefix()
    const endpoint = `/api/${prefix}/payments/order/${orderId}`
    return apiClient.get<PaymentSummaryDto>(endpoint, undefined, signal)
  },

  /**
   * Create payment for an order
   */
  createPayment: async (data: CreatePaymentRequest, signal?: AbortSignal): Promise<PaymentDto> => {
    const prefix = getCurrentApiPrefix()
    const endpoint = `/api/${prefix}/payments`
    return apiClient.post<PaymentDto>(endpoint, data, signal)
  },

  /**
   * Create installment plan for an order
   */
  createInstallmentPlan: async (
    data: CreateInstallmentPlanRequest,
    signal?: AbortSignal
  ): Promise<InstallmentPlanDto> => {
    const prefix = getCurrentApiPrefix()
    const endpoint = `/api/${prefix}/payments/installment`
    return apiClient.post<InstallmentPlanDto>(endpoint, data, signal)
  },
}

