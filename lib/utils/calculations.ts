import type { VehicleVariant, VehicleColor } from "@/lib/types"

export const calculateVehiclePrice = (basePrice: number, variant?: VehicleVariant, color?: VehicleColor, fees = 0) => {
  let total = basePrice

  if (variant) {
    total += variant.priceModifier
  }

  if (color) {
    total += color.priceModifier
  }

  total += fees

  return total
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

export const calculateMonthlyInstallment = (
  principal: number,
  interestRate: number, // Annual interest rate in percentage
  months: number,
) => {
  if (months === 0) return 0
  const monthlyRate = interestRate / 100 / 12
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
  return Math.round(payment)
}

export const calculations = {
  calculateVehiclePrice,
  formatCurrency,
  calculateMonthlyInstallment,
}
