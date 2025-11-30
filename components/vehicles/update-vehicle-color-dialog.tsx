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
import { Switch } from "@/components/ui/switch"
import { useVehicleColor, useUpdateVehicleColor } from "@/hooks/use-vehicles"
import { useToast } from "@/hooks/use-toast"
import { Loader2, X } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

const vehicleColorSchema = z.object({
  colorName: z.string().min(1, "Color name is required").max(50, "Color name must not exceed 50 characters"),
  colorCode: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color code must be in format #RRGGBB"),
  additionalPrice: z.number().min(0, "Additional price must be greater than or equal to 0"),
  image: z.instanceof(File).optional(),
  isActive: z.boolean(),
})

type VehicleColorFormValues = z.infer<typeof vehicleColorSchema>

interface UpdateVehicleColorDialogProps {
  colorId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function UpdateVehicleColorDialog({
  colorId,
  open,
  onOpenChange,
  onSuccess,
}: UpdateVehicleColorDialogProps) {
  const { data: color, isLoading: isLoadingColor } = useVehicleColor(colorId, { enabled: open && !!colorId })
  const { mutate, isLoading } = useUpdateVehicleColor()
  const { toast } = useToast()

  const processedColorIdRef = useRef<string | null>(null)
  const isMountedRef = useRef(true)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [hasNewImage, setHasNewImage] = useState(false)

  const form = useForm<VehicleColorFormValues>({
    resolver: zodResolver(vehicleColorSchema),
    defaultValues: {
      colorName: "",
      colorCode: "#000000",
      additionalPrice: 0,
      image: undefined,
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
      processedColorIdRef.current = null
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
      setImagePreview(null)
      setHasNewImage(false)
      form.reset({
        colorName: "",
        colorCode: "#000000",
        additionalPrice: 0,
        image: undefined,
        isActive: true,
      })
      return
    }

    if (!open || !color || !isMountedRef.current) {
      return
    }

    if (processedColorIdRef.current === color.id) {
      return
    }

    processedColorIdRef.current = color.id

    const formData = {
      colorName: color.colorName || "",
      colorCode: color.colorCode || "#000000",
      additionalPrice: color.additionalPrice || 0,
      image: undefined as File | undefined,
      isActive: color.isActive ?? true,
    }

    form.reset(formData)

    // Set existing image preview if available
    if (color.imageUrl && !hasNewImage) {
      setImagePreview(color.imageUrl)
    }
  }, [color?.id, open, form, hasNewImage])

  const handleImageChange = (file: File | null) => {
    if (!file) {
      if (hasNewImage && imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }
      setImagePreview(color?.imageUrl || null)
      setHasNewImage(false)
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
    if (hasNewImage && imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }
    setImagePreview(preview)
    setHasNewImage(true)
  }

  const onSubmit = async (data: VehicleColorFormValues) => {
    try {
      await mutate({
        id: colorId,
        data: {
          colorName: data.colorName,
          colorCode: data.colorCode,
          additionalPrice: data.additionalPrice,
          image: data.image,
          isActive: data.isActive,
        },
      })

      toast({
        title: "Success",
        description: "Vehicle color updated successfully",
      })

      // Clean up preview URL
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }
      setImagePreview(null)
      setHasNewImage(false)
      onOpenChange(false)
      
      setTimeout(() => {
        onSuccess?.()
      }, 100)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to update vehicle color",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Vehicle Color</DialogTitle>
          <DialogDescription>Update vehicle color information.</DialogDescription>
        </DialogHeader>

        {isLoadingColor ? (
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
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload a new image to replace the current one
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
                  Update Color
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}

