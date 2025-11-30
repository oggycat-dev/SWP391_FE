/**
 * Promotion Types
 */

export type PromotionStatus = 'Active' | 'Inactive' | 'Expired' | 'Scheduled'
export type DiscountType = 'Percentage' | 'FixedAmount' | 'Gift' | 'Accessory'

// Backend expects discountType as number enum
export enum DiscountTypeEnum {
  Percentage = 0,
  FixedAmount = 1,
  Gift = 2,
  Accessory = 3
}

// Backend expects status as number enum
export enum PromotionStatusEnum {
  Active = 0,
  Inactive = 1,
  Expired = 2,
  Scheduled = 3
}

// Helper functions to convert between backend enum numbers and frontend strings
export function mapDiscountTypeFromBackend(type: number): DiscountType {
  switch (type) {
    case 0: return 'Percentage'
    case 1: return 'FixedAmount'
    case 2: return 'Gift'
    case 3: return 'Accessory'
    default: return 'Percentage'
  }
}

export function mapDiscountTypeToBackend(type: DiscountType): number {
  const map: Record<DiscountType, number> = {
    'Percentage': DiscountTypeEnum.Percentage,
    'FixedAmount': DiscountTypeEnum.FixedAmount,
    'Gift': DiscountTypeEnum.Gift,
    'Accessory': DiscountTypeEnum.Accessory,
  }
  return map[type]
}

export function mapPromotionStatusFromBackend(status: number): PromotionStatus {
  switch (status) {
    case 0: return 'Active'
    case 1: return 'Inactive'
    case 2: return 'Expired'
    case 3: return 'Scheduled'
    default: return 'Active'
  }
}

export function mapPromotionStatusToBackend(status: PromotionStatus): number {
  const map: Record<PromotionStatus, number> = {
    'Active': PromotionStatusEnum.Active,
    'Inactive': PromotionStatusEnum.Inactive,
    'Expired': PromotionStatusEnum.Expired,
    'Scheduled': PromotionStatusEnum.Scheduled,
  }
  return map[status]
}

export interface Promotion {
  id: string
  promotionCode: string
  name: string
  description: string
  startDate: string
  endDate: string
  discountType: DiscountType
  discountPercentage: number
  discountAmount: number
  status: PromotionStatus
  applicableVehicleVariantIds: string[]
  applicableDealerIds: string[]
  maxUsageCount: number
  currentUsageCount: number
  imageUrl: string
  termsAndConditions: string
  createdAt: string
}

export interface CreatePromotionRequest {
  name: string
  description: string
  startDate: string
  endDate: string
  discountType: number // Backend expects enum number
  discountPercentage: number
  discountAmount: number
  applicableVehicleVariantIds: string[]
  applicableDealerIds: string[]
  maxUsageCount: number
  imageUrl?: string
  termsAndConditions?: string
}

export interface UpdatePromotionRequest extends CreatePromotionRequest {}

export interface UpdatePromotionStatusRequest {
  status: PromotionStatus
}
