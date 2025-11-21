"use client"

import { useState } from "react"
import { VehicleCard } from "@/components/vehicles/vehicle-card"
import { VehicleFilters } from "@/components/vehicles/vehicle-filters"
import { Button } from "@/components/ui/button"
import { MOCK_VEHICLES } from "@/lib/mock-data"
import { ArrowRightLeft } from "lucide-react"
import Link from "next/link"

export default function VehiclesPage() {
  const [compareList, setCompareList] = useState<string[]>([])

  const toggleCompare = (id: string) => {
    setCompareList((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id)
      if (prev.length >= 3) return prev // Max 3 items
      return [...prev, id]
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicle Catalog</h1>
          <p className="text-muted-foreground">Browse and manage available electric vehicles.</p>
        </div>
        {compareList.length > 0 && (
          <Button asChild>
            <Link href={`/dashboard/vehicles/compare?ids=${compareList.join(",")}`}>
              Compare ({compareList.length}) <ArrowRightLeft className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      <VehicleFilters />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MOCK_VEHICLES.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onCompare={toggleCompare}
            isSelected={compareList.includes(vehicle.id)}
          />
        ))}
      </div>
    </div>
  )
}
