/**
 * Customers API Service
 * Handles all customer-related API calls
 * Note: CMS can view, Dealer can manage
 */

import { apiClient } from './client'
import { getCurrentApiPrefix } from '@/lib/utils/api-prefix'

// Types based on backend DTOs
export interface CustomerDto {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  address: string
  idNumber: string
  dateOfBirth: string
  dealerId: string
  notes?: string
  createdAt: string
  updatedAt?: string
}

export interface CreateCustomerRequest {
  fullName: string
  email: string
  phoneNumber: string
  address: string
  idNumber: string
  dateOfBirth: string
  notes?: string
}

export interface UpdateCustomerRequest {
  fullName?: string
  email?: string
  phoneNumber?: string
  address?: string
  idNumber?: string
  dateOfBirth?: string
  notes?: string
}

export interface CustomerHistoryDto {
  customer: CustomerDto
  orders: any[] // OrderDto[]
  quotations: any[] // QuotationDto[]
  testDrives: any[] // TestDriveDto[]
}

export const customersApi = {
  /**
   * Get all customers
   * Uses dynamic prefix based on current user role (cms/dealer)
   */
  getCustomers: async (signal?: AbortSignal): Promise<CustomerDto[]> => {
    const prefix = getCurrentApiPrefix()
    const endpoint = `/api/${prefix}/customers`
    return apiClient.get<CustomerDto[]>(endpoint, undefined, signal)
  },

  /**
   * Get customer by ID
   */
  getCustomerById: async (id: string, signal?: AbortSignal): Promise<CustomerDto> => {
    const prefix = getCurrentApiPrefix()
    const endpoint = `/api/${prefix}/customers/${id}`
    return apiClient.get<CustomerDto>(endpoint, undefined, signal)
  },

  /**
   * Get customer history (orders, quotations, test drives)
   */
  getCustomerHistory: async (id: string, signal?: AbortSignal): Promise<CustomerHistoryDto> => {
    const prefix = getCurrentApiPrefix()
    const endpoint = `/api/${prefix}/customers/${id}/history`
    return apiClient.get<CustomerHistoryDto>(endpoint, undefined, signal)
  },

  /**
   * Create new customer
   */
  createCustomer: async (data: CreateCustomerRequest, signal?: AbortSignal): Promise<CustomerDto> => {
    const prefix = getCurrentApiPrefix()
    const endpoint = `/api/${prefix}/customers`
    return apiClient.post<CustomerDto>(endpoint, data, signal)
  },

  /**
   * Update existing customer
   */
  updateCustomer: async (
    id: string,
    data: UpdateCustomerRequest,
    signal?: AbortSignal
  ): Promise<CustomerDto> => {
    const prefix = getCurrentApiPrefix()
    const endpoint = `/api/${prefix}/customers/${id}`
    return apiClient.put<CustomerDto>(endpoint, data, signal)
  },
}
