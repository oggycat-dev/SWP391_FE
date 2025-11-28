/**
 * Custom hooks for Payments
 */

import { useApi, useApiMutation } from './use-api'
import {
  paymentsApi,
  type PaymentSummaryDto,
  type PaymentDto,
  type InstallmentPlanDto,
  type CreatePaymentRequest,
  type CreateInstallmentPlanRequest,
} from '@/lib/api/payments'

export function usePaymentsByOrder(orderId: string | null, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {}

  return useApi(
    () => {
      if (!orderId) throw new Error('Order ID is required')
      return paymentsApi.getPaymentsByOrder(orderId)
    },
    {
      enabled: enabled && !!orderId,
    }
  )
}

export function useCreatePayment() {
  return useApiMutation<PaymentDto, CreatePaymentRequest>(
    (data) => paymentsApi.createPayment(data),
    {
      onSuccess: () => console.log('[useCreatePayment] Payment created successfully'),
      onError: (error) => console.error('[useCreatePayment] Failed:', error),
    }
  )
}

export function useCreateInstallmentPlan() {
  return useApiMutation<InstallmentPlanDto, CreateInstallmentPlanRequest>(
    (data) => paymentsApi.createInstallmentPlan(data),
    {
      onSuccess: () => console.log('[useCreateInstallmentPlan] Installment plan created successfully'),
      onError: (error) => console.error('[useCreateInstallmentPlan] Failed:', error),
    }
  )
}

