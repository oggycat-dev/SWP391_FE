"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useVehicleVariant, useDeleteVehicleVariant } from "@/hooks/use-vehicles"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DeleteVehicleVariantDialogProps {
  variantId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DeleteVehicleVariantDialog({
  variantId,
  open,
  onOpenChange,
  onSuccess,
}: DeleteVehicleVariantDialogProps) {
  const { data: variant } = useVehicleVariant(variantId, { enabled: open && !!variantId })
  const { mutate, isLoading } = useDeleteVehicleVariant()
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      await mutate(variantId)

      toast({
        title: "Success",
        description: "Vehicle variant deleted successfully",
      })

      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to delete vehicle variant",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Delete Vehicle Variant</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this vehicle variant? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {variant && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You are about to delete <strong>{variant.variantName}</strong> ({variant.modelName}).
              This will permanently remove the vehicle variant from the system.
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Variant
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

