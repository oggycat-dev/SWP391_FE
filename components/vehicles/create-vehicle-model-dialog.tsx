"use client"

import { useState } from "react"
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
  DialogTrigger,
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
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateVehicleModel } from "@/hooks/use-vehicles"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { VehicleCategory, type VehicleCategoryString } from "@/lib/types/enums"

const vehicleModelSchema = z.object({
  modelCode: z.string().min(1, "Model code is required").max(50, "Model code must not exceed 50 characters"),
  modelName: z.string().min(1, "Model name is required").max(200, "Model name must not exceed 200 characters"),
  brand: z.string().min(1, "Brand is required").max(100, "Brand must not exceed 100 characters"),
  category: z.enum(['Sedan', 'SUV', 'Hatchback', 'Truck', 'Van', 'Coupe'], {
    required_error: "Please select a category",
  }),
  year: z.number().min(2001, "Year must be greater than 2000").max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  basePrice: z.number().min(0.01, "Base price must be greater than 0"),
  description: z.string().optional(),
  imageUrls: z.array(z.string().url("Invalid URL")).optional().default([]),
  brochureUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
})

type VehicleModelFormValues = z.infer<typeof vehicleModelSchema>

interface CreateVehicleModelDialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
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

export function CreateVehicleModelDialog({
  children,
  open: controlledOpen,
  onOpenChange,
  onSuccess,
}: CreateVehicleModelDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const { mutate, isLoading } = useCreateVehicleModel()
  const { toast } = useToast()

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  const form = useForm<VehicleModelFormValues>({
    resolver: zodResolver(vehicleModelSchema),
    defaultValues: {
      modelCode: "",
      modelName: "",
      brand: "",
      category: undefined,
      year: new Date().getFullYear(),
      basePrice: 0,
      description: "",
      imageUrls: [],
      brochureUrl: "",
    },
  })

  const onSubmit = async (data: VehicleModelFormValues) => {
    try {
      await mutate({
        modelCode: data.modelCode,
        modelName: data.modelName,
        brand: data.brand,
        category: data.category,
        year: data.year,
        basePrice: data.basePrice,
        description: data.description || "",
        imageUrls: data.imageUrls || [],
        brochureUrl: data.brochureUrl || "",
      })

      toast({
        title: "Success",
        description: "Vehicle model created successfully",
      })

      form.reset()
      setOpen(false)
      onSuccess?.()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to create vehicle model",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Vehicle Model</DialogTitle>
          <DialogDescription>Add a new vehicle model to the system.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="modelCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="MODEL-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </div>

            <div className="grid grid-cols-2 gap-4">
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

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
            </div>

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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Model
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

