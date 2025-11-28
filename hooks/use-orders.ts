/**
 * Custom hooks for Orders
 * Manages lifecycle and prevents duplicate API calls
 */

import { useCallback } from 'react'
import { useApi, useApiMutation } from './use-api'
import {
  ordersApi,
  type OrderDto,
  type CreateOrderRequest,
  type UpdateOrderStatusRequest,
  type GetOrdersParams,
} from '@/lib/api/orders'

/**
 * Hook to fetch all orders
 */
export function useOrders(
  params?: GetOrdersParams,
  options?: { enabled?: boolean; refetchInterval?: number }
) {
  const { enabled = true, refetchInterval } = options || {}

  return useApi(
    () => ordersApi.getOrders(params),
    {
      enabled,
      refetchInterval,
    }
  )
}

/**
 * Hook to fetch a single order by ID
 */
export function useOrder(id: string | null, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {}

  return useApi(
    () => {
      if (!id) throw new Error('Order ID is required')
      return ordersApi.getOrderById(id)
    },
    {
      enabled: enabled && !!id,
    }
  )
}

/**
 * Hook to create a new order
 */
export function useCreateOrder() {
  return useApiMutation<OrderDto, CreateOrderRequest>(
    (data) => ordersApi.createOrder(data),
    {
      onSuccess: () => {
        console.log('[useCreateOrder] Order created successfully')
      },
      onError: (error) => {
        console.error('[useCreateOrder] Failed to create order:', error)
      },
    }
  )
}

/**
 * Hook to update order status (DealerManager only)
 */
export function useUpdateOrderStatus() {
  return useApiMutation<OrderDto, { id: string; data: UpdateOrderStatusRequest }>(
    ({ id, data }) => ordersApi.updateOrderStatus(id, data),
    {
      onSuccess: () => {
        console.log('[useUpdateOrderStatus] Order status updated successfully')
      },
      onError: (error) => {
        console.error('[useUpdateOrderStatus] Failed to update order status:', error)
      },
    }
  )
}

