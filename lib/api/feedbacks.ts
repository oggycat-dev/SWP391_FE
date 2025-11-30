import { apiClient } from "./client"
import type {
  CustomerFeedback,
  FeedbackFilters,
  RespondToFeedbackRequest,
  FeedbackStatus,
  ComplaintStatus,
} from "@/lib/types/feedback"
import {
  mapFeedbackStatusFromBackend,
  mapComplaintStatusFromBackend,
} from "@/lib/types/feedback"

// Backend DTO interface
interface CustomerFeedbackBackendDto {
  id: string
  customerId: string
  customerName: string
  orderId?: string
  orderNumber?: string
  dealerId: string
  dealerName: string
  subject: string
  content: string
  rating: number
  feedbackStatus: number
  complaintStatus?: number
  response: string
  responseDate?: string
  respondedBy?: string
  responderName?: string
  createdAt: string
}

// Transform backend DTO to frontend type
function transformFeedbackFromBackend(dto: CustomerFeedbackBackendDto): CustomerFeedback {
  return {
    id: dto.id,
    customerId: dto.customerId,
    customerName: dto.customerName,
    orderId: dto.orderId,
    orderNumber: dto.orderNumber,
    dealerId: dto.dealerId,
    dealerName: dto.dealerName,
    subject: dto.subject,
    content: dto.content,
    rating: dto.rating,
    feedbackStatus: mapFeedbackStatusFromBackend(dto.feedbackStatus),
    complaintStatus: mapComplaintStatusFromBackend(dto.complaintStatus),
    response: dto.response,
    responseDate: dto.responseDate,
    respondedBy: dto.respondedBy,
    responderName: dto.responderName,
    createdAt: dto.createdAt,
  }
}

export const feedbacksApi = {
  /**
   * Get all feedbacks with optional filters
   */
  async getFeedbacks(filters?: FeedbackFilters): Promise<CustomerFeedback[]> {
    const params = new URLSearchParams()
    
    if (filters?.dealerId) params.append("dealerId", filters.dealerId)
    if (filters?.customerId) params.append("customerId", filters.customerId)
    if (filters?.status) params.append("status", filters.status)
    if (filters?.minRating !== undefined) params.append("minRating", filters.minRating.toString())
    if (filters?.maxRating !== undefined) params.append("maxRating", filters.maxRating.toString())

    const queryString = params.toString()
    const url = `/api/cms/feedbacks${queryString ? `?${queryString}` : ""}`
    
    const response = await apiClient.get<CustomerFeedbackBackendDto[]>(url)
    return response.map(transformFeedbackFromBackend)
  },

  /**
   * Get feedback by ID
   */
  async getFeedbackById(id: string): Promise<CustomerFeedback> {
    const response = await apiClient.get<CustomerFeedbackBackendDto>(`/api/cms/feedbacks/${id}`)
    return transformFeedbackFromBackend(response)
  },

  /**
   * Respond to feedback
   */
  async respondToFeedback(id: string, data: RespondToFeedbackRequest): Promise<CustomerFeedback> {
    const response = await apiClient.put<CustomerFeedbackBackendDto>(
      `/api/cms/feedbacks/${id}/respond`,
      data
    )
    return transformFeedbackFromBackend(response)
  },
}
