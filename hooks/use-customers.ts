/**
 * Custom hooks for Customers
 * Manages lifecycle and prevents duplicate API calls
 */

import { useCallback } from 'react'
import { useApi, useApiMutation } from './use-api'
import {
  customersApi,
  type CustomerDto,
  type CreateCustomerRequest,
  type UpdateCustomerRequest,
  type CustomerHistoryDto,
} from '@/lib/api/customers'

/**
 * Hook to fetch all customers
 */
export function useCustomers(options?: { enabled?: boolean; refetchInterval?: number }) {
  const { enabled = true, refetchInterval } = options || {}

  return useApi(
    () => customersApi.getCustomers(),
    {
      enabled,
      refetchInterval,
    }
  )
}

/**
 * Hook to fetch a single customer by ID
 */
export function useCustomer(id: string | null, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {}

  return useApi(
    () => {
      if (!id) throw new Error('Customer ID is required')
      return customersApi.getCustomerById(id)
    },
    {
      enabled: enabled && !!id,
    }
  )
}

/**
 * Hook to fetch customer history
 */
export function useCustomerHistory(id: string | null, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {}

  return useApi(
    () => {
      if (!id) throw new Error('Customer ID is required')
      return customersApi.getCustomerHistory(id)
    },
    {
      enabled: enabled && !!id,
    }
  )
}

/**
 * Hook to create a new customer
 */
export function useCreateCustomer() {
  return useApiMutation<CustomerDto, CreateCustomerRequest>(
    (data) => customersApi.createCustomer(data),
    {
      onSuccess: () => {
        console.log('[useCreateCustomer] Customer created successfully')
      },
      onError: (error) => {
        console.error('[useCreateCustomer] Failed to create customer:', error)
      },
    }
  )
}

/**
 * Hook to update a customer
 */
export function useUpdateCustomer() {
  return useApiMutation<CustomerDto, { id: string; data: UpdateCustomerRequest }>(
    ({ id, data }) => customersApi.updateCustomer(id, data),
    {
      onSuccess: () => {
        console.log('[useUpdateCustomer] Customer updated successfully')
      },
      onError: (error) => {
        console.error('[useUpdateCustomer] Failed to update customer:', error)
      },
    }
  )
}

