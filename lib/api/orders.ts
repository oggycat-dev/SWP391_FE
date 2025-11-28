/**
 * Orders API Service
 * Handles all order-related API calls
 * Note: CMS can view, Dealer can manage
 */

import { apiClient } from './client'
import { getCurrentApiPrefix } from '@/lib/utils/api-prefix'

// Order Status enum
export enum OrderStatus {
  Draft = 'Draft',
  Pending = 'Pending',
  Approved = 'Approved',
  VehicleAllocated = 'VehicleAllocated',
  ReadyForDelivery = 'ReadyForDelivery',
  Delivered = 'Delivered',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

// Payment Method enum
export enum PaymentMethod {
  Cash = 'Cash',
  Installment = 'Installment',
}

export interface OrderDto {
  id: string
  quotationId?: string
  customerId: string
  vehicleId: string
  variantId?: string
  colorId?: string
  totalAmount: number
  paymentMethod: PaymentMethod
  status: OrderStatus
  dealerId: string
  createdBy: string
  createdAt: string
  updatedAt?: string
  notes?: string
}

export interface CreateOrderRequest {
  quotationId?: string
  customerId: string
  vehicleId: string
  variantId?: string
  colorId?: string
  totalAmount: number
  paymentMethod: PaymentMethod
  notes?: string
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus
  notes?: string
}

export interface GetOrdersParams {
  customerId?: string
  status?: OrderStatus
}

export const ordersApi = {
  /**
   * Get all orders
   * Uses dynamic prefix based on current user role (cms/dealer)
   */
  getOrders: async (params?: GetOrdersParams, signal?: AbortSignal): Promise<OrderDto[]> => {
    const queryParams: Record<string, string> = {}
    if (params?.customerId) queryParams.customerId = params.customerId
    if (params?.status) queryParams.status = params.status

    const prefix = getCurrentApiPrefix()
    const endpoint = `/api/${prefix}/orders`
    return apiClient.get<OrderDto[]>(endpoint, queryParams, signal)
  },

  /**
   * Get order by ID
   */
  getOrderById: async (id: string, signal?: AbortSignal): Promise<OrderDto> => {
    const prefix = getCurrentApiPrefix()
    const endpoint = `/api/${prefix}/orders/${id}`
    return apiClient.get<OrderDto>(endpoint, undefined, signal)
  },

  /**
   * Create new order
   */
  createOrder: async (data: CreateOrderRequest, signal?: AbortSignal): Promise<OrderDto> => {
    const prefix = getCurrentApiPrefix()
    const endpoint = `/api/${prefix}/orders`
    return apiClient.post<OrderDto>(endpoint, data, signal)
  },

  /**
   * Update order status (DealerManager only)
   */
  updateOrderStatus: async (
    id: string,
    data: UpdateOrderStatusRequest,
    signal?: AbortSignal
  ): Promise<OrderDto> => {
    const prefix = getCurrentApiPrefix()
    const endpoint = `/api/${prefix}/orders/${id}/status`
    return apiClient.put<OrderDto>(endpoint, data, signal)
  },
}
