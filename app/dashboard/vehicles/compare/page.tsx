"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { MOCK_VEHICLES } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function ComparePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const ids = searchParams.get("ids")?.split(",") || []

  const vehicles = MOCK_VEHICLES.filter((v) => ids.includes(v.id))

  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold">No vehicles selected</h2>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Compare Vehicles</h1>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableBody>
            {/* Header Row with Images */}
            <TableRow>
              <TableCell className="w-[200px] font-medium">Vehicle</TableCell>
              {vehicles.map((vehicle) => (
                <TableCell key={vehicle.id} className="min-w-[250px] align-top">
                  <div className="space-y-3">
                    <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
                      <Image
                        src={vehicle.images[0] || "/placeholder.svg"}
                        alt={vehicle.modelName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-lg">{vehicle.brand}</div>
                      <div className="text-muted-foreground">{vehicle.modelName}</div>
                    </div>
                    <div className="text-xl font-bold text-primary">${vehicle.basePrice.toLocaleString()}</div>
                  </div>
                </TableCell>
              ))}
            </TableRow>

            {/* Specs Rows */}
            <TableRow className="bg-muted/50">
              <TableCell colSpan={vehicles.length + 1} className="font-semibold">
                Performance
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Range</TableCell>
              {vehicles.map((v) => (
                <TableCell key={v.id}>{v.specifications.range}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Acceleration (0-60)</TableCell>
              {vehicles.map((v) => (
                <TableCell key={v.id}>{v.specifications.acceleration}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Top Speed</TableCell>
              {vehicles.map((v) => (
                <TableCell key={v.id}>{v.specifications.topSpeed}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Motor Power</TableCell>
              {vehicles.map((v) => (
                <TableCell key={v.id}>{v.specifications.motorPower}</TableCell>
              ))}
            </TableRow>

            <TableRow className="bg-muted/50">
              <TableCell colSpan={vehicles.length + 1} className="font-semibold">
                Battery & Charging
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Battery Capacity</TableCell>
              {vehicles.map((v) => (
                <TableCell key={v.id}>{v.specifications.batteryCapacity}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Charging Time</TableCell>
              {vehicles.map((v) => (
                <TableCell key={v.id}>{v.specifications.chargingTime}</TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
