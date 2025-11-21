"use client"

import Link from "next/link"
import Image from "next/image"
import { Car, Battery, Zap, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Vehicle } from "@/lib/types"

interface VehicleCardProps {
  vehicle: Vehicle
  onCompare?: (id: string) => void
  isSelected?: boolean
}

export function VehicleCard({ vehicle, onCompare, isSelected }: VehicleCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={vehicle.images[0] || "/placeholder.svg"}
          alt={vehicle.modelName}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
        <Badge className="absolute right-2 top-2" variant={vehicle.status === "available" ? "default" : "secondary"}>
          {vehicle.status}
        </Badge>
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{vehicle.brand}</p>
            <CardTitle className="line-clamp-1">{vehicle.modelName}</CardTitle>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">${vehicle.basePrice.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Starting MSRP</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex flex-col items-center gap-1 rounded-md bg-muted/50 p-2 text-center">
            <Battery className="h-4 w-4 text-primary" />
            <span>{vehicle.specifications.range}</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-md bg-muted/50 p-2 text-center">
            <Zap className="h-4 w-4 text-primary" />
            <span>{vehicle.specifications.acceleration}</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-md bg-muted/50 p-2 text-center">
            <Car className="h-4 w-4 text-primary" />
            <span>{vehicle.specifications.topSpeed}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button asChild className="w-full" variant="default">
          <Link href={`/vehicles/${vehicle.id}`}>
            Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        {onCompare && (
          <Button
            variant={isSelected ? "secondary" : "outline"}
            size="icon"
            onClick={() => onCompare(vehicle.id)}
            title="Add to compare"
          >
            <Car className={`h-4 w-4 ${isSelected ? "text-primary" : ""}`} />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
