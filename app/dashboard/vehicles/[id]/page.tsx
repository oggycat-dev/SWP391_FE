"use client"

import { useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { MOCK_VEHICLES } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Battery, Zap, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export default function VehicleDetailPage() {
  const params = useParams()
  const vehicle = MOCK_VEHICLES.find((v) => v.id === params.id)

  const [selectedVariant, setSelectedVariant] = useState(vehicle?.variants[0])
  const [selectedColor, setSelectedColor] = useState(vehicle?.colors[0])

  if (!vehicle || !selectedVariant || !selectedColor) {
    return <div>Vehicle not found</div>
  }

  const finalPrice = vehicle.basePrice + selectedVariant.additionalPrice + selectedColor.additionalPrice

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Images */}
        <div className="space-y-4">
          <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
            <Image
              src={vehicle.images[0] || "/placeholder.svg"}
              alt={vehicle.modelName}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {vehicle.images.map((img, i) => (
              <div
                key={i}
                className="relative aspect-video cursor-pointer overflow-hidden rounded-md border bg-muted hover:opacity-80"
              >
                <Image src={img || "/placeholder.svg"} alt={`View ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Config */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">
                {vehicle.brand} {vehicle.modelName}
              </h1>
              <Badge variant="outline" className="text-lg">
                {vehicle.year}
              </Badge>
            </div>
            <p className="text-3xl font-bold text-primary mt-2">${finalPrice.toLocaleString()}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                <Battery className="mb-2 h-6 w-6 text-primary" />
                <div className="text-sm font-medium text-muted-foreground">Range</div>
                <div className="text-lg font-bold">{vehicle.specifications.range}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                <Zap className="mb-2 h-6 w-6 text-primary" />
                <div className="text-sm font-medium text-muted-foreground">0-60 mph</div>
                <div className="text-lg font-bold">{vehicle.specifications.acceleration}</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="mb-3 text-sm font-medium">Select Variant</h3>
              <div className="grid gap-3">
                {vehicle.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all hover:border-primary",
                      selectedVariant.id === variant.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "",
                    )}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    <div>
                      <div className="font-medium">{variant.name}</div>
                      <div className="text-xs text-muted-foreground">{variant.features.join(" • ")}</div>
                    </div>
                    <div className="text-sm font-medium">
                      {variant.additionalPrice > 0 ? `+$${variant.additionalPrice.toLocaleString()}` : "Included"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium">Select Color</h3>
              <div className="flex gap-3">
                {vehicle.colors.map((color) => (
                  <div
                    key={color.id}
                    className={cn(
                      "group relative h-10 w-10 cursor-pointer rounded-full border-2 shadow-sm transition-all hover:scale-110",
                      selectedColor.id === color.id
                        ? "border-primary ring-2 ring-primary ring-offset-2"
                        : "border-transparent",
                    )}
                    style={{ backgroundColor: color.hexCode }}
                    onClick={() => setSelectedColor(color)}
                    title={`${color.name} ${color.additionalPrice > 0 ? `(+$${color.additionalPrice})` : ""}`}
                  >
                    {selectedColor.id === color.id && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className={cn("h-4 w-4", color.hexCode === "#ffffff" ? "text-black" : "text-white")} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {selectedColor.name}{" "}
                {selectedColor.additionalPrice > 0 && `(+$${selectedColor.additionalPrice.toLocaleString()})`}
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button className="flex-1" size="lg">
              Create Quotation
            </Button>
            <Button variant="outline" size="lg">
              Schedule Test Drive
            </Button>
          </div>
        </div>
      </div>

      {/* Specs Tabs */}
      <Tabs defaultValue="specs" className="mt-8">
        <TabsList>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="features">Standard Features</TabsTrigger>
          <TabsTrigger value="warranty">Warranty</TabsTrigger>
        </TabsList>
        <TabsContent value="specs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">Battery Capacity</dt>
                  <dd className="text-lg font-medium">{vehicle.specifications.batteryCapacity}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">Charging Time</dt>
                  <dd className="text-lg font-medium">{vehicle.specifications.chargingTime}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">Motor Power</dt>
                  <dd className="text-lg font-medium">{vehicle.specifications.motorPower}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">Top Speed</dt>
                  <dd className="text-lg font-medium">{vehicle.specifications.topSpeed}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="features" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <ul className="grid gap-2 sm:grid-cols-2">
                {["Autopilot", "Premium Audio", "Glass Roof", "Heated Seats", "Wireless Charging", "Sentry Mode"].map(
                  (feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ),
                )}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
