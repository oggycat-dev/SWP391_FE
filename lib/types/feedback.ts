// Feedback Status Enum (backend: 0-3)
export enum FeedbackStatusEnum {
  Open = 0,
  InProgress = 1,
  Resolved = 2,
  Closed = 3,
}

// Complaint Status Enum (backend: 0-4)
export enum ComplaintStatusEnum {
  Open = 0,
  Investigating = 1,
  Resolved = 2,
  Escalated = 3,
  Closed = 4,
}

// Frontend types (strings for display)
export type FeedbackStatus = "Open" | "InProgress" | "Resolved" | "Closed"
export type ComplaintStatus = "Open" | "Investigating" | "Resolved" | "Escalated" | "Closed"

export interface CustomerFeedback {
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
  feedbackStatus: FeedbackStatus
  complaintStatus?: ComplaintStatus
  response: string
  responseDate?: string
  respondedBy?: string
  responderName?: string
  createdAt: string
}

export interface FeedbackFilters {
  dealerId?: string
  customerId?: string
  status?: FeedbackStatus
  minRating?: number
  maxRating?: number
}

export interface RespondToFeedbackRequest {
  response: string
}

// Mapping functions for FeedbackStatus
export function mapFeedbackStatusFromBackend(status: number): FeedbackStatus {
  switch (status) {
    case FeedbackStatusEnum.Open:
      return "Open"
    case FeedbackStatusEnum.InProgress:
      return "InProgress"
    case FeedbackStatusEnum.Resolved:
      return "Resolved"
    case FeedbackStatusEnum.Closed:
      return "Closed"
    default:
      return "Open"
  }
}

export function mapFeedbackStatusToBackend(status: FeedbackStatus): number {
  switch (status) {
    case "Open":
      return FeedbackStatusEnum.Open
    case "InProgress":
      return FeedbackStatusEnum.InProgress
    case "Resolved":
      return FeedbackStatusEnum.Resolved
    case "Closed":
      return FeedbackStatusEnum.Closed
    default:
      return FeedbackStatusEnum.Open
  }
}

// Mapping functions for ComplaintStatus
export function mapComplaintStatusFromBackend(status?: number): ComplaintStatus | undefined {
  if (status === undefined || status === null) return undefined
  
  switch (status) {
    case ComplaintStatusEnum.Open:
      return "Open"
    case ComplaintStatusEnum.Investigating:
      return "Investigating"
    case ComplaintStatusEnum.Resolved:
      return "Resolved"
    case ComplaintStatusEnum.Escalated:
      return "Escalated"
    case ComplaintStatusEnum.Closed:
      return "Closed"
    default:
      return undefined
  }
}

export function mapComplaintStatusToBackend(status?: ComplaintStatus): number | undefined {
  if (!status) return undefined
  
  switch (status) {
    case "Open":
      return ComplaintStatusEnum.Open
    case "Investigating":
      return ComplaintStatusEnum.Investigating
    case "Resolved":
      return ComplaintStatusEnum.Resolved
    case "Escalated":
      return ComplaintStatusEnum.Escalated
    case "Closed":
      return ComplaintStatusEnum.Closed
    default:
      return undefined
  }
}
