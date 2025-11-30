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
import { useVehicleModel, useDeleteVehicleModel } from "@/hooks/use-vehicles"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DeleteVehicleModelDialogProps {
  modelId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DeleteVehicleModelDialog({
  modelId,
  open,
  onOpenChange,
  onSuccess,
}: DeleteVehicleModelDialogProps) {
  const { data: model } = useVehicleModel(modelId, { enabled: open && !!modelId })
  const { mutate, isLoading } = useDeleteVehicleModel()
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      await mutate(modelId)

      toast({
        title: "Success",
        description: "Vehicle model deleted successfully",
      })

      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to delete vehicle model",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Delete Vehicle Model</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this vehicle model? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {model && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You are about to delete <strong>{model.modelName}</strong> ({model.brand}).
              This will permanently remove the vehicle model from the system.
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Model
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

