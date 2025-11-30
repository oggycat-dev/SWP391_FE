"use client"

import { useState, useMemo } from "react"
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
import { useCreateVehicleColor } from "@/hooks/use-vehicles"
import { useToast } from "@/hooks/use-toast"
import { Loader2, X, Settings, XCircle } from "lucide-react"
import Image from "next/image"
import { VehicleVariantSelector } from "@/components/vehicles/vehicle-variant-selector"

const vehicleColorSchema = z.object({
  variantId: z.string().min(1, "Variant is required"),
  colorName: z.string().min(1, "Color name is required").max(50, "Color name must not exceed 50 characters"),
  colorCode: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color code must be in format #RRGGBB"),
  additionalPrice: z.number().min(0, "Additional price must be greater than or equal to 0"),
  image: z.instanceof(File).optional(),
})

type VehicleColorFormValues = z.infer<typeof vehicleColorSchema>

interface CreateVehicleColorDialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateVehicleColorDialog({
  children,
  open: controlledOpen,
  onOpenChange,
  onSuccess,
}: CreateVehicleColorDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const { mutate, isLoading } = useCreateVehicleColor()
  const { toast } = useToast()
  const [selectedVariantId, setSelectedVariantId] = useState<string>("")
  const [selectedVariantName, setSelectedVariantName] = useState<string>("")
  const [isVariantSelectorOpen, setIsVariantSelectorOpen] = useState(false)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  const form = useForm<VehicleColorFormValues>({
    resolver: zodResolver(vehicleColorSchema),
    defaultValues: {
      variantId: "",
      colorName: "",
      colorCode: "#000000",
      additionalPrice: 0,
      image: undefined,
    },
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setImagePreview(null)
      form.setValue('image', undefined, { shouldValidate: true })
      return
    }

    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select an image file",
      })
      return
    }

    form.setValue('image', file, { shouldValidate: true })
    const preview = URL.createObjectURL(file)
    setImagePreview(preview)
  }

  const onSubmit = async (data: VehicleColorFormValues) => {
    try {
      await mutate({
        variantId: data.variantId,
        colorName: data.colorName,
        colorCode: data.colorCode,
        additionalPrice: data.additionalPrice,
        image: data.image,
      })

      toast({
        title: "Success",
        description: "Vehicle color created successfully",
      })

      // Clean up preview URL
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
      form.reset()
      setImagePreview(null)
      setOpen(false)
      onSuccess?.()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to create vehicle color",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Vehicle Color</DialogTitle>
          <DialogDescription>Add a new color option for a vehicle variant.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="variantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant *</FormLabel>
                  <FormControl>
                    {selectedVariantId && selectedVariantName ? (
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
                        <Settings className="h-5 w-5 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {selectedVariantName}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedVariantId("")
                            setSelectedVariantName("")
                            field.onChange("")
                          }}
                          className="p-1 rounded-lg hover:bg-primary/10 transition-colors flex-shrink-0"
                          title="Remove variant"
                        >
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsVariantSelectorOpen(true)}
                        className="w-full justify-start"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Select a variant
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
                name="colorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Midnight Blue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colorCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color Code *</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          className="w-16 h-10"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <Input
                          type="text"
                          placeholder="#000000"
                          {...field}
                          pattern="^#[0-9A-Fa-f]{6}$"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Hex color code (e.g., #FF5733)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="additionalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Price *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Additional cost for this color option
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          handleImageChange(file)
                        }}
                        className="cursor-pointer"
                      />
                      {imagePreview && (
                        <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                          <Image
                            src={imagePreview}
                            alt="Color preview"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute right-2 top-2 h-6 w-6"
                            onClick={() => {
                              handleImageChange(null)
                              if (imagePreview) {
                                URL.revokeObjectURL(imagePreview)
                              }
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload an image showing this color
                  </FormDescription>
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
                Create Color
              </Button>
            </DialogFooter>
          </form>
        </Form>

        {/* Variant Selector */}
        <VehicleVariantSelector
          open={isVariantSelectorOpen}
          onOpenChange={setIsVariantSelectorOpen}
          onSelect={(variantId, variantName) => {
            setSelectedVariantId(variantId)
            setSelectedVariantName(variantName)
            form.setValue("variantId", variantId)
            setIsVariantSelectorOpen(false)
          }}
          selectedVariantId={selectedVariantId}
        />
      </DialogContent>
    </Dialog>
  )
}

