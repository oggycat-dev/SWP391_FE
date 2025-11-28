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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useCreateOrder } from "@/hooks/use-orders"
import { useCustomers } from "@/hooks/use-customers"
import { useQuotations } from "@/hooks/use-quotations"
import { useVehicleModels, useVehicleVariants, useVehicleColors } from "@/hooks/use-vehicles"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { PaymentMethod } from "@/lib/api/orders"
import { QuotationStatus } from "@/lib/api/quotations"

const orderSchema = z.object({
  quotationId: z.string().optional(),
  customerId: z.string().min(1, "Customer is required"),
  vehicleId: z.string().min(1, "Vehicle is required"),
  variantId: z.string().optional(),
  colorId: z.string().optional(),
  totalAmount: z.number().min(0, "Total amount must be positive"),
  paymentMethod: z.nativeEnum(PaymentMethod),
  notes: z.string().optional(),
})

type OrderFormValues = z.infer<typeof orderSchema>

interface CreateOrderDialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
  quotationId?: string
}

export function CreateOrderDialog({
  children,
  open: controlledOpen,
  onOpenChange,
  onSuccess,
  quotationId,
}: CreateOrderDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const { mutate, isLoading } = useCreateOrder()
  const { toast } = useToast()
  const { data: customers } = useCustomers()
  const { data: quotations } = useQuotations()
  const { data: vehicleModels } = useVehicleModels()
  const [selectedQuotationId, setSelectedQuotationId] = useState<string>(quotationId || "")
  const [selectedModelId, setSelectedModelId] = useState<string>("")
  const [selectedVariantId, setSelectedVariantId] = useState<string>("")
  const [selectedColorId, setSelectedColorId] = useState<string>("")

  const selectedQuotation = quotations?.find((q) => q.id === selectedQuotationId)

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

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      quotationId: quotationId || "",
      customerId: "",
      vehicleId: "",
      variantId: "",
      colorId: "",
      totalAmount: 0,
      paymentMethod: PaymentMethod.Cash,
      notes: "",
    },
  })

  // Load quotation data when selected
  useEffect(() => {
    if (selectedQuotation) {
      form.setValue("customerId", selectedQuotation.customerId)
      form.setValue("vehicleId", selectedQuotation.vehicleId)
      form.setValue("variantId", selectedQuotation.variantId || "")
      form.setValue("colorId", selectedQuotation.colorId || "")
      form.setValue("totalAmount", selectedQuotation.finalPrice)
      setSelectedModelId(selectedQuotation.vehicleId)
      setSelectedVariantId(selectedQuotation.variantId || "")
      setSelectedColorId(selectedQuotation.colorId || "")
    }
  }, [selectedQuotation, form])

  const onSubmit = async (data: OrderFormValues) => {
    try {
      await mutate({
        quotationId: data.quotationId || undefined,
        customerId: data.customerId,
        vehicleId: data.vehicleId,
        variantId: data.variantId || undefined,
        colorId: data.colorId || undefined,
        totalAmount: data.totalAmount,
        paymentMethod: data.paymentMethod,
        notes: data.notes || undefined,
      })

      toast({
        title: "Success",
        description: "Order created successfully",
      })

      form.reset()
      setSelectedQuotationId("")
      setSelectedModelId("")
      setSelectedVariantId("")
      setSelectedColorId("")
      setOpen(false)
      onSuccess?.()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to create order",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Order</DialogTitle>
          <DialogDescription>Create a new order from a quotation or manually.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quotationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Quotation (Optional)</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      setSelectedQuotationId(value)
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a quotation or create manually" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Create manually</SelectItem>
                      {quotations
                        ?.filter((q) => q.status === QuotationStatus.Accepted || q.status === QuotationStatus.Sent)
                        .map((quotation) => (
                          <SelectItem key={quotation.id} value={quotation.id}>
                            Quote {quotation.id.substring(0, 8)} - ${quotation.finalPrice.toLocaleString()}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Select a quotation to auto-fill order details</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount *</FormLabel>
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
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(value as PaymentMethod)}
                      defaultValue={field.value}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={PaymentMethod.Cash} id="cash" />
                        <Label htmlFor="cash">Cash</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={PaymentMethod.Installment} id="installment" />
                        <Label htmlFor="installment">Installment</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    {form.watch("paymentMethod") === PaymentMethod.Installment &&
                      "Installment plan will be created after order approval"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                Create Order
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

