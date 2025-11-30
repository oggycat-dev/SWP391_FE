"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useVehicleVariant, useUpdateVehicleVariant } from "@/hooks/use-vehicles"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const vehicleVariantSchema = z.object({
  variantName: z.string().min(1, "Variant name is required").max(100, "Variant name must not exceed 100 characters"),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  specifications: z.string().optional(),
  isActive: z.boolean(),
})

type VehicleVariantFormValues = z.infer<typeof vehicleVariantSchema>

interface UpdateVehicleVariantDialogProps {
  variantId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function UpdateVehicleVariantDialog({
  variantId,
  open,
  onOpenChange,
  onSuccess,
}: UpdateVehicleVariantDialogProps) {
  const { data: variant, isLoading: isLoadingVariant } = useVehicleVariant(variantId, { enabled: open && !!variantId })
  const { mutate, isLoading } = useUpdateVehicleVariant()
  const { toast } = useToast()

  const processedVariantIdRef = useRef<string | null>(null)
  const isMountedRef = useRef(true)

  const form = useForm<VehicleVariantFormValues>({
    resolver: zodResolver(vehicleVariantSchema),
    defaultValues: {
      variantName: "",
      price: 0,
      specifications: "",
      isActive: true,
    },
  })

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!open) {
      processedVariantIdRef.current = null
      form.reset({
        variantName: "",
        price: 0,
        specifications: "",
        isActive: true,
      })
      return
    }

    if (!open || !variant || !isMountedRef.current) {
      return
    }

    if (processedVariantIdRef.current === variant.id) {
      return
    }

    processedVariantIdRef.current = variant.id

    const specificationsJson = variant.specifications 
      ? JSON.stringify(variant.specifications, null, 2)
      : ""

    const formData = {
      variantName: variant.variantName || "",
      price: variant.price || 0,
      specifications: specificationsJson,
      isActive: variant.isActive ?? true,
    }

    form.reset(formData)
  }, [variant, open, form])

  const onSubmit = async (data: VehicleVariantFormValues) => {
    try {
      // Parse specifications JSON string to object
      let specifications: Record<string, any> = {}
      if (data.specifications && data.specifications.trim()) {
        try {
          specifications = JSON.parse(data.specifications)
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Invalid JSON",
            description: "Specifications must be valid JSON format",
          })
          return
        }
      }

      await mutate({
        id: variantId,
        data: {
          variantName: data.variantName,
          price: data.price,
          specifications,
          isActive: data.isActive,
        },
      })

      toast({
        title: "Success",
        description: "Vehicle variant updated successfully",
      })

      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update vehicle variant",
      })
    }
  }

  if (isLoadingVariant) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Vehicle Variant</DialogTitle>
            <DialogDescription>Loading variant details...</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!variant) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>Variant not found</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Vehicle Variant</DialogTitle>
          <DialogDescription>
            Update the vehicle variant information. Modify the fields below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="variantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Standard" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (VND) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specifications (JSON)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='{"engine": "Electric", "power": "150kW", "range": "500km"}'
                      className="font-mono text-sm"
                      rows={8}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter specifications as JSON object. Example: {"{"}"engine": "Electric", "power": "150kW"{"}"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Enable or disable this variant. Inactive variants will not be available for selection.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Variant
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

