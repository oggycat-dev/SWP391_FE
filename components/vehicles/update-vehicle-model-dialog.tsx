"use client"

import { useEffect, useRef } from "react"
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useVehicleModel, useUpdateVehicleModel } from "@/hooks/use-vehicles"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { type VehicleCategoryString } from "@/lib/types/enums"

const vehicleModelSchema = z.object({
  modelName: z.string().min(1, "Model name is required").max(200, "Model name must not exceed 200 characters"),
  brand: z.string().min(1, "Brand is required").max(100, "Brand must not exceed 100 characters"),
  category: z.enum(['Sedan', 'SUV', 'Hatchback', 'Truck', 'Van', 'Coupe'], {
    required_error: "Please select a category",
  }),
  year: z.number().min(2001, "Year must be greater than 2000"),
  basePrice: z.number().min(0.01, "Base price must be greater than 0"),
  description: z.string().optional(),
  imageUrls: z.array(z.string().url("Invalid URL")).optional().default([]),
  brochureUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  isActive: z.boolean(),
})

type VehicleModelFormValues = z.infer<typeof vehicleModelSchema>

interface UpdateVehicleModelDialogProps {
  modelId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const CATEGORY_OPTIONS: { value: VehicleCategoryString; label: string }[] = [
  { value: 'Sedan', label: 'Sedan' },
  { value: 'SUV', label: 'SUV' },
  { value: 'Hatchback', label: 'Hatchback' },
  { value: 'Truck', label: 'Truck' },
  { value: 'Van', label: 'Van' },
  { value: 'Coupe', label: 'Coupe' },
]

export function UpdateVehicleModelDialog({
  modelId,
  open,
  onOpenChange,
  onSuccess,
}: UpdateVehicleModelDialogProps) {
  const { data: model, isLoading: isLoadingModel } = useVehicleModel(modelId, { enabled: open && !!modelId })
  const { mutate, isLoading } = useUpdateVehicleModel()
  const { toast } = useToast()

  const processedModelIdRef = useRef<string | null>(null)
  const isMountedRef = useRef(true)

  const form = useForm<VehicleModelFormValues>({
    resolver: zodResolver(vehicleModelSchema),
    defaultValues: {
      modelName: "",
      brand: "",
      category: undefined,
      year: new Date().getFullYear(),
      basePrice: 0,
      description: "",
      imageUrls: [],
      brochureUrl: "",
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
      processedModelIdRef.current = null
      form.reset({
        modelName: "",
        brand: "",
        category: undefined,
        year: new Date().getFullYear(),
        basePrice: 0,
        description: "",
        imageUrls: [],
        brochureUrl: "",
        isActive: true,
      })
      return
    }

    if (!open || !model || !isMountedRef.current) {
      return
    }

    if (processedModelIdRef.current === model.id) {
      return
    }

    processedModelIdRef.current = model.id

    const formData = {
      modelName: model.modelName || "",
      brand: model.brand || "",
      category: (model.category as VehicleCategoryString) || 'Sedan',
      year: model.year || new Date().getFullYear(),
      basePrice: model.basePrice || 0,
      description: model.description || "",
      imageUrls: model.imageUrls || [],
      brochureUrl: model.brochureUrl || "",
      isActive: model.isActive ?? true,
    }

    form.reset(formData)

    requestAnimationFrame(() => {
      if (isMountedRef.current && processedModelIdRef.current === model.id) {
        form.setValue('category', formData.category, { shouldValidate: false, shouldDirty: false })
        form.setValue('modelName', formData.modelName, { shouldValidate: false, shouldDirty: false })
        form.setValue('brand', formData.brand, { shouldValidate: false, shouldDirty: false })
        form.setValue('year', formData.year, { shouldValidate: false, shouldDirty: false })
        form.setValue('basePrice', formData.basePrice, { shouldValidate: false, shouldDirty: false })
        form.setValue('description', formData.description, { shouldValidate: false, shouldDirty: false })
        form.setValue('imageUrls', formData.imageUrls, { shouldValidate: false, shouldDirty: false })
        form.setValue('brochureUrl', formData.brochureUrl, { shouldValidate: false, shouldDirty: false })
        form.setValue('isActive', formData.isActive, { shouldValidate: false, shouldDirty: false })
      }
    })
  }, [model?.id, open, form])

  const onSubmit = async (data: VehicleModelFormValues) => {
    try {
      await mutate({
        id: modelId,
        data: {
          modelName: data.modelName,
          brand: data.brand,
          category: data.category,
          year: data.year,
          basePrice: data.basePrice,
          description: data.description || "",
          imageUrls: data.imageUrls || [],
          brochureUrl: data.brochureUrl || "",
          isActive: data.isActive,
        },
      })

      toast({
        title: "Success",
        description: "Vehicle model updated successfully",
      })

      onOpenChange(false)
      
      setTimeout(() => {
        onSuccess?.()
      }, 100)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to update vehicle model",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Vehicle Model</DialogTitle>
          <DialogDescription>Update vehicle model information.</DialogDescription>
        </DialogHeader>

        {isLoadingModel ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="modelName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Model X" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand *</FormLabel>
                      <FormControl>
                        <Input placeholder="Tesla" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => {
                    const categoryValue = field.value || 'Sedan'
                    return (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select 
                          key={`category-select-${model?.id || 'new'}-${categoryValue}`}
                          onValueChange={field.onChange} 
                          value={categoryValue}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORY_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="2024"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="50000"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Vehicle description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brochureUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brochure URL</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://example.com/brochure.pdf" {...field} />
                    </FormControl>
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
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Model
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}

