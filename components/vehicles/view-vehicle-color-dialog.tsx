"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useVehicleColor } from "@/hooks/use-vehicles"
import { Skeleton } from "@/components/ui/skeleton"
import { Palette, DollarSign, CheckCircle, XCircle, Image as ImageIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

interface ViewVehicleColorDialogProps {
  colorId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewVehicleColorDialog({
  colorId,
  open,
  onOpenChange,
}: ViewVehicleColorDialogProps) {
  const { data: color, isLoading } = useVehicleColor(colorId, { enabled: open && !!colorId })

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Vehicle Color Details</DialogTitle>
            <DialogDescription>View vehicle color information and details.</DialogDescription>
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

  if (!color) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Vehicle Color Details</DialogTitle>
            <DialogDescription>View vehicle color information and details.</DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center text-muted-foreground">
            Vehicle color not found
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vehicle Color Details</DialogTitle>
          <DialogDescription>View vehicle color information and details.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Color Header */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
              <Palette className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{color.colorName}</h3>
              <p className="text-sm text-muted-foreground">{color.variantName}</p>
              <div className="mt-2 flex items-center gap-2">
                <div
                  className="h-6 w-6 rounded-full border-2"
                  style={{ backgroundColor: color.colorCode }}
                />
                <Badge variant="outline" className="font-mono">{color.colorCode}</Badge>
                <Badge variant={color.isActive ? "default" : "secondary"}>
                  {color.isActive ? (
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

          {/* Color Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <DollarSign className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Additional Price</p>
                  <p className="text-sm text-muted-foreground">${color.additionalPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {color.imageUrl && (
              <div className="flex items-start gap-3">
                <ImageIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">Color Image</p>
                  <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
                    <Image
                      src={color.imageUrl}
                      alt={color.colorName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
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

