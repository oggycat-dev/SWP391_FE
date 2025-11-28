"use client"

import { useState, useEffect } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCreateQuotation } from "@/hooks/use-quotations"
import { useCustomers } from "@/hooks/use-customers"
import { useVehicleModels, useVehicleVariants, useVehicleColors } from "@/hooks/use-vehicles"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Calculator } from "lucide-react"

const quotationSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  vehicleId: z.string().min(1, "Vehicle model is required"),
  variantId: z.string().optional(),
  colorId: z.string().optional(),
  basePrice: z.number().min(0, "Base price must be positive"),
  variantPrice: z.number().min(0).default(0),
  colorPrice: z.number().min(0).default(0),
  dealerDiscount: z.number().min(0).default(0),
  promotionDiscount: z.number().min(0).default(0),
  validUntil: z.string().min(1, "Valid until date is required"),
  notes: z.string().optional(),
})

type QuotationFormValues = z.infer<typeof quotationSchema>

interface CreateQuotationDialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateQuotationDialog({
  children,
  open: controlledOpen,
  onOpenChange,
  onSuccess,
}: CreateQuotationDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const { mutate, isLoading } = useCreateQuotation()
  const { toast } = useToast()
  const { data: customers } = useCustomers()
  const { data: vehicleModels } = useVehicleModels()
  const [selectedModelId, setSelectedModelId] = useState<string>("")
  const [selectedVariantId, setSelectedVariantId] = useState<string>("")
  const [selectedColorId, setSelectedColorId] = useState<string>("")

  const { data: variants } = useVehicleVariants(
    selectedModelId ? { modelId: selectedModelId } : undefined,
    { enabled: !!selectedModelId }
  )

  const { data: colors } = useVehicleColors(
    selectedVariantId ? { variantId: selectedVariantId } : undefined,
    { enabled: !!selectedVariantId }
  )

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      customerId: "",
      vehicleId: "",
      variantId: "",
      colorId: "",
      basePrice: 0,
      variantPrice: 0,
      colorPrice: 0,
      dealerDiscount: 0,
      promotionDiscount: 0,
      validUntil: "",
      notes: "",
    },
  })

  // Set default valid until date (30 days from now)
  useEffect(() => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 30)
    form.setValue("validUntil", futureDate.toISOString().split("T")[0])
  }, [form])

  // Calculate final price
  const watchedValues = form.watch()
  const finalPrice =
    (watchedValues.basePrice || 0) +
    (watchedValues.variantPrice || 0) +
    (watchedValues.colorPrice || 0) -
    (watchedValues.dealerDiscount || 0) -
    (watchedValues.promotionDiscount || 0)

  // Update prices when selections change
  useEffect(() => {
    const selectedModel = vehicleModels?.items?.find((m) => m.id === selectedModelId)
    if (selectedModel) {
      form.setValue("basePrice", Number(selectedModel.basePrice))
    }
  }, [selectedModelId, vehicleModels, form])

  useEffect(() => {
    const selectedVariant = variants?.items?.find((v) => v.id === selectedVariantId)
    if (selectedVariant) {
      form.setValue("variantPrice", Number(selectedVariant.price))
    } else {
      form.setValue("variantPrice", 0)
    }
  }, [selectedVariantId, variants, form])

  useEffect(() => {
    const selectedColor = colors?.items?.find((c) => c.id === selectedColorId)
    if (selectedColor) {
      form.setValue("colorPrice", Number(selectedColor.additionalPrice))
    } else {
      form.setValue("colorPrice", 0)
    }
  }, [selectedColorId, colors, form])

  const onSubmit = async (data: QuotationFormValues) => {
    try {
      await mutate({
        customerId: data.customerId,
        vehicleId: data.vehicleId,
        variantId: data.variantId || undefined,
        colorId: data.colorId || undefined,
        basePrice: data.basePrice,
        variantPrice: data.variantPrice,
        colorPrice: data.colorPrice,
        dealerDiscount: data.dealerDiscount,
        promotionDiscount: data.promotionDiscount,
        validUntil: data.validUntil,
        notes: data.notes || undefined,
      })

      toast({
        title: "Success",
        description: "Quotation created successfully",
      })

      form.reset()
      setSelectedModelId("")
      setSelectedVariantId("")
      setSelectedColorId("")
      setOpen(false)
      onSuccess?.()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to create quotation",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Quotation</DialogTitle>
          <DialogDescription>Create a price quotation for a customer with vehicle selection and pricing.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers?.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.fullName} - {customer.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="vehicleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Model *</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedModelId(value)
                        setSelectedVariantId("")
                        setSelectedColorId("")
                        form.setValue("variantId", "")
                        form.setValue("colorId", "")
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicleModels?.items?.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.brand} {model.modelName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="variantId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedVariantId(value)
                        setSelectedColorId("")
                        form.setValue("colorId", "")
                      }}
                      defaultValue={field.value}
                      disabled={!selectedModelId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select variant" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {variants?.items?.map((variant) => (
                          <SelectItem key={variant.id} value={variant.id}>
                            {variant.variantName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedColorId(value)
                      }}
                      defaultValue={field.value}
                      disabled={!selectedVariantId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colors?.items?.map((color) => (
                          <SelectItem key={color.id} value={color.id}>
                            {color.colorName}
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
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
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
                name="variantPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="colorPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dealerDiscount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dealer Discount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="promotionDiscount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promotion Discount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
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
                name="validUntil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valid Until *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator className="h-5 w-5" />
                  Price Calculation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Price:</span>
                    <span>${(watchedValues.basePrice || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Variant Price:</span>
                    <span>+ ${(watchedValues.variantPrice || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Color Price:</span>
                    <span>+ ${(watchedValues.colorPrice || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dealer Discount:</span>
                    <span className="text-red-600">- ${(watchedValues.dealerDiscount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Promotion Discount:</span>
                    <span className="text-red-600">- ${(watchedValues.promotionDiscount || 0).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Final Price:</span>
                    <span className="text-primary">${finalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes..." {...field} />
                  </FormControl>
                  <FormDescription>Optional: Any additional information</FormDescription>
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
                Create Quotation
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

