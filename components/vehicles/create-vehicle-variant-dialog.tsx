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
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useCreateVehicleVariant } from "@/hooks/use-vehicles"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Car, XCircle } from "lucide-react"
import { VehicleModelSelector } from "@/components/vehicles/vehicle-model-selector"

const vehicleVariantSchema = z.object({
  modelId: z.string().min(1, "Model is required"),
  variantName: z.string().min(1, "Variant name is required").max(100, "Variant name must not exceed 100 characters"),
  variantCode: z.string().min(1, "Variant code is required").max(50, "Variant code must not exceed 50 characters"),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  specifications: z.string().optional(),
})

type VehicleVariantFormValues = z.infer<typeof vehicleVariantSchema>

interface CreateVehicleVariantDialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateVehicleVariantDialog({
  children,
  open: controlledOpen,
  onOpenChange,
  onSuccess,
}: CreateVehicleVariantDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const { mutate, isLoading } = useCreateVehicleVariant()
  const { toast } = useToast()
  const [selectedModelId, setSelectedModelId] = useState<string>("")
  const [selectedModelName, setSelectedModelName] = useState<string>("")
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  const form = useForm<VehicleVariantFormValues>({
    resolver: zodResolver(vehicleVariantSchema),
    defaultValues: {
      modelId: "",
      variantName: "",
      variantCode: "",
      price: 0,
      specifications: "",
    },
  })

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
        modelId: data.modelId,
        variantName: data.variantName,
        variantCode: data.variantCode,
        price: data.price,
        specifications,
      })

      toast({
        title: "Success",
        description: "Vehicle variant created successfully",
      })

      form.reset()
      setOpen(false)
      onSuccess?.()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create vehicle variant",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Vehicle Variant</DialogTitle>
          <DialogDescription>
            Add a new vehicle variant to the system. Fill in all required fields.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="modelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model *</FormLabel>
                  <FormControl>
                    {selectedModelId && selectedModelName ? (
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
                        <Car className="h-5 w-5 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {selectedModelName}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedModelId("")
                            setSelectedModelName("")
                            field.onChange("")
                          }}
                          className="p-1 rounded-lg hover:bg-primary/10 transition-colors flex-shrink-0"
                          title="Remove model"
                        >
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsModelSelectorOpen(true)}
                        className="w-full justify-start"
                      >
                        <Car className="mr-2 h-4 w-4" />
                        Select a model
                      </Button>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
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
                name="variantCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="STD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      rows={6}
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Variant
              </Button>
            </DialogFooter>
          </form>
        </Form>

        {/* Model Selector */}
        <VehicleModelSelector
          open={isModelSelectorOpen}
          onOpenChange={setIsModelSelectorOpen}
          onSelect={(modelId, modelName) => {
            setSelectedModelId(modelId)
            setSelectedModelName(modelName)
            form.setValue("modelId", modelId)
            setIsModelSelectorOpen(false)
          }}
          selectedModelId={selectedModelId}
        />
      </DialogContent>
    </Dialog>
  )
}

