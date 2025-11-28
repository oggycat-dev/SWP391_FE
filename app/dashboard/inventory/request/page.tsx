"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCreateVehicleRequest } from "@/hooks/use-vehicle-requests"
import { useVehicleModels, useVehicleVariants, useVehicleColors } from "@/hooks/use-vehicles"

const requestSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle model is required"),
  variantId: z.string().min(1, "Variant is required"),
  colorId: z.string().min(1, "Color is required"),
  quantity: z.number().min(1, "Quantity must be at least 1").max(50, "Quantity cannot exceed 50"),
  notes: z.string().optional(),
})

type RequestFormValues = z.infer<typeof requestSchema>

export default function RequestVehiclePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { mutate, isLoading } = useCreateVehicleRequest()
  const { data: vehicleModels } = useVehicleModels()
  const [selectedModelId, setSelectedModelId] = useState<string>("")
  const [selectedVariantId, setSelectedVariantId] = useState<string>("")

  const { data: variants } = useVehicleVariants(
    selectedModelId ? { modelId: selectedModelId } : undefined,
    { enabled: !!selectedModelId }
  )

  const { data: colors } = useVehicleColors(
    selectedVariantId ? { variantId: selectedVariantId } : undefined,
    { enabled: !!selectedVariantId }
  )

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      vehicleId: "",
      variantId: "",
      colorId: "",
      quantity: 1,
      notes: "",
    },
  })

  const onSubmit = async (data: RequestFormValues) => {
    try {
      await mutate({
        vehicleId: data.vehicleId,
        variantId: data.variantId,
        colorId: data.colorId,
        quantity: data.quantity,
        notes: data.notes || undefined,
      })

      toast({
        title: "Request Submitted",
        description: "Your vehicle request has been sent to EVM for approval.",
      })

      router.push("/dashboard/inventory")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to submit vehicle request",
      })
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Request Vehicle</h1>
          <p className="text-muted-foreground">Create a new stock request from central warehouse.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
          <CardDescription>Select the vehicle configuration you need.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        form.setValue("variantId", "")
                        form.setValue("colorId", "")
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select model..." />
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
                    <FormLabel>Variant *</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedVariantId(value)
                        form.setValue("colorId", "")
                      }}
                      defaultValue={field.value}
                      disabled={!selectedModelId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select variant..." />
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
                    <FormLabel>Color *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!selectedVariantId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select color..." />
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

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="50"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormDescription>Number of vehicles to request (1-50)</FormDescription>
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
                      <Input placeholder="Additional notes..." {...field} />
                    </FormControl>
                    <FormDescription>Optional: Any special requirements</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter className="flex justify-end gap-2 px-0 pb-0">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Request
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
