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
import { useVehicleColor, useDeleteVehicleColor } from "@/hooks/use-vehicles"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DeleteVehicleColorDialogProps {
  colorId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DeleteVehicleColorDialog({
  colorId,
  open,
  onOpenChange,
  onSuccess,
}: DeleteVehicleColorDialogProps) {
  const { data: color } = useVehicleColor(colorId, { enabled: open && !!colorId })
  const { mutate, isLoading } = useDeleteVehicleColor()
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      await mutate(colorId)

      toast({
        title: "Success",
        description: "Vehicle color deleted successfully",
      })

      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to delete vehicle color",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Delete Vehicle Color</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this vehicle color? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {color && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You are about to delete <strong>{color.colorName}</strong> ({color.variantName}).
              This will permanently remove the vehicle color from the system.
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Color
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

