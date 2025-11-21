"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MOCK_VEHICLES } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RequestVehiclePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [selectedVehicle, setSelectedVehicle] = useState<string>("")
  const [selectedVariant, setSelectedVariant] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)

  const vehicle = MOCK_VEHICLES.find((v) => v.id === selectedVehicle)

  const handleSubmit = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Request Submitted",
      description: "Your vehicle request has been sent to EVM for approval.",
    })

    router.push("/dashboard/inventory")
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
                        {v.name}
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
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedVehicle || !selectedVariant || !selectedColor || isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Request
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
