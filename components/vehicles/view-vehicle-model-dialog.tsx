"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useVehicleModel } from "@/hooks/use-vehicles"
import { Skeleton } from "@/components/ui/skeleton"
import { Car, Calendar, DollarSign, FileText, Image as ImageIcon, CheckCircle, XCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

interface ViewVehicleModelDialogProps {
  modelId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewVehicleModelDialog({
  modelId,
  open,
  onOpenChange,
}: ViewVehicleModelDialogProps) {
  const { data: model, isLoading } = useVehicleModel(modelId, { enabled: open && !!modelId })

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Vehicle Model Details</DialogTitle>
            <DialogDescription>View vehicle model information and details.</DialogDescription>
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

  if (!model) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Vehicle Model Details</DialogTitle>
            <DialogDescription>View vehicle model information and details.</DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center text-muted-foreground">
            Vehicle model not found
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vehicle Model Details</DialogTitle>
          <DialogDescription>View vehicle model information and details.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Model Header */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
              <Car className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{model.modelName}</h3>
              <p className="text-sm text-muted-foreground">{model.brand}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline">{model.category}</Badge>
                <Badge variant={model.isActive ? "default" : "secondary"}>
                  {model.isActive ? (
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

          {/* Model Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Model Code</p>
                  <p className="text-sm text-muted-foreground font-mono">{model.modelCode}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Year</p>
                  <p className="text-sm text-muted-foreground">{model.year}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Base Price</p>
                  <p className="text-sm text-muted-foreground">${model.basePrice.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Car className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-muted-foreground">{model.category}</p>
                </div>
              </div>
            </div>

            {model.description && (
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-sm text-muted-foreground">{model.description}</p>
                </div>
              </div>
            )}

            {model.brochureUrl && (
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Brochure URL</p>
                  <a 
                    href={model.brochureUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {model.brochureUrl}
                  </a>
                </div>
              </div>
            )}

            {model.imageUrls && model.imageUrls.length > 0 && (
              <div className="flex items-start gap-3">
                <ImageIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">Images</p>
                  <div className="grid grid-cols-2 gap-2">
                    {model.imageUrls.map((url, index) => (
                      <div key={index} className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
                        <Image
                          src={url}
                          alt={`${model.modelName} image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Created At</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(model.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {model.modifiedAt && (
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Last Modified</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(model.modifiedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

