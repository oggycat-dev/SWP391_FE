"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MOCK_CUSTOMERS, MOCK_VEHICLES } from "@/lib/mock-data"
import { calculations } from "@/lib/utils/calculations"

export default function CreateQuotationPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Form State
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [selectedVehicle, setSelectedVehicle] = useState<string>("")
  const [selectedVariant, setSelectedVariant] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [discount, setDiscount] = useState<number>(0)

  // Derived Data
  const vehicle = MOCK_VEHICLES.find((v) => v.id === selectedVehicle)
  const variant = vehicle?.variants.find((v) => v.id === selectedVariant)
  const color = vehicle?.colors.find((c) => c.id === selectedColor)

  const finalPrice =
    vehicle && variant && color
      ? calculations.calculateFinalPrice(vehicle.basePrice, variant.additionalPrice, color.additionalPrice, discount, 0)
      : 0

  const handleCreate = () => {
    // In a real app, this would call the API
    router.push("/dashboard/orders")
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Quotation</h1>
        <p className="text-muted-foreground">
          Step {step} of 3: {step === 1 ? "Select Customer" : step === 2 ? "Configure Vehicle" : "Review & Finalize"}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <Card>
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>Select an existing customer or create a new one.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Customer</Label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Search customer..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_CUSTOMERS.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} ({c.phone})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                Create New Customer
              </Button>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!selectedCustomer}>
                Next Step
              </Button>
            </CardFooter>
          </>
        )}

        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle>Vehicle Configuration</CardTitle>
              <CardDescription>Choose the vehicle model and specifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Vehicle Model</Label>
                <Select
                  value={selectedVehicle}
                  onValueChange={(v) => {
                    setSelectedVehicle(v)
                    setSelectedVariant("")
                    setSelectedColor("")
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_VEHICLES.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.brand} {v.modelName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {vehicle && (
                <>
                  <div className="space-y-2">
                    <Label>Variant</Label>
                    <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select variant..." />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicle.variants.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.name} (+${v.additionalPrice.toLocaleString()})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Select value={selectedColor} onValueChange={setSelectedColor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select color..." />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicle.colors.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name} (+${c.additionalPrice.toLocaleString()})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)} disabled={!selectedVehicle || !selectedVariant || !selectedColor}>
                Next Step
              </Button>
            </CardFooter>
          </>
        )}

        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle>Review & Pricing</CardTitle>
              <CardDescription>Finalize the quotation details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base Price</span>
                  <span>${vehicle?.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Variant ({variant?.name})</span>
                  <span>+${variant?.additionalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Color ({color?.name})</span>
                  <span>+${color?.additionalPrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <Label>Dealer Discount</Label>
                  <div className="w-32">
                    <Input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="text-right"
                    />
                  </div>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Final Price</span>
                  <span className="text-primary">${finalPrice.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={handleCreate}>Create Quotation</Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}
