"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useVehicleVariant } from "@/hooks/use-vehicles"
import { Skeleton } from "@/components/ui/skeleton"
import { Car, DollarSign, CheckCircle, XCircle, Settings } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface ViewVehicleVariantDialogProps {
  variantId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewVehicleVariantDialog({
  variantId,
  open,
  onOpenChange,
}: ViewVehicleVariantDialogProps) {
  const { data: variant, isLoading } = useVehicleVariant(variantId, { enabled: open && !!variantId })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Vehicle Variant Details</DialogTitle>
            <DialogDescription>View vehicle variant information and details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!variant) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Vehicle Variant Details</DialogTitle>
            <DialogDescription>View vehicle variant information and details.</DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center text-muted-foreground">
            Vehicle variant not found
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const specifications = variant.specifications || {}

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vehicle Variant Details</DialogTitle>
          <DialogDescription>View vehicle variant information and details.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Variant Header */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
              <Car className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{variant.variantName}</h3>
              <p className="text-sm text-muted-foreground">{variant.modelName}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className="font-mono">{variant.variantCode}</Badge>
                <Badge variant={variant.isActive ? "default" : "secondary"}>
                  {variant.isActive ? (
                    <>
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-1 h-3 w-3" />
                      Inactive
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Variant Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <DollarSign className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Price</p>
                  <p className="text-sm text-muted-foreground">{formatPrice(variant.price)}</p>
                </div>
              </div>
            </div>

            {Object.keys(specifications).length > 0 && (
              <div className="flex items-start gap-3">
                <Settings className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">Specifications</p>
                  <div className="space-y-2 rounded-md border p-3 bg-muted/50">
                    {Object.entries(specifications).map(([key, value]) => (
                      <div key={key} className="flex items-start justify-between gap-4">
                        <span className="text-sm font-medium capitalize text-muted-foreground">
                          {key}:
                        </span>
                        <span className="text-sm text-right">
                          {typeof value === "object" ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

