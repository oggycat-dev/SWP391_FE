"use client"

import { format } from "date-fns"
import { Calendar, DollarSign, Tag, Users, Car, FileText, Percent } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Promotion } from "@/lib/types/promotion"
import { useQuery } from "@tanstack/react-query"
import { vehiclesApi } from "@/lib/api/vehicles"
import { dealersApi } from "@/lib/api/dealers"

interface PromotionDetailDialogProps {
  promotion: Promotion | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PromotionDetailDialog({
  promotion,
  open,
  onOpenChange,
}: PromotionDetailDialogProps) {
  // Fetch vehicle variants and dealers to show names
  const { data: vehicleVariantsData } = useQuery({
    queryKey: ['vehicle-variants-all'],
    queryFn: () => vehiclesApi.getVehicleVariants({ isActive: true, pageSize: 1000 }),
    enabled: open && !!promotion,
  })

  const { data: dealersData } = useQuery({
    queryKey: ['dealers-all'],
    queryFn: () => dealersApi.getDealers({ status: 'Active', pageSize: 1000 }),
    enabled: open && !!promotion,
  })

  if (!promotion) return null

  const vehicleVariants = vehicleVariantsData?.items || []
  const dealers = dealersData?.items || []

  const selectedVehicles = vehicleVariants.filter(v => 
    promotion.applicableVehicleVariantIds.includes(v.id)
  )
  const selectedDealers = dealers.filter(d => 
    promotion.applicableDealerIds.includes(d.id)
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500 hover:bg-green-600 text-white"
      case "Inactive":
        return "bg-red-500 hover:bg-red-600 text-white"
      case "Expired":
        return "bg-gray-500 hover:bg-gray-600 text-white"
      case "Scheduled":
        return "bg-blue-500 hover:bg-blue-600 text-white"
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white"
    }
  }

  const usagePercentage = promotion.maxUsageCount > 0 
    ? (promotion.currentUsageCount / promotion.maxUsageCount) * 100 
    : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <Badge className={`text-sm ${getStatusColor(promotion.status)}`}>
              {promotion.status}
            </Badge>
            <div className="flex-1">
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Tag className="h-6 w-6 text-primary" />
                {promotion.name}
              </DialogTitle>
              <DialogDescription className="text-sm mt-1">
                {promotion.promotionCode}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6 pr-4">
            {/* Description */}
            <div>
              <h3 className="text-sm font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{promotion.description}</p>
            </div>

            <Separator />

            {/* Discount Information */}
            <div>
              <h3 className="text-sm font-medium mb-3">Discount Details</h3>
              <div className="grid gap-3">
                <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/50">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-primary/10">
                      {promotion.discountType === "Percentage" ? (
                        <Percent className="h-4 w-4 text-primary" />
                      ) : (
                        <DollarSign className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Discount Type</p>
                      <p className="text-sm font-medium">{promotion.discountType}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Value</p>
                    <p className="text-xl font-bold text-primary">
                      {promotion.discountType === "Percentage"
                        ? `${promotion.discountPercentage}%`
                        : formatCurrency(promotion.discountAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Date Range */}
            <div>
              <h3 className="text-sm font-medium mb-3">Promotion Period</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 rounded-lg border p-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Start Date</p>
                    <p className="text-sm font-medium">
                      {format(new Date(promotion.startDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border p-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">End Date</p>
                    <p className="text-sm font-medium">
                      {format(new Date(promotion.endDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Usage Statistics */}
            <div>
              <h3 className="text-sm font-medium mb-3">Usage Statistics</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Usage</span>
                  <span className="font-medium">
                    {promotion.currentUsageCount} / {promotion.maxUsageCount}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {usagePercentage.toFixed(1)}% of maximum usage reached
                </p>
              </div>
            </div>

            <Separator />

            {/* Applicable Vehicles */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Car className="h-4 w-4" />
                Applicable Vehicle Variants
              </h3>
              {promotion.applicableVehicleVariantIds.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Applies to all vehicle variants
                </p>
              ) : selectedVehicles.length > 0 ? (
                <div className="space-y-2">
                  {selectedVehicles.map((variant) => (
                    <div key={variant.id} className="flex items-center gap-2 rounded-lg border p-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {variant.modelName} - {variant.variantName}
                        </p>
                        <p className="text-xs text-muted-foreground">{variant.variantCode}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {formatCurrency(variant.price)}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Loading vehicle details...</p>
              )}
            </div>

            <Separator />

            {/* Applicable Dealers */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Applicable Dealers
              </h3>
              {promotion.applicableDealerIds.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Applies to all dealers
                </p>
              ) : selectedDealers.length > 0 ? (
                <div className="space-y-2">
                  {selectedDealers.map((dealer) => (
                    <div key={dealer.id} className="flex items-center gap-2 rounded-lg border p-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{dealer.dealerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {dealer.dealerCode} • {dealer.city}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {dealer.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Loading dealer details...</p>
              )}
            </div>

            {/* Image URL */}
            {promotion.imageUrl && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium mb-2">Promotion Image</h3>
                  <div className="rounded-lg border overflow-hidden">
                    <img
                      src={promotion.imageUrl}
                      alt={promotion.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available'
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Terms and Conditions */}
            {promotion.termsAndConditions && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Terms & Conditions
                  </h3>
                  <div className="rounded-lg border p-3 bg-muted/50">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {promotion.termsAndConditions}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Metadata */}
            <Separator />
            <div>
              <h3 className="text-sm font-medium mb-2">Additional Information</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {format(new Date(promotion.createdAt), "MMM dd, yyyy HH:mm")}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
