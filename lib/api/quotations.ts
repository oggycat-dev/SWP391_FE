/**
 * Quotations API Service
 * Handles all quotation-related API calls for Dealer
 */

import { apiClient } from './client'
import { getCurrentApiPrefix } from '@/lib/utils/api-prefix'

// Quotation Status enum
export enum QuotationStatus {
  Draft = 'Draft',
  Sent = 'Sent',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Expired = 'Expired',
}

export interface QuotationDto {
  id: string
  customerId: string
  vehicleId: string
  variantId?: string
  colorId?: string
  basePrice: number
  variantPrice: number
  colorPrice: number
  dealerDiscount: number
  promotionDiscount: number
  finalPrice: number
  validUntil: string
  status: QuotationStatus
  createdBy: string
  createdAt: string
  updatedAt?: string
  notes?: string
}

export interface CreateQuotationRequest {
  customerId: string
  vehicleId: string
  variantId?: string
  colorId?: string
  basePrice: number
  variantPrice: number
  colorPrice: number
  dealerDiscount: number
  promotionDiscount: number
  validUntil: string
  notes?: string
}

export interface GetQuotationsParams {
  customerId?: string
}

export const quotationsApi = {
  /**
   * Get all quotations for the dealer
   */
  getQuotations: async (params?: GetQuotationsParams, signal?: AbortSignal): Promise<QuotationDto[]> => {
    const queryParams: Record<string, string> = {}
    if (params?.customerId) queryParams.customerId = params.customerId

    const prefix = getCurrentApiPrefix()
    const endpoint = `/api/${prefix}/quotations`
    return apiClient.get<QuotationDto[]>(endpoint, queryParams, signal)
  },

  /**
   * Get quotation by ID
   */
  getQuotationById: async (id: string, signal?: AbortSignal): Promise<QuotationDto> => {
    const prefix = getCurrentApiPrefix()
    const endpoint = `/api/${prefix}/quotations/${id}`
    return apiClient.get<QuotationDto>(endpoint, undefined, signal)
  },

  /**
   * Create new quotation
   */
  createQuotation: async (data: CreateQuotationRequest, signal?: AbortSignal): Promise<QuotationDto> => {
    const prefix = getCurrentApiPrefix()
    const endpoint = `/api/${prefix}/quotations`
    return apiClient.post<QuotationDto>(endpoint, data, signal)
  },
}

