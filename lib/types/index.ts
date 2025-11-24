export { UserRole, type UserRoleString, type ApiPrefix } from './enums'
import type { UserRoleString } from './enums'

export type Role = UserRoleString

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
  dealerId?: string
  createdAt?: string
}

export interface Vehicle {
  id: string
  modelName: string
  brand: string
  year: number
  basePrice: number
  status: "available" | "out_of_stock" | "coming_soon"
  createdAt: string
  images: string[]
  variants: VehicleVariant[]
  colors: VehicleColor[]
  specifications: VehicleSpecs
}

export interface VehicleSpecs {
  batteryCapacity: string
  range: string
  motorPower: string
  chargingTime: string
  topSpeed: string
  acceleration: string
}

export interface VehicleVariant {
  id: string
  name: string
  additionalPrice: number
  features: string[]
}

export interface VehicleColor {
  id: string
  name: string
  hexCode: string
  additionalPrice: number
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  idNumber: string
  dateOfBirth: string
  dealerId: string
  createdAt: string
}

export interface Order {
  id: string
  quotationId: string
  customerId: string
  vehicleId: string
  totalAmount: number
  paymentMethod: "cash" | "installment"
  status: "pending" | "vehicle_allocated" | "ready_for_delivery" | "delivered" | "cancelled"
  dealerId: string
  createdBy: string
  createdAt: string
}

export interface Quotation {
  id: string
  customerId: string
  vehicleId: string
  variantId: string
  colorId: string
  basePrice: number
  variantPrice: number
  colorPrice: number
  dealerDiscount: number
  promotionDiscount: number
  finalPrice: number
  validUntil: string
  status: "draft" | "sent" | "accepted" | "rejected" | "expired"
  createdBy: string
  createdAt: string
}

export interface Inventory {
  id: string
  vehicleId: string
  variantId: string
  colorId: string
  dealerId: string | null // null means Central Inventory
  quantity: number
  status: "available" | "reserved" | "maintenance"
  updatedAt: string
}

export interface VehicleRequest {
  id: string
  dealerId: string
  vehicleId: string
  variantId: string
  colorId: string
  quantity: number
  status: "pending" | "approved" | "rejected"
  requestedBy: string
  approvedBy?: string
  createdAt: string
}

export interface TestDrive {
  id: string
  customerId: string
  vehicleId: string
  date: string
  time: string
  status: "scheduled" | "completed" | "cancelled" | "no_show"
  notes?: string
  dealerId: string
  createdAt: string
}

export interface Dealer {
  id: string
  name: string
  code: string
  address: string
  phone: string
  email: string
  managerName: string
  status: "active" | "inactive"
  region: "North" | "Central" | "South"
  createdAt: string
}

export interface Promotion {
  id: string
  name: string
  description: string
  discountType: "percentage" | "fixed_amount"
  discountValue: number
  startDate: string
  endDate: string
  status: "active" | "expired" | "scheduled"
  applicableVehicles?: string[] // vehicle IDs
}
