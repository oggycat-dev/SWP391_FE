/**
 * Custom hooks for Quotations
 * Manages lifecycle and prevents duplicate API calls
 */

import { useCallback } from 'react'
import { useApi, useApiMutation } from './use-api'
import {
  quotationsApi,
  type QuotationDto,
  type CreateQuotationRequest,
  type GetQuotationsParams,
} from '@/lib/api/quotations'

/**
 * Hook to fetch all quotations
 */
export function useQuotations(
  params?: GetQuotationsParams,
  options?: { enabled?: boolean; refetchInterval?: number }
) {
  const { enabled = true, refetchInterval } = options || {}

  return useApi(
    () => quotationsApi.getQuotations(params),
    {
      enabled,
      refetchInterval,
    }
  )
}

/**
 * Hook to fetch a single quotation by ID
 */
export function useQuotation(id: string | null, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {}

  return useApi(
    () => {
      if (!id) throw new Error('Quotation ID is required')
      return quotationsApi.getQuotationById(id)
    },
    {
      enabled: enabled && !!id,
    }
  )
}

/**
 * Hook to create a new quotation
 */
export function useCreateQuotation() {
  return useApiMutation<QuotationDto, CreateQuotationRequest>(
    (data) => quotationsApi.createQuotation(data),
    {
      onSuccess: () => {
        console.log('[useCreateQuotation] Quotation created successfully')
      },
      onError: (error) => {
        console.error('[useCreateQuotation] Failed to create quotation:', error)
      },
    }
  )
}

