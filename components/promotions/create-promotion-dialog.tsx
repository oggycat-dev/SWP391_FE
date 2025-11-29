"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
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
  FormDescription,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useCreatePromotion, useUpdatePromotion } from "@/hooks/use-promotions"
import type { Promotion, DiscountType } from "@/lib/types/promotion"
import { mapDiscountTypeToBackend } from "@/lib/types/promotion"
import { vehiclesApi } from "@/lib/api/vehicles"
import { dealersApi } from "@/lib/api/dealers"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useQuery } from "@tanstack/react-query"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  discountType: z.enum(["Percentage", "FixedAmount", "Gift", "Accessory"]),
  discountPercentage: z.string().optional(),
  discountAmount: z.string().optional(),
  applicableVehicleVariantIds: z.array(z.string()),
  applicableDealerIds: z.array(z.string()),
  maxUsageCount: z.string().min(1, "Max usage count is required"),
  imageUrl: z.string().optional(),
  termsAndConditions: z.string().optional(),
}).refine(
  (data) => {
    if (data.discountType === "Percentage") {
      return !!data.discountPercentage && parseFloat(data.discountPercentage) > 0
    }
    if (data.discountType === "FixedAmount") {
      return !!data.discountAmount && parseFloat(data.discountAmount) > 0
    }
    return true
  },
  {
    message: "Discount value is required based on discount type",
    path: ["discountPercentage"],
  }
)

type FormValues = z.infer<typeof formSchema>

interface CreatePromotionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  promotion?: Promotion | null
}

export function CreatePromotionDialog({
  open,
  onOpenChange,
  promotion,
}: CreatePromotionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const createMutation = useCreatePromotion()
  const updateMutation = useUpdatePromotion()

  // Fetch vehicle variants and dealers
  const { data: vehicleVariantsData } = useQuery({
    queryKey: ['vehicle-variants-all'],
    queryFn: () => vehiclesApi.getVehicleVariants({ isActive: true, pageSize: 1000 }),
    enabled: open,
  })

  const { data: dealersData } = useQuery({
    queryKey: ['dealers-all'],
    queryFn: () => dealersApi.getDealers({ status: 'Active', pageSize: 1000 }),
    enabled: open,
  })

  const vehicleVariants = vehicleVariantsData?.items || []
  const dealers = dealersData?.items || []

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      discountType: "Percentage",
      discountPercentage: "",
      discountAmount: "",
      applicableVehicleVariantIds: [],
      applicableDealerIds: [],
      maxUsageCount: "",
      imageUrl: "",
      termsAndConditions: "",
    },
  })

  // Load promotion data when editing
  useEffect(() => {
    if (promotion && open) {
      form.reset({
        name: promotion.name,
        description: promotion.description,
        startDate: new Date(promotion.startDate),
        endDate: new Date(promotion.endDate),
        discountType: promotion.discountType,
        discountPercentage: promotion.discountPercentage > 0 ? promotion.discountPercentage.toString() : "",
        discountAmount: promotion.discountAmount > 0 ? promotion.discountAmount.toString() : "",
        applicableVehicleVariantIds: promotion.applicableVehicleVariantIds || [],
        applicableDealerIds: promotion.applicableDealerIds || [],
        maxUsageCount: promotion.maxUsageCount.toString(),
        imageUrl: promotion.imageUrl || "",
        termsAndConditions: promotion.termsAndConditions || "",
      })
    } else if (!promotion && open) {
      // Reset form when creating new
      form.reset({
        name: "",
        description: "",
        discountType: "Percentage",
        discountPercentage: "",
        discountAmount: "",
        applicableVehicleVariantIds: [],
        applicableDealerIds: [],
        maxUsageCount: "",
        imageUrl: "",
        termsAndConditions: "",
      })
    }
  }, [promotion, open, form])

  const discountType = form.watch("discountType")

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      const data = {
        name: values.name,
        description: values.description,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        discountType: mapDiscountTypeToBackend(values.discountType as DiscountType),
        discountPercentage: parseFloat(values.discountPercentage || "0"),
        discountAmount: parseFloat(values.discountAmount || "0"),
        applicableVehicleVariantIds: values.applicableVehicleVariantIds,
        applicableDealerIds: values.applicableDealerIds,
        maxUsageCount: parseInt(values.maxUsageCount),
        imageUrl: values.imageUrl || "",
        termsAndConditions: values.termsAndConditions || "",
      }

      if (promotion) {
        await updateMutation.mutateAsync({ id: promotion.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to save promotion:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{promotion ? "Edit Promotion" : "Create New Promotion"}</DialogTitle>
          <DialogDescription>
            {promotion ? "Update promotion details" : "Fill in the details to create a new promotion"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promotion Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Summer Sale 2024" {...field} />
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
                    <Textarea
                      placeholder="Enter promotion description..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="discountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Percentage">Percentage</SelectItem>
                      <SelectItem value="FixedAmount">Fixed Amount</SelectItem>
                      <SelectItem value="Gift">Gift</SelectItem>
                      <SelectItem value="Accessory">Accessory</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {discountType === "Percentage" && (
              <FormField
                control={form.control}
                name="discountPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Percentage (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        placeholder="10"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Enter percentage (0-100)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {discountType === "FixedAmount" && (
              <FormField
                control={form.control}
                name="discountAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Amount (VND)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1000"
                        min="0"
                        placeholder="1000000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="applicableVehicleVariantIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Applicable Vehicle Variants</FormLabel>
                  <FormDescription>Select vehicles this promotion applies to (optional)</FormDescription>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    {vehicleVariants.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No vehicle variants available</p>
                    ) : (
                      <div className="space-y-2">
                        {vehicleVariants.map((variant) => (
                          <div key={variant.id} className="flex items-center space-x-2">
                            <Checkbox
                              checked={field.value?.includes(variant.id)}
                              onCheckedChange={(checked) => {
                                const current = field.value || []
                                if (checked) {
                                  field.onChange([...current, variant.id])
                                } else {
                                  field.onChange(current.filter((id) => id !== variant.id))
                                }
                              }}
                            />
                            <label className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {variant.modelName} - {variant.variantName} ({variant.variantCode})
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicableDealerIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Applicable Dealers</FormLabel>
                  <FormDescription>Select dealers this promotion applies to (optional)</FormDescription>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    {dealers.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No dealers available</p>
                    ) : (
                      <div className="space-y-2">
                        {dealers.map((dealer) => (
                          <div key={dealer.id} className="flex items-center space-x-2">
                            <Checkbox
                              checked={field.value?.includes(dealer.id)}
                              onCheckedChange={(checked) => {
                                const current = field.value || []
                                if (checked) {
                                  field.onChange([...current, dealer.id])
                                } else {
                                  field.onChange(current.filter((id) => id !== dealer.id))
                                }
                              }}
                            />
                            <label className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {dealer.dealerName} ({dealer.dealerCode})
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxUsageCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Usage Count</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="100"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Maximum number of times this promotion can be used</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="termsAndConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terms & Conditions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter terms and conditions..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {promotion ? "Update" : "Create"} Promotion
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
