"use client"

import { Car, Eye, Edit, Trash2, MoreVertical } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { VehicleVariantDto } from "@/lib/api/vehicles"

interface VehicleVariantCardProps {
  variant: VehicleVariantDto
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function VehicleVariantCard({ variant, onView, onEdit, onDelete }: VehicleVariantCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const specifications = variant.specifications || {}
  const specKeys = Object.keys(specifications).slice(0, 3) // Show first 3 specs

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{variant.modelName}</p>
            <CardTitle className="line-clamp-1 mt-1">{variant.variantName}</CardTitle>
            <p className="text-xs text-muted-foreground font-mono mt-1">{variant.variantCode}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(variant.id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(variant.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(variant.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant={variant.isActive ? "default" : "secondary"}>
            {variant.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="text-sm font-semibold">{formatPrice(variant.price)}</span>
          </div>
          {specKeys.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Specifications:</p>
              <div className="space-y-1">
                {specKeys.map((key) => (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground capitalize">{key}:</span>
                    <span className="font-medium">
                      {typeof specifications[key] === "object"
                        ? JSON.stringify(specifications[key])
                        : String(specifications[key])}
                    </span>
                  </div>
                ))}
                {Object.keys(specifications).length > 3 && (
                  <p className="text-xs text-muted-foreground italic">
                    +{Object.keys(specifications).length - 3} more
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="gap-2 pt-4">
        {onView && (
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onView(variant.id)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
        )}
        {onEdit && (
          <Button 
            variant="default" 
            className="flex-1"
            onClick={() => onEdit(variant.id)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

